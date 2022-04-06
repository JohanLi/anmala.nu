import { db } from './database';
import { OAUTH_STATE_EXPIRY, SESSION_ID_EXPIRY, SSOProvider } from '../pages/api/auth/utils';
import { User } from '../shared/userTypes';

type InsertUser = Omit<User, 'id'>;
type InsertUserPending = {
  verificationToken: string;
  email: string;
  passwordHash: string;
}

export const getUser = async (id: number): Promise<User> => {
  const result = await db.query(
    `
    SELECT id, email, password_hash AS "passwordHash", organization_id AS "organizationId", swish_number AS "swishNumber", stripe_account_id AS "stripeAccountId"
    FROM users
    WHERE id = $1
  `,
    [id],
  );

  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<Pick<User, 'id' | 'email' | 'passwordHash'> | undefined> => {
  const result = await db.query(
    `
    SELECT id, email, password_hash AS "passwordHash"
    FROM users
    WHERE email = $1
  `,
    [email],
  );

  return result.rows[0];
};

export const insertUserPending = async (user: InsertUserPending): Promise<boolean> => {
  const { verificationToken, email, passwordHash } = user;

  const result = await db.query(
    `
    INSERT INTO users_pending (verification_token, email, password_hash)
    VALUES ($1, $2, $3)
  `,
    [verificationToken, email, passwordHash],
  );

  return result.rowCount > 0;
};

export const getUserPending = async (verificationToken: string): Promise<Omit<InsertUserPending, 'verificationToken'> | undefined> => {
  const result = await db.query(
    `
    SELECT email, password_hash AS "passwordHash"
    FROM users_pending
    WHERE verification_token = $1 AND created > NOW() - INTERVAL '1 hour'
  `,
    [verificationToken],
  );

  return result.rows[0];
};

export const deleteUserPending = async (verificationToken: string): Promise<boolean> => {
  const result = await db.query(
    `
    DELETE FROM users_pending
    WHERE verification_token = $1
  `,
    [verificationToken],
  );

  return result.rowCount > 0;
};

export const insertUser = async (user: InsertUser): Promise<User> => {
  const { email, passwordHash } = user;

  const result = await db.query(
    `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, password_hash AS "passwordHash"
  `,
    [email, passwordHash],
  );

  return result.rows[0];
};

const providerColumnMap: { [key in SSOProvider]: string } = {
  google: 'google_id',
  facebook: 'facebook_id',
};

export const updateUserSSOId = async (userId: number, provider: SSOProvider, ssoId: string): Promise<boolean> => {
  const column = providerColumnMap[provider];

  const result = await db.query(
    `
    UPDATE users
    SET ${column} = $1, last_updated = DEFAULT
    WHERE id = $2
  `,
    [ssoId, userId],
  );

  return result.rowCount > 0;
};

export const insertSession = async (id: string, userId: number, ipAddress: string): Promise<boolean> => {
  const result = await db.query(
    `
      INSERT INTO sessions (id, user_id, ip_address)
      VALUES ($1, $2, $3)
    `,
    [id, userId, ipAddress],
  );

  return result.rowCount > 0;
}

export const removeSession = async (id: string): Promise<boolean> => {
  const result = await db.query(
    `
      DELETE FROM sessions
      WHERE id = $1
    `,
    [id],
  );

  return result.rowCount > 0;
}

// TODO: the expiry check should be considered business logic and thus moved out
export const getUserBySessionId = async (id: string): Promise<User | undefined> => {
  const result = await db.query(
    `
      SELECT u.id, email, google_id AS "googleId", facebook_id AS "facebookId", organization_id AS "organizationId"
      FROM sessions s
      INNER JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.created > NOW() - INTERVAL '${SESSION_ID_EXPIRY} seconds';
    `,
    [id],
  );

  return result.rows[0];
}

export const insertOauthState = async (id: string, ipAddress: string): Promise<boolean> => {
  const result = await db.query(
    `
      INSERT INTO oauth_states (id, ip_address)
      VALUES ($1, $2)
    `,
    [id, ipAddress],
  );

  return result.rowCount > 0;
}

export const isValidOauthState = async (id: string): Promise<boolean> => {
  const result = await db.query(
    `
      SELECT id
      FROM oauth_states
      WHERE id = $1 AND created > NOW() - INTERVAL '${OAUTH_STATE_EXPIRY} seconds';
    `,
    [id],
  );

  return result.rows.length > 0;
}

export const insertPasswordReset = async (resetToken: string, userId: number): Promise<boolean> => {
  const result = await db.query(
    `
    INSERT INTO users_password_reset (reset_token, user_id) 
    VALUES ($1, $2)
  `,
    [resetToken, userId],
  );

  return result.rowCount > 0;
};

export const getUserByResetToken = async (resetToken: string): Promise<Pick<User, 'id' | 'email'> | undefined> => {
  const result = await db.query(
    `
    SELECT id, email
    FROM users_password_reset
    INNER JOIN users u on users_password_reset.user_id = u.id
    WHERE reset_token = $1 AND users_password_reset.created > NOW() - INTERVAL '1 hour'
  `,
    [resetToken],
  );

  return result.rows[0];
};

export const deletePasswordReset = async (resetToken: string): Promise<boolean> => {
  const result = await db.query(
    `
    DELETE FROM users_password_reset
    WHERE reset_token = $1
  `,
    [resetToken],
  );

  return result.rowCount > 0;
};

export const updatePassword = async (userId: number, passwordHash: string): Promise<boolean> => {
  const result = await db.query(
    `
    UPDATE users
    SET password_hash = $2
    WHERE id = $1
  `,
    [userId, passwordHash],
  );

  return result.rowCount > 0;
};
