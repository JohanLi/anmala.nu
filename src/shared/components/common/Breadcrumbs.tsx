import React from 'react';
import { useRouter } from 'next/router';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid';

import { Link } from './Link';

const linkToText = (link: string) => {
  if (link === 'mina-formular') {
    return 'Mina formulär';
  }

  return link.charAt(0).toUpperCase() + link.slice(1).replace(/-/g, ' ');
};

const ignoreLastPaths: string[] = [
  'deltagare',
  'bokningsbekraftelse',
  'meddelanden',
];

interface Props {
  lastText?: string; // used for the name of Pages, which cannot be determined by the slug alone
}

export const Breadcrumbs = (props: Props): JSX.Element | null => {
  const { lastText } = props;

  const router = useRouter();

  const path = router.asPath.split('/');

  if (path.length < 2) {
    return null;
  }

  path.shift();

  if (ignoreLastPaths.includes(path[path.length - 1])) {
    path.pop();
  }

  return (
    <nav className="flex pb-2" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 h-5 w-5" />
            </Link>
          </div>
        </li>
        {path.map((link, i) => {
          const href = `/${path.slice(0, i + 1).join('/')}`;
          const text = i + 1 === path.length && lastText ? lastText : linkToText(link);

          return (
            <li key={`${i}-${lastText}`}>
              <div className="flex items-center">
                <ChevronRightIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />
                <Link
                  href={href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {text}
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
