import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

const paddingClass = 'px-4 sm:px-6 py-6';
const noPaddingClass = 'overflow-hidden'; // so child element doesn't need to specify border-radius

export const Content = (props: Props) => {
  const { children, className = '', padding = true } = props;

  return (
    <div className={`bg-white ${padding ? paddingClass : noPaddingClass} border-gray-200 sm:rounded-lg sm:shadow ${className}`}>
      {children}
    </div>
  );
}
