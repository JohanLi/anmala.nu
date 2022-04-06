import mjml2html from 'mjml';

import { sendEmail } from '../email';
import { getFormReceipt } from '../formRepository';
import { insertLog, Order, updateOrderReceipt } from '../orderRepository';
import { Form } from '../../shared/formTypes';
import { getLogoGrayUrl, getFormUrl, NEXT_PUBLIC_HOST } from '../../shared/urls';
import { footerAbout, formatDate, textToHtml } from '../../shared/utils';
import { getEmailFromFields, getNameFromFields } from '../../shared/components/form/utils';

export type OrderReceipt = Pick<Order, 'id' | 'total' | 'vat' | 'referenceNumber' | 'ticketsAmounts' | 'fieldsWithValues' | 'created' | 'receiptSent'>

export interface Receipt {
  order: OrderReceipt;
  form: Form;
  organizer: {
    organizationId?: string;
    email: string;
  };
}

// TODO terms of service URL
export const getReceiptHtml = (receipt: Receipt, customMessage?: string): string => {
  const { order, form, organizer } = receipt;

  const formUrl = getFormUrl(form.id, form.slug);

  // TODO: fix
  const description = 'Test';

  const { html } = mjml2html(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-text align="center" font-size="20px">
          Tack för din bokning!
        </mj-text>
        ${customMessage ? `
          <mj-text>
            ${textToHtml(customMessage)}
          </mj-text>
        ` : ''}
      </mj-column>
    </mj-section>
    <mj-section background-color="#f4f4f4" border="1px solid #eeeeee">
      <mj-column>
        <mj-text font-size="20px" font-weight="700">
          ${form.title}
        </mj-text>
        <mj-text>
          <a href="${formUrl}" target="_blank" rel="noreferrer" style="color: #5850e6;">
          	${formUrl}
        	</a>
        </mj-text>
        <mj-divider border-width="1px" border-style="dashed" border-color="lightgrey" />
        <mj-table>
          <tr>
            <td>Referensnummer</td>
            <td style="font-weight: 700">${order.referenceNumber}</td>
          </tr>
          <tr>
            <td>Namn</td>
            <td style="font-weight: 700">${getNameFromFields(order.fieldsWithValues)}</td>
          </tr>
          ${description ? `
            <tr>
              <td>Valt alternativ</td>
              <td style="font-weight: 700">${description}</td>
            </tr>
          ` : ''}
          ${order.total > 0 ? `
            <tr>
              <td>Orderdatum</td>
              <td style="font-weight: 700">${formatDate(order.created)}</td>
            </tr>
            <tr>
              <td>Totalt</td>
              <td style="font-weight: 700">${order.total} kr</td>
            </tr>
            <tr>
              <td>Varav moms</td>
              <td style="font-weight: 700">${order.vat} kr</td>
            </tr>
            <tr>
              <td>Arrangörens org.&#8203;nr</td>
              <td style="font-weight: 700">${organizer.organizationId ? organizer.organizationId : 'Ej angivet'}</td>
            </tr>
          ` : ''}
        </mj-table>
      </mj-column>
    </mj-section>
    <mj-section>
      <mj-column>
        <mj-text>
          Vid frågor, kontakta arrangören på <a href="mailto:${organizer.email}" style="color: #5850e6;">${organizer.email}</a>.
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

export const sendReceipt = async (receipt: Receipt): Promise<void> => {
  const { order, form, organizer } = receipt;

  if (order.receiptSent) {
    return;
  }

  const { customMessage } = await getFormReceipt(form.id) || {};

  const html = getReceiptHtml(receipt, customMessage);

  let receiptResponse;

  // TODO decide whether error should be returned if receipt cannot be sent
  try {
    receiptResponse = await sendEmail({
      to: getEmailFromFields(order.fieldsWithValues),
      subject: `Bokningsbekräftelse – ${form.title}`,
      bodyHtml: html,
      replyTo: organizer.email,
    });

    await updateOrderReceipt(order.id);
  } catch (e) {
    console.log(e);
  } finally {
    await insertLog('RECEIPT_RESPONSE', receiptResponse);
  }
};
