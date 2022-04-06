import React, { ReactNode } from 'react';

import { Link } from './Link';

type Type = 'primary' | 'secondary' | 'danger' | 'custom';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  type: Type;
  size: Size;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  submit?: boolean;
  children: ReactNode;
}

// button elements have text centered by default, but anchor elements do not
const baseClass = 'inline-block font-medium rounded shadow-sm focus:outline-none text-center';

const typeMap: { [key in Type]: string } = {
  primary: 'text-white bg-indigo-600 hover:bg-indigo-700',
  secondary: 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200',
  danger: 'text-red-700 bg-red-100 hover:bg-red-200',
  custom: '',
};

const sizeClass: { [key in Size]: string } = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = (props: Props): JSX.Element => {
  const { type, size, disabled, onClick, href, className, submit = false, children } = props;

  const finalClass = `${baseClass} ${typeMap[type] || ''} ${sizeClass[size] || ''} ${className || ''} ${disabled ? 'opacity-40 pointer-events-none' : ''}`;

  // // https://nextjs.org/docs/api-reference/next/link#if-the-child-is-a-function-component
  if (href) {
    return (
      <Link href={href} className={finalClass} data-test="button">
        {children}
      </Link>
    );
  }

  return (
    <button
      type={!submit ? 'button' : 'submit'}
      className={finalClass}
      onClick={onClick}
      disabled={disabled}
      data-test="button"
    >
      {children}
    </button>
  );
}
