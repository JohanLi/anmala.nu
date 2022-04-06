import React, { ReactNode } from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';

import { classNames } from './utils';

const checkClass = 'h-5 w-5 text-green-500';
const chevronClass = 'text-gray-500 h-5 w-5 ml-auto';

export interface StepProps {
  isCurrent: boolean;
  complete: boolean;
  onClick: () => void;
  title: string;
  children?: ReactNode;
}

export const Step = (props: StepProps): JSX.Element => {
  const { isCurrent, complete, onClick, title, children } = props;

  return (
    <div onClick={!isCurrent && complete ? onClick : undefined}>
      <div className="flex cursor-pointer items-center py-4">
        <h2 className={classNames(
          'text-lg font-bold mr-2',
          isCurrent ? 'text-gray-900' : 'text-gray-300',
        )}>
          {title}
        </h2>
        {complete && !isCurrent && <CheckIcon className={checkClass} />}
        {isCurrent && <ChevronDownIcon className={chevronClass} />}
        {!isCurrent && <ChevronUpIcon className={chevronClass} />}
      </div>
      {isCurrent && (
        <div className="px-2 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}
