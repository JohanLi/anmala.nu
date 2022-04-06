import { GetServerSideProps } from 'next';

import { AccountAdmin } from '../shared/components/admin/AccountAdmin';
import { getUser } from '../server/utils';
import { getSignInPageUrl } from '../shared/urls';
import { QueryAlerts } from '../shared/queryAlert';

export default AccountAdmin;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUser(req);

  if (!user) {
    return {
      redirect: {
        destination: `${getSignInPageUrl()}?alert=${QueryAlerts.REQUIRES_LOGIN}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};
