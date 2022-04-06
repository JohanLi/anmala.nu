import { GetServerSideProps } from 'next';

import { FormAdmin, FormAdminProps } from '../../../shared/components/admin/form/FormAdmin';
import { idFromUrl } from '../../../shared/utils';
import { getForm } from '../../../server/formRepository';
import { getUser } from '../../../server/utils';
import { getSignInPageUrl } from '../../../shared/urls';
import { QueryAlerts } from '../../../shared/queryAlert';
import { getActiveParticipantsCount } from '../../../server/participantRepository';
import { getMessageHtml } from '../../../server/order/message';
import { getMessageHistory } from '../../../server/messageRepository';

export default FormAdmin;

export const getServerSideProps: GetServerSideProps<FormAdminProps> = async (context) => {
  const user = await getUser(context.req);

  if (!user) {
    return {
      redirect: {
        destination: `${getSignInPageUrl()}?alert=${QueryAlerts.REQUIRES_LOGIN}`,
        permanent: false,
      },
    };
  }

  const id = idFromUrl(context.query.formId as string);

  if (!id) {
    return { notFound: true };
  }

  const form = await getForm(id);

  if (!form || form.userId !== user.id) {
    return { notFound: true };
  }

  const activeParticipantsCount = await getActiveParticipantsCount(form.id);
  const messageHistory = await getMessageHistory(form.id);

  return {
    props: {
      form,
      tab: 'messages',
      activeParticipantsCount,
      message: {
        html: getMessageHtml(''),
        history: messageHistory,
      },
      user,
    },
  };
};
