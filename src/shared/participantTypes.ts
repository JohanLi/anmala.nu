import { FieldWithValue, PublicOrderStatus, TicketAmount } from './orderTypes';

export interface Participant {
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  note: string | null;
  created: string;
  orderReferenceNumber: string;
  orderStatus: PublicOrderStatus;
}
