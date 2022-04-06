import { setPriceToZeroIfEmpty, getTicketDescriptionsFromTo, verifyForm } from './verifyForm';
import { FormErrors } from '../shared/errors';

describe('Pages', () => {
  test('must have a title', () => {
    expect(verifyForm({} as any)).toEqual(FormErrors.TITLE_MISSING);

    expect(verifyForm({ title: '' } as any)).toEqual(FormErrors.TITLE_MISSING);
  });

  test('must have at least one ticket', () => {
    expect(verifyForm({ title: 'Random' } as any)).toEqual(FormErrors.TICKET_MISSING);

    expect(verifyForm({
      title: 'Random',
      tickets: [],
    } as any)).toEqual(FormErrors.TICKET_MISSING);
  });

  test('if multiple tickets, every ticket must have a description', () => {
    expect(verifyForm({
      title: 'Random',
      tickets: [
        { description: 'Business' },
        { description: '' },
      ],
    } as any)).toEqual(FormErrors.TICKET_MISSING_DESCRIPTION);
  });

  test('each description must be unique', () => {
    expect(verifyForm({
      title: 'Random',
      tickets: [
        { description: 'Business' },
        { description: 'Business' },
      ],
    } as any)).toEqual(FormErrors.TICKET_DUPLICATE_DESCRIPTION);
  });

  test('tickets must either be free, or cost at least 20 SEK', () => {
    expect(verifyForm({
      title: 'Random',
      tickets: [
        {
          description: '',
          price: {
            value: 19,
            vatRate: '0',
          },
        },
      ],
    } as any)).toEqual(FormErrors.TICKET_TOO_LOW_PRICE);

    expect(verifyForm({
      title: 'Random',
      tickets: [
        {
          description: 'Business',
          price: {
            value: 20,
            vatRate: '0.25',
          },
        },
        {
          description: 'Economy',
          price: {
            value: 0,
            vatRate: '0.25',
          },
        },
      ],
    } as any)).toEqual(null);
  });

  test('description is removed if only a single ticket type exists', () => {
    const page = {
      tickets: [
        {
          description: 'Accidental description',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
      ],
    } as any;

    setPriceToZeroIfEmpty(page);

    expect(page).toEqual({
      tickets: [
        {
          description: '',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
      ],
    });

    const pageMultipleTickets = {
      tickets: [
        {
          description: 'Business',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
        {
          description: 'Economy',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
      ],
    } as any;

    setPriceToZeroIfEmpty(pageMultipleTickets);

    expect(pageMultipleTickets).toEqual(pageMultipleTickets);
  });

  test('price value is set to 0, if a non-integer is passed in', () => {
    const page = {
      tickets: [
        {
          description: 'Business',
          price: {
            vatRate: '0',
          },
        },
        {
          description: 'Economy',
          price: {
            value: '',
            vatRate: '0',
          },
        },
      ],
    } as any;

    setPriceToZeroIfEmpty(page);

    expect(page).toEqual({
      tickets: [
        {
          description: 'Business',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
        {
          description: 'Economy',
          price: {
            value: 0,
            vatRate: '0',
          },
        },
      ],
    });
  });
});

test('detect changes to existing tickets', () => {
  expect(getTicketDescriptionsFromTo(
    [
      { description: 'Business' },
      { description: 'Economy' },
    ] as any,
    [
      { description: 'Business v2' },
      { description: 'Economy' },
    ] as any,
  )).toEqual([['Business', 'Business v2']]);

  expect(getTicketDescriptionsFromTo(
    [
      { description: 'Business v1' },
    ] as any,
    [
      { description: 'Business v1' },
      { description: 'Business v2' },
      { description: 'Business v3' },
    ] as any,
  )).toEqual([]);
});
