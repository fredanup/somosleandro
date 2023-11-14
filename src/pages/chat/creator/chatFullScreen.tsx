import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { type IUserCalling } from '../../../utils/auth';
import { useEffect, useRef, useState } from 'react';
import {
  type ApplicantRoomType,
  type MessageType,
  type UserType,
} from 'server/routers/room';
import { trpc } from 'utils/trpc';
import { type Session } from 'next-auth';
import Payment from './modal/payment';

function MessageItem({
  message,
  session,
}: {
  message: MessageType;
  session: Session | null;
}) {
  return (
    /**Si el atributo del mensaje con nombre de usuario corresponde al del usuario que se acaba de logear estilizar contenedor de una manera y si no de otra */
    <div
      className={`text-md mb-4 w-7/12 rounded-md p-4 text-gray-700 ${
        message.userName === session?.user?.name
          ? 'self-end bg-purple-200 text-black'
          : 'bg-purple-900 text-white'
      }`}
    >
      <div className="flex">
        <time>
          {/** Se da formato a la hora y nombre del usuario dentro del contenedor*/}
          {message.createdAt.toLocaleTimeString('en-AU', {
            timeStyle: 'short',
          })}{' '}
          - {message.userName}
        </time>
      </div>
      {message.text}
    </div>
  );
}

export default function ChatFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  //Se inicializa la variable roomId de tipo string
  const [roomId, setRoomId] = useState('');
  //Se inicializa la variable isRoomChanged de tipo bool con el valor de false, VERIFICA SI SE HA CAMBIADO DE SALA
  const [room, setRoom] = useState<ApplicantRoomType | null>(null);
  const [isRoomChanged, setIsRoomChanged] = useState(false);
  const [callingId, setCallingId] = useState('');
  const [notification, setNotification] = useState('');
  //Se llenan con las suscripciones

  //Se inicializa la variable messages que es un arreglo donde cada elemento, tiene el tipo o estructura MessageType que se definió previamente junto con los campos que se mostrarían
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [rooms, setRooms] = useState<ApplicantRoomType[]>([]);
  //Hace referencia a un nodo del DOM que es un div, iniciando en null
  const messageRef = useRef<HTMLDivElement>(null);
  //Lista a todas las salas creadas
  const roomsQuery = trpc.room.findMany.useQuery({ callingId });
  //Lista todos los mensajes de la sala con id roomId, mostrando los campos usuario y sala, RECUERDA! ACÁ roomId es null
  const messageQuery = trpc.message.findMany.useQuery({ roomId });
  const [user, setUser] = useState<UserType | null>(null);
  //Aquí viene lo importante!!
  //ACTUALIZA la sala del usuario con el ID DE ROOM proporcionado y Emite el evento Enter_Room con un objeto asociado que tiene los ID DEL USUARIO E ID DE LA SALA, AHORA ES NULO, YA QUE NO SE ALCANZÓ NINGÚN VALOR, acá solo se inicializa
  const updateRoom = trpc.user.updateRoom.useMutation();
  //Retorna un mensaje con los datos proporcionados por el usuario y Emite el evento SEND_MESSAGE junto con el mensaje retornado, acá solo se inicializa
  const sendMessageMutation = trpc.room.sendMessage.useMutation();
  //CREA un mensaje en base de datos con los datos ingresados pasados como argumentos, acá solo se inicializa
  const addMessage = trpc.message.addMessage.useMutation();
  //Emite el evento ENTER_ROOM con la entrada proporcionada. LA ENTRADA DEBE SER UN OBJETO CON EL ID DE LA SALA, acá solo se inicializa

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //SE CARGAN LOS MENSAJES DE LA SALA Y SE EMITE EL EVENTO ENTER_ROOM CON EL ID DE LA SALA
  //Otra vez se cargan los usuarios de la sala en users por la suscripción
  //Cuando se ingrese a una sala se cargarán los mensajes de esa sala si es que hay y Emite el evento ENTER_ROOM con la entrada de datos como adjunto Y LA ENTRADA CONTIENE EL ID de la sala
  useEffect(() => {
    if (selectedCard) {
      // Verifica si se obtuvieron datos de la consulta

      setNotification('No tiene a ningún postulante en esta convocatoria.');
      setCallingId(selectedCard.id);
      if (roomsQuery.data?.length) {
        setRooms(roomsQuery.data);
        setNotification(''); // Limpia la notificación si hay datos
        //DADO QUE EN EL ANTERIOR USEEFFECT YA SE TIENE EL VALOR DE roomId, messageQuery ESTA VEZ SÍ TIENE DATOS
        if (messageQuery.data) {
          // Se llena la variable mensajes con todos los mensajes de la sala especificada
          setMessages(messageQuery.data);
          // Se emite el evento ENTER_ROOM con la entrada proporcionada que en este caso es el ID de la sala del anterior USEEFFECT que pasó su valor al roomId global
        }
      }
    } else {
      setNotification('No ha seleccionado ninguna card.');
    }
  }, [selectedCard, isRoomChanged, roomsQuery.data, messageQuery.data]);

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

  return (
    <>
      {selectedCard ? (
        roomsQuery?.data !== null && roomsQuery?.data?.length !== null ? (
          <div className="flex h-full w-full flex-row gap-2">
            {/**Chat container */}

            {user !== null ? (
              <div className="flex w-2/3 flex-col rounded-lg bg-white">
                {isOpen && (
                  <Payment
                    isOpen={isOpen}
                    onClose={closeModal}
                    selectedRoom={room}
                  />
                )}
                {/**Header */}
                <div className="flex flex-row gap-2 rounded-t-lg border-b border-gray-200 bg-white px-4 py-2">
                  <Image
                    className="h-10 w-10 rounded-full"
                    src={user.image || '/avatar.png'}
                    width={100}
                    height={100}
                    alt="Logo"
                  />
                  <div>
                    <p className="text-normal font-semibold text-black">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-xs font-medium text-gray-400">
                      En línea
                    </p>
                  </div>
                  <div className="ml-auto flex flex-row items-center gap-4">
                    <svg
                      viewBox="0 0 512 512"
                      className="h-4 w-4 cursor-pointer"
                      onClick={openModal}
                    >
                      <path d="M320 96H192L144.6 24.9C137.5 14.2 145.1 0 157.9 0H354.1c12.8 0 20.4 14.2 13.3 24.9L320 96zM192 128H320c3.8 2.5 8.1 5.3 13 8.4C389.7 172.7 512 250.9 512 416c0 53-43 96-96 96H96c-53 0-96-43-96-96C0 250.9 122.3 172.7 179 136.4l0 0 0 0c4.8-3.1 9.2-5.9 13-8.4zm84 88c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V424c0 11 9 20 20 20s20-9 20-20V410.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l0 0-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V216z" />
                    </svg>

                    <svg
                      viewBox="0 0 512 512"
                      className="h-4 w-4 cursor-pointer"
                    >
                      <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                    </svg>

                    <svg
                      viewBox="0 0 512 512"
                      className="h-4 w-4 cursor-pointer"
                    >
                      <path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z" />
                    </svg>
                  </div>
                </div>

                {/**Chat space */}
                <div className={`grow overflow-auto bg-gray-200`}>
                  <div className="flex flex-col p-4" ref={messageRef}>
                    {/**Se muestran los mensajes cargados en el segundo useEffect de acuerdo a la sala proporcionada*/}
                    {messages?.map((m, index) => {
                      return (
                        /**Se carga el componente con los datos pasados como argumentos, recordando que siempre se mostrarán los últimos mensajes por messageRef*/
                        <MessageItem
                          key={index}
                          message={m}
                          session={session || null}
                        />
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
              <div className="flex h-full w-full flex-col items-center justify-center bg-white">
                <p className="text-center text-lg font-black text-gray-500">
                  Seleccione a un postulante de la lista
                </p>
              </div>
            )}

            <div className="flex w-1/3 flex-col rounded-lg bg-white">
              {/**Header */}
              <div className="flex w-full flex-row rounded-t-lg bg-green-400 px-4 py-2">
                <h1 className="text-xl font-semibold text-white">
                  Postulantes
                </h1>
              </div>
              <div className="grow overflow-auto">
                {/**Profile card */}
                {rooms.map((room, index) => (
                  <div
                    className="flex w-full cursor-pointer flex-row items-center gap-2 border-b-2 border-gray-100 p-2"
                    key={index}
                    onClick={() => {
                      //SE CAMBIA EL VALOR DE LA SALA AL HACER CLIC EN OTRA SALA
                      setRoomId(room.id);
                      setRoom(room);
                      setUser(room.Applicant);
                      //ACTUALIZA la sala del usuario con el ID DE LA SALA proporcionado y Emite el evento Enter_Room que tiene un objeto con los ID DE USUARIO E ID DE SALA
                      //ENTONCES UN USUARIO SÓLO PUEDE ESTAR EN UNA SALA A LA VEZ
                      //LUEGO SE VUELVEN A CARGAR LOS USUARIOS DE LA SALA EN USERS
                      updateRoom.mutate({ roomId: room.id });
                      //SE NOTIFICA EL CAMBIO DE SALA SI ES QUE HUBO Y SI HUBO SE CARGAN LOS MENSAJES DE ESA SALA
                      setIsRoomChanged(!isRoomChanged);
                    }}
                  >
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={room.Applicant.image || '/avatar.png'}
                      width={100}
                      height={100}
                      alt="Logo"
                    />
                    <div>
                      <div className="mb-1 flex flex-row gap-2">
                        <p className="text-xs font-medium text-black">
                          {room.Applicant.name} {room.Applicant.lastName}
                        </p>
                        <div className="flex flex-row items-center gap-2">
                          <svg
                            viewBox="0 0 512 512"
                            className="h-2 w-2 fill-green-400"
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
                          </svg>
                          <p className="text-xs font-light text-gray-600">
                            En línea
                          </p>
                        </div>
                        <p className="text-xs font-black text-gray-600">
                          Ene. 12:45
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="text-xs font-light text-gray-600">
                          Hola te puedo enseñar?
                        </p>
                        <svg
                          viewBox="0 0 448 512"
                          className="ml-auto h-4 w-4 fill-sky-400"
                        >
                          <path d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white drop-shadow-lg">
            <p className="text-center text-lg font-black text-gray-500">
              {notification}
            </p>
          </div>
        )
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white drop-shadow-lg">
          <p className="text-center text-lg font-black text-black">
            {notification}
          </p>
        </div>
      )}
    </>
  );
}
