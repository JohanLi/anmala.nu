import { Layout } from '../common/Layout';
import { Content } from '../common/Content';
import { fieldStaticTextClass, rowClass, valueClass } from '../common/classes';
import { User } from '../../userTypes';

interface Props {
  user: User;
}

export const AccountAdmin = (props: Props): JSX.Element => {
  const { user } = props;

  return (
    <Layout heading="Mitt konto">
      <Content className="pt-0 pb-0 divide-y divide-gray-200">
        <div className={rowClass}>
          <div className={fieldStaticTextClass}>
            E-post
          </div>
          <div className={`${valueClass} flex space-x-6`}>
                <span>
                  {user.email}
                </span>
            {user.googleId && <img src="/google.svg" alt="google" className="h-6" />}
            {user.facebookId && <img src="/facebook.svg" alt="facebook" className="h-6" />}
          </div>
        </div>
        <div className={rowClass}>
          <div className={fieldStaticTextClass}>
            Lösenord
          </div>
          <div className={valueClass}>
            ••••••••
          </div>
        </div>
      </Content>
    </Layout>
  );
};
