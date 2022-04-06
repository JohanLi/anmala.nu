import React from 'react';

import { classNames } from '../form/utils';

// TODO force a className to be passed in, if Color is Custom
type Color = 'green' | 'red' | 'gray'| 'indigo' | 'custom';
type Size = 'sm' | 'lg';

const colorClassMap: { [key in Color]: string; } = {
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  gray: 'bg-gray-200 text-gray-800', // used for Participants tab
  indigo: 'bg-indigo-100 text-indigo-800', // used for Participants tab
  custom: '',
}

const sizeClassMap: { [key in Size]: string; } = {
  sm: 'px-2 py-0.5 rounded text-xs',
  lg: 'px-2.5 py-0.5 rounded-md text-sm',
}

interface Props {
  color: Color;
  size: Size;
  text: string;
  className?: string;
}

export const Badge = (props: Props): JSX.Element => {
  const { color, size, text, className = '' } = props;

  return (
    <span className={classNames(
      'inline-flex items-center font-medium',
      colorClassMap[color],
      sizeClassMap[size],
      className
    )}>
      {text}
    </span>
  );
}
