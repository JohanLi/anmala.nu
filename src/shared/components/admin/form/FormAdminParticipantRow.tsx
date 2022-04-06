import React from 'react';

import { formatTime } from '../../../utils';
import { Participant } from '../../../participantTypes';
import { Link } from '../../common/Link';
import { statusSwedishMap } from '../../../orderTypes';
import { getEmailFromFields, getNameFromFields } from '../../form/utils';
import { FormAdminParticipantRowFieldsWithValues } from './FormAdminParticipantRowFieldsWithValues';
import { Badge } from '../../common/Badge';
import { Button } from '../../common/Button';
import { PencilIcon } from '@heroicons/react/solid';

interface Props {
  participant: Participant;
  onCancel: () => void;
  onAddNote: () => void;
}

export const FormAdminParticipantRow = (props: Props): JSX.Element => {
  const { participant, onCancel, onAddNote } = props;

  const name = getNameFromFields(participant.fieldsWithValues);
  const email = getEmailFromFields(participant.fieldsWithValues);

  return (
    <tr>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">
          {name}
        </div>
        <Link
          href={`mailto:${email}`}
          className="text-sm text-gray-500"
        >
          {email}
        </Link>
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {participant.ticketsAmounts.map((ticketAmount, i) => (
          <div key={i} className="flex">
            <div>
              {ticketAmount.description}
            </div>
            <div className="pl-2">
              x {ticketAmount.amount}
            </div>
          </div>
        ))}
      </td>
      <td className="px-6 py-4">
        <FormAdminParticipantRowFieldsWithValues fieldsWithValues={participant.fieldsWithValues} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {formatTime(participant.created)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {participant.orderReferenceNumber}
      </td>
      <td className="px-6 py-4">
        {participant.orderStatus === 'completed' && (
          <Badge
            color="green"
            text={statusSwedishMap[participant.orderStatus]}
            size="lg"
          />
        )}
        {participant.orderStatus === 'cancelled' && (
          <Badge
            color="red"
            text={statusSwedishMap[participant.orderStatus]}
            size="lg"
          />
        )}
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-6">
          {participant.orderStatus === 'completed' && (
            <Button
              type="danger"
              size="sm"
              onClick={onCancel}
            >
              Avboka
            </Button>
          )}
          {!participant.note && (
            <Button
              type="secondary"
              size="sm"
              onClick={onAddNote}
            >
              Anteckna
            </Button>
          )}
          {participant.note && (
            <div className="cursor-pointer" onClick={onAddNote}>
              <PencilIcon className="p-1 h-7 w-7 text-gray-400 group-hover:text-gray-500" />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
