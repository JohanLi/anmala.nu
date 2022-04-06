import { GetServerSideProps } from 'next';

import { FormsAdmin, FormsAdminProps } from '../shared/components/admin/FormsAdmin';
import { getUser } from '../server/utils';
import { getOverviewForms } from '../server/formRepository';
import { getSignInPageUrl } from '../shared/urls';
import { QueryAlerts } from '../shared/queryAlert';

export default FormsAdmin;

export const getServerSideProps: GetServerSideProps<FormsAdminProps> = async ({ req }) => {
  const user = await getUser(req);

  if (!user) {
    return {
      redirect: {
        destination: `${getSignInPageUrl()}?alert=${QueryAlerts.REQUIRES_LOGIN}`,
        permanent: false,
      },
    };
  }

  const overviewForms = await getOverviewForms(user.id);

  return {
    props: {
      overviewForms,
      user,
    },
  };
};
