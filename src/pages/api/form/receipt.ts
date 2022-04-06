import { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '../../../server/utils';
import { getForm, upsertFormReceipt } from '../../../server/formRepository';

export type UpsertFormReceiptRequest = { formId: string; customMessage: string };

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const user = await getUser(req);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { formId, customMessage } = req.body as UpsertFormReceiptRequest;

      const form = await getForm(formId);

      if (form.userId !== user.id) {
        res.status(401).end();
        return;
      }

      if (await upsertFormReceipt(formId, customMessage)) {
        res.status(200).end();
        return;
      }

      res.status(500).end();
      return;
    } catch(e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  res.status(404).end();
}
