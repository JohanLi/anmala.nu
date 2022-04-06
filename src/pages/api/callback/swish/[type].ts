import type { NextApiRequest, NextApiResponse } from 'next';

import {
  insertLog,
  OrderStatus,
  updateSwishOrderByReferenceNumberAndUUID,
  updateSwishOrderByReferenceNumberAndRefundUUID,
} from '../../../../server/orderRepository';
import { handleApiError } from '../../../../server/utils';

type SwishCallbackType = 'payment' | 'refund';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'POST') {
    res.status(404).end();
    return;
  }

  try {
    const { type } = req.query as { type: SwishCallbackType };

    let status: OrderStatus;

    if (type === 'payment') {
      const { id: UUID, payeePaymentReference: referenceNumber, status: swishStatus, paymentReference } = req.body;

      await insertLog('SWISH_PAYMENT_CALLBACK', req.body);

      if (swishStatus === 'PAID') {
        status = 'completed';
      } else if (swishStatus === 'DECLINED') {
        status = 'aborted';
      } else if (swishStatus === 'CANCELLED') {
        status = 'cancelled';
      } else if (swishStatus === 'ERROR') {
        status = 'pending';
      } else {
        res.status(500).end();
        return;
      }

      await updateSwishOrderByReferenceNumberAndUUID({ referenceNumber, status, UUID, paymentReference });
    } else if (type === 'refund') {
      const { id: refundUUID, payerPaymentReference: referenceNumber, status: swishStatus } = req.body;

      await insertLog('SWISH_REFUND_CALLBACK', req.body);

      if (swishStatus === 'DEBITED') {
        status = 'cancelled';
      } else if (swishStatus === 'PAID') {
        status = 'cancelled';
      } else if (swishStatus === 'ERROR') {
        status = 'pending';
      } else {
        res.status(500).end();
        return;
      }

      await updateSwishOrderByReferenceNumberAndRefundUUID({ referenceNumber, status, refundUUID });
    } else {
      res.status(500).end();
      return;
    }

    res.status(200).end();
    return;
  } catch(e) {
    handleApiError(e, res);
    return;
  }
}
