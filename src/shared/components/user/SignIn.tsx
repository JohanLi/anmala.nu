import React from 'react';

import { Layout } from '../common/Layout';
import { SignInCommon } from './SignInCommon';
import { Content } from '../common/Content';
import { useRedirectToDashboardIfLoggedIn } from '../../utils';
import { QueryAlerts, useQueryAlert } from '../../queryAlert';

export const SignIn = (): JSX.Element => {
  useRedirectToDashboardIfLoggedIn();

  let alert = useQueryAlert(QueryAlerts.REQUIRES_LOGIN);

  if (!alert) {
    alert = useQueryAlert(QueryAlerts.INVALID_PASSWORD_RESET_TOKEN);
  }

  return (
    <Layout heading="Logga in" alert={alert}>
      <Content>
        <SignInCommon isModal={false} />
      </Content>
    </Layout>
  );
};
