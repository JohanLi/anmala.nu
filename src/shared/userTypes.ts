export interface User {
  id: number;
  email: string;
  passwordHash?: string;
  googleId?: string;
  facebookId?: string;
  organizationId?: string;
  swishNumber?: string;
  stripeAccountId?: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface Username {
  email: string;
}

export interface CredentialsResetToken {
  resetToken: string;
  password: string;
}
