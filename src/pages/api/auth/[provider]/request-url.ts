import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

import { generateOauthState, getIpAddress } from '../../../../server/utils';
import { insertOauthState } from '../../../../server/userRepository';
import { googleOauth } from '../../../../server/googleOauth';
import { OAUTH_STATE_COOKIE_NAME, OAUTH_STATE_EXPIRY, SSOProvider } from '../utils';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const provider = req.query.provider as SSOProvider;

    const state = await generateOauthState();

    await insertOauthState(state, getIpAddress(req));

    let url;

    if (provider === 'google') {
      url = googleOauth.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.email',
        state,
      });
    } else if (provider === 'facebook') {
      url = `https://www.facebook.com/v9.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_HOST}${process.env.FACEBOOK_REDIRECT_URI}&scope=email&state=${state}`;
    } else {
      console.log('Unknown provider');
      res.status(400).end();
      return;
    }

    res.setHeader('Set-Cookie', cookie.serialize(OAUTH_STATE_COOKIE_NAME, state, {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: OAUTH_STATE_EXPIRY,
    }));

    res.json({ url });
    return;
  }

  res.status(404).end();
}
