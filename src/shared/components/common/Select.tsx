import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';

import { classNames } from '../form/utils';

export interface Option {
  title: string;
  description: string;
  colors: {
    background: string;
    hover: string;
    border: string;
  };
}

interface Props<T extends string> {
  options: { [key in T]: Option };
  option: T;
  setOption: (option: T) => void;
  disabled: boolean;
}

export const Select = <T extends string>(props: Props<T>): JSX.Element => {
  const { options, option, setOption, disabled } = props;

  const selected = options[option];

  return (
    <Listbox
      value={option}
      onChange={setOption}
    >
      <div className="relative">
        <div className={classNames(
          'inline-flex shadow-sm rounded-md divide-x divide-green-600',
          selected.colors.border,
          disabled ? 'opacity-40 pointer-events-none' : '',
        )}>
          <div className={classNames(
            'relative z-0 inline-flex shadow-sm rounded-md divide-x',
            selected.colors.border,
          )}>
            <div
              className={classNames(
                'relative inline-flex items-center border border-transparent rounded-l-md shadow-sm text-white text-sm font-medium py-2 px-4',
                selected.colors.background,
              )}>
              {selected.title}
            </div>
            <Listbox.Button
              className={classNames(
                'relative inline-flex items-center rounded-l-none rounded-r-md text-sm font-medium text-white focus:outline-none focus:z-10 p-2',
                selected.colors.background,
                selected.colors.hover,
              )}>
              <ChevronDownIcon className="h-5 w-5" />
            </Listbox.Button>
          </div>
        </div>

        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options
            className="origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {(Object.entries(options) as [T, Option][]).map(([key, value]) => (
              <Listbox.Option
                key={value.title}
                className={({ active }) =>
                  classNames(
                    'cursor-pointer select-none relative p-4 text-sm text-gray-900',
                    active ? 'bg-gray-100' : '',
                  )
                }
                value={key}
              >
                {({ selected }) => (
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <p className={selected ? 'font-semibold' : 'font-normal'}>{value.title}</p>
                      {selected && (
                        <span className="text-green-500">
                          <CheckIcon className="h-5 w-5" />
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-500">
                      {value.description}
                    </p>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
