import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const DISABLE_EMAIL = process.env.DISABLE_EMAIL;

const accessKeyId = process.env.AWS_SES_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SES_ACCESS_KEY_SECRET;

if (!(accessKeyId && secretAccessKey)) {
  console.log('AWS_SES_ACCESS_KEY and AWS_SES_ACCESS_KEY_SECRET both need to be set!');
  process.exit(1);
}

const client = new SESClient({
  region: 'eu-west-1',
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

// https://github.com/aws/aws-sdk-js/issues/1585
const nameToBase64 = Buffer.from('Anmäla.nu').toString('base64');

interface SendEmail {
  to: string;
  subject: string;
  bodyHtml: string;
  from?: string;
  replyTo?: string;
}

// sign ups and receipts use the same, while organizer-sent emails use a different one in case of spam
export const sendEmail = ({ to, subject, bodyHtml, from = 'info@anmala.nu', replyTo = 'support@anmala.nu' }: SendEmail) => {
  if (DISABLE_EMAIL === 'true') {
    console.log(`Skipping email intended for ${to} with the subject ${subject}`);
    return;
  }

  const Source = `=?UTF-8?B?${nameToBase64}?= <${from}>`;

  return client.send(new SendEmailCommand({
    Source,
    Destination: {
      ToAddresses: [to],
    },
    ReplyToAddresses: [replyTo],
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject,
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: bodyHtml,
        },
      },
    },
  }));
}
