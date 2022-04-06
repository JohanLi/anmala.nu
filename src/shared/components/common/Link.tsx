import React, { ReactNode } from 'react';
import NextLink from 'next/link';

import { linkClass } from './classes';

// TODO figure out how to forbid text, if children is passed in. external should also not be passed in, if newWindow is
interface Props {
  href: string;
  children?: ReactNode;
  className?: string;
  external?: boolean;
  newWindow?: boolean;
}

export const Link = (props: Props): JSX.Element => {
  const { href, children, className, external = false, newWindow = false } = props;

  const finalClass = className !== undefined ? className : linkClass;

  if (external) {
    return (
      <a
        href={href}
        className={finalClass}
      >
        {children}
      </a>
    );
  }

  if (newWindow) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={finalClass}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink href={href}>
      <a className={finalClass}>
        {children}
      </a>
    </NextLink>
  );
}
