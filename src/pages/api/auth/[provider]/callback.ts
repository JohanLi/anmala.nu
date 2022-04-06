import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import axios from 'axios';

import { generateSessionId, getIpAddress } from '../../../../server/utils';
import {
  getUserByEmail,
  insertSession,
  insertUser,
  isValidOauthState, updateUserSSOId,
} from '../../../../server/userRepository';
import { googleOauth } from '../../../../server/googleOauth';
import { insertLog } from '../../../../server/orderRepository';
import { getCreatePageUrl, getDashboardUrl, getSignUpPageUrl } from '../../../../shared/urls';
import { OAUTH_STATE_COOKIE_NAME, SESSION_ID_COOKIE_NAME, SESSION_ID_EXPIRY, SSOProvider } from '../utils';

interface UserFromProvider {
  id: string;
  email: string;
}

const emailAndSSOGoogle = async (code: string): Promise<UserFromProvider> => {
  const { tokens } = await googleOauth.getToken(code);

  const idToken = tokens['id_token'];

  if (!idToken) {
    throw Error('no id_token returned');
  }

  const loginTicket = await googleOauth.verifyIdToken({
    idToken,
  });

  const tokenPayload = loginTicket.getPayload();

  if (!tokenPayload) {
    throw Error('no payload from id_token');
  }

  const { sub: id, email } = tokenPayload;

  if (!email) {
    throw Error('missing email');
  }

  return { id, email };
}

const emailAndSSOFacebook = async (code: string): Promise<UserFromProvider> => {
  const { data: { access_token } } = await axios({
    method: 'GET',
    url: 'https://graph.facebook.com/v9.0/oauth/access_token',
    params: {
      client_id: process.env.FACEBOOK_CLIENT_ID,
      redirect_uri: `${process.env.NEXT_PUBLIC_HOST}${process.env.FACEBOOK_REDIRECT_URI}`,
      client_secret: process.env.FACEBOOK_CLIENT_SECRET,
      code,
    }
  });

  const { data: { id, email } } = await axios({
    method: 'GET',
    url: 'https://graph.facebook.com/me',
    params: {
      fields: 'name,email',
      access_token,
    }
  });

  return { id, email };
}

// TODO phase out using email as the primary key for SSO

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'GET') {
    const provider = req.query.provider as SSOProvider;

    try {
      const { code, state } = req.query as { code: string; state: string };

      if (!code) {
        console.log(req.query);
        res.redirect(getSignUpPageUrl());
        return;
      }

      const cookies = cookie.parse(req.headers.cookie || '');
      const stateFromCookies = cookies[OAUTH_STATE_COOKIE_NAME];

      if (state !== stateFromCookies || !await isValidOauthState(state)) {
        console.log('Oauth state mismatch');
        res.status(500).end();
        return;
      }

      let ssoId;
      let email;

      if (provider === 'google') {
        ({ id: ssoId, email } = await emailAndSSOGoogle(code));
      } else if (provider === 'facebook') {
        ({ id: ssoId, email } = await emailAndSSOFacebook(code));
      } else {
        console.log('Unknown provider');
        res.status(500).end();
        return;
      }

      await insertLog(`AUTH_${provider.toUpperCase()}`, { ssoId, email });

      let { id: userId } = await getUserByEmail(email) || {};
      let landingPage = getDashboardUrl();

      if (!userId) {
        ({ id: userId } = await insertUser({ email }));
        landingPage = getCreatePageUrl();
      }

      await updateUserSSOId(userId, provider, ssoId);

      const sessionId = await generateSessionId();

      await insertSession(sessionId, userId, getIpAddress(req));

      res.setHeader('Set-Cookie', [
        cookie.serialize(SESSION_ID_COOKIE_NAME, sessionId, {
          path: '/',
          secure: true,
          httpOnly: true,
          maxAge: SESSION_ID_EXPIRY,
        }),
        cookie.serialize(OAUTH_STATE_COOKIE_NAME, '', {
          path: '/',
          secure: true,
          httpOnly: true,
          maxAge: 0,
        }),
      ]);

      res.redirect(landingPage);
      return;
    } catch (e) {
      console.log(e);
      res.status(500).end();
      return;
    }
  }

  res.status(404).end();
}
