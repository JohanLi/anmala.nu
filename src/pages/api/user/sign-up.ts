import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import mjml2html from 'mjml';

import { Errors } from '../../../shared/errors';
import { passwordMeetsRequirements, validEmail } from '../../../server/utils';
import { getUserByEmail, insertUserPending } from '../../../server/userRepository';
import { sendEmail } from '../../../server/email';
import { insertLog } from '../../../server/orderRepository';
import { getLogoUrl, getSignUpVerificationPageUrl, NEXT_PUBLIC_HOST } from '../../../shared/urls';
import { Credentials } from '../../../shared/userTypes';

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const { email, password } = req.body as Credentials;

    if (!validEmail(email)) {
      res.status(400).json({ code: Errors.INVALID_EMAIL });
      return;
    }

    if (!passwordMeetsRequirements(password)) {
      res.status(400).json({ code: Errors.PASSWORD_REQUIREMENT });
      return;
    }

    const { id: userId } = await getUserByEmail(email) || {};

    if (userId) {
      res.status(409).end();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = nanoid();

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
          <a href="${getSignUpVerificationPageUrl(verificationToken)}" style="color: #5850e6;">
            ${getSignUpVerificationPageUrl(verificationToken)}
          </a>
        </mj-text>
        <mj-text>
          Länken är giltig i 60 minuter. När du klickar på den, skapas ditt konto. 
        </mj-text>
        <mj-text>
          Välkommen!
        </mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>
    `, { minify: false });

    let verificationResponse;

    // TODO decide whether error should be returned if receipt cannot be sent
    try {
      await insertUserPending({
        verificationToken,
        email,
        passwordHash: hashedPassword,
      });

      verificationResponse = await sendEmail({
        to: email,
        subject: `Länk för att verifiera din e-post`,
        bodyHtml: html,
      });
    } catch (e) {
      console.log(e);
    } finally {
      await insertLog('RECEIPT_RESPONSE', verificationResponse);
    }

    res.status(200).end();
    return;
  }

  res.status(404).end();
};
