import React from 'react';
import { Form } from '../../formTypes';
import { FieldWithValue, TicketAmount } from '../../orderTypes';
import { getEmailFromFields, getNameFromFields } from './utils';

interface FormCompletedProps {
  form: Form;
  ticketsAmounts: TicketAmount[];
  fieldsWithValues: FieldWithValue[];
  referenceNumber: string;
}

export const FormCompleted = (props: FormCompletedProps): JSX.Element => {
  const { form, ticketsAmounts, fieldsWithValues, referenceNumber } = props;

  return (
    <div>
      <h1>
        Tack för din bokning!
      </h1>
      <div>
        En bokningsbekräftelse har skickats till {getEmailFromFields(fieldsWithValues)}.
      </div>
      <h2>
        Bokningsinfo
      </h2>
      <table>
        <tbody>
          <tr>
            <td>
              Referensnummer
            </td>
            <td>
              {referenceNumber}
            </td>
          </tr>
          <tr>
            <td>
              Namn
            </td>
            <td>
              {getNameFromFields(fieldsWithValues)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
