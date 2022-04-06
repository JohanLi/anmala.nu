import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { api } from '../../../client/api';
import { User } from '../../userTypes';
import { apiAdmin } from '../../../client/apiAdmin';

type State = {
  user: User | undefined;
  signOut: () => Promise<void>;
};

export const UserContext = createContext<State | undefined>(undefined);

type Props = {
  user: User | undefined;
  children: ReactNode;
};

export const UserProvider = (props: Props): JSX.Element => {
  const { user: userFromServer, children } = props;

  const [user, setUser] = useState<User | undefined>(userFromServer);

  useEffect(() => {
    if (user) {
      return;
    }

    api
      .getUserFromSession()
      .then((user) => setUser(user))
      .catch(() => setUser(undefined));
  }, []);

  const signOut = async () => {
    try {
      await api.signOut();

      // TODO consider storing the create page backup on the server instead
      localStorage.clear();
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = (): State => {
  const context = React.useContext(UserContext);

  if (context === undefined) {
    throw Error('');
  }

  return context;
}
