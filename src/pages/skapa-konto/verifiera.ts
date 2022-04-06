import { GetServerSideProps } from 'next';
import cookie from 'cookie';

import { deleteUserPending, getUserPending, insertSession, insertUser } from '../../server/userRepository';
import { getCreatePageUrl, getSignUpPageUrl } from '../../shared/urls';
import { generateSessionId, getIpAddress } from '../../server/utils';
import { SESSION_ID_COOKIE_NAME, SESSION_ID_EXPIRY } from '../api/auth/utils';
import { QueryAlerts } from '../../shared/queryAlert';

// TODO handle errors
export const getServerSideProps: GetServerSideProps = async ({ query, req, res }) => {
  const token = query.token as string;

  const userPending = await getUserPending(token);

  if (!userPending) {
    return {
      redirect: {
        destination: `${getSignUpPageUrl()}?alert=${QueryAlerts.INVALID_VERIFICATION_TOKEN}`,
        permanent: false,
      },
    };
  }

  await deleteUserPending(token);

  const { id: userId } = await insertUser(userPending);

  const sessionId = await generateSessionId();

  await insertSession(sessionId, userId, getIpAddress(req));

  res.setHeader('Set-Cookie', cookie.serialize(SESSION_ID_COOKIE_NAME, sessionId, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: SESSION_ID_EXPIRY,
  }));

  return {
    redirect: {
      destination: getCreatePageUrl(),
      permanent: false,
    },
  };
};

// this "page" exists so end users do not see the /api routes in their email links
const Placeholder = () => null;

export default Placeholder;
