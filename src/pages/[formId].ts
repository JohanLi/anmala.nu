import { GetServerSideProps } from 'next';

import { ViewForm, ViewFormProps } from '../shared/components/form/ViewForm';
import { idFromUrl } from '../shared/utils';
import { getForm } from '../server/formRepository';
import { getUser } from '../server/userRepository';
import { getTicketSeatsTaken } from '../server/orderRepository';
import { TicketDescriptionSeatsLeft } from '../shared/formTypes';

const SHOW_SEATS_LEFT_BELOW_INCLUDING = 5;

export const getServerSideProps: GetServerSideProps<ViewFormProps> = async (context) => {
  const id = idFromUrl(context.query.formId as string);

  if (!id) {
    return { notFound: true };
  }

  const form = await getForm(id);

  if (!form) {
    return { notFound: true };
  }

  const ticketDescriptionSeatsLeft: TicketDescriptionSeatsLeft = {};

  for (const { description, seats } of form.tickets) {
    if (seats !== 0) {
      const seatsLeft = Math.max(seats - await getTicketSeatsTaken({ description }, form), 0);

      if (seatsLeft <= SHOW_SEATS_LEFT_BELOW_INCLUDING) {
        ticketDescriptionSeatsLeft[description] = seatsLeft;
      }
    }
  }

  const { stripeAccountId } = await getUser(form.userId);

  return {
    props: {
      form,
      ticketDescriptionSeatsLeft,
      stripeAccountId,
    },
  };
}

export default ViewForm;
