export type FormStatus = 'open' | 'closed' | 'deleted';

export type PublicFormStatus = Extract<FormStatus, 'open' | 'closed'>;

export interface Form {
  id: string;
  userId: number;
  slug: string;
  status: FormStatus;
  title: string;
  tickets: Ticket[];
  customFields: Field[];
}

export interface PublicForm extends Form {
  status: PublicFormStatus;
}

export interface Ticket {
  description: string;
  price: number;
  vatRate: number;
  seats: number;
}

export type FormType = 'text' | 'textarea' | 'radio' | 'checkbox';

export interface Field {
  name: string;
  type: FormType;
  required: boolean;
  options: string[];
}

export const BASE_FIELDS: Field[] = [
  {
    name: 'Namn',
    type: 'text',
    required: true,
    options: [],
  },
  {
    name: 'E-post',
    type: 'text',
    required: true,
    options: [],
  },
];

export type EditForm = Omit<PublicForm, 'userId' | 'created' | 'lastUpdated'>;
export type CreateForm = Omit<EditForm, 'id' | 'slug' | 'status'>;

export type OverviewForm = Pick<PublicForm, 'id' | 'slug' | 'title' | 'status'> & {
  participantCount: number;
  created: string;
  lastUpdated: string | null;
};

export type Receipt = {
  html: string;
  customMessage: string;
};

export type TicketDescriptionsFromTo = [string, string][];

export type TicketDescriptionSeatsLeft = { [key: string]: number };
