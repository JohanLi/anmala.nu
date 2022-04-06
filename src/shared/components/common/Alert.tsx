import React, { ReactNode } from 'react';

export type AlertType = 'success' | 'attention' | 'info' | 'error';

const colorClassMap: {
  [key in AlertType]: {
    background: string;
    svg: string;
    title: string;
    description: string;
    close: string;
  };
} = {
  success: {
    background: 'bg-green-50',
    svg: 'text-green-400',
    title: 'text-green-800',
    description: 'text-green-700',
    close: 'bg-green-50 text-green-500 hover:bg-green-100',
  },
  attention: {
    background: 'bg-yellow-50',
    svg: 'text-yellow-400',
    title: 'text-yellow-800',
    description: 'text-yellow-700',
    close: 'bg-yellow-50 text-yellow-500 hover:bg-yellow-100',
  },
  info: {
    background: 'bg-blue-50',
    svg: 'text-blue-400',
    title: 'text-blue-800',
    description: 'text-blue-700',
    close: 'bg-blue-50 text-blue-500 hover:bg-blue-100',
  },
  error: {
    background: 'bg-red-50',
    svg: 'text-red-400',
    title: 'text-red-800',
    description: 'text-red-700',
    close: 'bg-red-50 text-red-500 hover:bg-red-100',
  },
};

const svgPathMap: { [key in AlertType]: string } = {
  success: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
  attention: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
  info: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z',
  error: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
};

interface Props {
  type: AlertType;
  title: string;
  description?: ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Alert = (props: Props): JSX.Element => {
  const { type, title, description, className = '', onClose } = props;

  const colorClass = colorClassMap[type];
  const svgPath = svgPathMap[type]

  return (
    <div className={`rounded-md ${colorClass.background} p-4 ${className}`} data-test="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className={`h-5 w-5 ${colorClass.svg}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d={svgPath}
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${colorClass.title}`}>
            {title}
          </h3>
          {description && (
            <div className={`mt-2 text-sm ${colorClass.description}`}>
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                className={`inline-flex rounded-md p-1.5 ${colorClass.close} focus:outline-none`}
                onClick={() => onClose()}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
