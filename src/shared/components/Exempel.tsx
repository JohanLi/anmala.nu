import React, { useEffect } from 'react';

import { Layout } from './common/Layout';
import { Link } from './common/Link';
import { getExampleFormUrl } from '../urls';
import { getInlineWidgetHTML, getPopupWidgetHTML, getWidgetJSUrl } from '../utils';

export const Exempel = (): JSX.Element => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = getWidgetJSUrl();
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="flex items-center">
          <div>
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              Skidåkning 2022
            </h1>
            <p className="mt-3 text-gray-500 sm:mt-5 sm:text-lg">
              Påhittat evenemang! Nedan ser du tre sätt att lägga in ett formulär, som du skapat, på din egen hemsida.
            </p>
          </div>
        </div>
        <div>
          <img
            className="w-full object-cover"
            src="/images/skidresa-3c2c8a87ff0b2e6d34b2.jpg"
            alt=""
          />
        </div>
      </div>
      <h2 className="mt-12 text-xl font-bold text-gray-900">1. Direkt på din sida</h2>
      <div>
        För varje formulär du skapar, får du en kodsnutt som du klistrar in i ditt befintliga hemsideprogram.
      </div>
      <div
        className="my-8"
        dangerouslySetInnerHTML={{ __html: getInlineWidgetHTML(getExampleFormUrl(), false) }}
      />
      <h2 className="mt-12 text-xl font-bold text-gray-900">2. Knapp som öppnar ett extrafönster/popup-fönster</h2>
      <div>
        En kodsnutt används även för denna variant. Fördelen är att du inte behöver lämna utrymme på din befintliga
        sida för att ge plats åt formuläret.
      </div>
      <div
        className="my-8"
        dangerouslySetInnerHTML={{ __html: getPopupWidgetHTML(getExampleFormUrl(), false) }}
      />
      <h2 className="mt-12 text-xl font-bold text-gray-900">3. Vanlig länk som leder till formuläret</h2>
      <div>
        Passar om du inte har möjligheten att klistra in kod på din sida. Ett vanligt fall är om du skriver ett
        Facebook-inlägg.
      </div>
      <div className="my-8">
        <Link
          href={getExampleFormUrl()}
          newWindow
        >
          Länk till mitt formulär
        </Link>
      </div>
    </Layout>
  );
};
