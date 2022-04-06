import { NextApiRequest, NextApiResponse } from 'next';

import { getUserByEmail, insertPasswordReset } from '../../../server/userRepository';
import { Errors } from '../../../shared/errors';
import { Username } from '../../../shared/userTypes';
import { nanoid } from 'nanoid';
import mjml2html from 'mjml';
import {
  getLogoUrl,
  getNewPasswordPageUrl,
  NEXT_PUBLIC_HOST,
} from '../../../shared/urls';
import { sendEmail } from '../../../server/email';
import { insertLog } from '../../../server/orderRepository';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const { email } = req.body as Username;

    if (!email) {
      res.status(400).json({ code: Errors.REQUIRED_FIELDS_MISSING });
      return;
    }

    const user = await getUserByEmail(email);

    if (!user) {
      res.status(400).json({ code: Errors.INVALID_EMAIL });
      return;
    }

    const resetToken = nanoid();

    const { html } = mjml2html(`
<mjml>
  <mj-body>
    <mj-section>
      <mj-column>
        <mj-image href="${NEXT_PUBLIC_HOST}" src="${getLogoUrl()}" width="120px" align="left" />
        <mj-divider border-color="#eeeeee" border-width="1px"></mj-divider>
        <mj-text>
          Här kommer din länk:
        </mj-text>
        <mj-text>
          <a href="${getNewPasswordPageUrl(resetToken)}" style="color: #5850e6;">
            ${getNewPasswordPageUrl(resetToken)}
          </a>
        </mj-text>
        <mj-text>
          Länken är giltig i 60 minuter. När du klickar på den, kommer du till en sida för att skapa ett nytt lösenord. 
        </mj-text>
        <mj-text>
          Hoppas det löser sig!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `, { minify: false });

    let passwordResetResponse;

    // TODO decide whether error should be returned if password reset cannot be sent
    try {
      await insertPasswordReset(resetToken, user.id);

      passwordResetResponse = await sendEmail({
        to: email,
        subject: `Länk för att skapa ett nytt lösenord`,
        bodyHtml: html,
      });
    } catch (e) {
      console.log(e);
    } finally {
      await insertLog('PASSWORD_RESET_RESPONSE', passwordResetResponse);
    }

    res.status(200).end();
    return;
  }

  res.status(404).end();
};
