import React, { useEffect, useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { OrderResponse } from '../../../pages/api/order';
import { FieldWithValue } from '../../orderTypes';
import { getEmailFromFields, getNameFromFields } from './utils';

// 4000007520000008 Swedish Test Card (https://stripe.com/docs/testing#international-cards)
// https://stripe.com/docs/connect/creating-a-payments-page?platform=web&ui=elements#create-a-payment-intent

// colors taken from https://tailwindcss.com/docs/customizing-colors
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: '#2563EB',
      color: '#111827',
      fontWeight: 400,
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

interface FormPaymentStripeProps {
  createOrUpdateOrder: () => Promise<OrderResponse>;
  fieldsWithValues: FieldWithValue[];
  checkOrderCompletion: () => void;
}

export const FormPaymentStripe = (props: FormPaymentStripeProps): JSX.Element => {
  const { createOrUpdateOrder, fieldsWithValues, checkOrderCompletion } = props;

  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const confirmCardPayment = async () => {
    setLoading(true);

    const card = elements?.getElement(CardElement);

    if (!stripe || !card) {
      return;
    }

    const response = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: getNameFromFields(fieldsWithValues),
          email: getEmailFromFields(fieldsWithValues),
        },
      },
    });

    if (response.error) {
      // TODO save these errors on the server
      setError('Ett fel inträffade med din betalning.');
    } else {
      if (response.paymentIntent.status === 'succeeded') {
        checkOrderCompletion();
      }
    }
  };

  const [clientSecret, setClientSecret] = useState('');

  const initiateStripe = async () => {
    const response = await createOrUpdateOrder();

    if (!response.stripe) {
      return;
    }

    setClientSecret(response.stripe.clientSecret);
  }

  useEffect(() => {
    initiateStripe();
  }, []);

  return (
    <div className="space-y-4">
      <div className="max-w-md space-y-4">
        <div className="px-3 py-2 border-gray-300 rounded-md border">
          <CardElement
            options={CARD_ELEMENT_OPTIONS}
            onChange={(e) => {
              if (e.error) {
                setError(e.error.message);
              } else {
                setError('');
              }

              setComplete(e.complete);
            }}
          />
        </div>
        {error && (
          <Alert
            type="error"
            title={error}
          />
        )}
      </div>
      <Button
        type="primary"
        size="md"
        disabled={!complete || loading}
        onClick={() => confirmCardPayment()}
      >
        Betala
      </Button>
    </div>
  );
}
