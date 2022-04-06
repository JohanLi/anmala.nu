import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import bcrypt from 'bcrypt';

import {
  getUserByEmail,
  getUserByResetToken,
  insertSession,
  removeSession,
  updatePassword,
} from '../../server/userRepository';
import { generateSessionId, getIpAddress, getUser, passwordMeetsRequirements } from '../../server/utils';
import { Errors } from '../../shared/errors';
import { SESSION_ID_COOKIE_NAME, SESSION_ID_EXPIRY } from './auth/utils';
import { Credentials, CredentialsResetToken } from '../../shared/userTypes';

// TODO logic for generating sessions is still rather spread out
export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  // sign in
  if (req.method === 'POST') {
    let user;

    if (!req.body.resetToken) {
      const { email, password } = req.body as Credentials;

      if (!email || !password) {
        res.status(400).json({ code: Errors.REQUIRED_FIELDS_MISSING });
        return;
      }

      user = await getUserByEmail(email);

      if (!user) {
        res.status(400).json({ code: Errors.INVALID_EMAIL });
        return;
      }

      if (!user.passwordHash) {
        res.status(400).json({ code: Errors.WRONG_SIGN_IN_METHOD });
        return;
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        res.status(400).json({ code: Errors.INVALID_PASSWORD });
        return;
      }
    } else {
      const { resetToken, password } = req.body as CredentialsResetToken;

      if (!resetToken || !password) {
        res.status(400).json({ code: Errors.REQUIRED_FIELDS_MISSING });
        return;
      }

      if (!passwordMeetsRequirements(password)) {
        res.status(400).json({ code: Errors.PASSWORD_REQUIREMENT });
        return;
      }

      user = await getUserByResetToken(resetToken);

      if (!user) {
        res.status(400).json({ code: Errors.INVALID_PASSWORD_RESET_TOKEN });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await updatePassword(user.id, hashedPassword);
    }

    const sessionId = await generateSessionId();

    await insertSession(sessionId, user.id, getIpAddress(req));

    res.setHeader('Set-Cookie', cookie.serialize(SESSION_ID_COOKIE_NAME, sessionId, {
      path: '/',
      secure: true,
      httpOnly: true,
      maxAge: SESSION_ID_EXPIRY,
    }));

    res.status(200).end();
    return;
  }

  try {
    const user = await getUser(req);

    if (!user) {
      res.status(401).end();
      return;
    }

    // check session. TODO refresh session logic
    if (req.method === 'PUT') {
      res.json(user);
      return;
    }

    // sign out
    if (req.method === 'DELETE') {
      const cookies = cookie.parse(req.headers.cookie || '');
      const sessionId = cookies[SESSION_ID_COOKIE_NAME];

      await removeSession(sessionId);

      res.setHeader('Set-Cookie', cookie.serialize(SESSION_ID_COOKIE_NAME, '', {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 0,
      }));

      res.status(200).end();
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).end();
    return;
  }

  res.status(404).end();
};
