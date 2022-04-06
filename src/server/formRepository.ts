import { db } from './database';
import { OverviewForm, FormStatus, PublicForm, TicketDescriptionsFromTo } from '../shared/formTypes';

export const getForm = async (id: string): Promise<PublicForm> => {
  const result = await db.query(`
    SELECT
      f.id, user_id AS "userId", slug, status, title, custom_fields AS "customFields",
      json_agg(json_build_object('description', description, 'price', price, 'vatRate', vat_rate, 'seats', seats)) AS tickets
    FROM forms f
    INNER JOIN forms_tickets ft on f.id = ft.form_id
    WHERE f.id = $1 AND status != 'deleted'
    GROUP BY f.id;
  `,
    [id],
  );

  return result.rows[0];
};

/*
 casting timestamptz as ::text will cause issues in Safari
 https://stackoverflow.com/questions/4310953/invalid-date-in-safari
 https://stackoverflow.com/a/55387470
*/
export const getOverviewForms = async (userId: number): Promise<OverviewForm[]> => {
  const result = await db.query(`
    SELECT id, slug, status, title,
      to_json(created)#>>'{}' AS created, to_json(last_updated)#>>'{}' AS "lastUpdated",
      coalesce(count, 0) AS "participantCount"
    FROM forms f
    LEFT JOIN (
      SELECT form_id, sum(amount) AS count
      FROM orders_tickets ot
      INNER JOIN orders o ON ot.order_id = o.id
      WHERE status = 'completed'
      GROUP BY form_id
    ) ot ON ot.form_id = f.id
    WHERE user_id = $1 AND status != 'deleted'
    ORDER BY created DESC
  `,
    [userId],
  );

  return result.rows;
};

export const insertForm = async (form: PublicForm): Promise<void> => {
  const { id, userId, slug, title, tickets, customFields } = form;

  const client = await db.connect()

  try {
    await client.query('BEGIN');

    await client.query(`
      INSERT INTO forms (id, user_id, slug, title, custom_fields)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [id, userId, slug, title, JSON.stringify(customFields)],
    );

    for (const ticket of tickets) {
      const { description, price, vatRate, seats } = ticket;

      await client.query(`
        INSERT INTO forms_tickets (form_id, description, price, vat_rate, seats)
        VALUES ($1, $2, $3, $4, $5)
      `,
        [id, description, price, vatRate, seats],
      );
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

// verifying permissions is done at the service level
export const updateForm = async (page: PublicForm, ticketDescriptionsFromTo: TicketDescriptionsFromTo): Promise<void> => {
  const { id, slug, title, tickets, customFields } = page;

  const client = await db.connect()

  try {
    await client.query('BEGIN');

    await client.query(`
      UPDATE forms
      SET slug = $2, last_updated = DEFAULT, title = $3, custom_fields = $4
      WHERE id = $1
    `,
      [id, slug, title, JSON.stringify(customFields)],
    );

    for (const [from, to] of ticketDescriptionsFromTo) {
      await client.query(`
        UPDATE forms_tickets
        SET description = $3
        WHERE form_id = $1 AND description = $2
      `,
        [id, from, to],
      );
    }

    for (const ticket of tickets) {
      const { description, price, vatRate, seats } = ticket;

      await client.query(`
        INSERT INTO forms_tickets (form_id, description, price, vat_rate, seats)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (form_id, description) DO UPDATE
          SET description = $2, price = $3, vat_rate = $4, seats = $5
      `,
        [id, description, price, vatRate, seats],
      );
    }

    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export const updateFormStatus = async (formId: string, userId: number, status: FormStatus): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE forms
    SET status = $3, last_updated = DEFAULT
    WHERE id = $1 AND user_id = $2 AND status != 'deleted'
  `,
    [formId, userId, status],
  );

  return result.rowCount > 0;
};

export const getFormReceipt = async (formId: string): Promise<{ customMessage: string } | undefined> => {
  const result = await db.query(
    `
    SELECT custom_message AS "customMessage"
    FROM forms_receipt
    WHERE form_id = $1
  `,
    [formId],
  );

  return result.rows[0];
};

export const upsertFormReceipt = async (formId: string, customMessage: string): Promise<boolean> => {
  const result = await db.query(
    `
    INSERT INTO forms_receipt (form_id, custom_message)
    VALUES ($1, $2)
    ON CONFLICT (form_id) DO UPDATE
    SET custom_message = $2, last_updated = DEFAULT
  `,
    [formId, customMessage],
  );

  return result.rowCount > 0;
};
