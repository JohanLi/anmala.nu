import { OrderStatus } from '../server/orderRepository';
import { Field, Ticket } from './formTypes';

export type PublicOrderStatus = Extract<OrderStatus, 'completed' | 'cancelled'>;

export const statusSwedishMap: { [key in PublicOrderStatus]: string } = {
  completed: 'Anmäld',
  cancelled: 'Avbokad',
};

export interface TicketAmount extends Pick<Ticket, 'description'> {
  amount: number;
}

export interface FieldWithValue extends Pick<Field, 'name'> {
  value: string | string[];
}

export type FormStep = 'ticket' | 'customForm' | 'payment' | 'completed';

export const paymentMethods = ['swish', 'stripe'] as const;
export type PaymentMethod = typeof paymentMethods[number];
