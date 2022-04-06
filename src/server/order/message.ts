import mjml2html from 'mjml';

import { getLogoGrayUrl, getLogoUrl, NEXT_PUBLIC_HOST } from '../../shared/urls';
import { footerAbout, messagePlaceholder, textToHtml } from '../../shared/utils';

export const getMessageHtml = (message: string): string => {
  const { html } = mjml2html(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text>
          ${textToHtml(message || messagePlaceholder)}
        </mj-text>
        <mj-divider border-color="#eeeeee" border-width="1px"></mj-divider>
        <mj-image href="${NEXT_PUBLIC_HOST}" src="${getLogoGrayUrl()}" width="120px" align="left" />
        <mj-text color="#9ca3af">
          ${footerAbout}
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
  `, { minify: false });

  return html;
}
