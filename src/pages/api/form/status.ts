import { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '../../../server/utils';
import { PublicFormStatus } from '../../../shared/formTypes';
import { updateFormStatus } from '../../../server/formRepository';

export interface UpdateFormStatusRequest {
  formId: string;
  status: PublicFormStatus;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const user = await getUser(req);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (req.method === 'PUT') {
    try {
      const { formId, status } = req.body as UpdateFormStatusRequest;

      if (await updateFormStatus(formId, user.id, status)) {
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
