import { OAuth2Client } from 'google-auth-library';

export const googleOauth = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_HOST}${process.env.GOOGLE_REDIRECT_URI}`,
);
