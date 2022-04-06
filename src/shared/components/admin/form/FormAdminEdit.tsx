import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { EditForm } from '../../../formTypes';
import { getFormAdminUrl } from '../../../urls';
import { FormEditor } from './FormEditor';
import { Button } from '../../common/Button';
import { apiAdmin } from '../../../../client/apiAdmin';
import { FormErrors } from '../../../errors';
import { Alert } from '../../common/Alert';

interface Props {
  form: EditForm;
  setForm: (page: EditForm) => void;
}

export const FormAdminEdit = (props: Props): JSX.Element => {
  const { form, setForm } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const edit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const { id, slug } = await apiAdmin.editForm(form);

      setHasChanged(false);

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

  const firstUpdate = useRef(true);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      setHasChanged(true);
    }
  }, [form]);

  return (
    <form onSubmit={edit}>
      <FormEditor<EditForm>
        form={form}
        setForm={setForm}
      />
      <div className="pt-6 px-4 sm:px-0 space-y-4">
        <div className="text-right">
          <Button
            type="primary"
            size="lg"
            submit
            disabled={!hasChanged || loading}
          >
            Spara ändringar
          </Button>
        </div>
        {!hasChanged && (
          <div className="text-sm text-gray-500 text-right">
            Inga ändringar har gjorts ännu.
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
  );
};
