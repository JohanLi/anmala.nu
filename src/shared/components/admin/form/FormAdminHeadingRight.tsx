import React, { useState } from 'react';

import { Option, Select } from '../../common/Select';
import { EditForm, PublicFormStatus } from '../../../formTypes';
import { getFormUrl } from '../../../urls';
import { Badge } from '../../common/Badge';
import { apiAdmin } from '../../../../client/apiAdmin';
import { FormAdminDropdown } from './FormAdminDropdown';
import { Button } from '../../common/Button';
import { InlineEmbedModal } from './modals/InlineEmbedModal';

const options: { [key in PublicFormStatus]: Option } = {
  open: {
    title: 'Öppen',
    description: 'Ditt formulär är öppen för anmälningar.',
    colors: {
      background: 'bg-green-500',
      hover: 'hover:bg-green-600',
      border: 'divide-green-600',
    },
  },
  closed: {
    title: 'Stängd',
    description: 'Ditt formulär syns, men tar ej emot nya anmälningar.',
    colors: {
      background: 'bg-red-500',
      hover: 'hover:bg-red-600',
      border: 'divide-red-600',
    },
  },
};

interface Props {
  form: EditForm;
}

export const FormAdminHeadingRight = (props: Props): JSX.Element => {
  const { form } = props;

  const formUrl = getFormUrl(form.id, form.slug);

  const [showInlineEmbedModal, setShowInlineEmbedModal] = useState(false);

  const [status, setStatus] = useState<PublicFormStatus>(form.status);
  const [loading, setLoading] = useState(false);

  // TODO make it more obvious that changes are applied immediately
  const setFormStatusWithApiRequest = async (status: PublicFormStatus) => {
    setLoading(true);

    // TODO error handling
    await apiAdmin.updateFormStatus({
      formId: form.id,
      status,
    });

    setStatus(status);
    setLoading(false);
  }

  return (
    <>
      {showInlineEmbedModal && (
        <InlineEmbedModal
          form={form}
          onClose={() => setShowInlineEmbedModal(false)}
        />
      )}
      <div className="flex items-end">
        <div className="flex flex-wrap items-center">
          <Button
            type="primary"
            size="md"
            onClick={() => setShowInlineEmbedModal(true)}
            className="mr-4 mt-4"
          >
            Dela
          </Button>
          <Button
            type="secondary"
            size="md"
            href={formUrl}
            className="mr-4 mt-4"
          >
            Besök
          </Button>
          <div className="mr-4 mt-4">
            <Select<PublicFormStatus>
              option={status}
              setOption={setFormStatusWithApiRequest}
              options={options}
              disabled={loading}
            />
          </div>
          <div className="flex items-center mt-4">
            <FormAdminDropdown page={form} />
          </div>
        </div>
      </div>
    </>
  );
}
