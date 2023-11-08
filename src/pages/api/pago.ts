// Importa las dependencias necesarias
import { type NextApiRequest, type NextApiResponse } from 'next';
import mercadopago from 'mercadopago';
import { config as dotenvConfig } from 'dotenv';
import { env } from 'server/env';
dotenvConfig();
export interface PaymentRequestBody {
  transactionAmount: number;
  token: string;
  description: string;
  installments: number;
  payment_method_id: string;
  issuer_id: string;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

const mercadoPagoAccessToken = env.MERCADO_PAGO_SAMPLE_ACCESS_TOKEN;
if (!mercadoPagoAccessToken) {
  console.log('Error: access token not defined');
  process.exit(1);
}
mercadopago.configurations.setAccessToken(mercadoPagoAccessToken);
// Configura el manejador para la ruta API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Configura MercadoPago con tus credenciales (las obtenidas de tu archivo .env)

  if (req.method === 'POST') {
    const body = req.body as PaymentRequestBody;

    // Define la estructura de los datos de pago
    const paymentData = {
      transaction_amount: Number(body.transactionAmount),
      token: body.token,
      description: body.description,
      installments: Number(body.installments),
      payment_method_id: body.payment_method_id,
      issuer_id: body.issuer_id,
      payer: {
        email: body.payer.email,
        identification: {
          type: body.payer.identification.type,
          number: body.payer.identification.number,
        },
      },
    };

    try {
      // Realiza el pago utilizando MercadoPago
      const response = await mercadopago.payment.save(paymentData);
      const { status } = response;

      res.status(201).json({
        status: status,
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.status(405).end(); // Método no permitido
  }
}
