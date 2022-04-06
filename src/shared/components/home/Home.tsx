import React from 'react';

import { useUserContext } from '../user/UserContext';
import { Button } from '../common/Button';
import { Layout } from '../common/Layout';
import { Pricing } from './Pricing';
import { getDashboardUrl, getExampleUrl, getSignUpPageUrl } from '../../urls';

export const Home = (): JSX.Element => {
  const { user } = useUserContext();

  return (
    <Layout>
      <div className="space-y-12 lg:space-y-24 lg:pb-12 px-4 lg:px-0">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="flex items-center">
            <div>
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <div>
                  Skapa sidor,
                </div>
                <div>
                  ta emot bokningar,
                </div>
                <div>
                  hantera deltagare
                </div>
              </h1>
              <p className="mt-6 text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Passar dig som vill kunna ta betalt, men utan att behöva en hel webbutik.
              </p>
              <div className="mt-8 lg:mt-12 space-y-4 sm:space-y-0 sm:flex sm:space-x-12">
                <div>
                  <Button
                    type="primary"
                    size="lg"
                    className="px-8 py-3 md:py-4 md:text-lg md:px-10 rounded-md w-full sm:w-auto"
                    href={!user ? getSignUpPageUrl() : getDashboardUrl()}
                  >
                    {!user ? 'Kom igång' : 'Gå till Mina formulär'}
                  </Button>
                </div>
                <div>
                  <Button
                    type="secondary"
                    size="lg"
                    className="px-8 py-3 md:py-4 md:text-lg md:px-10 rounded-md w-full sm:w-auto"
                    href={getExampleUrl()}
                  >
                    Se exempel
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <img
            src="/images/demo1-57b347c9d0c05d97dfb4.jpg"
            alt=""
            width={2400}
            height={1800}
            className="w-full shadow-sm"
          />
        </div>
        <Pricing />
      </div>
    </Layout>
  );
};
