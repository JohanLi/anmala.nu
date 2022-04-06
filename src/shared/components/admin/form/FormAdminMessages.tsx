import React, { useState } from 'react';
import IframeResizer from 'iframe-resizer-react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router';

import { EditForm } from '../../../formTypes';
import { apiAdmin } from '../../../../client/apiAdmin';
import { Content } from '../../common/Content';
import { fieldClass, inputClass, rowClass, valueClass } from '../../common/classes';
import { Button } from '../../common/Button';
import { Alert } from '../../common/Alert';
import { formatTime, messagePlaceholder, textToHtml } from '../../../utils';
import { MessageHistory } from '../../../../server/messageRepository';
import { useUserContext } from '../../user/UserContext';

const RECEIPT_PREVIEW_DEBOUNCE = 1000;

interface Props {
  form: EditForm;
  message: { html: string, history: MessageHistory };
}

export const FormAdminMessages = (props: Props): JSX.Element => {
  const { form, message: { html, history } } = props;

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const sendMessage = async () => {
    setLoading(true);
    setError('');

    try {
      await apiAdmin.sendMessage({ formId: form.id, subject, body });

      router.reload();
    } catch (e) {
      setError('Något gick fel vid utskicket.');
    }
  };

  const [debouncedMessage] = useDebounce(body, RECEIPT_PREVIEW_DEBOUNCE);

  const previewReceiptHtml = debouncedMessage ?
    html.replace(messagePlaceholder, textToHtml(debouncedMessage)) :
    html;

  const srcDoc = `
    ${previewReceiptHtml}
    <script src="/js/iframeResizer.contentWindow-v4.3.2.min.js"></script>
  `;

  const canSend = subject && body;

  const { user } = useUserContext();

  return (
    <>
      <Content className="pt-0 pb-0 divide-y divide-gray-200">
        <div className="max-w-2xl text-sm text-gray-500 py-6">
          <p>
            Meddelandet kommer skickas till alla anmälda deltagare (de som är avbokade kommer inte få det).
          </p>
          <p className="mt-4">
            Avsändaren är <strong>meddelanden@anmala.nu</strong>, medan svarsadressen är <strong>{user?.email}</strong>.
          </p>
          <p className="mt-4">
            Denna funktion är endast till för att informera deltagarna och <strong>får ej användas för marknadsföring</strong>.
          </p>
        </div>
        <div>
          <label className={rowClass}>
            <div className={fieldClass}>
              Rubrik
            </div>
            <div className={valueClass}>
              <input
                className={inputClass}
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
          </label>
          <label className={`${rowClass} pt-0`}>
            <div className={fieldClass}>
              Meddelande
            </div>
            <div className={valueClass}>
            <textarea
              rows={8}
              className={inputClass}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
              <div className="text-sm text-gray-500 mt-2">
                Endast text och radbrytningar stöds. Länkar kommer automatiskt göras klickbara av
                mottagarens e-postprogram.
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
            onClick={() => sendMessage()}
            disabled={!canSend || loading}
          >
            Skicka
          </Button>
        </div>
        {canSend && (
          <div className="text-sm text-gray-500 text-right">
            Det kan ta någon minut för alla meddelanden att skickas ut om du har många deltagare.
          </div>
        )}
        {!canSend && (
          <div className="text-sm text-gray-500 text-right">
            Du kan inte skicka förrän Rubrik och Meddelande fyllts i.
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
      <h2 className="text-lg font-medium text-gray-900 mb-4 px-4 sm:px-0">
        Historik
      </h2>
      {history.length === 0 && (
        <Content className="text-sm text-gray-500">
          När utskicket är klart, kommer ditt meddelande att listas här.
        </Content>
      )}
      {history.length > 0 && (
        <Content padding={false}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rubrik
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meddelande
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((message) => (
                  <tr key={message.created}>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatTime(message.created)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {message.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: textToHtml(message.body) }} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Content>
      )}
    </>
  );
};
