import React from 'react';

import { Layout } from './common/Layout';
import { Content } from './common/Content';
import { lastUpdatedClass } from './common/classes';

export const SimpleSignupComparison = (): JSX.Element => {
  return (
    <Layout heading="Jämfört med Simple Signup">
      <div className={lastUpdatedClass}>
        Uppdaterad 1 december 2021
      </div>
      <Content>
        Placeholder
      </Content>
    </Layout>
  );
};
