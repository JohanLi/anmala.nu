import React, { useEffect, useState } from 'react';

import { Participant } from '../../../participantTypes';
import { FormAdminParticipantRow } from './FormAdminParticipantRow';
import { BASE_FIELDS, PublicForm } from '../../../formTypes';
import { NoteModal } from './modals/NoteModal';
import { CancellationModal } from './modals/CancellationModal';
import { Content } from '../../common/Content';
import { Button } from '../../common/Button';
import { apiAdmin } from '../../../../client/apiAdmin';
import { inputClass } from '../../common/classes';
import { PublicOrderStatus, statusSwedishMap } from '../../../orderTypes';
import { getEmailFromFields, getNameFromFields } from '../../form/utils';

interface Props {
  form: Omit<PublicForm, 'userId'>;
  participants: Participant[];
}

type StatusFilter = PublicOrderStatus | '';

export const FormAdminParticipants = (props: Props): JSX.Element => {
  const { form } = props;
  let { participants } = props;

  let columnCount = 6;

  const hasCustomFields = participants.some((participant) => participant.fieldsWithValues.length > BASE_FIELDS.length);

  if (hasCustomFields) {
    columnCount += 1;
  }

  const unfilteredParticipantsCount = participants.length;

  const [ticketDescriptionFilter, setTicketDescriptionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    setTicketDescriptionFilter(window.sessionStorage.getItem('ticketDescriptionFilter') || '');
    setStatusFilter(window.sessionStorage.getItem('statusFilter') as StatusFilter || '');
    setSearchFilter(window.sessionStorage.getItem('searchFilter') || '');
  }, []);

  useEffect(() => {
    if (ticketDescriptionFilter) {
      window.sessionStorage.setItem('ticketDescriptionFilter', ticketDescriptionFilter);
    } else {
      window.sessionStorage.removeItem('ticketDescriptionFilter');
    }
  }, [ticketDescriptionFilter]);

  useEffect(() => {
    if (statusFilter) {
      window.sessionStorage.setItem('statusFilter', statusFilter);
    } else {
      window.sessionStorage.removeItem('statusFilter');
    }
  }, [statusFilter]);

  useEffect(() => {
    if (searchFilter) {
      window.sessionStorage.setItem('searchFilter', searchFilter);
    } else {
      window.sessionStorage.removeItem('searchFilter');
    }
  }, [searchFilter]);

  const filterActive = ticketDescriptionFilter !== '' || statusFilter !== '' || searchFilter !== '';
  const resetFilter = () => {
    setTicketDescriptionFilter('');
    setStatusFilter('');
    setSearchFilter('');
  };

  if (ticketDescriptionFilter) {
    participants = participants.filter(({ ticketsAmounts }) => ticketsAmounts.find(({ description }) => description === ticketDescriptionFilter));
  }

  if (statusFilter) {
    participants = participants.filter(({ orderStatus }) => orderStatus === statusFilter);
  }

  if (searchFilter) {
    participants = participants.filter((participant) => {
      if (getNameFromFields(participant.fieldsWithValues).toLowerCase().startsWith(searchFilter.toLowerCase())) {
        return true;
      }

      if (getEmailFromFields(participant.fieldsWithValues).toLowerCase().startsWith(searchFilter.toLowerCase())) {
        return true;
      }

      return participant.orderReferenceNumber.startsWith(searchFilter);
    });
  }

  const [cancellationParticipant, setCancellationParticipant] = useState<Participant | null>(null);
  const [noteParticipant, setNoteParticipant] = useState<Participant | null>(null);

  return (
    <>
      {noteParticipant && (
        <NoteModal
          participant={noteParticipant}
          pageId={form.id}
          onClose={() => setNoteParticipant(null)}
        />
      )}
      {cancellationParticipant && (
        <CancellationModal
          participant={cancellationParticipant}
          form={form}
          onClose={() => setCancellationParticipant(null)}
        />
      )}
      <div className="flex items-center flex-wrap -mx-4 sm:-mx-6 -my-2 sm:-my-3 px-4 sm:px-0 pb-6">
        <label className="mx-4 sm:mx-6 my-2 sm:my-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Valt alternativ
          </div>
          <select
            className="block focus:outline-none w-full shadow-sm text-sm border-gray-300 rounded-md"
            value={ticketDescriptionFilter}
            onChange={(e) => setTicketDescriptionFilter(e.target.value)}
          >
            <option value="">Alla</option>
            {form.tickets.map(({ description }) => (
              <option value={description} key={description}>{description}</option>
            ))}
          </select>
        </label>
        <label className="mx-4 sm:mx-6 my-2 sm:my-3">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Status
          </div>
          <select
            className="block focus:outline-none w-full shadow-sm text-sm border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="">Alla</option>
            <option value="completed">{statusSwedishMap['completed']}</option>
            <option value="cancelled">{statusSwedishMap['cancelled']}</option>
          </select>
        </label>
        <label className="mx-4 sm:mx-6 my-2 sm:my-3 w-72">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Sök
          </div>
          <input
            className={inputClass}
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Namn, e-post eller referensnummer"
          />
        </label>
        {filterActive && (
          <div className="mx-4 sm:mx-6 my-2 sm:my-3">
            <Button
              type="secondary"
              size="md"
              onClick={() => resetFilter()}
            >
              Rensa filter
            </Button>
          </div>
        )}
      </div>
      <Content padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Namn och e-post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valt alternativ
              </th>
              {hasCustomFields && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Egna fält
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anmälningstid
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referensnummer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3" />
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {participants.map((participant) => (
              <FormAdminParticipantRow
                key={`${form.id} ${participant.orderReferenceNumber}`}
                participant={participant}
                onCancel={() => setCancellationParticipant(participant)}
                onAddNote={() => setNoteParticipant(participant)}
              />
            ))}
            {unfilteredParticipantsCount > 0 && participants.length === 0 && filterActive && (
              <tr>
                <td colSpan={columnCount} className="text-sm text-gray-500 px-4 sm:px-6 py-6">
                  <p>
                    Hittade inga deltagare som matchar följande:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    {Boolean(ticketDescriptionFilter) && (
                      <li>
                        Valt alternativ är <strong>{ticketDescriptionFilter}</strong>.
                      </li>
                    )}
                    {Boolean(statusFilter) && (
                      <li>
                        Status är <strong>{statusSwedishMap[statusFilter as PublicOrderStatus]}</strong>.
                      </li>
                    )}
                    {Boolean(searchFilter) && (
                      <>
                        <li>
                          Namn eller e-post börjar på <strong>{searchFilter}</strong>.
                        </li>
                        <li>
                          Referensnummer börjar på <strong>{searchFilter}</strong> (skiftlägeskänsligt).
                        </li>
                      </>
                    )}
                  </ul>
                </td>
              </tr>
            )}
            {unfilteredParticipantsCount === 0 && (
              <tr>
                <td colSpan={columnCount} className="text-sm text-gray-500 px-4 sm:px-6 py-6">
                  <p>
                    Inga har anmält sig ännu.
                  </p>
                  <p className="mt-4">
                    När du fått in deltagare, kommer du se en översikt av dem här.
                  </p>
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
      </Content>
      <div className="mt-12">
        <h2 className="text-lg font-medium text-gray-900 mb-4 px-4 sm:px-0">
          Import/Export
        </h2>
      </div>
      <Content>
        <Button
          type="secondary"
          size="lg"
          disabled // the API endpoint hasn't been updated after a major refactor
          // onClick={() => apiAdmin.exportOrders(form.id)}
          // disabled={unfilteredParticipantsCount === 0}
        >
          Exportera deltagarlistan (CSV-fil)
        </Button>
      </Content>
    </>
  );
}
