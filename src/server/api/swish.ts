import https from 'https';
import axios from 'axios';

const SWISH_PUBLIC_KEY = process.env.SWISH_PUBLIC_KEY;
const SWISH_PRIVATE_KEY = process.env.SWISH_PRIVATE_KEY;
const SWISH_PASSPHRASE = process.env.SWISH_PASSPHRASE;
const SWISH_BASE_URL = process.env.SWISH_BASE_URL;
const WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL;

const agent = new https.Agent({
  cert: SWISH_PUBLIC_KEY,
  key: SWISH_PRIVATE_KEY,
  passphrase: SWISH_PASSPHRASE,
});

const client = axios.create({
  httpsAgent: agent,
});

export type PaymentRequestOptions = {
  UUID: string;
  number: string;
  total: string;
  orderReferenceNumber: string;
  message: string;
}

// https://developer.swish.nu/api/payment-request/v2#create-payment-request
export const swishPaymentRequest = async (options: PaymentRequestOptions): Promise<{ headers: { paymentrequesttoken: string } }> => {
  const { UUID, number, total, orderReferenceNumber, message } = options;

  return client.request({
    method: 'PUT',
    url: `${SWISH_BASE_URL}/swish-cpcapi/api/v2/paymentrequests/${UUID}`,
    data: {
      callbackUrl: `${WEBHOOK_BASE_URL}/api/callback/swish/payment`,
      payeeAlias: number,
      amount: total,
      currency: 'SEK',
      payeePaymentReference: orderReferenceNumber,
      message,
    },
  });
}

// https://developer.swish.nu/api/qr-codes/v1
export const swishQrCode = async (token: string): Promise<{ data: string }> => {
  return client.request({
    method: 'POST',
    url: `${SWISH_BASE_URL}/qrg-swish/api/v1/commerce`,
    data: {
      format: 'svg',
      token,
    },
  });
}

export type RefundRequestOptions = {
  paymentReference: string;
  number: string;
  total: string;
  message: string;
  refundUUID: string;
  orderReferenceNumber: string;
}

// https://developer.swish.nu/api/refunds/v2#refund-request-object
export const swishRefundRequest = async (options: RefundRequestOptions): Promise<void> => {
  const { paymentReference, number, total, message, refundUUID, orderReferenceNumber } = options;

  return client.request({
    method: 'PUT',
    url: `${SWISH_BASE_URL}/swish-cpcapi/api/v2/refunds/${refundUUID}`,
    data: {
      originalPaymentReference: paymentReference,
      callbackUrl: `${WEBHOOK_BASE_URL}/api/callback/swish/refund`,
      payerAlias: number,
      amount: total,
      currency: 'SEK',
      payerPaymentReference: orderReferenceNumber,
      message,
    },
  });
}
