import React from 'react';

import { Button } from '../../common/Button';
import { Content } from '../../common/Content';
import { fieldClass, inputClass, rowClass, valueClass } from '../../common/classes';
import { CreateForm, EditForm, FormType, Field, Ticket, BASE_FIELDS } from '../../../formTypes';

export const createDefaultTicket = (): Ticket => ({
  description: '',
  price: 0,
  vatRate: 0,
  seats: 0,
});

export const createCustomField = (): Field => ({
  name: '',
  type: 'text',
  required: false,
  options: [],
});

interface Props<T> {
  form: T;
  setForm: (page: T) => void;
}

export const FormEditor = <T extends CreateForm | EditForm>(props: Props<T>): JSX.Element => {
  const { form, setForm } = props;

  const { title, tickets, customFields } = form;

  const fields = [...BASE_FIELDS, ...customFields];

  return (
    <Content className="pt-0 pb-0 divide-y divide-gray-200">
      <label className={rowClass}>
        <div className={fieldClass}>
          Rubrik <span className="text-red-500">*</span>
        </div>
        <div className={valueClass}>
          <input
            className={inputClass}
            type="text"
            value={title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            data-test="inputTitle"
            autoFocus={!Boolean(title)}
          />
        </div>
      </label>
      <div>
        <div className={rowClass}>
          <div className={valueClass}>
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Anmälningsalternativ
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-gray-500">
              En deltagare kan välja flera alternativ samtidigt, samt ange antal.
            </p>
          </div>
        </div>
        {tickets.map((ticket, i) => (
          <div className={`${rowClass} pt-0 gap-x-6 gap-y-2`} key={i}>
            <div className="col-span-6 lg:col-span-2 font-medium text-gray-700 pb-1">
              {i + 1}.
            </div>
            {tickets.length > 1 && (
              <div className="col-span-6 lg:col-span-2 lg:order-1 text-right lg:text-left">
                <Button
                  type="danger"
                  size="sm"
                  onClick={() => setForm({ ...form, tickets: tickets.filter((_, j) => j !== i) })}
                >
                  Ta bort
                </Button>
              </div>
            )}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              <label>
                <div className="text-sm font-medium text-gray-700 pb-2">
                  Beskrivning <span className="text-red-500">*</span>
                </div>
                <div>
                  <input
                    type="text"
                    className={inputClass}
                    value={ticket.description}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[i].description = e.target.value;

                      setForm({ ...form, tickets: newTickets });
                    }}
                    data-test="inputTicketDescription"
                  />
                </div>
              </label>
              <div className="grid grid-cols-12 gap-x-6">
                <label className="col-span-4">
                  <div className="text-sm font-medium text-gray-700 pb-2">
                    Pris (kr)
                  </div>
                  <input
                    type="number"
                    className={inputClass}
                    value={ticket.price || ''}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[i].price = e.target.valueAsNumber;

                      setForm({ ...form, tickets: newTickets });
                    }}
                    placeholder="gratis"
                    data-test="inputTicketPrice"
                  />
                </label>
                <label className="col-span-4">
                  <div className="text-sm font-medium text-gray-700 pb-2">
                    Moms (inklusive)
                  </div>
                  <select
                    className={inputClass}
                    value={ticket.vatRate}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[i].vatRate = Number(e.target.value);

                      setForm({ ...form, tickets: newTickets });
                    }}
                    data-test="inputTicketVat"
                  >
                    <option value="0">
                      ingen
                    </option>
                    <option value="0.25">
                      25%
                    </option>
                    <option value="0.12">
                      12%
                    </option>
                    <option value="0.06">
                      6%
                    </option>
                  </select>
                </label>
                <label className="col-span-4">
                  <div className="text-sm font-medium text-gray-700 pb-2">
                    Antal platser
                  </div>
                  <input
                    type="number"
                    className={inputClass}
                    value={ticket.seats || ''}
                    onChange={(e) => {
                      const newTickets = [...tickets];
                      newTickets[i].seats = e.target.valueAsNumber;

                      setForm({ ...form, tickets: newTickets });
                    }}
                    placeholder="obegränsat"
                    data-test="inputTicketSeats"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
        <div className={`${rowClass} pt-0 gap-x-6`}>
          <div className="col-span-12 lg:col-start-3 lg:col-span-10">
            <Button
              type="secondary"
              size="md"
              onClick={() => {
                const defaultTicket = createDefaultTicket();
                defaultTicket.vatRate = tickets[tickets.length - 1].vatRate;

                setForm({ ...form, tickets: [...tickets, defaultTicket] })
              }}
              data-test="buttonAddTickets"
            >
              Lägg till fler alternativ
            </Button>
          </div>
        </div>
      </div>
      <div>
        <div className={rowClass}>
          <div className={valueClass}>
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Anmälningsformulär
            </h2>
            <p className="mt-1 max-w-2xl text-xs text-gray-500">
              Namn och e-post är alltid obligatorisk. Lägg till ytterligare fält eller frågor.
            </p>
          </div>
        </div>
        {fields.map((field, orderFieldsIndex) => {
          const customFieldsIndex = orderFieldsIndex - BASE_FIELDS.length;

          return (
            <div className={`${rowClass} pt-0 gap-x-6 gap-y-2`} key={orderFieldsIndex}>
              <div className="col-span-6 lg:col-span-2 font-medium text-gray-700 lg:pt-2">
                {orderFieldsIndex + 1}.
              </div>
              <div className="col-span-6 lg:col-span-2 lg:order-1 text-right lg:text-left">
                {customFieldsIndex >= 0 && (
                  <Button
                    type="danger"
                    size="sm"
                    onClick={() => setForm({ ...form, customFields: customFields.filter((_, j) => j !== customFieldsIndex) })}
                  >
                    Ta bort
                  </Button>
                )}
              </div>
              <div className="col-span-12 lg:col-span-6 space-y-6">
                <div className="grid grid-cols-12 gap-x-6">
                  <label className="col-span-8">
                    <div className="text-sm font-medium text-gray-700 pb-2">
                      Fältnamn <span className="text-red-500">*</span>
                    </div>
                    <input
                      type="text"
                      className={inputClass}
                      value={field.name}
                      onChange={(e) => {
                        const newRegistrationFields = [...customFields];
                        newRegistrationFields[customFieldsIndex].name = e.target.value;

                        setForm({ ...form, customFields: newRegistrationFields });
                      }}
                      data-test="inputOrderCustomFieldName"
                      disabled={customFieldsIndex < 0}
                    />
                  </label>
                  <label className="col-span-4">
                    <div className="text-sm font-medium text-gray-700 pb-2">
                      Typ <span className="text-red-500">*</span>
                    </div>
                    <select
                      className={inputClass}
                      value={field.type}
                      onChange={(e) => {
                        const newRegistrationFields = [...customFields];
                        const type = e.target.value as FormType

                        newRegistrationFields[customFieldsIndex].type = type;

                        if (!['radio', 'checkbox'].includes(type)) {
                          newRegistrationFields[customFieldsIndex].options = [];
                        } else {
                          if (newRegistrationFields[customFieldsIndex].options.length === 0) {
                            newRegistrationFields[customFieldsIndex].options = [''];
                          }
                        }

                        setForm({ ...form, customFields: newRegistrationFields });
                      }}
                      data-test="inputTicketVat"
                      disabled={customFieldsIndex < 0}
                    >
                      <option value="text">
                        kort svar
                      </option>
                      <option value="textarea">
                        långt svar
                      </option>
                      <option value="radio">
                        flervalsfråga
                      </option>
                      <option value="checkbox">
                        kryssruta
                      </option>
                    </select>
                  </label>
                </div>
                {['radio', 'checkbox'].includes(field.type) && (
                  <div className="grid grid-cols-12 space-y-4">
                    {field.options.map((option, optionIndex) => (
                      <div className="col-span-12 grid grid-cols-12 gap-x-6" key={optionIndex}>
                        <div className="col-span-8">
                          <label className="col-span-4">
                            <div className="text-xs font-medium text-gray-700 pb-2">
                              Alternativ {optionIndex + 1} <span className="text-red-500">*</span>
                            </div>
                            <input
                              type="text"
                              className={inputClass}
                              value={option}
                              onChange={(e) => {
                                const newRegistrationFields = [...customFields];
                                newRegistrationFields[customFieldsIndex].options[optionIndex] = e.target.value;

                                setForm({ ...form, customFields: newRegistrationFields });
                              }}
                              data-test="inputOrderCustomFieldName"
                            />
                          </label>
                        </div>
                        <div className="col-span-4 text-right lg:text-left">
                          {field.options.length > 1 && (
                            <Button
                              type="danger"
                              size="sm"
                              onClick={() => {
                                const newRegistrationFields = [...customFields];
                                newRegistrationFields[customFieldsIndex].options = customFields[customFieldsIndex].options.filter((_, j) => j !== optionIndex);

                                setForm({ ...form, customFields: newRegistrationFields });
                              }}
                            >
                              Ta bort
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="col-span-12">
                      <Button
                        type="secondary"
                        size="sm"
                        onClick={() => {
                          const newRegistrationFields = [...customFields];
                          newRegistrationFields[customFieldsIndex].options = [...customFields[customFieldsIndex].options, ''];

                          setForm({ ...form, customFields: newRegistrationFields });
                        }}
                      >
                        Lägg till fler alternativ
                      </Button>
                    </div>
                  </div>
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 cursor-pointer border-gray-300 focus:ring-0 focus:ring-offset-0"
                    checked={field.required}
                    onChange={(e) => {
                      const newRegistrationFields = [...customFields];
                      newRegistrationFields[customFieldsIndex].required = e.target.checked;

                      setForm({ ...form, customFields: newRegistrationFields });
                    }}
                    data-test="inputOrderCustomFieldRequired"
                    disabled={customFieldsIndex < 0}
                  />
                  <div className="text-sm font-medium text-gray-700 ml-2">
                    Obligatoriskt?
                  </div>
                </label>
              </div>
            </div>
          );
        })}
        <div className={`${rowClass} pt-0 gap-x-6`}>
          <div className="col-span-12 lg:col-start-3 lg:col-span-10">
            <Button
              type="secondary"
              size="md"
              onClick={() => setForm({ ...form, customFields: [...customFields, createCustomField()] })}
            >
              Lägg till fler fält
            </Button>
          </div>
        </div>
      </div>
    </Content>
  );
}
