import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Spinner from 'pages/utilities/spinner';
import { useState, type ReactNode, useEffect, memo } from 'react';
import type { ApplicantRoomType } from 'server/routers/room';
import type { IUserCalling } from 'utils/auth';
import { trpc } from 'utils/trpc';

interface BodyProps {
  smallScreenBody: ReactNode;
  fullScreenBody: ReactNode;
  menu: ReactNode;
  selectedCard: IUserCalling | ApplicantRoomType | null;
}

const ScreenDesign = ({
  smallScreenBody,
  fullScreenBody,
  menu,
  selectedCard,
}: BodyProps) => {
  //Declaración de variable de estado cuyo valor inicial va a depender de dónde se ejecuta. Si es en el cliente su valor será el ancho de la ventana del navegador
  //pero si está en el servidor será 0
  //Obtenemos la sesión de la bd
  const { data: session, status } = useSession();

  //Inicialización de ruta
  const router = useRouter();
  const [anchoPantalla, setAnchoPantalla] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    //Actualiza el ancho de la pantalla cada que se cambia de ancho
    const handleResize = () => {
      setAnchoPantalla(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (status === 'loading') {
      return; // Si la sesión está cargando, no hagas nada
    }
    if (!session) {
      // Si el usuario no está autenticado, redirige a la página de inicio de sesión
      router.replace('/').catch((error) => {
        console.error(
          'Error al redirigir a la página de inicio de sesión:',
          error,
        );
      });
    }
  }, [status, session, router]);

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

  useEffect(() => {
    subscribeFunction(); // Llama a la función subscribeFunction cuando el componente se monta
  }, []);

  trpc.room.onSendMessage.useSubscription(undefined, {
    onData(data) {
      //Busca al usuario de la sesión actual. Nota revisar
      const user = data.users.find((u) => u.id === session?.user?.id);
      //Si la sala del usuario actual es la sala del mensaje
      if (user?.roomId === data.message.applicantRoomId) {
        //Llenar el buzón de mensajes previo con el nuevo mensaje agregándo la fecha de creación. Nota revisar

        if (data.message.userId !== session?.user?.id) {
          // Verifica que el mensaje sea de otro usuario antes de mostrar la notificación

          sendNotification(data.message.userName, data.message.text);
        }
      }
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });
  /*
  //Si la sesión no existe se redirige al inicio de sesión
  if (!session) {
    router.replace('/').catch((error) => {
      // Se muestra el error identificado en el enrutadomiento. F(x): manejo de errores
      console.error(
        'Error al redirigir a la página de inicio de sesión:',
        error,
      );
    });
  } else {
    subscribeFunction();
  }
*/

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

  const subscribeFunction = (): void => {
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

        console.log('Web push subscribed!');
        console.log(sub);
      })
      .catch((error) => {
        console.error('Error subscribing to web push:', error);
        // Maneja el error
      });
  };

  const sendNotification = (
    title: string | null,
    message: string | null,
  ): void => {
    if (!subscription) {
      console.error('Web push not subscribed');
      return;
    }

    fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        suscription: subscription,
        data: { title, message },
      }),
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

  //Se obtiene la sesión de la base de datos si es que la hay y mientras se muestra un spinner
  if (status === 'loading') {
    // Muestra un spinner de carga mientras se carga la sesión
    return <Spinner text="Cargando sesión" />;
  }

  if (!session) {
    // Si la sesión no está disponible, no renderices nada
    return null;
  }

  return (
    <>
      <div className="m-0 box-border h-screen w-screen border-0 bg-slate-200 md:flex md:flex-row md:gap-2">
        {/**Nodo menú */}
        {menu}
        {/*/Contenedor principal se ubica a la derecha del menú en dispositivos de pantalla grande y en toda la pantalla en móviles**/}
        <div className="h-full w-full md:flex md:flex-row md:gap-2">
          {/* Contenedor izquierdo [SmallScreen].Dato importante: El padding de bottom es bastante para que el menú no tape al contenido 
            El contenedor izquierdo se oculta si el ancho de la ventana es pequeño y se tiene seleccionado a una card
        */}
          <div
            className={`${
              anchoPantalla <= 768 && selectedCard !== null
                ? 'hidden'
                : 'relative h-full w-full flex flex-col pb-12 md:drop-shadow-lg md:rounded-lg md:w-1/3 md:pb-0'
            }`}
          >
            {/**body */}

            <div className="grow overflow-auto rounded-b-lg bg-white">
              {smallScreenBody}
            </div>
          </div>

          {/* Contenedor derecho [FullScreen]. El contenedor derecho se muestra si el ancho de la ventana es pequeño y se tiene seleccionado a una card
            de lo contrario, 
        */}
          <div
            className={`${
              anchoPantalla <= 768 && selectedCard !== null
                ? 'w-full'
                : 'hidden md:block md:flex md:flex-row md:gap-2 md:w-2/3 md:h-full md:rounded-lg md:drop-shadow-lg'
            }`}
          >
            {/**body */}
            {fullScreenBody}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ScreenDesign);
