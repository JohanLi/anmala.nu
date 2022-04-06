import React from 'react';

import { Button } from '../common/Button';
import { api } from '../../../client/api';
import { getDashboardUrl } from '../../urls';
import { SSOProvider } from '../../../pages/api/auth/utils';

interface Props {
  provider: SSOProvider,
  text: string;
}

// TODO this component works under the assumption that there are only two providers
export const SSOButton = (props: Props) => {
  const { provider, text } = props;

  const authRequestUrl = provider === 'google' ? api.authRequestUrlGoogle : api.authRequestUrlFacebook;
  const className = provider === 'google' ? 'bg-gray-100 hover:bg-gray-200' : 'bg-blue-100 hover:bg-blue-200';

  const signIn = async () => {
    window.location.href = await authRequestUrl(getDashboardUrl())
  }

  return (
    <Button
      size="lg"
      type="custom"
      className={`${className} flex w-full sm:w-auto relative`}
      onClick={() => signIn()}
    >
      <img
        src={`/${provider}.svg`}
        alt={provider}
        className="h-6 sm:h-8 absolute top-3 left-3 sm:top-2 sm:left-2"
      />
      <div className="mx-auto pl-6 sm:pl-8">
        {text}
      </div>
    </Button>
  );
}
