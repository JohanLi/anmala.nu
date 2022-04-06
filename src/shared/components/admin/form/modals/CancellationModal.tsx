import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ExclamationIcon } from '@heroicons/react/outline';

import { Button } from '../../../common/Button';
import { apiAdmin } from '../../../../../client/apiAdmin';
import { Modal } from '../../../common/Modal';
import { Participant } from '../../../../participantTypes';
import { getNameFromFields, getTotalAndVat } from '../../../form/utils';
import { PublicForm } from '../../../../formTypes';

interface Props {
  participant: Participant;
  form: Omit<PublicForm, 'userId'>;
  onClose: () => void;
}

export const CancellationModal = (props: Props): JSX.Element => {
  const { participant, form, onClose } = props;

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const { total } = getTotalAndVat(participant.ticketsAmounts, form.tickets);

  const onCancel = async () => {
    setLoading(true);

    // TODO error handling
    try {
      await apiAdmin.cancelOrder({
        formId: form.id,
        referenceNumber: participant.orderReferenceNumber
      });

      router.reload();
    } catch(e) {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <ExclamationIcon className="h-6 w-6 text-red-600" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Avboka
          </h2>
          <div className="mt-4 text-sm text-gray-500">
            Avboka <strong>{getNameFromFields(participant.fieldsWithValues)}</strong>?
          </div>
          {total > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              <strong>{total} kr</strong> kommer att återbetalas.
            </div>
          )}
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
        <Button
          type="danger"
          size="md"
          className="w-full sm:w-auto"
          onClick={onCancel}
          disabled={loading}
        >
          Avboka
        </Button>
        <Button
          type="secondary"
          size="md"
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Avbryt
        </Button>
      </div>
    </Modal>
  );
}
