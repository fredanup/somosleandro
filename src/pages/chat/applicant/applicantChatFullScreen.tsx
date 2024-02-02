import type { ApplicantRoomType, MessageType } from 'server/routers/room';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { trpc } from 'utils/trpc';
import Image from 'next/image';
import Message from 'pages/utilities/message';
import Warning from 'pages/utilities/warning';

export default function ApplicantChatFullScreen({
  selectedCard,
  onBackSelect,
}: {
  selectedCard: ApplicantRoomType | null;
  onBackSelect: (data: ApplicantRoomType | null) => void;
}) {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState('');
  //Se inicializa la variable roomId de tipo string
  const [roomId, setRoomId] = useState('');

  const [notification, setNotification] = useState('');

  //Se inicializa la variable messages que es un arreglo donde cada elemento, tiene el tipo o estructura MessageType que se definió previamente junto con los campos que se mostrarían
  const [messages, setMessages] = useState<MessageType[]>([]);

  //Hace referencia a un nodo del DOM que es un div, iniciando en null
  const messageRef = useRef<HTMLDivElement>(null);

  //Lista todos los mensajes de la sala con id roomId, mostrando los campos usuario y sala, RECUERDA! ACÁ roomId es null
  const messageQuery = trpc.message.findMany.useQuery({ roomId });

  //Aquí viene lo importante!!

  //Retorna un mensaje con los datos proporcionados por el usuario y Emite el evento SEND_MESSAGE junto con el mensaje retornado, acá solo se inicializa
  const sendMessageMutation = trpc.room.sendMessage.useMutation();
  //CREA un mensaje en base de datos con los datos ingresados pasados como argumentos, acá solo se inicializa
  const addMessage = trpc.message.addMessage.useMutation();
  //Emite el evento ENTER_ROOM con la entrada proporcionada. LA ENTRADA DEBE SER UN OBJETO CON EL ID DE LA SALA, acá solo se inicializa

  //SE CARGAN LOS MENSAJES DE LA SALA Y SE EMITE EL EVENTO ENTER_ROOM CON EL ID DE LA SALA
  //Otra vez se cargan los usuarios de la sala en users por la suscripción
  //Cuando se ingrese a una sala se cargarán los mensajes de esa sala si es que hay y Emite el evento ENTER_ROOM con la entrada de datos como adjunto Y LA ENTRADA CONTIENE EL ID de la sala
  useEffect(() => {
    if (selectedCard) {
      // Verifica si se obtuvieron datos de la consulta
      setRoomId(selectedCard.id);

      setNotification(''); // Limpia la notificación si hay datos
      //DADO QUE EN EL ANTERIOR USEEFFECT YA SE TIENE EL VALOR DE roomId, messageQuery ESTA VEZ SÍ TIENE DATOS
      if (messageQuery.data) {
        // Se llena la variable mensajes con todos los mensajes de la sala especificada
        setMessages(messageQuery.data);
        // Se emite el evento ENTER_ROOM con la entrada proporcionada que en este caso es el ID de la sala del anterior USEEFFECT que pasó su valor al roomId global
      }
    } else {
      setNotification('No ha seleccionado ninguna card.');
    }
  }, [selectedCard, messageQuery.data]);

  //Verifica que los mensajes recientes se muestren primero
  useEffect(() => {
    //Se verifica que el messageRef actual sea distinto de nulo
    if (messageRef.current) {
      //indica que el navegador haga scroll hasta que se haga visible el div al cual hace referencia
      messageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  if (status === 'loading') {
    // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
    return null;
  }

  //Retorna un objeto con dos objetos en su interior: 1 objeto que tiene todos los mensajes de la sala y 2 un objeto con todos los usuarios
  trpc.room.onSendMessage.useSubscription(undefined, {
    onData(data) {
      //Busca al usuario de la sesión
      const user = data.users.find((u) => u.id === session?.user?.id);
      //Si la sala del usuario es la sala donde está el mensaje
      if (user?.roomId === data.message.applicantRoomId) {
        //Llenar el buzón de mensajes con el nuevo mensaje agregándole la fecha de creación
        setMessages((m) => {
          return [
            ...m,
            {
              ...data.message,
              createdAt: new Date(),
            },
          ];
        });
      }
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });

  const handleBackButton = () => {
    onBackSelect(null);
  };

  return (
    <>
      {selectedCard ? (
        /**Chat container */
        <div className="flex h-screen w-full flex-col rounded-lg pb-12 md:pb-0">
          {/**Header */}

          <div className="flex flex-row gap-4 rounded-t-lg border-b border-gray-200 bg-white px-4 py-2 items-center">
            {/**Botón atrás */}
            <svg
              viewBox="0 0 512 512"
              className={`h-4 w-4 cursor-pointer md:hidden`}
              onClick={handleBackButton}
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            <Image
              className="h-10 w-10 rounded-full"
              src={selectedCard.Calling.User.image || '/avatar.png'}
              width={100}
              height={100}
              alt="Logo"
            />
            <div>
              <p className="text-normal font-semibold text-black">
                {selectedCard.Calling.User.name}{' '}
                {selectedCard.Calling.User.lastName}
              </p>
              <p className="text-xs font-medium text-gray-400">En línea</p>
            </div>
            <div className="ml-auto flex flex-row items-center gap-4">
              <svg viewBox="0 0 512 512" className="h-4 w-4 cursor-pointer">
                <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
              </svg>

              <svg viewBox="0 0 512 512" className="h-4 w-4 cursor-pointer">
                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>

              <svg viewBox="0 0 512 512" className="h-4 w-4 cursor-pointer">
                <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
              </svg>
            </div>
          </div>

          {/**Chat space */}
          <div className="grow overflow-auto bg-gray-200">
            <div className="flex flex-col p-4" ref={messageRef}>
              {/**Se muestran los mensajes de la sala seleccionada por el usuario actual cargados por el segundo useEffect*/}
              {messages?.map((m, index) => {
                return (
                  /**Se carga el componente con los datos pasados como argumentos, recordando que siempre se mostrarán primero los últimos mensajes por messageRef*/
                  <Message key={index} message={m} session={session || null} />
                );
              })}
            </div>
          </div>
          {/**Input text */}
          <div className="border-b-1 flex w-full flex-row items-center gap-3 rounded-b-lg bg-white p-3">
            <svg viewBox="0 0 512 512" className="h-6 w-6 cursor-pointer">
              <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
            </svg>
            <svg viewBox="0 0 512 512" className="h-6 w-6 cursor-pointer">
              <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
            </svg>
            <input
              className="w-full rounded-lg border px-3 py-2 leading-tight text-black shadow focus:outline-none"
              type="text"
              placeholder="Escriba algo..."
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  /**Se crea el MENSAJE Y SE EMITE EL EVENTO SEND_MESSAGE QUE TIENE ASOCIADO EL MENSAJE. EL ID DEL CUARTO Y EL ID DEL USUARIO SON OBTENIDOS DEL VALOR FIJADO EN EL PRIMER
                   * USEEFFECT Y EN EL ROUTER. AL EMITIRSE EL EVENTO SE MANDA EL MENSAJE CREADO Y SE LISTA A TODOS LOS USUARIOS POR LA SUSCRIPCIÓN. ENTONCES ES POSIBLE OBTENERSE EL ULTIMO MENSAJE
                   * DE ESTA MANERA SE VA LLENANDO EL BUZÓN DE MENSAJES
                   */
                  sendMessageMutation.mutate({
                    applicantRoomId: roomId,
                    text: message,
                  });
                  /**
                   * SE GUARDA EL MENSAJE EN BASE DE DATOS Y SE LIMPIA LOS DATOS DE MESSAGE
                   */
                  addMessage.mutate({
                    text: message,
                    roomId,
                  });
                  setMessage('');
                }
              }}
            />
            <svg viewBox="0 0 512 512" className="h-6 w-6 cursor-pointer">
              <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </svg>
          </div>
        </div>
      ) : (
        <Warning text={notification} />
      )}
    </>
  );
}
