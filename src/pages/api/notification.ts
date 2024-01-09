import { env } from 'server/env';
import type { PushSubscription } from 'web-push';
import webPush from 'web-push';
import { config as dotenvConfig } from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';



dotenvConfig();


webPush.setVapidDetails(
  `mailto:${env.WEB_PUSH_EMAIL}`,
  env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,  
  env.WEB_PUSH_PRIVATE_KEY
)


const Notification = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    const body = req.body as PushSubscription;
    console.log('Received subscription:', body);
    if (!body || !body.endpoint) {
      console.error('Web push subscription is incomplete or missing endpoint.');
      res.status(400).end();  // Retorna un código de estado 400 Bad Request
      return;
    }
    try {
      const response = await webPush.sendNotification(
        body,
        JSON.stringify({
          title: 'Nueva notificación',
          message: 'Alguien desea contactar contigo',
        })
      );
      res.writeHead(response.statusCode, response.headers).end(response.body);
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Aquí puedes trabajar con el error como un Error típico
        console.error(err);
        if (err instanceof Error) {
          console.error(err.message);
        }
      
        res.status(500).end();
      } else {
        // Aquí tratas err como unknown, por lo que debes asegurarte de manejarlo adecuadamente
        console.error(err);
        res.status(500).end();
      }
    }
  } else {
    res.status(405).end();
  }
};

export default Notification;
