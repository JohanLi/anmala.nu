import React from 'react';

import { Layout } from './common/Layout';
import { Content } from './common/Content';
import { lastUpdatedClass } from './common/classes';
import { Link } from './common/Link';

const swishForetagList = [
  {
    bank: 'Danske Bank',
    transactionFee: '2 kr',
    refundFee: '2 kr',
    monthlyFee: '40 kr',
    startFee: '475 kr',
    source: 'https://danskebank.se/foretag/annat/prislista-foretag#content-list-0-item-6',
  },
  {
    bank: 'Handelsbanken',
    transactionFee: '1,75 kr',
    refundFee: '1,75 kr',
    monthlyFee: '49 kr',
    startFee: '495 kr',
    source: 'https://www.handelsbanken.se/shb/inet/icentsv.nsf/vlookuppics/a_betalningar_prislista_informations-_och_betaltjanster__villkor_foretag/$file/p011.pdf',
  },
  {
    bank: 'Länsförsäkringar',
    transactionFee: (
      <>
        <p>
          1 kr upp till 100 kr
        </p>
        <p className="mt-2">
          2,50 kr annars
        </p>
      </>
    ),
    refundFee: '2,50 kr',
    monthlyFee: '33,33 kr',
    startFee: '?',
    source: 'https://www.lansforsakringar.se/globalassets/aa-global/dokument/prislistor/08199_prislista_foretag.pdf',
  },
  {
    bank: 'Nordea',
    transactionFee: '2 kr',
    refundFee: '2 kr',
    monthlyFee: '50 kr',
    startFee: '500 kr',
    source: 'https://www.nordea.se/foretag/produkter/betala/swish-foretag.html',
  },
  {
    bank: 'SEB',
    transactionFee: '2,50 kr',
    refundFee: '0 kr',
    monthlyFee: '40 kr',
    startFee: '0 kr',
    source: 'https://seb.se/foretag/verktyg-for-ditt-foretagande/swish-foretag',
  },
  {
    bank: 'Sparbanken Syd',
    transactionFee: '1,50 kr',
    refundFee: '?',
    monthlyFee: '41,67 kr',
    startFee: '?',
    source: 'https://www.sparbankensyd.se/vardagstjanster/betala/swish-foretag/',
  },
  {
    bank: 'Swedbank',
    transactionFee: '2 kr',
    refundFee: '?',
    monthlyFee: '50 kr',
    startFee: '1000 kr',
    source: 'https://online.swedbank.se/ConditionsEarchive/download?bankid=1111&id=WEBDOC-CID-2165966',
  },
];

const swishHandelList = [
  {
    bank: 'Danske Bank',
    transactionFee: (
      <>
        <p>
          2 kr upp till 100 kr
        </p>
        <p className="mt-2">
          2,50 kr upp till 1 000 kr
        </p>
        <p className="mt-2">
          3 kr annars
        </p>
      </>
    ),
    refundFee: '2,50 kr',
    monthlyFee: '50 kr',
    startFee: '475 kr',
    source: 'https://danskebank.se/foretag/annat/prislista-foretag#content-list-0-item-6',
  },
  {
    bank: 'Handelsbanken',
    transactionFee: '1,75 kr',
    refundFee: '1,75 kr',
    monthlyFee: '85 kr',
    startFee: '795 kr',
    source: 'https://www.handelsbanken.se/shb/inet/icentsv.nsf/vlookuppics/a_betalningar_prislista_informations-_och_betaltjanster__villkor_foretag/$file/p011.pdf',
  },
  {
    bank: 'Länsförsäkringar',
    transactionFee: (
      <>
        <p>
          2 kr upp till 100 kr
        </p>
        <p className="mt-2">
          3 kr upp till 500 kr
        </p>
        <p className="mt-2">
          5 kr annars
        </p>
      </>
    ),
    refundFee: '2,50 kr',
    monthlyFee: '62,50 kr',
    startFee: '?',
    source: 'https://www.lansforsakringar.se/globalassets/aa-global/dokument/prislistor/08199_prislista_foretag.pdf',
  },
  {
    bank: 'Nordea',
    transactionFee: '1,50 kr + 0,3%, max 10 kr',
    refundFee: '2 kr',
    monthlyFee: '50 kr',
    startFee: '500 kr',
    source: 'https://www.nordea.se/foretag/produkter/betala/swish-handel.html',
  },
  {
    bank: 'SEB',
    transactionFee: '3 kr',
    refundFee: '0 kr',
    monthlyFee: '60 kr',
    startFee: '0 kr',
    source: 'https://seb.se/foretag/verktyg-for-ditt-foretagande/swish-foretag',
  },
  {
    bank: 'Swedbank',
    transactionFee: '3 kr',
    refundFee: '?',
    monthlyFee: '50 kr',
    startFee: '1000 kr',
    source: 'https://online.swedbank.se/ConditionsEarchive/download?bankid=1111&id=WEBDOC-CID-2165966',
  },
];

export const SwishCostComparison = (): JSX.Element => {
  return (
    <Layout heading="Prisjämförelse av Swish mellan banker">
      <div className={lastUpdatedClass}>
        Uppdaterad 30 november 2021
      </div>
      <h2 className="text-lg font-medium text-gray-900 mb-4 px-4 sm:px-0">
        Prisjämförelse av Swish mellan banker
      </h2>
      <Content>
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <div className="max-w-2xl text-gray-500">
              <p>
                Ett separat avtal behöver tecknas med en bank för att ta emot betalningar via Swish som företag.
                Utöver en månadsavgift och eventuell anslutningsavgift, tar bankerna en avgift per betalning. Nedan
                har vi samlat ihop de olika prislistorna.
              </p>
              <p className="mt-4">
                Det finns ingen solklar vinnare – det beror på din försäljningsvolym och hur du upplever bankens andra
                tjänster som helhet.
              </p>
              <p className="mt-4">
                Om du vill erbjuda Swish som betalning via Anmäla.nu:s tjänst, behöver du skaffa <strong>Swish Handel</strong>.
              </p>
            </div>
          </div>
          <div className="md:col-span-5 flex items-center justify-center">
            <img
              src="/swish.svg"
              className="max-w-sm"
            />
          </div>
        </div>
      </Content>
      <h2 className="text-lg font-medium text-gray-900 mb-4 px-4 sm:px-0 mt-12">
        Swish Företag
      </h2>
      <Content padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaktionsavgift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Återbetalningsavgift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Månadsavgift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Anslutningsavgift
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Källa
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {swishForetagList.map((swishForetag) => (
              <tr key={swishForetag.bank}>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishForetag.bank}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishForetag.transactionFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishForetag.refundFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishForetag.monthlyFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishForetag.startFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 break-all">
                  <Link href={swishForetag.source} external>
                    Länk
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Content>
      <h2 className="text-lg font-medium text-gray-900 mb-4 px-4 sm:px-0 mt-12">
        Swish Handel
      </h2>
      <Content padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaktionsavgift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Återbetalningsavgift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Månadsavgift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anslutningsavgift
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Källa
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {swishHandelList.map((swishHandel) => (
              <tr>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishHandel.bank}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishHandel.transactionFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishHandel.refundFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishHandel.monthlyFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {swishHandel.startFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 break-all">
                  <Link href={swishHandel.source} external>
                    Länk
                  </Link>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Content>
    </Layout>
  );
};
