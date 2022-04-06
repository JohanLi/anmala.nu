import { GetServerSideProps } from 'next';

import { FormAdmin, FormAdminProps } from '../../../shared/components/admin/form/FormAdmin';
import { idFromUrl, randomName, receiptCustomMessagePlaceholder } from '../../../shared/utils';
import { getForm, getFormReceipt } from '../../../server/formRepository';
import { generateOrderReferenceNumber, getUser } from '../../../server/utils';
import { getSignInPageUrl } from '../../../shared/urls';
import { QueryAlerts } from '../../../shared/queryAlert';
import { getActiveParticipantsCount } from '../../../server/participantRepository';
import { getReceiptHtml, OrderReceipt, Receipt } from '../../../server/order/receipt';

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

  const { customMessage = '' } = await getFormReceipt(form.id) || {};

  const ticketThatCostsIfPossible = form.tickets.find((ticket) => ticket.price) || form.tickets[0];

  const order: OrderReceipt = {
    id: 1, // used to satisfy interface
    total: ticketThatCostsIfPossible.price,
    vat: ticketThatCostsIfPossible.price * Number(ticketThatCostsIfPossible.vatRate),
    referenceNumber: await generateOrderReferenceNumber(),
    ticketsAmounts: [{ description: ticketThatCostsIfPossible.description, amount: 1 }],
    fieldsWithValues: [
      {
        name: 'Namn',
        value: randomName(),
      },
    ],
    created: new Date().toString(),
    receiptSent: false, // used to satisfy interface
  };

  const sendReceipt: Receipt = {
    order,
    form,
    organizer: {
      organizationId: user.organizationId,
      email: user.email,
    },
  };

  return {
    props: {
      form,
      tab: 'receipt',
      activeParticipantsCount,
      receipt: {
        html: getReceiptHtml(sendReceipt, receiptCustomMessagePlaceholder),
        customMessage,
      },
      user,
    },
  };
};
