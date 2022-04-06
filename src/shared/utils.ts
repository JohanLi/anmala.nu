import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useUserContext } from './components/user/UserContext';
import { getDashboardUrl, NEXT_PUBLIC_HOST } from './urls';
import { QueryAlerts } from './queryAlert';

export const formatDate = (date: string | null): string => {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString(
    'sv-SE',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  );
};

export const formatTime = (date: string | null): string => {
  if (!date) {
    return '-';
  }

  return new Date(date).toLocaleDateString(
    'sv-SE',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    },
  );
};

export const idFromUrl = (input: string): string => {
  const lastHyphenIndex = input.lastIndexOf('-');

  if (lastHyphenIndex === -1) {
    return '';
  }

  return input.substring(lastHyphenIndex + 1);
};

/*
  on redirect, Facebook appends #_=_ https://stackoverflow.com/a/18305085
  for Google, using certain accounts, # is appended
  not truncating them affects browser history navigation
 */
export const useOauthCallbackTidyUrl = (): void => {
  const router = useRouter();

  useEffect(() => {
    // /page# does not contain hash === '#'. href needs to be used instead
    if (window.location.hash !== '#_=_' && !window.location.href.endsWith('#')) {
      return;
    }

    const cleanPath = router.asPath.split('#')[0];

    router.replace(cleanPath, undefined, { shallow: true });
  }, []);
};

export const useRedirectToDashboardIfLoggedIn = (): void => {
  const { user } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      return;
    }

    router.replace(`${getDashboardUrl()}?alert=${QueryAlerts.ALREADY_LOGGED_IN}`);
  }, [user]);
};

// 12-digit organization IDs are also valid, but I haven't been able to find examples of them
export const validOrganizationId = (organizationId: string): boolean => {
  const numbers = organizationId.replace(/\D/g, '');

  if (numbers.length !== 10) {
    return false;
  }

  return validLuhnChecksum(numbers);
}

const validLuhnChecksum = (numbers: string): boolean => {
  let checksum = 0;

  for (let i = numbers.length - 1; i >= 0; i -= 1) {
    const number = Number(numbers[i]);

    if (i % 2 === 1) {
      checksum += number;
    } else {
      checksum += (number * 2) > 9 ? (number * 2) - 9 : number * 2;
    }
  }

  return checksum % 10 === 0;
}

export const textToHtml = (text: string): string => text.replace(/\n/g, '<br />')

const names = [
  'Alfons Åberg',
  'Kalle Anka',
  'Pippi Långstrump',
  'Ronja Rövardotter',
];

// https://stackoverflow.com/a/5915122
export const randomName = (): string => names[Math.floor(Math.random() * names.length)];

export const receiptCustomMessagePlaceholder = '(Ditt meddelande kommer hamna här, om du väljer att ha ett.)';
export const messagePlaceholder = '(Ditt meddelande kommer hamna här.)';

export const footerAbout = 'Skapa sidor, ta emot bokningar och hantera deltagare. Passar dig som vill kunna ta betalt, men utan att behöva en hel webbutik.';

export const seatsLeftSingularPlural = (seatsLeft: number): string => seatsLeft === 1 ? `${seatsLeft} plats` : `${seatsLeft} platser`;

export const getWidgetJSUrl = () => `${NEXT_PUBLIC_HOST}/js/widget.js`;

const widgetCSSHTML = `<link href="${NEXT_PUBLIC_HOST}/css/widget.css" rel="stylesheet">`;
const widgetJSHTML = `<script type="text/javascript" src="${getWidgetJSUrl()}" async></script>`;

export const getInlineWidgetHTML = (formUrl: string, includeJS = true) => `
  <div class="anmala-inline" data-url="${formUrl}" style="min-width:320px;min-height:100px;"></div>
  ${includeJS ? widgetJSHTML : ''}
`.trim();

export const getPopupWidgetHTML = (formUrl: string, includeJS = true) => `
  ${widgetCSSHTML}
  <a class="anmala-button" href="" onclick="openPopupWidget('${formUrl}');return false;">Boka</a>
  ${includeJS ? widgetJSHTML : ''}
`.trim();
