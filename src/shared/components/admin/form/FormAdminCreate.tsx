import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';

import { Button } from '../../common/Button';
import { createDefaultTicket, FormEditor } from './FormEditor';
import { getFormAdminUrl } from '../../../urls';
import { Layout } from '../../common/Layout';
import { CreateForm as CreateFormInterface } from '../../../formTypes';
import { apiAdmin } from '../../../../client/apiAdmin';
import { Alert } from '../../common/Alert';
import { FormErrors } from '../../../errors';

export const createDefaultForm = (): CreateFormInterface => ({
  title: '',
  tickets: [createDefaultTicket()],
  customFields: [],
});

export const FormAdminCreate = (): JSX.Element => {
  const [form, setForm] = useState<CreateFormInterface>(createDefaultForm());

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const create = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const { id, slug } = await apiAdmin.createForm(form);

      await router.replace(getFormAdminUrl(id, slug));
    } catch(e: any) {
      if (e.response.data.code === FormErrors.TITLE_MISSING) {
        setError('Ditt formulär saknar rubrik.');
      }

      if (e.response.data.code === FormErrors.TICKET_MISSING) {
        setError('Ditt formulär måste ha minst ett anmälningsalternativ.');
      }

      if (e.response.data.code === FormErrors.TICKET_MISSING_DESCRIPTION) {
        setError('Varje anmälningsalternativ måste ha en beskrivning.');
      }

      if (e.response.data.code === FormErrors.TICKET_DUPLICATE_DESCRIPTION) {
        setError('Vid flera anmälningsalternativ, kan två alternativ inte ha samma beskrivning.');
      }

      if (e.response.data.code === FormErrors.TICKET_TOO_LOW_PRICE) {
        setError('Varje anmälningsalternativ måste kosta minst 20 kr, förutsatt att alternativet inte är gratis.');
      }
    } finally {
      setLoading(false);
    }
  };

  const canCreate = Boolean(form.title && form.tickets[0].description);

  return (
    <Layout heading="Skapa nytt">
      <form onSubmit={create}>
        <FormEditor
          form={form}
          setForm={setForm}
        />
        <div className="pt-6 px-4 sm:px-0 space-y-4">
          <div className="text-right">
            <Button
              type="primary"
              size="lg"
              submit
              disabled={!canCreate || loading}
            >
              Skapa
            </Button>
          </div>
          {!canCreate && (
            <div className="text-sm text-gray-500 text-right">
              Formuläret behöver ha en rubrik och minst ett anmälningsalternativ innan den kan skapas.
            </div>
          )}
          <div className="ml-auto w-full sm:max-w-md">
            {error && (
              <Alert
                type="error"
                title={error}
                onClose={() => setError('')}
              />
            )}
          </div>
        </div>
      </form>
    </Layout>
  );
};
