import type { MouseEvent } from 'react';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const base64ToUint8Array = (base64: string) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const Index: React.FC = () => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // run only in browser
      navigator.serviceWorker.ready
        .then((reg) => {
          reg.pushManager
            .getSubscription()
            .then((sub) => {
              if (
                sub &&
                !(
                  sub.expirationTime &&
                  Date.now() > sub.expirationTime - 5 * 60 * 1000
                )
              ) {
                setSubscription(sub);
                setIsSubscribed(true);
              }
            })
            .catch((error) => {
              // Maneja los errores de la solicitud
              console.error('Error de red:', error);
              // Realiza alguna acción en función del error de red
            });
          setRegistration(reg);
        })
        .catch((error) => {
          // Maneja los errores de la solicitud
          console.error('Error de red:', error);
          // Realiza alguna acción en función del error de red
        });
    }
  }, []);

  const subscribeButtonOnClick = (
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();

    if (!registration) {
      console.error('Service Worker registration not found.');
      return;
    }

    registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64ToUint8Array(
          'BJwvGYEOUTD1sPwR0UqBzDRvtmRZswpRVYfxzWH1X88X2NzpLWpRMwxij9GDbAXDnT4VsVJ50gGbiXbkjGM3Mpg',
        ),
      })
      .then((sub) => {
        // TODO: deberías llamar a tu API para guardar los datos de la suscripción en el servidor
        setSubscription(sub);
        setIsSubscribed(true);

        console.log('Web push subscribed!');
        console.log(sub);
      })
      .catch((error) => {
        console.error('Error subscribing to web push:', error);
        // Maneja el error
      });
  };

  const unsubscribeButtonOnClick = (
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();

    if (!subscription) {
      console.error('Web push subscription not found.');
      return;
    }

    subscription
      .unsubscribe()
      .then(() => {
        // TODO: you should call your API to delete or invalidate subscription data on the server

        setSubscription(null);
        setIsSubscribed(false);
        console.log('Web push unsubscribed!');
      })
      .catch((error) => {
        console.error('Error unsubscribing from web push:', error);
        // Handle the error
      });
  };

  const sendNotificationButtonOnClick = (
    event: MouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();

    if (!subscription) {
      console.error('Web push not subscribed');
      return;
    }

    fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(subscription),
    })
      .then((response) => {
        // Handle the response as needed
        console.log('Notification sent:', response);
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
        // Handle the error
      });
  };

  return (
    <>
      <Head>
        <title>next-pwa example</title>
      </Head>
      <h1>Next.js + PWA = AWESOME!</h1>
      <button
        onClick={subscribeButtonOnClick}
        disabled={isSubscribed}
        className="rounded-lg border bg-amber-600 px-4 py-1 text-base font-medium text-white"
      >
        Subscribe
      </button>
      <button
        onClick={unsubscribeButtonOnClick}
        disabled={!isSubscribed}
        className="rounded-lg border bg-amber-600 px-4 py-1 text-base font-medium text-white"
      >
        Unsubscribe
      </button>
      <button
        onClick={sendNotificationButtonOnClick}
        disabled={!isSubscribed}
        className="rounded-lg border bg-amber-600 px-4 py-1 text-base font-medium text-white"
      >
        Send Notification
      </button>
    </>
  );
};

export default Index;
