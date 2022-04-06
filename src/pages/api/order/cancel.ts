import { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '../../../server/utils';
import { getOrderByReferenceNumber, Order, updateOrderStatus } from '../../../server/orderRepository';
import { getForm } from '../../../server/formRepository';
import { refundStripe, refundSwish } from '../../../server/order/utils';

export type CancelOrderRequest = Pick<Order, 'formId' | 'referenceNumber'>

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  try {
    const user = await getUser(req);

    if (!user) {
      res.status(401).end();
      return;
    }

    const { formId, referenceNumber } = req.body as CancelOrderRequest;

    const form = await getForm(formId);

    if (form.userId !== user.id) {
      res.status(401).end();
      return;
    }

    const order = await getOrderByReferenceNumber({ formId, referenceNumber });

    if (!order) {
      res.status(404).end();
      return;
    }

    if (order.swish) {
      await refundSwish(form, order);
    }

    if (order.stripe) {
      await refundStripe(form, order);
    }

    await updateOrderStatus(order.id, 'cancelled');

    res.status(200).end();
    return;
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}
