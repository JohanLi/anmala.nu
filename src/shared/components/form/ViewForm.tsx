import Head from 'next/head';
import React, { useState } from 'react';

import { BASE_FIELDS, Form, TicketDescriptionSeatsLeft } from '../../formTypes';
import { TicketAmount, FormStep, FieldWithValue } from '../../orderTypes';
import { FormTicket } from './FormTicket';
import { FormCustomForm } from './FormCustomForm';
import { FormPayment } from './FormPayment';
import { FormCompleted } from './FormCompleted';
import { getRequiredFieldsFilled } from './utils';

export interface ViewFormProps {
  form: Form;
  ticketDescriptionSeatsLeft: TicketDescriptionSeatsLeft,
  stripeAccountId?: string;
}

export const ViewForm = (props: ViewFormProps): JSX.Element => {
  const { form, ticketDescriptionSeatsLeft, stripeAccountId } = props;

  const [step, setStep] = useState<FormStep>('ticket');

  const [ticketsAmounts, setTicketsAmounts] = useState<TicketAmount[]>(form.tickets.map((ticket) => ({
    description: ticket.description,
    amount: 0,
  })));

  const [fieldsWithValues, setFieldsWithValues] = useState<FieldWithValue[]>(BASE_FIELDS.concat(form.customFields).map((field) => ({
    name: field.name,
    value: '',
  })));

  const [referenceNumber, setReferenceNumber] = useState('');

  const ticketComplete = Boolean(ticketsAmounts.find((option) => option.amount > 0));

  const fields = BASE_FIELDS.concat(form.customFields);
  const customFormComplete = getRequiredFieldsFilled(fields, fieldsWithValues);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Head>
        <title>{form.title}</title>
      </Head>
      <div className="divide-y divide-gray-200">
        <FormTicket
          form={form}
          ticketDescriptionSeatsLeft={ticketDescriptionSeatsLeft}
          ticketsAmounts={ticketsAmounts}
          setTicketsAmounts={setTicketsAmounts}
          isCurrent={step === 'ticket'}
          complete={ticketComplete}
          onClick={() => setStep('ticket')}
          onNext={() => setStep('customForm')}
        />
        <FormCustomForm
          form={form}
          fieldsWithValues={fieldsWithValues}
          setFieldsWithValues={setFieldsWithValues}
          isCurrent={step === 'customForm'}
          complete={customFormComplete}
          onClick={() => setStep('customForm')}
          onNext={() => setStep('payment')}
        />
        <FormPayment
          form={form}
          ticketsAmounts={ticketsAmounts}
          fieldsWithValues={fieldsWithValues}
          stripeAccountId={stripeAccountId}
          referenceNumber={referenceNumber}
          setReferenceNumber={setReferenceNumber}
          isCurrent={step === 'payment'}
          onClick={() => setStep('payment')}
          onNext={() => setStep('completed')}
        />
        {step === 'completed' && (
          <FormCompleted
            form={form}
            ticketsAmounts={ticketsAmounts}
            fieldsWithValues={fieldsWithValues}
            referenceNumber={referenceNumber}
          />
        )}
      </div>
      <script src="/js/iframeResizer.contentWindow-v4.3.2.min.js" async />
    </div>
  );
}
