export const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST;

export const getFormUrl = (id: string, slug: string): string =>
  `${NEXT_PUBLIC_HOST}/${slug}-${id}`;

export const getFormAdminUrl = (id: string, slug: string): string =>
  `${NEXT_PUBLIC_HOST}/mina-formular/${slug}-${id}`;
export const getParticipantsAdminUrl = (id: string, slug: string): string =>
  `${NEXT_PUBLIC_HOST}/mina-formular/${slug}-${id}/deltagare`;
export const getReceiptAdminUrl = (id: string, slug: string): string =>
  `${NEXT_PUBLIC_HOST}/mina-formular/${slug}-${id}/bokningsbekraftelse`;
export const getMessagesAdminUrl = (id: string, slug: string): string =>
  `${NEXT_PUBLIC_HOST}/mina-formular/${slug}-${id}/meddelanden`;

export const getSignInPageUrl = (): string => `${NEXT_PUBLIC_HOST}/logga-in`;
export const getNewPasswordPageUrl = (resetToken: string): string =>
  `${NEXT_PUBLIC_HOST}/nytt-losenord?token=${resetToken}`;
export const getSignUpPageUrl = (): string => `${NEXT_PUBLIC_HOST}/skapa-konto`;
export const getSignUpVerificationPageUrl = (verificationToken: string): string =>
  `${getSignUpPageUrl()}/verifiera?token=${verificationToken}`;

export const getDashboardUrl = (): string => `${NEXT_PUBLIC_HOST}/mina-formular`;
export const getCreatePageUrl = (): string => `${NEXT_PUBLIC_HOST}/mina-formular/skapa`;

export const getAccountUrl = (): string => `${NEXT_PUBLIC_HOST}/mitt-konto`;

export const getExampleUrl = (): string => `${NEXT_PUBLIC_HOST}/exempel`;
export const getExampleFormUrl = (): string => `${NEXT_PUBLIC_HOST}/test-D5wACFdu`;

export const getSwishCostComparisonUrl = (): string => `${NEXT_PUBLIC_HOST}/swish-prisjamforelse`;

export const getLogoUrl = (): string => `${NEXT_PUBLIC_HOST}/logo.png`;
export const getLogoGrayUrl = (): string => `${NEXT_PUBLIC_HOST}/logo-gray.png`;

export const whatUrlFragment = 'funktioner';
export const getWhatUrl = (): string => `${NEXT_PUBLIC_HOST}/#${whatUrlFragment}`;

export const priceUrlFragment = 'pris';
export const getPriceUrl = (): string => `${NEXT_PUBLIC_HOST}/#${priceUrlFragment}`;

export const contactUrlFragment = 'kontakt';
export const getContactUrl = (): string => `${NEXT_PUBLIC_HOST}/#${contactUrlFragment}`;
