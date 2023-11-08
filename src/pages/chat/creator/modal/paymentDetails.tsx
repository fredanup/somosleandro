import { useState } from 'react';

import Script from 'next/script';

import type { PaymentRequestBody } from 'pages/api/pago';

export interface PaymentRequestForm {
  total: number;
  onSubmit: (transactionData: PaymentRequestBody) => void;
}

declare global {
  interface Window {
    MercadoPago: new (accessToken: string) => MercadoPagoInstance;
  }
  interface MercadoPagoInstance {
    bricks(): MercadoPagoBricks;
  }

  interface MercadoPagoSettings {
    locale: string;
    initialization: {
      amount: number;
    };
    callbacks: {
      onReady: () => void;
      onSubmit: (cardFormData: PaymentRequestBody) => void;
      onError: () => void;
    };
    customization: {
      paymentMethods: {
        maxInstallments: number;
      };
    };
  }

  interface MercadoPagoBricks {
    create(
      type: string,
      containerId: string,
      settings: MercadoPagoSettings,
    ): Promise<string>;
  }
}

export default function PaymentDetails({
  totalAmount,
  onClose,
}: {
  totalAmount: number;
  onClose: () => void;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const createMPFormContainer = () => {
    const mp = new window.MercadoPago(
      'TEST-0c4750fe-4946-477d-ad96-6686f1bd7ac2',
    );
    const settings = {
      locale: 'es-PE',
      initialization: {
        amount: totalAmount,
      },
      callbacks: {
        onReady: () => {
          setIsLoading(false); // Cuando el formulario está listo, cambia isLoading a false
        },
        onSubmit: (cardFormData: PaymentRequestBody) => {
          //  callback llamado cuando el usuario haga clic en el botón enviar los datos
          //  ejemplo de envío de los datos recolectados por el Brick a su servidor

          const cardholderEmail = cardFormData.payer.email;

          return new Promise(() => {
            fetch('/api/pago', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: cardFormData.token,
                installments: cardFormData.installments,
                issuerId: cardFormData.issuer_id,
                paymentMethodId: cardFormData.payment_method_id,
                payer: {
                  email: cardholderEmail,
                  identification: {
                    docNumber: cardFormData.payer.identification.number,
                    docType: cardFormData.payer.identification.type,
                  },
                },
                transactionAmount: Number(totalAmount),
              }),
            })
              .then((response) => {
                if (response.ok) {
                  // Si la respuesta es exitosa (código 200), puedes realizar alguna acción en el cliente
                  console.log('La solicitud fue exitosa');

                  // Por ejemplo, cerrar el formulario
                  onClose();
                  window.location.reload();
                } else {
                  // Si la respuesta no es exitosa, puedes manejar el error aquí
                  console.error(
                    'Error al procesar la solicitud:',
                    response.statusText,
                  );
                  // Realiza alguna acción en función del error
                }
              })
              .catch((error) => {
                // Maneja los errores de la solicitud
                console.error('Error de red:', error);
                // Realiza alguna acción en función del error de red
              });
          });
        },
        onError: () => {
          // Resto del código de onError
        },
      },
      customization: {
        paymentMethods: {
          maxInstallments: 12,
        },
      },
    };
    mp.bricks()
      .create('cardPayment', 'cardPaymentBrick_container', settings)
      .then((res: string) => {
        console.log('MPForm -> res', res);
      })
      .catch((error) => {
        console.error(error); // Manejar el error
      });
  };

  return (
    <>
      <div className="absolute left-1/2 top-1/2 z-40 w-auto -translate-x-1/2 -translate-y-1/2 transform overflow-auto rounded-lg bg-white p-6 drop-shadow-lg">
        <Script
          src="https://sdk.mercadopago.com/js/v2"
          onLoad={createMPFormContainer}
        />
        {isLoading && <div>Cargando...</div>}
        <div id="cardPaymentBrick_container"></div>
        <button
          onClick={() => {
            onClose;
            window.location.reload();
          }}
        >
          Cerrar
        </button>
      </div>
    </>
  );
}
