import React from 'react';

import { getSwishCostComparisonUrl, priceUrlFragment } from '../../urls';
import { Link } from '../common/Link';

export const Pricing = (): JSX.Element => {
  return (
    <div>
      <div id={priceUrlFragment}>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Pris
        </h2>
        <div className="mt-4 text-sm text-gray-600">
          Välj mellan två prisklasser. Om du känner dig missnöjd, kontakta oss inom 14 dagar från första bokningen
          och få pengarna tillbaka!
        </div>
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex items-center">
            <div className="flex-1 pr-6">
              <h3 className="font-bold tracking-wide text-gray-900 uppercase">
                Standard
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                För dig som arrangerar mindre, enstaka eller oregelbundna evenemang.
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                2% + 1,5 kr
              </div>
              <div className="font-medium text-gray-500">
                /bokning
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex items-center">
            <div className="flex-1 pr-6">
              <h3 className="font-bold tracking-wide text-gray-900 uppercase">
                Premium
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                Slipp bokningsavgiften. För dig som arrangerar större eller återkommande evenemang. Betalas årsvis.
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                200 kr
              </div>
              <div className="font-medium text-gray-500">
                /månad
              </div>
            </div>
          </div>
        </div>
        <h3 className="mt-12 text-xl font-bold text-gray-900">
          Transaktionsavgift
        </h3>
        <div className="mt-4 text-sm text-gray-600">
          Utöver delen som Anmäla.nu tar, tillkommer det transaktionsavgifter beroende på vilken/vilka betallösningar du vill
          erbjuda. Nedan ser du vilka vi stödjer:
        </div>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex items-center">
            <div className="flex-1 pr-6">
              <img src="/swish.svg" alt="Swish" className="h-12" />
            </div>
            <div className="text-xl font-semibold text-gray-900">
              2kr - 3kr
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex items-center">
            <div className="flex-1 pr-6">
              <img src="/stripe.svg" alt="Stripe" className="h-12" />
            </div>
            <div className="text-xl font-semibold text-gray-900">
              1,4% + 1,80kr
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg shadow-sm bg-white p-4 flex items-center">
            <div className="flex-1 pr-6">
              <img src="/payson.png" alt="Stripe" className="h-12" />
            </div>
            <div className="text-xl font-semibold text-gray-900">
              2,85%
            </div>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-sm text-gray-600">
            Avgiften för Swish varierar beroende på bank. Här har vi <Link href={getSwishCostComparisonUrl()}>jämfört priserna för Swish</Link>.
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <Link href="https://stripe.com/en-se/pricing">Stripes prislista</Link>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <Link href="https://www.payson.se/sv/foretag-betallosningar/prislista/">Paysons prislista</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
