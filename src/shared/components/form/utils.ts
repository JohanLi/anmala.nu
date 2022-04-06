import { FieldWithValue, TicketAmount } from '../../orderTypes';
import { Field, Ticket } from '../../formTypes';

interface TotalAndVat {
  total: number;
  vat: number;
}

export const getTotalAndVat = (ticketsAmounts: TicketAmount[], tickets: Ticket[]): TotalAndVat => ticketsAmounts.reduce((acc, cur) => {
  const ticket = tickets.find(({ description }) => description === cur.description);

  if (!ticket) {
    throw Error('Invalid ticket');
  }

  const total = ticket.price * cur.amount;

  acc.total += total;
  acc.vat += total * Number(ticket.vatRate);

  return acc;
}, { total: 0, vat: 0 });

export const filterTickets = (ticketsAmounts: TicketAmount[]): TicketAmount[] => ticketsAmounts.filter(({ amount }) => amount > 0);

export const getNameFromFields = (fieldsWithValues: FieldWithValue[]): string => fieldsWithValues.find(({ name }) => name === 'Namn')?.value as string || '';
export const getEmailFromFields = (fieldsWithValues: FieldWithValue[]): string => fieldsWithValues.find(({ name }) => name === 'E-post')?.value as string || '';

export const getRequiredFieldsFilled = (fields: Field[], fieldsWithValues: FieldWithValue[]): boolean => {
  const unfilledFound = fields.find((field, i) => {
    if (!field.required) {
      return false;
    }

    const { value } = fieldsWithValues[i];

    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return !value;
    }
  })

  return unfilledFound === undefined;
}

export const classNames = (...classes: string[]): string => classes.filter(Boolean).join(' ');
