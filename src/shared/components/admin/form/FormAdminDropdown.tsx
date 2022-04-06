import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { DotsVerticalIcon, TrashIcon } from '@heroicons/react/solid';

import { DeleteFormModal } from './modals/DeleteFormModal';
import { EditForm } from '../../../formTypes';

interface Props {
  page: EditForm;
}

export const FormAdminDropdown = (props: Props): JSX.Element => {
  const { page } = props;

  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    window.addEventListener('click', close);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('click', close);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [open]);

  const onKeyUp = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') {
      return;
    }

    setOpen(false);
  };

  const [showDeleteFormModal, setShowDeleteFormModal] = useState(false);

  return (
    <>
      {showDeleteFormModal && (
        <DeleteFormModal
          form={page}
          onClose={() => setShowDeleteFormModal(false)}
        />
      )}
      <div className="relative inline-block text-left">
        <div onClick={() => setOpen(true)}>
          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 rounded-full flex items-center text-gray-400 focus:outline-none focus:bg-gray-200 p-2"
          >
            <DotsVerticalIcon className="h-5 w-5" />
          </button>
        </div>
        <Transition
          show={open}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
            <div>
              <a
                className="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                onClick={() => setShowDeleteFormModal(true)}
              >
                <TrashIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Ta bort formuläret
              </a>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
}
