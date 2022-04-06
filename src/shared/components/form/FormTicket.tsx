import React, { ChangeEvent } from 'react';

import { TicketAmount } from '../../orderTypes';
import { Form, TicketDescriptionSeatsLeft } from '../../formTypes';
import { seatsLeftSingularPlural } from '../../utils';
import { Button } from '../common/Button';
import { Step } from './Step';

const TICKET_AMOUNT_SELECT_LIMIT = 10;

export interface FormTicketProps {
  form: Form;
  ticketDescriptionSeatsLeft: TicketDescriptionSeatsLeft,
  ticketsAmounts: TicketAmount[];
  setTicketsAmounts: (optionsWithAmount: TicketAmount[]) => void;
  isCurrent: boolean;
  complete: boolean;
  onClick: () => void;
  onNext: () => void;
}

export const FormTicket = (props: FormTicketProps): JSX.Element => {
  const { form, ticketDescriptionSeatsLeft, ticketsAmounts, setTicketsAmounts, isCurrent, complete, onClick, onNext } = props;

  const setAmount = (e: ChangeEvent<HTMLSelectElement>, i: number) => {
    const newTicketsAmounts = [...ticketsAmounts];
    newTicketsAmounts[i].amount = Number(e.target.value);
    setTicketsAmounts(newTicketsAmounts);
  };

  return (
    <Step
      isCurrent={isCurrent}
      complete={complete}
      onClick={onClick}
      title="1. Välj"
    >
      <table className="table-fixed w-full -my-2">
        <tbody className="divide-y divide-gray-100">
        {form.tickets.map((ticket, i) => {
          const seatsLeft = ticketDescriptionSeatsLeft[ticket.description];
          const selectLimit = (seatsLeft > 0 ? seatsLeft : TICKET_AMOUNT_SELECT_LIMIT) + 1;

          return (
            <tr className={seatsLeft === 0 ? 'opacity-60' : ''} key={i}>
              <td className="py-2">
                <span className="text-sm font-medium text-gray-700 mr-2">{ticket.description}</span>
                {seatsLeft >= 0 && (
                  <span className="text-xs font-medium text-red-400">
                    {seatsLeft > 0 ? `${seatsLeftSingularPlural(seatsLeft)} kvar` : 'Slutsålt'}
                  </span>
                )}
              </td>
              <td className="py-2 text-right pr-4">
                <span className="text-sm font-medium text-gray-400">{ticket.price} kr</span>
              </td>
              <td className="py-2 w-20">
                <select
                  className="block w-full border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm rounded-md"
                  onChange={(e) => setAmount(e, i)}
                  value={ticketsAmounts[i].amount}
                  disabled={seatsLeft === 0}
                >
                  {Array(selectLimit).fill(0).map((_, i) => <option value={i} key={i}>{i}</option>)}
                </select>
              </td>
            </tr>
          );
        })}
        </tbody>
      </table>
      <Button
        type="primary"
        size="lg"
        onClick={onNext}
        disabled={!complete}
        className="w-full mt-6"
      >
        Boka
      </Button>
    </Step>
  );
}
