import React, { useState } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router';

import { EditForm, Receipt } from '../../../formTypes';
import { apiAdmin } from '../../../../client/apiAdmin';
import { Content } from '../../common/Content';
import { fieldClass, inputClass, rowClass, valueClass } from '../../common/classes';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';
import { receiptCustomMessagePlaceholder, textToHtml } from '../../../utils';
import { useUserContext } from '../../user/UserContext';

const RECEIPT_PREVIEW_DEBOUNCE = 1000;

interface Props {
  form: EditForm;
  receipt: Receipt;
}

export const FormAdminReceipt = (props: Props): JSX.Element => {
  const { form, receipt } = props;

  const [customMessage, setCustomMessage] = useState(receipt.customMessage);

  const hasChanged = customMessage !== receipt.customMessage;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const update = async () => {
    setLoading(true);
    setError('');

    try {
      await apiAdmin.upsertReceipt({ formId: form.id, customMessage });

      router.reload();
    } catch (e) {
      setError('Något gick fel vid sparandet av dina ändringar.');
    }
  };

  const [debouncedCustomMessage] = useDebounce(customMessage, RECEIPT_PREVIEW_DEBOUNCE);

  const previewReceiptHtml = debouncedCustomMessage ?
    receipt.html.replace(receiptCustomMessagePlaceholder, textToHtml(debouncedCustomMessage)) :
    receipt.html;

  const srcDoc = `
    ${previewReceiptHtml}
    <script src="/js/iframeResizer.contentWindow-v4.3.2.min.js"></script>
  `;

  const { user } = useUserContext();

  return (
    <>
      <Content className="pt-0 pb-0 divide-y divide-gray-200">
        <div className="max-w-2xl text-sm text-gray-500 py-6">
          <p>
            Här kan du ställa in ett eget, valfritt meddelande som inkluderas i bokningsbekräftelsen.
          </p>
          <p className="mt-4">
            Avsändaren är <strong>info@anmala.nu</strong>, medan svarsadressen är <strong>{user?.email}</strong>.
          </p>
          <p className="mt-4">
            <strong>Glöm inte att spara</strong> genom knappen längst ned om du väljer att ha ett.
          </p>
        </div>
        <div>
          <div className={rowClass}>
            <div className={fieldClass}>
              Rubrik
            </div>
            <div className={valueClass}>
              <div className="mt-2">
                Bokningsbekräftelse – {form.title}
              </div>
            </div>
          </div>
          <label className={`${rowClass} pt-0`}>
            <div className={fieldClass}>
              Eget meddelande
            </div>
            <div className={valueClass}>
            <textarea
              rows={8}
              className={inputClass}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Inget meddelande"
            />
              <div className="text-sm text-gray-500 mt-2">
                Endast text och radbrytningar stöds. Länkar kommer automatiskt göras klickbara av mottagarens
                e-postprogram.
              </div>
            </div>
          </label>
        </div>
        <div className={rowClass}>
          <div className={fieldClass}>
            Förhandsvisning
          </div>
          <div className="col-span-12 lg:col-span-8">
            <IframeResizer
              srcDoc={srcDoc}
              checkOrigin={false}
              className="w-full border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </Content>
      <div className="pt-6 px-4 sm:px-0 space-y-4">
        <div className="text-right">
          <Button
            type="primary"
            size="lg"
            onClick={() => update()}
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
    </>
  );
};
