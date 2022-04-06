import React, { FormEvent, useState } from 'react';

import { getDashboardUrl, getSignUpPageUrl } from '../../urls';
import { api } from '../../../client/api';
import { Errors } from '../../errors';
import { SSOButton } from './SSOButton';
import { inputClass, linkClass } from '../common/classes';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { Link } from '../common/Link';

interface Props {
  isModal?: boolean;
}

// TODO modal size should not change when resetting password
export const SignInCommon = (props: Props) => {
  const { isModal = true } = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryLinkSent, setRecoverLinkSent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.forgotPassword({ email });

      setRecoverLinkSent(true);
    } catch (e: any) {
      if (e.response.data.code === Errors.REQUIRED_FIELDS_MISSING) {
        setError('E-post behöver fyllas i.');
      }

      if (e.response.data.code === Errors.INVALID_EMAIL) {
        setError('Det finns inget konto kopplat till den angivna e-posten.');
      }
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.signIn({ email, password });
      // TODO try to get this working with router.push()
      window.location.href = getDashboardUrl();
    } catch (e: any) {
      if (e.response.data.code === Errors.REQUIRED_FIELDS_MISSING) {
        setError('Både e-post och lösenord behöver fyllas i.');
      }

      if (e.response.data.code === Errors.INVALID_EMAIL) {
        setError('Det finns inget konto kopplat till den angivna e-posten.');
      }

      if (e.response.data.code === Errors.WRONG_SIGN_IN_METHOD) {
        setError('Ditt konto verkar vara skapat med Google eller Facebook – prova att logga in med de alternativen istället.');
      }

      if (e.response.data.code === Errors.INVALID_PASSWORD) {
        setError('Lösenordet är fel.');
      }

      setLoading(false);
    }
  }

  if (showForgotPassword) {
    return (
      <div className="max-w-lg space-y-6">
        <div>
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Glömt lösenordet
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ingen fara! Du får en länk skickad till din inkorg för att skapa ett nytt.
          </p>
        </div>
        {!recoveryLinkSent && (
          <form
            className="space-y-6"
            onSubmit={forgotPassword}
          >
            <label className="flex flex-col sm:flex-row">
              <div className="font-medium text-gray-700 w-32 sm:pt-2 pb-2 sm:pb-0">
                E-post
              </div>
              <div className="flex-1">
                <input
                  className={inputClass}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="username"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </label>
            <Button
              type="primary"
              size="lg"
              className="w-full sm:w-auto"
              submit
              disabled={loading}
            >
              Skicka länk
            </Button>
            {error && (
              <Alert
                type="error"
                title={error}
                onClose={() => setError('')}
              />
            )}
            <div className="text-sm text-gray-500">
              Saknar du ett konto? Klicka här för att
              {' '}
              <span className="whitespace-nowrap">
                <Link href={getSignUpPageUrl()}>
                  skapa ett
                </Link>
              </span>.
            </div>
          </form>
        )}
        {recoveryLinkSent && (
          <div className="text-sm text-gray-500">
            En länk har skickats till <strong>{email}</strong>.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      {isModal && (
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Välkommen tillbaka!
        </h2>
      )}
      <div className="space-y-6">
        <SSOButton provider="google" text="Logga in med Google" />
        <SSOButton provider="facebook" text="Logga in med Facebook" />
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Eller
          </span>
        </div>
      </div>
      <form
        className="space-y-6"
        onSubmit={signIn}
      >
        <label className="flex flex-col sm:flex-row">
          <div className="font-medium text-gray-700 w-32 sm:pt-2 pb-2 sm:pb-0">
            E-post
          </div>
          <div className="flex-1">
            <input
              className={inputClass}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="username"
              required
              autoComplete="username"
            />
          </div>
        </label>
        <label className="flex flex-col sm:flex-row">
          <div className="font-medium text-gray-700 w-32 sm:pt-2 pb-2 sm:pb-0">
            Lösenord
          </div>
          <div className="flex-1">
            <input
              className={inputClass}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              required
              autoComplete="current-password"
              id="current-password"
            />
            <div className="mt-4">
              <a
                className={`${linkClass} cursor-pointer text-sm`}
                onClick={() => {
                  setShowForgotPassword(true);
                  setError('');
                }}
              >
                Glömt lösenordet?
              </a>
            </div>
          </div>
        </label>
        <Button
          type="primary"
          size="lg"
          className="w-full sm:w-auto"
          submit
          disabled={loading}
        >
          Logga in med e-post
        </Button>
        {error && (
          <Alert
            type="error"
            title={error}
            onClose={() => setError('')}
          />
        )}
        <div className="text-sm text-gray-500">
          Saknar du ett konto? Klicka här för att
          {' '}
          <span className="whitespace-nowrap">
            <Link href={getSignUpPageUrl()}>
              skapa ett
            </Link>
          </span>.
        </div>
      </form>
    </div>
  );
}
