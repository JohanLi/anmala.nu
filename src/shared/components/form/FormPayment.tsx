import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { classNames, filterTickets, getTotalAndVat } from './utils';
import { TicketAmount, FieldWithValue, PaymentMethod, paymentMethods } from '../../orderTypes';
import { api } from '../../../client/api';
import { Form } from '../../formTypes';
import { FormPaymentStripe } from './FormPaymentStripe';
import { FormPaymentSwish } from './FormPaymentSwish';
import { OrderResponse } from '../../../pages/api/order';
import { Step } from './Step';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set!');
}

const POLL_ORDER_INTERVAL = 2000;

interface FormPaymentProps {
  form: Form;
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  stripeAccountId?: string;
  referenceNumber: string;
  setReferenceNumber: (referenceNumber: string) => void;
  isCurrent: boolean;
  onClick: () => void;
  onNext: () => void;
}

// TODO implement logic for available payment methods
export const FormPayment = (props: FormPaymentProps): JSX.Element => {
  const { form, ticketsAmounts, fieldsWithValues, stripeAccountId, referenceNumber, setReferenceNumber, isCurrent, onClick, onNext } = props;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>();

  const createOrUpdateOrder = (paymentMethod: PaymentMethod) => async () => {
    const orderCommon = {
      formId: form.id,
      ticketsAmounts: filterTickets(ticketsAmounts),
      fieldsWithValues,
      acceptedToS: true,
    };

    let response: OrderResponse;

    if (referenceNumber) {
      response = await api.updateOrder({
        ...orderCommon,
        referenceNumber,
        paymentMethod,
      });
    } else {
      response = await api.order({
        ...orderCommon,
        paymentMethod,
      })
    }

    setReferenceNumber(response.referenceNumber);

    return response;
  };

  const stripePromise = useMemo(() => loadStripe(stripePublishableKey, {
    stripeAccount: stripeAccountId,
    locale: 'sv',
  }), [stripeAccountId]);

  const [pollOrder, setPollOrder] = useState(false);
  const checkOrderCompletion = () => setPollOrder(true);

  useEffect(() => {
    if (!pollOrder) {
      return;
    }

    let timeoutId: number;

    const pollOrderStatus = async () => {
      const { status } = await api.getOrderStatus({ formId: form.id, referenceNumber });

      if (status !== 'pending') {
        onNext();
      } else {
        timeoutId = window.setTimeout(pollOrderStatus, POLL_ORDER_INTERVAL);
      }
    }

    pollOrderStatus();

    return () => {
      clearTimeout(timeoutId);
    }
  }, [pollOrder]);

  return (
    <Step
      isCurrent={isCurrent}
      complete={false}
      onClick={onClick}
      title="3. Betalning"
    >
      <div className="divide-y divide-gray-100 -my-4">
        <div className="py-4 flex items-center">
          <div className="text-sm font-medium text-gray-700">
            Att betala
          </div>
          <div className="text-lg font-medium text-gray-900 text-right flex-1">
            {getTotalAndVat(ticketsAmounts, form.tickets).total} kr
          </div>
        </div>
        <div className="py-4">
          <div className="text-sm font-medium text-gray-700 pb-2">
            Välj betalsätt
          </div>
          <div className="relative bg-white rounded-md -space-y-px">
            {paymentMethods.map((paymentMethod, i) => {
              const isSelected = selectedPaymentMethod === paymentMethod;

              return (
                <label
                  key={i}
                  className={classNames(
                    i === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                    i === paymentMethods.length - 1 ? 'rounded-bl-md rounded-br-md' : '',
                    isSelected ? 'bg-indigo-50 border-indigo-200 z-10' : 'border-gray-200',
                    'border p-4 flex items-center cursor-pointer md:pl-4 md:pr-6 focus:outline-none'
                  )}
                >
                  <input
                    type="radio"
                    checked={isSelected}
                    onChange={() => setSelectedPaymentMethod(paymentMethod)}
                    className="h-4 w-4 text-indigo-600 cursor-pointer border-gray-300 focus:ring-0 focus:ring-offset-0"
                  />
                  <div className={classNames(isSelected ? 'text-indigo-900' : 'text-gray-900', 'ml-3 font-medium text-sm flex-1')}>
                    {paymentMethod === 'swish' && 'Swish'}
                    {paymentMethod === 'stripe' && 'Kort'}
                  </div>
                  <div className="flex items-center">
                    {paymentMethod === 'swish' && <img src="/swish.svg" alt="Swish" className="h-8" />}
                    {paymentMethod === 'stripe' && (
                      <>
                        <img src="/visa.svg" alt="Visa" className="h-6 mr-4" />
                        <img src="/mastercard.svg" alt="Mastercard" className="h-8" />
                      </>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        {Boolean(selectedPaymentMethod) && (
          <div className="py-4">
            {selectedPaymentMethod === 'swish' && (
              <FormPaymentSwish
                createOrUpdateOrder={createOrUpdateOrder('swish')}
                checkOrderCompletion={checkOrderCompletion}
              />
            )}
            {selectedPaymentMethod === 'stripe' && (
              <Elements
                stripe={stripePromise}
              >
                <FormPaymentStripe
                  createOrUpdateOrder={createOrUpdateOrder('stripe')}
                  fieldsWithValues={fieldsWithValues}
                  checkOrderCompletion={checkOrderCompletion}
                />
              </Elements>
            )}
          </div>
        )}
      </div>
    </Step>
  );
}
