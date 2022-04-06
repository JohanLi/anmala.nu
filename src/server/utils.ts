import { nanoid, customAlphabet } from 'nanoid/async';
import slugifyNpm from 'slugify';
import { NextApiResponse } from 'next';
import { IncomingMessage } from 'http';
import cookie from 'cookie';

import { getUserBySessionId } from './userRepository';
import { SESSION_ID_COOKIE_NAME } from '../pages/api/auth/utils';
import { User } from '../shared/userTypes';

export const generateOauthState = async (): Promise<string> => nanoid(16);

export const generateSessionId = async (): Promise<string> => nanoid(32);

export const validEmail = (input: string): boolean => /\S+@\S+\.\S+/.test(input);

export const getUser = async (req: IncomingMessage): Promise<User | undefined> => {
  let user;

  const cookies = cookie.parse(req.headers.cookie || '');
  const sessionId = cookies[SESSION_ID_COOKIE_NAME];

  if (sessionId) {
    user = await getUserBySessionId(sessionId);
  }

  return user;
};

export const passwordMeetsRequirements = (input: string): boolean => input.length >= 8;

export const getIpAddress = (req: IncomingMessage): string => {
  // Cloudflare
  const ipAddress = req.headers['cf-connecting-ip'] || req.headers['x-real-ip'];

  if (typeof ipAddress !== 'string') {
    throw 'Unable to get IP address';
  }

  return ipAddress;
};

/*
 _ and - are omitted from the default 64 possible characters, as the location
 of the last hyphen is used to determine pageIds from URLs
*/
export const generateFormId = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890', 8);

export const slugify = (input: string): string => slugifyNpm(input, {
  remove: /[*+~.()'"!:@]/g,
  lower: true,
});

export const generateOrderReferenceNumber = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8);

export const generateSwishUUID = customAlphabet('1234567890ABCDEF', 32);

export const handleApiError = (e: any, res: NextApiResponse) => {
  if (e.response) {
    console.log(e.response.status);
    console.log(e.response.data);
  } else {
    console.log(e);
  }

  res.status(500).end();
}
