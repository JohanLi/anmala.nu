import { NextApiRequest, NextApiResponse } from 'next';

import {
  getOrderByReferenceNumber,
  insertOrder, updateOrder,
} from '../../server/orderRepository';
import { generateOrderReferenceNumber, handleApiError } from '../../server/utils';
import { Errors } from '../../shared/errors';
import { getTotalAndVat } from '../../shared/components/form/utils';
import { FieldWithValue, PaymentMethod, TicketAmount } from '../../shared/orderTypes';
import {
  getSwishOrderResponse,
  orderContainsError,
  initiateSwish,
  parseOrder,
  initiateStripe,
  getStripeOrderResponse,
} from '../../server/order/utils';

export interface CreateOrderRequest {
  formId: string;
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  acceptedToS: boolean;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderRequest extends CreateOrderRequest {
  referenceNumber: string;
}

interface ErrorResponse {
  code: Errors;
}

export interface OrderResponse {
  referenceNumber: string;
  swish?: OrderResponseSwish;
  stripe?: {
    clientSecret: string;
  };
}

export interface OrderResponseSwish {
  link: string;
  qrCode: string;
  isPhone: boolean;
}

export default async (req: NextApiRequest, res: NextApiResponse<OrderResponse | ErrorResponse>): Promise<void> => {
  if (req.method === 'POST') {
    const parsedOrder = await parseOrder(req);

    if (orderContainsError(parsedOrder)) {
      res.status(400).json({ code: parsedOrder });
      return;
    }

    const { form, formId, ticketsAmounts, fieldsWithValues, paymentMethod } = parsedOrder;

    const referenceNumber = await generateOrderReferenceNumber();
    const { total, vat } = getTotalAndVat(ticketsAmounts, form.tickets);

    let swish = null;
    let stripe = null;

    try {
      if (paymentMethod === 'swish') {
        swish = await initiateSwish(form, { referenceNumber, total });
      }

      if (paymentMethod === 'stripe') {
        stripe = await initiateStripe(form, { total });
      }

      await insertOrder({
        total,
        vat,
        formId,
        referenceNumber,
        ticketsAmounts,
        fieldsWithValues,
        swish,
        stripe,
      });

      if (paymentMethod === 'swish') {
        res.status(201).json({
          referenceNumber,
          swish: getSwishOrderResponse(req, { swish }),
        });
      }

      if (paymentMethod === 'stripe') {
        res.status(201).json({
          referenceNumber,
          stripe: getStripeOrderResponse({ stripe }),
        });
      }

      return;
    } catch (e) {
      handleApiError(e, res);
      res.status(500).end();
      return;
    }
  }

  if (req.method === 'PUT') {
    const parsedOrder = await parseOrder(req);

    if (orderContainsError(parsedOrder)) {
      res.status(400).json({ code: parsedOrder });
      return;
    }

    const { form, formId, ticketsAmounts, fieldsWithValues, paymentMethod } = parsedOrder;
    const { referenceNumber } = req.body as UpdateOrderRequest;

    try {
      const currentOrder = await getOrderByReferenceNumber({ formId, referenceNumber });

      if (!currentOrder) {
        res.status(400).json({ code: Errors.ORDER_NOT_FOUND });
        return;
      }

      if (currentOrder.status !== 'pending') {
        res.status(400).json({ code: Errors.ORDER_NOT_PENDING });
        return;
      }

      const { total, vat } = getTotalAndVat(ticketsAmounts, form.tickets);
      const changedTotalOrVat = currentOrder.total !== total || currentOrder.vat !== vat;

      let swish = changedTotalOrVat ? null : currentOrder.swish;
      let stripe = changedTotalOrVat ? null : currentOrder.stripe;

      if (paymentMethod === 'swish' && !swish) {
        swish = await initiateSwish(form, { referenceNumber, total });
      }

      if (paymentMethod === 'stripe' && !stripe) {
        stripe = await initiateStripe(form, { total });
      }

      await updateOrder({
        id: currentOrder.id,
        total,
        vat,
        formId,
        referenceNumber,
        ticketsAmounts,
        fieldsWithValues,
        swish,
        stripe,
      });

      if (paymentMethod === 'swish') {
        res.status(201).json({
          referenceNumber,
          swish: getSwishOrderResponse(req, { swish }),
        });
      }

      if (paymentMethod === 'stripe') {
        res.status(201).json({
          referenceNumber,
          stripe: getStripeOrderResponse({ stripe }),
        });
      }

      return;
    } catch (e) {
      handleApiError(e, res);
      res.status(500).end();
      return;
    }
  }

  res.status(404).end();
}
