import React, { ReactNode, useEffect, useRef, MouseEvent, useState } from 'react';
import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';

interface Props {
  onClose?: () => void;
  children: ReactNode;
  size?: 'lg';
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
}

// the extra div containing the ref inside <Transition> should not be necessary. Follow https://github.com/tailwindlabs/headlessui/issues/273
export const Modal = (props: Props): JSX.Element => {
  const { children, onClose, size, closeOnClickOutside = true, closeOnEscape = true } = props;

  const divContent = useRef<HTMLDivElement>(null);

  const onKeyUp = (e: KeyboardEvent) => {
    if (!onClose) {
      return;
    }

    if (e.key !== 'Escape') {
      return;
    }

    onClose();
  };

  useEffect(() => {
    if (!onClose || !closeOnEscape) {
      return;
    }

    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const onClick = (e: MouseEvent) => {
    if (!onClose || !closeOnClickOutside) {
      return;
    }

    const { current } = divContent;

    // https://stackoverflow.com/questions/61164018/typescript-ev-target-and-node-contains-eventtarget-is-not-assignable-to-node
    if (!current || !current.parentElement || current.parentElement.contains(e.target as Node)) {
      return;
    }

    onClose();
  }

  const sizeClass = size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-lg';

  // used for the sole purpose of triggering the animation
  const [show, setShow] = useState(false);

  useEffect(() => setShow(true), []);

  return (
    <>
      <div className="fixed z-10 inset-0 overflow-y-auto" onClick={onClick}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition
            show={show}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="fixed inset-0 transition-opacity"
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75" />
          </Transition>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <Transition
            show={show}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            className={`inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClass} sm:w-full sm:p-6`}
          >
            <div ref={divContent}>
              {onClose && (
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XIcon className="h-6 w-6" />
                  </button>
                </div>
              )}
              {children}
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}