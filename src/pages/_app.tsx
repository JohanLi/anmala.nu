import React from 'react'
import type { AppProps } from 'next/app';
import Head from 'next/head';

import { UserProvider } from '../shared/components/user/UserContext';
import '../../global.css';

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      <UserProvider user={pageProps.user}>
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

export default MyApp;
