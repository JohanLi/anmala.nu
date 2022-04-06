import React, { ReactNode } from 'react';
import Head from 'next/head';

import { Menu } from '../menu/Menu';
import { Footer } from './Footer';
import { Breadcrumbs } from './Breadcrumbs';

// TODO headingRight cannot exist without heading
interface Props {
  heading?: string; // is not set only on the homepage
  headingRight?: ReactNode;
  alert?: ReactNode;
  children: ReactNode;
}

// footer with dynamic height fixed at bottom https://stackoverflow.com/a/59865099
export const Layout = (props: Props) => {
  const { heading, headingRight, alert, children } = props;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Head>
        {Boolean(heading) && (
          <title>{heading} - Anmäla.nu</title>
        )}
        {!Boolean(heading) && (
          <>
            <title>Skapa sidor, ta emot bokningar, hantera deltagare – Anmäla.nu</title>
            <meta name="description" content="För dig som ska arrangera en kurs eller aktivitet och vill kunna ta betalt. Helt gratis om du inte tar betalt!" />
          </>
        )}
      </Head>
      <Menu />
      <div className="mb-auto">
        <div className="max-w-7xl mx-auto py-12 sm:px-6">
          {Boolean(alert) && (
            <div className="mb-6">
              {alert}
            </div>
          )}
          {Boolean(heading) && (
            <div className="mb-6 px-4 sm:px-0 lg:flex lg:justify-between">
              <div className="flex-1">
                <Breadcrumbs lastText={heading} />
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  {heading}
                </h1>
              </div>
              {headingRight}
            </div>
          )}
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
}
