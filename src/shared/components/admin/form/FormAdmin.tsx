import React, { useState } from 'react';

import { EditForm, PublicForm, Receipt } from '../../../formTypes';
import { Layout } from '../../common/Layout';
import { getMessagesAdminUrl, getFormAdminUrl, getParticipantsAdminUrl, getReceiptAdminUrl } from '../../../urls';
import { FormAdminEdit } from './FormAdminEdit';
import { Participant } from '../../../participantTypes';
import { FormAdminParticipants } from './FormAdminParticipants';
import { Badge } from '../../common/Badge';
import { Link } from '../../common/Link';
import { FormAdminHeadingRight } from './FormAdminHeadingRight';
import { FormAdminReceipt } from './FormAdminReceipt';
import { User } from '../../../userTypes';
import { FormAdminMessages } from './FormAdminMessages';
import { MessageHistory } from '../../../../server/messageRepository';

const linkClass = 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm';
const currentLinkClass = 'border-indigo-500 text-indigo-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm';

type AdminTabs = 'edit' | 'participants' | 'receipt' | 'messages';

export interface FormAdminProps {
  form: PublicForm;
  tab: AdminTabs;
  activeParticipantsCount: number;
  allParticipants?: Participant[];
  receipt?: Receipt;
  message?: { html: string, history: MessageHistory };
  user: User; // used for the sole purpose of populating UserContext server-side
}

export const FormAdmin = (props: FormAdminProps): JSX.Element => {
  const { form: originalForm, tab, activeParticipantsCount, allParticipants, receipt, message } = props;

  const [form, setForm] = useState<EditForm>(originalForm);

  return (
    <Layout
      heading={form.title}
      headingRight={<FormAdminHeadingRight form={form} />}
    >
      <div className="my-6 sm:-mx-6">
        <div className="px-4 sm:px-6 border-b border-gray-200">
          <nav className="-my-px flex space-x-6 overflow-x-auto">
            <Link
              href={getFormAdminUrl(form.id, originalForm.slug)}
              className={tab === 'edit' ? currentLinkClass : linkClass}
            >
              Redigera
            </Link>
            <Link
              href={getParticipantsAdminUrl(form.id, originalForm.slug)}
              className={tab === 'participants' ? currentLinkClass : linkClass}
            >
              <div className="flex items-center">
                <div>
                  Deltagare
                </div>
                <Badge
                  color={tab === 'participants' ? 'indigo' : 'gray'}
                  size="sm"
                  text={activeParticipantsCount.toString()}
                  className="ml-2 rounded-full"
                />
              </div>
            </Link>
            <Link
              href={getReceiptAdminUrl(form.id, originalForm.slug)}
              className={tab === 'receipt' ? currentLinkClass : linkClass}
            >
              Bokningsbekräftelse
            </Link>
            <Link
              href={getMessagesAdminUrl(form.id, originalForm.slug)}
              className={tab === 'messages' ? currentLinkClass : linkClass}
            >
              Skicka meddelanden
            </Link>
          </nav>
        </div>
      </div>
      {tab === 'edit' && (
        <FormAdminEdit
          form={form}
          setForm={setForm}
        />
      )}
      {tab === 'participants' && (
        <FormAdminParticipants
          form={form}
          participants={allParticipants!}
        />
      )}
      {tab === 'receipt' && (
        <FormAdminReceipt
          form={form}
          receipt={receipt!}
        />
      )}
      {tab === 'messages' && (
        <FormAdminMessages
          form={form}
          message={message!}
        />
      )}
    </Layout>
  );
};
