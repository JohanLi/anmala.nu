import { db } from './database';
import { Participant } from '../shared/participantTypes';

export const getActiveParticipantsCount = async (formId: string): Promise<number> => {
  const result = await db.query(
    `
    SELECT coalesce(sum(amount), 0) AS count
    FROM orders_tickets ot
    INNER JOIN orders o ON ot.order_id = o.id
    WHERE form_id = $1 AND status = 'completed'
  `,
    [formId],
  );

  return result.rows[0].count;
};

export const getAllParticipants = async (pageId: string): Promise<Participant[]> => {
  const result = await db.query(
    `
    SELECT
      json_agg(json_build_object('description', description, 'amount', amount)) AS "ticketsAmounts",
      fields_with_values AS "fieldsWithValues", to_json(created)#>>'{}' AS created,
      reference_number AS "orderReferenceNumber", status AS "orderStatus", note
    FROM orders o
    INNER JOIN orders_tickets ot on o.id = ot.order_id
    INNER JOIN forms_tickets ft on ot.ticket_id = ft.id
    WHERE o.form_id = $1 AND status IN ('completed', 'cancelled')
    GROUP BY o.id, o.status, o.last_updated
    ORDER BY
      CASE
        WHEN status = 'completed' THEN 1
        WHEN status = 'cancelled' THEN 2
        ELSE 3
      END, last_updated DESC, created DESC
  `,
    [pageId],
  );

  return result.rows;
};

export const getActiveParticipantEmails = async (pageId: string): Promise<{ email: string }[]> => {
  const result = await db.query(
    `
    SELECT DISTINCT(email) FROM orders
    WHERE page_id = $1 AND status = 'completed'
  `,
    [pageId],
  );

  return result.rows;
};
