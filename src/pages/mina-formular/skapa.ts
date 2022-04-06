import { GetServerSideProps } from 'next';

import { FormAdminCreate} from '../../shared/components/admin/form/FormAdminCreate';
import { getUser } from '../../server/utils';
import { getSignInPageUrl } from '../../shared/urls';
import { QueryAlerts } from '../../shared/queryAlert';

export default FormAdminCreate;

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
