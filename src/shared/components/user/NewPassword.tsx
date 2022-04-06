import React, { FormEvent, useState } from 'react';

import { Layout } from '../common/Layout';
import { Content } from '../common/Content';
import { useRedirectToDashboardIfLoggedIn } from '../../utils';
import { inputClass } from '../common/classes';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { api } from '../../../client/api';
import { getDashboardUrl } from '../../urls';
import { Errors } from '../../errors';

export interface NewPasswordProps {
  resetToken: string;
  email: string;
}

export const NewPassword = (props: NewPasswordProps): JSX.Element => {
  const { resetToken, email } = props;

  useRedirectToDashboardIfLoggedIn();

  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithResetToken = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await api.signInWithResetToken({ resetToken, password });
      // TODO try to get this working with router.push()
      window.location.href = getDashboardUrl();
    } catch (e: any) {
      if (e.response.data.code === Errors.REQUIRED_FIELDS_MISSING) {
        setError('Lösenord behöver fyllas i.');
      }

      if (e.response.data.code === Errors.PASSWORD_REQUIREMENT) {
        setError('Ditt lösenord måste ha minst 8 tecken.');
      }

      if (e.response.data.code === Errors.INVALID_PASSWORD_RESET_TOKEN) {
        setError('Din länk för att skapa ett nytt lösenord verkar inte vara giltig längre.');
      }

      setLoading(false);
    }
  }

  return (
    <Layout heading="Nytt lösenord">
      <Content>
        <div className="max-w-lg space-y-6">
          <form
            className="space-y-6"
            onSubmit={signInWithResetToken}
          >
            <label className="flex flex-col sm:flex-row">
              <div className="font-medium text-gray-700 w-48 sm:pt-2 pb-2 sm:pb-0">
                E-post
              </div>
              <div className="flex-1 sm:mt-2">
                {email}
              </div>
            </label>
            <label className="flex flex-col sm:flex-row">
              <div className="font-medium text-gray-700 w-48 sm:pt-2 pb-2 sm:pb-0">
                Nytt lösenord
              </div>
              <div className="flex-1">
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
              </div>
            </label>
            <Button
              type="primary"
              size="lg"
              className="w-full sm:w-auto"
              submit
              disabled={loading}
            >
              Logga in
            </Button>
            {error && (
              <Alert
                type="error"
                title={error}
                onClose={() => setError('')}
              />
            )}
          </form>
        </div>
      </Content>
    </Layout>
  );
};
