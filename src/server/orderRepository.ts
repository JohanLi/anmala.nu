import { db } from './database';
import { Form, Ticket } from '../shared/formTypes';
import { FieldWithValue, TicketAmount } from '../shared/orderTypes';

export const insertLog = async (key: string, value: any): Promise<boolean> => {
  const result = await db.query(
    `
    INSERT INTO logs ("key", "value")
    VALUES ($1, $2)
    RETURNING id
  `,
    [key, JSON.stringify(value)],
  );

  return result.rows[0].id;
};

export interface Order {
  id: number;
  status: OrderStatus;
  total: number;
  vat: number;
  formId: string;
  referenceNumber: string;
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  receiptSent: boolean;
  swish: Swish | null;
  stripe: Stripe | null;
  created: string;
  lastUpdated: string;
}

export interface Swish {
  UUID: string; // set on our end and used together with form_id in a webhook to update orders to completed
  paymentRequestToken: string; // returned from Swish. Used to form an URL that opens Swish (non-QR code method)
  qrCode: string; // SVG
  paymentReference: string; // returned from Swish to our webhook after a successful payment. Used to find the correct order when a refund event is sent to our webhook.
  refundUUID: string; // set on our end and used to update order in our webhook
}

export interface Stripe {
  paymentIntentId: string;
  clientSecret: string;
}

export const insertOrder = async (order: Omit<Order, 'id' | 'status' | 'receiptSent' | 'created' | 'lastUpdated'>): Promise<void> => {
  const { total, vat, formId, referenceNumber, ticketsAmounts, fieldsWithValues, swish, stripe } = order;

  const client = await db.connect()

  try {
    const result = await client.query(`
      INSERT INTO orders (total, vat, form_id, reference_number, fields_with_values, swish, stripe)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `,
      [total, vat, formId, referenceNumber, JSON.stringify(fieldsWithValues), swish, stripe],
    );

    const { id } = result.rows[0];

    for (const { description, amount } of ticketsAmounts) {
      await client.query(`
        INSERT INTO orders_tickets (order_id, ticket_id, amount)
        VALUES ($1, (SELECT id FROM forms_tickets WHERE description = $2), $3)
      `,
        [id, description, amount],
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

export const updateOrder = async (order: Omit<Order, 'status' | 'receiptSent' | 'created' | 'lastUpdated'>): Promise<void> => {
  const { id, total, vat, formId, referenceNumber, ticketsAmounts, fieldsWithValues, swish, stripe } = order;

  const client = await db.connect()

  try {
    await client.query(
      `
    UPDATE orders
    SET total = $2, vat = $3, form_id = $4, reference_number = $5, fields_with_values = $6, swish = $7, stripe = $8
    WHERE id = $1
  `,
      [id, total, vat, formId, referenceNumber, JSON.stringify(fieldsWithValues), swish, stripe],
    );

    await client.query(
      `
      DELETE FROM orders_tickets
      WHERE order_id = $1
      `,
      [id],
    );

    for (const { description, amount } of ticketsAmounts) {
      await client.query(`
        INSERT INTO orders_tickets (order_id, ticket_id, amount)
        VALUES ($1, (SELECT id FROM forms_tickets WHERE description = $2), $3)
      `,
        [id, description, amount],
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

export const getOrderByReferenceNumber = async (order: Pick<Order, 'formId' | 'referenceNumber'>): Promise<Order | undefined> => {
  const { formId, referenceNumber } = order;

  const result = await db.query(
    `
    SELECT 
      o.id, status, total, vat, o.form_id AS "formId", reference_number AS "referenceNumber",
      json_agg(json_build_object('description', description, 'amount', amount)) AS "ticketsAmounts",
      fields_with_values AS "fieldsWithValues", swish, stripe
    FROM orders o
    INNER JOIN orders_tickets ot ON o.id = ot.order_id
    INNER JOIN forms_tickets ft ON ot.ticket_id = ft.id
    WHERE o.form_id = $1 AND reference_number = $2
    GROUP BY o.id
  `,
    [formId, referenceNumber],
  );

  return result.rows[0];
};

export type OrderStatus = 'pending' | 'aborted' | 'cancelled' | 'completed';

export const updateOrderStatus = async (id: number, status: OrderStatus): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE orders
    SET status = $1, last_updated = DEFAULT
    WHERE id = $2
  `,
    [status, id],
  );

  return result.rowCount > 0;
};

export const updateOrderReceipt = async (id: number): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE orders
    SET receipt_sent = true, last_updated = DEFAULT
    WHERE id = $1
  `,
    [id],
  );

  return result.rowCount > 0;
};

export const updateOrderNote = async (id: number, note: string | null): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE orders
    SET note = $1, last_updated = DEFAULT
    WHERE id = $2
  `,
    [note, id],
  );

  return result.rowCount > 0;
};

export const getTicketSeatsTaken = async (ticket: Pick<Ticket, 'description'>, form: Pick<Form, 'id'>): Promise<number> => {
  const result = await db.query(`
    SELECT coalesce(sum(amount), 0) AS count
    FROM orders_tickets ot
    INNER JOIN orders o ON ot.order_id = o.id
    INNER JOIN forms_tickets ft ON ot.ticket_id = ft.id
    WHERE ft.description = $1 AND o.form_id = $2 AND status = 'completed'
  `,
    [ticket.description, form.id],
  );

  return result.rows[0].count;
};

export const updateSwishOrderByReferenceNumberAndUUID = async (data: Pick<Order, 'referenceNumber' | 'status'> & Pick<Swish, 'UUID' | 'paymentReference'>): Promise<boolean> => {
  const { referenceNumber, status, UUID, paymentReference } = data;

  const result = await db.query(
    `
    UPDATE orders
    SET status = $3, swish = swish || $4
    WHERE reference_number = $1 AND swish->>'UUID' = $2
  `,
    [referenceNumber, UUID, status, { UUID, paymentReference }],
  );

  return result.rowCount > 0;
};

export const updateSwishOrderBeforeRefund = async (data: Pick<Order, 'formId' | 'referenceNumber'> & Pick<Swish, 'refundUUID'>): Promise<(Pick<Order, 'total'> & Pick<Swish, 'paymentReference'>) | undefined> => {
  const { formId, referenceNumber, refundUUID } = data;

  const result = await db.query(
    `
    UPDATE orders
    SET swish = swish || $3
    WHERE form_id = $1 AND reference_number = $2
    RETURNING total, swish->>'paymentReference' AS "paymentReference"
  `,
    [formId, referenceNumber, { refundUUID }],
  );

  return result.rows[0];
};

export const updateSwishOrderByReferenceNumberAndRefundUUID = async (data: Pick<Order, 'referenceNumber' | 'status'> & Pick<Swish, 'refundUUID'>): Promise<boolean> => {
  const { referenceNumber, status, refundUUID } = data;

  const result = await db.query(
    `
    UPDATE orders
    SET status = $3
    WHERE reference_number = $1 AND swish->>'refundUUID' = $2
  `,
    [referenceNumber, refundUUID, status],
  );

  return result.rowCount > 0;
};

export const updateStripeOrderByPaymentIntentId = async (data: Pick<Stripe, 'paymentIntentId'> & Pick<Order, 'status'>): Promise<boolean> => {
  const { paymentIntentId, status } = data;

  const result = await db.query(
    `
    UPDATE orders
    SET status = $2
    WHERE stripe->>'paymentIntentId' = $1
  `,
    [paymentIntentId, status],
  );

  return result.rowCount > 0;
};
