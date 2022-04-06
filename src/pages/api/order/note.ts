import { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '../../../server/utils';
import { getOrderByReferenceNumber, Order, updateOrderNote } from '../../../server/orderRepository';
import { getForm } from '../../../server/formRepository';
import { Participant } from '../../../shared/participantTypes';

export type UpdateNoteRequest = Pick<Order, 'formId' | 'referenceNumber'> & Pick<Participant, 'note'>;

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method !== 'PUT') {
    res.status(404).end();
    return;
  }

  try {
    const user = await getUser(req);

    if (!user) {
      res.status(401).end();
      return;
    }

    const { formId, referenceNumber, note } = req.body as UpdateNoteRequest;

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

    await updateOrderNote(order.id, note);

    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}
