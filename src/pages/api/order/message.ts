import { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '../../../server/utils';
import { getForm } from '../../../server/formRepository';
import { getActiveParticipantEmails } from '../../../server/participantRepository';
import { sendEmail } from '../../../server/email';
import { getMessageHtml } from '../../../server/order/message';
import { insertLog } from '../../../server/orderRepository';
import { insertMessageHistory } from '../../../server/messageRepository';

export type SendMessageRequest = { formId: string; subject: string; body: string };

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const user = await getUser(req);

  if (!user) {
    res.status(401).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { formId, subject, body } = req.body as SendMessageRequest;

      const form = await getForm(formId);

      if (form.userId !== user.id) {
        res.status(401).end();
        return;
      }

      const activeParticipantEmails = (await getActiveParticipantEmails(form.id)).map(({ email }) => email);

      try {
        await Promise.all(activeParticipantEmails.map((email) => sendEmail({
          to: email,
          subject,
          bodyHtml: getMessageHtml(body),
          from: 'meddelanden@anmala.nu',
          replyTo: user.email,
        })));
      } catch (e) {
        await insertLog('MESSAGE_TO_PARTICIPANTS_ERROR', e);
        console.log(e);
      }

      await insertMessageHistory({
        formId: form.id,
        recipientEmails: activeParticipantEmails.join(','),
        subject,
        body,
      });

      res.status(200).end();
      return;
    } catch(e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  res.status(404).end();
}
