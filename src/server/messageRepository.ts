import { db } from './database';

export type MessageHistory = {
  subject: string;
  body: string;
  created: string;
}[];

export interface InsertMessageHistory {
  formId: string;
  subject: string;
  body: string;
  recipientEmails: string;
}

export const getMessageHistory = async (formId: string): Promise<MessageHistory> => {
  const result = await db.query(
    `
    SELECT subject, body, to_json(created)#>>'{}' AS created
    FROM message_history
    WHERE form_id = $1
  `,
    [formId],
  );

  return result.rows;
};

export const insertMessageHistory = async (messageHistory: InsertMessageHistory): Promise<boolean> => {
  const { formId, subject, body, recipientEmails } = messageHistory;

  const result = await db.query(
    `
    INSERT INTO message_history (form_id, recipient_emails, subject, body)
    VALUES ($1, $2, $3, $4)
  `,
    [formId, recipientEmails, subject, body],
  );

  return result.rowCount > 0;
};
