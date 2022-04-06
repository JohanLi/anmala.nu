import React, { FormEvent, useState } from 'react';

import { Button } from '../common/Button';
import { api } from '../../../client/api';
import { getContactUrl } from '../../urls';
import { Alert } from '../common/Alert';
import { Errors } from '../../errors';
import { inputClass } from '../common/classes';
import { SSOButton } from './SSOButton';
import { Layout } from '../common/Layout';
import { Content } from '../common/Content';
import { useRedirectToDashboardIfLoggedIn } from '../../utils';
import { QueryAlerts, useQueryAlert } from '../../queryAlert';
import { Link } from '../common/Link';

// https://web.dev/sign-in-form-best-practices/
// TODO error handling and loading state for Google and Facebook
export const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

  const createAccount = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.signUp({ email, password });
      setVerificationEmailSent(true);
    } catch (e: any) {
      if (e.response.status === 409) {
        setError('Den angivna e-posten tillhör redan ett konto. Prova att logga in istället.');
      }

      if (e.response.data.code === Errors.INVALID_EMAIL) {
        setError('Kontrollera att du skrivit in en giltig e-post.');
      }

      if (e.response.data.code === Errors.PASSWORD_REQUIREMENT) {
        setError('Ditt lösenord måste ha minst 8 tecken.');
      }
    } finally {
      setLoading(false);
    }
  }

  useRedirectToDashboardIfLoggedIn();

  const alert = useQueryAlert(QueryAlerts.INVALID_VERIFICATION_TOKEN);

  return (
    <Layout heading="Skapa konto" alert={alert}>
      <Content>
        <div className="grid md:grid-cols-12 gap-6 md:gap-12">
          <div className="md:col-span-8 lg:col-span-6">
            <div className="max-w-lg space-y-6">
              <div className="space-y-6">
                <SSOButton provider="google" text="Skapa konto med Google" />
                <SSOButton provider="facebook" text="Skapa konto med Facebook" />
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
              {!verificationEmailSent && (
                <form
                  className="space-y-6"
                  onSubmit={createAccount}
                >
                  <label className="flex flex-col sm:flex-row">
                    <div className="font-medium text-gray-700 w-48 sm:pt-2 pb-2 sm:pb-0">
                      E-post
                    </div>
                    <input
                      className={inputClass}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      name="username"
                      required
                      autoComplete="username"
                    />
                  </label>
                  <label className="flex flex-col sm:flex-row">
                    <div className="font-medium text-gray-700 w-48 sm:pt-2 pb-2 sm:pb-0">
                      Välj lösenord
                    </div>
                    <input
                      className={inputClass}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      name="password"
                      required
                      autoComplete="new-password"
                      id="new-password"
                    />
                  </label>
                  <Button
                    type="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                    submit
                    disabled={loading}
                  >
                    Skapa konto med e-post
                  </Button>
                  {error && (
                    <Alert type="error" title={error} onClose={() => setError('')} />
                  )}
                </form>
              )}
              {verificationEmailSent && (
                <>
                  <Alert
                    type="success"
                    title={`En länk för att verifiera din e-post (${email}) har skickats till dig.`}
                    onClose={() => setVerificationEmailSent(false)}
                  />
                  <div className="text-sm text-gray-500">
                    Ditt konto skapas så fort du klickat på länken. Detta steg finns så att obehöriga inte
                    kan skapa ett konto med din e-post.
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
