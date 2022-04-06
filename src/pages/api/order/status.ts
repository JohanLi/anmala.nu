import { NextApiRequest, NextApiResponse } from 'next';

import { getOrderByReferenceNumber, Order } from '../../../server/orderRepository';

export type OrderStatusRequest = Pick<Order, 'formId' | 'referenceNumber'>;

export type OrderStatusResponse = Pick<Order, 'status'>;

export default async (req: NextApiRequest, res: NextApiResponse<OrderStatusResponse>): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(404).end();
    return;
  }

  const { formId, referenceNumber } = req.query as OrderStatusRequest;

  const { status } = await getOrderByReferenceNumber({ formId, referenceNumber }) || {};

  if (!status) {
    res.status(404).end();
    return;
  }

  res.status(200).json({ status });
}
