import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Modal } from '../../../common/Modal';
import { Button } from '../../../common/Button';
import { apiAdmin } from '../../../../../client/apiAdmin';
import { Participant } from '../../../../participantTypes';
import { getNameFromFields } from '../../../form/utils';

interface Props {
  participant: Participant;
  pageId: string;
  onClose: () => void;
}

export const NoteModal = (props: Props): JSX.Element => {
  const { participant, pageId, onClose } = props;

  const router = useRouter();

  const [note, setNote] = useState(participant.note || '');
  const [loading, setLoading] = useState(false);

  return (
    <Modal onClose={onClose} closeOnEscape={false} closeOnClickOutside={false}>
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            {participant.note ? 'Redigera anteckning' : 'Skapa anteckning'}
          </h2>
          <div className="mt-4 text-sm text-gray-500">
            Gällande <strong>{getNameFromFields(participant.fieldsWithValues)}</strong>:
          </div>
          <textarea
            rows={6}
            className="shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md mt-4"
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
        <Button
          type="primary"
          size="md"
          className="w-full sm:w-auto"
          onClick={() => {
            setLoading(true);

            // TODO error handling
            apiAdmin.updateNote({
              formId: pageId,
              referenceNumber: participant.orderReferenceNumber,
              note,
            })
              .then(() => {
                router.reload();
              });
          }}
          disabled={loading}
        >
          {participant.note ? 'Spara' : 'Skapa'}
        </Button>
        <Button
          type="secondary"
          size="md"
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Avbryt
        </Button>
        {participant.note && (
          <Button
            type="danger"
            size="md"
            onClick={() => {
              setLoading(true);

              // TODO error handling
              apiAdmin.updateNote({
                formId: pageId,
                referenceNumber: participant.orderReferenceNumber,
                note: null,
              })
                .then(() => {
                  router.reload();
                });
            }}
            className="w-full sm:w-auto"
            disabled={loading}
          >
            Ta bort
          </Button>
        )}
      </div>
    </Modal>
  );
}
