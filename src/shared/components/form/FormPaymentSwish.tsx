import React, { useEffect, useState } from 'react';

import { Button } from '../common/Button';
import { OrderResponse } from '../../../pages/api/order';
import { Link } from '../common/Link';

interface FormPaymentSwishProps {
  createOrUpdateOrder: () => Promise<OrderResponse>;
  checkOrderCompletion: () => void;
}

export const FormPaymentSwish = (props: FormPaymentSwishProps): JSX.Element => {
  const { createOrUpdateOrder, checkOrderCompletion } = props;

  const [qrCode, setQrCode] = useState('');
  const [swishLink, setSwishLink] = useState('');
  const [isPhone, setIsPhone] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const initiateSwish = async () => {
    const response = await createOrUpdateOrder();

    if (!response.swish) {
      return;
    }

    setSwishLink(response.swish.link);
    setQrCode(response.swish.qrCode);
    setIsPhone(response.swish.isPhone);

    if (!response.swish.isPhone) {
      setShowQrCode(true);
    }

    checkOrderCompletion();
  }

  useEffect(() => {
    initiateSwish();
  }, []);

  if (isPhone) {
    return (
      <div>
        <div>
          <Button
            type="primary"
            size="md"
            href={swishLink}
          >
            Öppna Swish-appen
          </Button>
        </div>
        <div>
          <Button
            type="secondary"
            size="md"
            onClick={() => setShowQrCode(true)}
          >
            Skanna QR-kod
          </Button>
          <div>
            Om du betalar med en annan mobil, eller använder datorn just nu
          </div>
          {showQrCode && (
            <div
              className="w-96 h-96"
              dangerouslySetInnerHTML={{ __html: qrCode }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 mt-6 gap-8">
      <div className="flex flex-col items-center">
        <div className="text-lg font-medium text-gray-900">
          Skanna denna kod med Swish-appen
        </div>
        <div
          className="w-80 h-80"
          dangerouslySetInnerHTML={{ __html: qrCode }}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-sm font-medium text-gray-700 pb-2">
          Använder du mobilen redan?
        </div>
        <Link
          href={swishLink}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
        >
          Öppna Swish-appen på denna enhet
        </Link>
      </div>
    </div>
  );
}
