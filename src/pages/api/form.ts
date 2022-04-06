import { NextApiRequest, NextApiResponse } from 'next';

import {
  getOverviewForms, getForm,
  insertForm,
  updateForm,
  updateFormStatus,
} from '../../server/formRepository';
import { generateFormId, getUser, slugify } from '../../server/utils';
import { PublicForm } from '../../shared/formTypes';
import { getTicketDescriptionsFromTo, setPriceToZeroIfEmpty, verifyForm } from '../../server/verifyForm';

export interface DeleteFormRequest {
  formId: string;
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const user = await getUser(req);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const forms = await getOverviewForms(user.id);

      res.status(200).json(forms);
      return;
    } catch(e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  if (req.method === 'POST') {
    try {
      const form = req.body as PublicForm;

      const code = verifyForm(form);
      setPriceToZeroIfEmpty(form);

      if (code !== null) {
        res.status(400).json({ code });
        return;
      }

      form.id = await generateFormId();
      form.userId = user.id;
      form.slug = slugify(form.title);

      await insertForm(form);

      res.status(200).json({
        ...form,
        userId: undefined,
      });
      return;
    } catch(e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  if (req.method === 'PUT') {
    try {
      const newForm = req.body as PublicForm;

      const currentForm = await getForm(newForm.id);

      if (currentForm.userId !== user.id) {
        res.status(401).end();
        return;
      }

      const code = verifyForm(newForm);
      setPriceToZeroIfEmpty(newForm);

      if (code !== null) {
        res.status(400).json({ code });
        return;
      }

      newForm.slug = slugify(newForm.title);

      const ticketDescriptionsFromTo = getTicketDescriptionsFromTo(currentForm.tickets, newForm.tickets);

      await updateForm(newForm, ticketDescriptionsFromTo);

      res.status(200).json({
        ...newForm,
        userId: undefined,
      });
      return;
    } catch(e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { formId } = req.body as DeleteFormRequest;

      if (await updateFormStatus(formId, user.id, 'deleted')) {
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
