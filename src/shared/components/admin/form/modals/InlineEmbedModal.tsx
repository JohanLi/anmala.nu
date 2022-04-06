import React, { useEffect, useState } from 'react';

import { Modal } from '../../../common/Modal';
import { EditForm } from '../../../../formTypes';
import { inputClass } from '../../../common/classes';
import { Button } from '../../../common/Button';
import { getFormUrl, getExampleUrl } from '../../../../urls';
import { Link } from '../../../common/Link';
import { getInlineWidgetHTML, getPopupWidgetHTML } from '../../../../utils';

const useCopyToClipboard = (textToCopy: string) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setCopied(false), 1000);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const onClick = async () => {
    // https://caniuse.com/mdn-api_clipboard_writetext
    if (!navigator.clipboard?.writeText) {
      return;
    }

    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
  };

  return { copied, onClick };
}

interface Props {
  form: EditForm;
  onClose: () => void;
}

export const InlineEmbedModal = (props: Props): JSX.Element => {
  const { form, onClose } = props;

  const formUrl = getFormUrl(form.id, form.slug);

  const inlineWidgetHTML = getInlineWidgetHTML(formUrl);
  const popupWidgetHTML = getPopupWidgetHTML(formUrl);

  const { copied: copiedInline, onClick: onClickInline } = useCopyToClipboard(inlineWidgetHTML);
  const { copied: copiedPopup, onClick: onClickPopup } = useCopyToClipboard(popupWidgetHTML);
  const { copied: copiedUrl, onClick: onClickUrl } = useCopyToClipboard(formUrl);

  return (
    <Modal
      onClose={onClose}
      closeOnClickOutside={false}
    >
      <div className="sm:flex sm:items-start">
        <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            Dela formuläret
          </h2>
          <div className="mt-4 text-sm text-gray-500">
            På <Link href={getExampleUrl()} newWindow>exempel-sidan</Link> kan du se skillnaden på de olika sätten att inkludera formuläret på din hemsida.
          </div>
          <h2 className="mt-6 text-lg font-bold text-gray-900">
            1. Direkt på din sida
          </h2>
          <textarea
            rows={2}
            className={`${inputClass} mt-2`}
            value={inlineWidgetHTML}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={onClickInline}
              disabled={copiedInline}
            >
              {copiedInline ? 'Kopierat!' : 'Kopiera'}
            </Button>
          </div>
          <h2 className="mt-6 text-lg font-bold text-gray-900">
            2. Knapp som öppnar ett extrafönster/popup-fönster
          </h2>
          <textarea
            rows={2}
            className={`${inputClass} mt-2`}
            value={popupWidgetHTML}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={onClickPopup}
              disabled={copiedPopup}
            >
              {copiedPopup ? 'Kopierat!' : 'Kopiera'}
            </Button>
          </div>
          <h2 className="mt-6 text-lg font-bold text-gray-900">
            3. Vanlig länk som leder till formuläret
          </h2>
          <textarea
            rows={1}
            className={`${inputClass} mt-2`}
            value={formUrl}
          />
          <div className="flex flex-row-reverse">
            <Button
              type="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={onClickUrl}
              disabled={copiedUrl}
            >
              {copiedUrl ? 'Kopierat!' : 'Kopiera'}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
        <Button
          type="secondary"
          size="md"
          className="w-full sm:w-auto"
          onClick={onClose}
        >
          Stäng
        </Button>
      </div>
    </Modal>
  );
}
