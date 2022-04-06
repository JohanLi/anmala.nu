import { GetServerSideProps } from 'next';

import { getUserByResetToken } from '../server/userRepository';
import { getSignInPageUrl } from '../shared/urls';
import { QueryAlerts } from '../shared/queryAlert';
import { NewPassword, NewPasswordProps } from '../shared/components/user/NewPassword';

export const getServerSideProps: GetServerSideProps<NewPasswordProps> = async ({ query }) => {
  const resetToken = query.token as string;

  const { email } = await getUserByResetToken(resetToken) || {};

  if (!email) {
    return {
      redirect: {
        destination: `${getSignInPageUrl()}?alert=${QueryAlerts.INVALID_PASSWORD_RESET_TOKEN}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      resetToken,
      email,
    },
  };
};

export default NewPassword;
