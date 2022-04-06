import { Form, Ticket, TicketDescriptionsFromTo } from '../shared/formTypes';
import { FormErrors } from '../shared/errors';

export const verifyForm = (form: Form): number | null => {
  if (!form.title) {
    return FormErrors.TITLE_MISSING;
  }

  if (!Array.isArray(form.tickets) || form.tickets.length === 0) {
    return FormErrors.TICKET_MISSING;
  }

  if (form.tickets.some((ticket) => !ticket.description)) {
    return FormErrors.TICKET_MISSING_DESCRIPTION;
  }

  if (form.tickets.length > 1) {
    const descriptions = form.tickets.map((ticket) => ticket.description);
    const duplicateDescriptions = new Set(descriptions).size !== descriptions.length;

    if (duplicateDescriptions) {
      return FormErrors.TICKET_DUPLICATE_DESCRIPTION;
    }
  }

  if (form.tickets.some((ticket) => ticket.price > 0 && ticket.price < 20)) {
    return FormErrors.TICKET_TOO_LOW_PRICE;
  }

  return null;
}

export const setPriceToZeroIfEmpty = (form: Form): void => {
  form.tickets.forEach((ticket) => {
    if (!ticket.price) {
      ticket.price = 0;
    }
  });
}

export const getTicketDescriptionsFromTo = (currentTickets: Ticket[], newTickets: Ticket[]): TicketDescriptionsFromTo => {
  if (JSON.stringify(currentTickets) === JSON.stringify(newTickets)) {
    return [];
  }

  const fromTo: TicketDescriptionsFromTo = [];

  newTickets.forEach((ticket, i) => {
    if (!currentTickets[i]) {
      return;
    }

    if (currentTickets[i].description !== ticket.description) {
      fromTo.push([currentTickets[i].description, ticket.description]);
    }
  });

  return fromTo;
}
