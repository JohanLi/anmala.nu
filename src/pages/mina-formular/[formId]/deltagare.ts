import { GetServerSideProps } from 'next';

import { FormAdmin, FormAdminProps } from '../../../shared/components/admin/form/FormAdmin';
import { idFromUrl } from '../../../shared/utils';
import { getForm } from '../../../server/formRepository';
import { getUser } from '../../../server/utils';
import { getSignInPageUrl } from '../../../shared/urls';
import { getActiveParticipantsCount, getAllParticipants } from '../../../server/participantRepository';
import { QueryAlerts } from '../../../shared/queryAlert';

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

  const allParticipants = await getAllParticipants(form.id);

  return {
    props: {
      form,
      tab: 'participants',
      activeParticipantsCount,
      allParticipants,
      user,
    },
  };
};
