import { NextApiRequest } from 'next';
import isMobile from 'ismobilejs';

import { Errors } from '../../shared/errors';
import { CreateOrderRequest, OrderResponseSwish } from '../../pages/api/order';
import { getForm } from '../formRepository';
import {
  getTicketSeatsTaken,
  insertLog,
  Order,
  Stripe,
  Swish,
  updateSwishOrderBeforeRefund,
} from '../orderRepository';
import { generateSwishUUID, validEmail } from '../utils';
import { BASE_FIELDS, Form } from '../../shared/formTypes';
import { FieldWithValue, PaymentMethod, TicketAmount } from '../../shared/orderTypes';
import { swishPaymentRequest, swishQrCode, swishRefundRequest } from '../api/swish';
import { getUser } from '../userRepository';
import { stripe } from '../stripe';

const requiredFilledIn = (order: CreateOrderRequest, form: Form): boolean => {
  const { fieldsWithValues } = order;

  const requiredFields = BASE_FIELDS.concat(form.customFields)
    .filter(({ required }) => required);

  return requiredFields.every((requiredField) => {
    const field = fieldsWithValues.find(({ name }) => name === requiredField.name);

    if (!field) {
      return false;
    }

    if (requiredField.type === 'checkbox') {
      return Array.isArray(field.value) && field.value.length > 0;
    }

    return field.value !== '';
  });
}

const removeEmptyCustomFields = (customFields: FieldWithValue[]) => customFields.filter(({ value }) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return value;
});

export interface ParsedOrder {
  form: Form;
  formId: string;
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  paymentMethod: PaymentMethod;
}

export const parseOrder = async (req: NextApiRequest): Promise<Errors | ParsedOrder> => {
  const { formId, ticketsAmounts, acceptedToS, paymentMethod } = req.body as CreateOrderRequest;
  let { fieldsWithValues } = req.body as CreateOrderRequest;

  fieldsWithValues = removeEmptyCustomFields(fieldsWithValues);

  const form = await getForm(formId);

  if (!form) {
    return Errors.FORM_NOT_FOUND;
  }

  if (!requiredFilledIn(req.body, form)) {
    return Errors.REQUIRED_FIELDS_MISSING;
  }

  const email = fieldsWithValues.find(({ name }) => name === 'E-post')!.value;

  if (Array.isArray(email) || !validEmail(email)) {
    return Errors.INVALID_EMAIL;
  }

  if (!acceptedToS) {
    return Errors.TOS_NOT_ACCEPTED;
  }

  if (form.status !== 'open') {
    return Errors.FORM_NOT_OPEN;
  }

  for (const { description, amount } of ticketsAmounts) {
    if (amount < 1) {
      return Errors.TICKET_INVALID;
    }

    const matchedFormTicket = form.tickets.find((ticket) => ticket.description === description);

    if (!matchedFormTicket) {
      return Errors.TICKET_INVALID;
    }

    // TODO this current implementation can cause overbookings. Can be solved through introducing reservations
    if (matchedFormTicket.seats !== 0) {
      const seatsTaken = await getTicketSeatsTaken({ description }, form);

      if (matchedFormTicket.seats - seatsTaken < 0) {
        return Errors.TICKET_SOLD_OUT;
      }
    }
  }

  return {
    form,
    formId,
    ticketsAmounts,
    fieldsWithValues,
    paymentMethod,
  };
}

export const orderContainsError = (parsedOrder: Errors | ParsedOrder): parsedOrder is Errors => !(parsedOrder as ParsedOrder).form;

export const initiateSwish = async (form: Pick<Form, 'userId'>, order: Pick<Order, 'referenceNumber' | 'total'>): Promise<Swish> => {
  const { swishNumber } = await getUser(form.userId);

  if (!swishNumber) {
    throw Error('Swish is not connected!');
  }

  const { referenceNumber, total } = order;

  const UUID = await generateSwishUUID();

  const response = await swishPaymentRequest({
    UUID,
    number: swishNumber,
    orderReferenceNumber: referenceNumber,
    total: total.toString(),
    message: '', // TODO decide on a suitable message
  });

  const { paymentrequesttoken: paymentRequestToken } = response.headers;

  await insertLog('SWISH_PAYMENT_REQUEST', response.headers);

  const { data: qrCode } = await swishQrCode(paymentRequestToken);

  return {
    UUID,
    paymentRequestToken,
    qrCode,
    paymentReference: '',
    refundUUID: '',
  };
}

export const getSwishOrderResponse = (req: NextApiRequest, order: Pick<Order, 'swish'>): OrderResponseSwish => {
  const { swish } = order;

  if (!swish) {
    throw Error('Order lacks Swish data!');
  }

  const userAgent = req.headers['user-agent'];
  const isPhone = isMobile(userAgent).phone;

  return {
    link: `swish://paymentrequest?token=${swish.paymentRequestToken}&callbackurl=http://192.168.1.183:3000`,
    qrCode: swish.qrCode,
    isPhone,
  };
}

/*
  TODO:
    periodically check if Swish has simplified their refunding logic.
    As it stands, you need to generate your own ID, receive it from the resulting webhook, and match it back.
 */
export const refundSwish = async (form: Pick<Form, 'userId'>, order: Pick<Order, 'formId' | 'referenceNumber'>): Promise<void> => {
  const { formId, referenceNumber } = order;

  const { swishNumber } = await getUser(form.userId);

  if (!swishNumber) {
    throw Error('Form’s creator lacks a Swish number.');
  }

  const refundUUID = await generateSwishUUID();

  const swishOrderBeforeRefund = await updateSwishOrderBeforeRefund({ formId, referenceNumber, refundUUID });

  if (!swishOrderBeforeRefund?.paymentReference) {
    throw Error('updateSwishOrderBeforeRefund failed.');
  }

  const { total, paymentReference } = swishOrderBeforeRefund;

  const response = await swishRefundRequest({
    paymentReference,
    number: swishNumber,
    total: total.toString(),
    message: '', // TODO decide on a suitable message
    refundUUID,
    orderReferenceNumber: referenceNumber,
  });

  await insertLog('SWISH_REFUND_REQUEST', response);
}

export const initiateStripe = async (form: Pick<Form, 'userId'>, order: Pick<Order, 'total'>): Promise<Stripe> => {
  const { total } = order;

  const { stripeAccountId } = await getUser(form.userId);

  if (!stripeAccountId) {
    throw Error('Stripe is not connected!');
  }

  const paymentIntent = await stripe.paymentIntents.create({
    payment_method_types: ['card'],
    amount: total * 100,
    currency: 'sek',
  }, { stripeAccount: stripeAccountId });

  await insertLog('STRIPE_PAYMENT_INTENT', paymentIntent);

  return {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret || '', // TODO under what circumstance is client_secret null?
  };
}

export const getStripeOrderResponse = (order: Pick<Order, 'stripe'>): Pick<Stripe, 'clientSecret'> => {
  const { stripe } = order;

  if (!stripe) {
    throw Error('Order lacks Stripe data!');
  }

  return {
    clientSecret: stripe.clientSecret,
  };
}

export const refundStripe = async (form: Pick<Form, 'userId'>, order: Pick<Order, 'stripe'>): Promise<void> => {
  const { stripeAccountId } = await getUser(form.userId);

  if (!order.stripe) {
    throw Error('Order lacks Stripe data!');
  }

  const refund = await stripe.refunds.create({
    payment_intent: order.stripe.paymentIntentId,
  }, { stripeAccount: stripeAccountId });

  await insertLog('STRIPE_REFUND', refund);
}
