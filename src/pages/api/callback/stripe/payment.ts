import type { NextApiRequest, NextApiResponse } from 'next';
import { PaymentIntent } from '@stripe/stripe-js';

import { insertLog, updateStripeOrderByPaymentIntentId } from '../../../../server/orderRepository';
import { handleApiError } from '../../../../server/utils';
import { stripe } from '../../../../server/stripe';

const stripeWebhookSigningSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

if (!stripeWebhookSigningSecret) {
  console.log('STRIPE_WEBHOOK_SIGNING_SECRET is not set!');
  process.exit(1);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// https://github.com/vercel/next.js/blob/86160a5190c50ea315c7ba91d77dfb51c42bc65f/test/integration/api-support/pages/api/no-parsing.js
// https://github.com/vercel/next.js/discussions/13405#discussioncomment-405300
const webhookPayloadParser = (req: NextApiRequest): Promise<string> =>
  new Promise((resolve) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      resolve(Buffer.from(data).toString());
    });
  });

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  try {
    const rawBody = await webhookPayloadParser(req);

    await insertLog('STRIPE_PAYMENT_INTENT_CALLBACK', rawBody);

    const signature = req.headers['stripe-signature'] as string;

    const event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSigningSecret);

    if (event.type === 'payment_intent.succeeded') {
      const { id: paymentIntentId } = event.data.object as PaymentIntent;

      await updateStripeOrderByPaymentIntentId({
        paymentIntentId,
        status: 'completed',
      });
    }

    res.status(200).end();
    return;
  } catch(e) {
    handleApiError(e, res);
    return;
  }
}
