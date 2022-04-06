import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

import { Alert, AlertType } from './components/common/Alert';

export enum QueryAlerts {
  INVALID_VERIFICATION_TOKEN,
  ALREADY_LOGGED_IN,
  REQUIRES_LOGIN,
  INVALID_PASSWORD_RESET_TOKEN,
}

const QueryAlertMap: {
  [key in QueryAlerts]: {
    type: AlertType;
    title: string;
    description?: ReactNode;
  }
} = {
  [QueryAlerts.INVALID_VERIFICATION_TOKEN]: {
    type: 'error',
    title: `
      Din länk för att verifiera din e-post verkar inte vara giltig längre.
      Skapa kontot igen för att få en ny länk skickat till dig.
    `,
  },
  [QueryAlerts.ALREADY_LOGGED_IN]: {
    type: 'attention',
    title: 'Du är redan inloggad.',
  },
  [QueryAlerts.REQUIRES_LOGIN]: {
    type: 'error',
    title: 'Sidan du försöker besöka kräver inloggning.',
  },
  [QueryAlerts.INVALID_PASSWORD_RESET_TOKEN]: {
    type: 'error',
    title: 'Din länk för att skapa ett nytt lösenord verkar inte vara giltig längre.',
  },
};

export const useQueryAlert = (code: QueryAlerts): JSX.Element | null => {
  const router = useRouter();

  const { alert } = router.query as { alert?: QueryAlerts };

  const onClose = () => {
    const cleanPath = router.asPath.split('?alert=')[0];

    router.replace(cleanPath, undefined, { shallow: true });
  }

  if (alert === undefined) {
    return null;
  }

  if (Number(alert) !== code) {
    return null;
  }

  const { type, title, description } = QueryAlertMap[alert];

  return (
    <div className="pb-6">
      <Alert
        type={type}
        title={title}
        description={description}
        onClose={onClose}
      />
    </div>
  );
};
