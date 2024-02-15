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
import Payment from './modal/payment';
import Spinner from 'pages/utilities/spinner';
import Warning from 'pages/utilities/warning';
import Header from 'pages/utilities/header';
import Message from 'pages/utilities/message';

export default function ChatFullScreen({
  selectedCard,
  onBackSelect,
}: {
  selectedCard: IUserCalling | null;
  onBackSelect: (data: IUserCalling | null) => void;
}) {
  //Declaración de hook usado para obtener la sesión y de esta manera se sepa quién escribe escribe el texto
  const { data: session, status } = useSession();
  /**
   * Declaraciones de hooks de estado
   */
  //Hook de estado que controla la apertura del modal de pago
  const [isOpen, setIsOpen] = useState(false);
  //Hook de estado utilizado para almacenar el mensaje que el usuario tipea, para enviarse con la suscripción y para almacenarse en base de datos
  const [message, setMessage] = useState('');
  //Hook de estado que almacena la sala sobre la que el usuario hizo clic y ayuda a obtener de la base de datos los mensajes de esa sala
  const [roomId, setRoomId] = useState('');
  //Hook de estado que almacena los datos de la sala sobre la que el usuario hizo clic. Se utiliza para mandar los datos de la sala al componente de pago
  const [room, setRoom] = useState<ApplicantRoomType | null>(null);
  //Hook de estado que almacena el cambio de sala. Si cambia de valor se ejecuta el primer hook para cargar los mensajes de esa sala
  const [isRoomChanged, setIsRoomChanged] = useState(false);
  //Hook de estado que almacena el id de la convocatoria, es útil para realizar consultas a la base de datos
  const [callingId, setCallingId] = useState('');
  //Hook de estado que controla la visualización de notificaciones en función de la existencia de registros en la base de datos o la selección de alguna card de convocatoria
  const [notification, setNotification] = useState('');
  //Hook de estado usado para almacenar todos las mensajes de una sala que pertenece a una convocatoria obtenidas desde una consulta a la base de datos.
  const [messages, setMessages] = useState<MessageType[]>([]);
  //Hook de estado usado para almacenar todas las salas de una convocatoria obtenidas desde una consulta a la base de datos. Las salas visualmente se aprecian como perfiles en una lista de postulantes.
  const [rooms, setRooms] = useState<ApplicantRoomType[]>([]);
  //Hook de estado usado para almacenar los datos personales de un postulante a partir de la sala en la que se encuentra
  const [user, setUser] = useState<UserType | null>(null);
  //Hook de estado utilizado para recordar en qué card se encuentra el usuario
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [notVisible, setNotVisible] = useState(false);
  const [anchoPantalla, setAnchoPantalla] = useState<number>(window.innerWidth);

  //Hace referencia a un nodo del DOM que es un div, iniciando en null. Es el contenedor (Div html) en el cual se mostrarán los mensajes
  const messageRef = useRef<HTMLDivElement>(null);
  //Consulta hecha para obtener todas las salas de una determinada convocatoria. Depende del valor de callingId por lo que debe ser llenado inicialmente con un useEffect
  const roomsQuery = trpc.room.findManyAccepted.useQuery({ callingId });
  //Lista todos los mensajes de la sala especificada, mostrando los campos usuario y sala. Depende del valor de roomId por lo que debe ser llenado inicialmente
  const messageQuery = trpc.message.findMany.useQuery({ roomId });

  //Aquí viene lo importante!!
  //EL usuario actual elige a qué sala entrar y da a conocer a los oyentes la sala a la que entró
  const updateRoom = trpc.user.updateRoom.useMutation();
  //Retorna un mensaje con los datos proporcionados por el usuario y Emite el evento SEND_MESSAGE junto con el mensaje retornado, acá solo se inicializa
  const sendMessageMutation = trpc.room.sendMessage.useMutation();
  //CREA un mensaje en base de datos con los datos ingresados pasados como argumentos, acá solo se inicializa
  const addMessage = trpc.message.addMessage.useMutation();
  //Emite el evento ENTER_ROOM con la entrada proporcionada. LA ENTRADA DEBE SER UN OBJETO CON EL ID DE LA SALA, acá solo se inicializa

  /**
   * Funciones de apertura y cierre de modales
   */
  //Función de apertura del modal Payment
  const openModal = () => {
    setIsOpen(true);
  };
  //Función de cierre del modal Payment
  const closeModal = () => {
    setIsOpen(false);
  };

  /**
   *
   * @param data se usa para pasar como argumento los datos de la card seleccionada
   * @param index se usa para pasar como argumento la posición actual de la card seleccinada
   * Guarda el valor del índice seleccionado en la card por el usuario, éste valor se utiliza posteriormente para dar color
   * a la card y que así el usuario entienda en qué card se encuentra.
   */
  const handleCardClick = (index: number | null, show: boolean) => {
    setSelectedCardIndex(index);
    setNotVisible(show);
  };

  //SE CARGAN LOS MENSAJES DE LA SALA Y SE EMITE EL EVENTO ENTER_ROOM CON EL ID DE LA SALA
  //Otra vez se cargan los usuarios de la sala en users por la suscripción
  //Cuando se ingrese a una sala se cargarán los mensajes de esa sala si es que hay y Emite el evento ENTER_ROOM con la entrada de datos como adjunto Y LA ENTRADA CONTIENE EL ID de la sala
  useEffect(() => {
    //Limpieza de las salas de la convocatoria
    setRooms([]);

    if (selectedCard) {
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
      } else {
        setNotification('No tiene a ningún postulante en esta convocatoria.');
        setUser(null);
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

  /**
   * Hook de efecto inicial
   */
  useEffect(() => {
    const handleResize = () => {
      setAnchoPantalla(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Limpia el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  //Se obtiene la sesión de la base de datos si es que la hay y mientras se muestra un spinner
  if (status === 'loading') {
    // Se muestra el spinner mientra se verifica el estado de autenticación
    return <Spinner text="Cargando sesión" />;
  }

  //Retorna un objeto con dos objetos en su interior: 1 objeto que tiene todos los mensajes de la sala y 2 un objeto con todos los usuarios
  //En términos simples: Retorna el objeto mensaje enviado mediante el evento y la lista de todos los usuarios
  trpc.room.onSendMessage.useSubscription(undefined, {
    onData(data) {
      //Busca al usuario de la sesión actual. Nota revisar
      const user = data.users.find((u) => u.id === session?.user?.id);
      //Si la sala del usuario actual es la sala del mensaje
      if (user?.roomId === data.message.applicantRoomId) {
        //Llenar el buzón de mensajes previo con el nuevo mensaje agregándo la fecha de creación. Nota revisar
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

  // Función para enviar el mensaje
  const sendMessage = () => {
    // Se crea el MENSAJE Y SE EMITE EL EVENTO SEND_MESSAGE QUE TIENE ASOCIADO EL MENSAJE. roomId ES OBTENIDO CUANDO EL USUARIO HACE CLIC EN UNA SALA Y EL TEXTO DE LO INGRESADO POR EL USUARIO
    // AL EMITIRSE EL EVENTO SE MANDA EL MENSAJE CREADO Y SE LISTA A TODOS LOS USUARIOS POR LA SUSCRIPCIÓN. ENTONCES ES POSIBLE OBTENERSE EL ULTIMO MENSAJE
    // DE ESTA MANERA SE VA LLENANDO EL BUZÓN DE MENSAJES
    sendMessageMutation.mutate({
      applicantRoomId: roomId,
      text: message,
    });

    // SE GUARDA EL MENSAJE EN BASE DE DATOS Y SE LIMPIA LOS DATOS DE MESSAGE PARA GUARDAR O ENVIAR OTRO MENSAJE
    addMessage.mutate({
      text: message,
      roomId,
    });
    setMessage('');
  };

  return (
    <>
      {selectedCard ? (
        roomsQuery?.data !== null && roomsQuery?.data?.length !== null ? (
          //Main container
          <div className="flex h-screen w-full flex-row gap-2 rounded-lg pb-12 md:pb-0">
            {/**Chat container or left container*/}
            {user !== null ? (
              <div className="flex h-full w-full flex-col ">
                {/**Header */}
                <div className="flex flex-row gap-4 rounded-t-lg border-b border-gray-200 bg-white px-4 py-2 items-center">
                  <svg
                    viewBox="0 0 448 512"
                    className="h-4 w-4 fill-black cursor-pointer md:hidden"
                    onClick={() => {
                      setUser(null);
                    }}
                  >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
                  </svg>
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
                    {/*
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
                    */}
                  </div>
                </div>

                {/**Chat space */}
                <div className="grow overflow-auto bg-gray-200">
                  <div className="flex flex-col p-4" ref={messageRef}>
                    {/**Se muestran los mensajes de la sala seleccionada por el usuario actual cargados por el segundo useEffect*/}
                    {messages?.map((m, index) => {
                      return (
                        /**Se carga el componente con los datos pasados como argumentos, recordando que siempre se mostrarán primero los últimos mensajes por messageRef*/
                        <Message
                          key={index}
                          message={m}
                          session={session || null}
                        />
                      );
                    })}
                  </div>
                </div>
                {/**Input text */}
                <div className="flex flex-row gap-4 w-full items-center rounded-b-lg bg-white p-3 mb-2">
                  {/*
                  <svg viewBox="0 0 512 512" className="h-6 w-6 cursor-pointer">
                    <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm177.6 62.1C192.8 334.5 218.8 352 256 352s63.2-17.5 78.4-33.9c9-9.7 24.2-10.4 33.9-1.4s10.4 24.2 1.4 33.9c-22 23.8-60 49.4-113.6 49.4s-91.7-25.5-113.6-49.4c-9-9.7-8.4-24.9 1.4-33.9s24.9-8.4 33.9 1.4zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
                  </svg>
                  <svg viewBox="0 0 512 512" className="h-6 w-6 cursor-pointer">
                    <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
                  </svg>
                  */}
                  <input
                    className="w-full rounded-lg border px-3 py-2 leading-tight text-black shadow focus:outline-none"
                    type="text"
                    placeholder="Escriba algo..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        /**Se crea el MENSAJE Y SE EMITE EL EVENTO SEND_MESSAGE QUE TIENE ASOCIADO EL MENSAJE. roomId ES OBTENIDO CUANDO EL USUARIO HACE CLIC EN UNA SALA Y EL TEXTO DE LO INGRESADO POR EL USUARIO
                         * AL EMITIRSE EL EVENTO SE MANDA EL MENSAJE CREADO Y SE LISTA A TODOS LOS USUARIOS POR LA SUSCRIPCIÓN. ENTONCES ES POSIBLE OBTENERSE EL ULTIMO MENSAJE
                         * DE ESTA MANERA SE VA LLENANDO EL BUZÓN DE MENSAJES
                         */
                        sendMessageMutation.mutate({
                          applicantRoomId: roomId,
                          text: message,
                        });

                        /**
                         * SE GUARDA EL MENSAJE EN BASE DE DATOS Y SE LIMPIA LOS DATOS DE MESSAGE PARA GUARDAR O ENVIAR OTRO MENSAJE
                         */
                        addMessage.mutate({
                          text: message,
                          roomId,
                        });
                        setMessage('');
                      }
                    }}
                  />
                  <svg
                    viewBox="0 0 576 512"
                    className="h-6 w-6 cursor-pointer fill-sky-500"
                    onClick={sendMessage}
                  >
                    <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                  </svg>
                </div>
                {isOpen && (
                  <Payment
                    isOpen={isOpen}
                    onClose={closeModal}
                    selectedRoom={room}
                  />
                )}
              </div>
            ) : (
              rooms.length > 0 && (
                <div className="hidden md:flex md:h-full md:w-full md:flex-col md:items-center md:justify-center md:bg-white">
                  <p className="text-center text-lg font-black text-gray-500">
                    Seleccione a un postulante de la lista
                  </p>
                </div>
              )
            )}
            {/**Contenedor de salas or right container */}
            <div
              className={`${
                notVisible && anchoPantalla <= 768 && user !== null
                  ? 'hidden'
                  : 'flex w-1/3 flex-col rounded-lg bg-white h-screen grow overflow-auto rounded-b-lg'
              }`}
            >
              {/**Header */}
              <Header
                arrowVisible={true}
                valueCarrier={handleBackButton}
                text="Postulantes aprobados"
              />
              <div className="grow overflow-auto rounded-b-lg bg-white">
                {/**Room card */}
                {rooms.length > 0 ? (
                  rooms.map((room, index) => (
                    <div
                      className={`flex flex-row cursor-pointer gap-4 p-4 rounded-lg drop-shadow-lg items-center m-4 ${
                        room.applyStatus === 'accepted'
                          ? selectedCardIndex === index
                            ? 'bg-sky-100'
                            : ' bg-white' // Cambia el color si es la tarjeta seleccionada
                          : null
                      }`} // Aplicar la clase si la tarjeta está aprobada
                      key={index}
                      onClick={() => {
                        handleCardClick(index, true);
                        //SE CAMBIA EL VALOR DE LA SALA AL HACER CLIC EN OTRA SALA
                        setRoomId(room.id);
                        //Se define la variable notvisible para ocultar el panel de salas de postulantes
                        setNotVisible(true);
                        //Se guarda los datos de la sala para el componente Payment
                        setRoom(room);
                        //Se guarda los datos del postulante de la sala para el estilizado del chat
                        setUser(room.Applicant);
                        //ACTUALIZA la sala del usuario con el ID DE LA SALA proporcionado y Emite el evento Enter_Room que tiene un objeto con los ID DE USUARIO E ID DE SALA
                        //ENTONCES UN USUARIO SÓLO PUEDE ESTAR EN UNA SALA A LA VEZ
                        //LUEGO SE VUELVEN A CARGAR LOS USUARIOS DE LA SALA EN USERS
                        //El usuario actual elige a qué sala entrar y da a conocer a los oyentes a qué sala entró
                        updateRoom.mutate({ roomId: room.id });
                        //SE CAMBIA EL VALOR A isRoomChanged LO CUAL GENERA QUE SE VUELVA A EJECUTAR USEEFFCECT
                        setIsRoomChanged(!isRoomChanged);
                      }}
                    >
                      {/**Foto del postulante*/}
                      <Image
                        className="h-14 w-14 rounded-full"
                        src={room.Applicant.image || '/avatar.png'}
                        width={100}
                        height={100}
                        alt="Logo"
                      />
                      <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between">
                          <p className="text-base font-medium text-black">
                            {room.Applicant.name} {room.Applicant.lastName}
                          </p>

                          <p className="text-xs font-black text-gray-600">
                            Ene. 12:45
                          </p>
                        </div>
                        <div className="flex flex-row">
                          <p className="text-xs font-light text-gray-600">
                            Hola te puedo enseñar?
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Warning text="No tiene a ningún postulante en esta convocatoria." />
                )}
              </div>
            </div>
          </div>
        ) : (
          <Warning text={notification} />
        )
      ) : (
        <Warning text={notification} />
      )}
    </>
  );
}
