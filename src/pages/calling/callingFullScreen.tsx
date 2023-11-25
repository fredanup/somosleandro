import Image from 'next/image';
import DocumentSmallScreen from '../profile/document/documentSmallScreen';
import VideoSmallScreen from '../profile/video/videoSmallScreen';
import Rating from '../profile/rating/rating';
import { type IUserCalling } from '../../utils/auth';
import { trpc } from 'utils/trpc';
import { useEffect, useState } from 'react';
import { type ApplicantRoomType } from 'server/routers/room';
import Header from 'pages/utilities/header';
import Warning from 'pages/utilities/warning';

export default function CallingFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  /**
   * Declaraciones de hooks de estado
   */
  //Hook de estado que controla la visualización de notificaciones en función de la existencia de registros en la base de datos o la selección de alguna card de convocatoria
  const [notification, setNotification] = useState('');
  //Hook de estado que almacena el id de una convocatoria a partir de una card seleccionada por el usuario
  const [callingId, setCallingId] = useState('');
  //Hook de estado que almacenará una copia de objetos ApplicantRoomType de una lista de objetos ApplicantRoomType obtenida a partir de la base de datos
  const [applicants, setApplicants] = useState<ApplicantRoomType[] | null>([]);
  //Hook de estado que almacena los datos de un objeto ApplicantRoomType seleccionado por el usuario de una lista de objetos ApplicantRoomType
  const [applicantChosen, setAppliantChosen] =
    useState<ApplicantRoomType | null>(null);
  //Hook de estado utilizado para recordar en qué card se encuentra el usuario
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  const [anchoPantalla, setAnchoPantalla] = useState<number>(window.innerWidth);
  /**
   * Consultas a base de datos
   */
  const utils = trpc.useContext();

  //Obtiene a los postulantes de una sala a partir del valor del hook de estado callingId obtenido mediante la selección de una card en el componente callingSmallScreen.
  //Dato: Inicialmente el hook de estado callingId es nulo.
  const applicantsQuery = trpc.applicantRoom.getApplicantsByCalling.useQuery({
    callingId: callingId,
  });

  //En términos simples. ESTA MUTACIÓN APRUEBA UNA SALA CREADA Y ENROLA AL CREADOR (AL USUARIO ACTUAL) Y AL POSTULANTE
  //Una vez lograda la mutación se invalidan los registros presentes en caché para actualizarse con los nuevos obtenidos desde la base de datos
  const acceptApplicant = trpc.applicantRoom.acceptApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
      await utils.user.findMany.invalidate();
    },
  });

  //Mutación que actualiza la sala en la que se encuentra el postulante para que no sea capaz de poder comunicarse con el cliente. Una vez que se produce la actualización en base de datos
  //se comunica a todos los oyentes del cambio. Nota: QUIZÁ no sea necesario emitir el evento esto puesto que el único oyente es el cliente, aunque podría ser útil en caso otros postulantes deseasen participar
  //partiendo de la exclusión de éste. Adicionalmente invalida los registros presentes en caché para actualizarse con los nuevos obtenidos desde la base de datos
  const rejectApplicant = trpc.applicantRoom.rejectApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
    },
  });

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
  useEffect(() => {
    //Función empleada con los argumentos en null con el propósito de limpiar los campos y no se mantegan datos anteriores cuando se esté seleccionando otra card
    handleCardClick(null, null);
    setApplicants(null);
    if (selectedCard) {
      // Almacena el valor del id de la convocatoria seleccionada a través del componente callingSmallScreen
      setCallingId(selectedCard.id);
      //Verifica si existen registros en la consulta
      if (applicantsQuery.data?.length) {
        //Almacena los registros en la variable applicants
        setApplicants(applicantsQuery.data);

        // Limpia la notificación puesto que si hay datos
        setNotification('');
      } else {
        // Notifica al usuario la ausencia de postulantes
        setNotification('No tiene a ningún postulante en esta convocatoria.');
      }
    } else {
      // Notifica al usuario la no selección de una convocatoria en el componente callingSmallScreen
      setNotification('No ha seleccionado ninguna card.');
    }
  }, [selectedCard, applicantsQuery.data]);

  //Función que se utiliza para evitar una llamada directa a la mutación de rechazo
  function rejectAppliantStatus(appliantId: string) {
    rejectApplicant.mutate({
      id: appliantId,
    });
  }

  //Función que se utiliza para evitar una llamada directa a la mutación de aprobación
  function acceptAppliantStatus(appliantId: string) {
    acceptApplicant.mutate({
      id: appliantId,
    });
  }

  /**
   * Retorna las salas de la convocatoria seleccionada por el usuario en callingSmallScreen
   */
  //Retorna las salas que están pendientes de aprobación o que fueron aceptadas
  trpc.applicantRoom.onApplicantChange.useSubscription(undefined, {
    onData(data) {
      //Filtra las salas a sólo aquellas que pertenecen a aquella que seleccionó el usuario en callingSmallScreen
      const filteredData = data.filter((item) => item.callingId === callingId);
      //Almacena las salas filtradas
      setApplicants(filteredData);
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });

  /**
   *
   * @param data se usa para pasar como argumento los datos de la card seleccionada
   * @param index se usa para pasar como argumento la posición actual de la card seleccinada
   * Guarda el valor del índice seleccionado en la card por el usuario, éste valor se utiliza posteriormente para dar color
   * a la card y que así el usuario entienda en qué card se encuentra.
   */
  const handleCardClick = (
    data: ApplicantRoomType | null,
    index: number | null,
  ) => {
    setAppliantChosen(data);
    setSelectedCardIndex(index);
  };

  return (
    <>
      {/**Contenedor de postulantes */}
      <div className="h-screen flex flex-col w-full md:w-1/3 rounded-lg">
        {/**Header */}
        <Header text="Postulantes" />
        {/**Body */}
        <div className="grow overflow-auto rounded-b-lg bg-white">
          {selectedCard ? (
            applicants !== null && applicants.length > 0 ? (
              applicants?.map((entry, index) => (
                //Card de postulante
                <div
                  className={`flex flex-row cursor-pointer gap-4 p-6 rounded-lg drop-shadow-lg items-center m-4 ${
                    entry.applyStatus === 'accepted'
                      ? selectedCardIndex === index
                        ? 'bg-sky-100'
                        : ' bg-white' // Cambia el color si es la tarjeta seleccionada
                      : 'bg-yellow-200'
                  }`} // Aplicar la clase si la tarjeta está aprobada
                  key={index}
                  onClick={() => handleCardClick(entry, index)}
                >
                  {/**Foto del postulante*/}
                  <Image
                    className="h-14 w-14 rounded-full"
                    src={entry.Applicant.image || '/avatar.png'}
                    width={100}
                    height={100}
                    alt="Logo"
                  />
                  {/**Datos del postulante*/}
                  <div className="flex flex-col">
                    <p className="text-base font-medium text-black">
                      {entry.Applicant.name} {entry.Applicant.lastName}
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      Fecha: {entry.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm font-light text-gray-500">
                      Hora: {entry.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                  {/**Botones de edición y aceptación */}
                  <div className="ml-auto flex flex-row gap-4">
                    <svg
                      viewBox="0 0 512 512"
                      className={`h-6 w-6 cursor-pointer fill-black ${
                        entry.applyStatus === 'accepted' ? 'hidden' : 'block'
                      }`}
                      onClick={() => acceptAppliantStatus(entry.id)}
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                    <svg
                      viewBox="0 0 512 512"
                      className="h-6 w-6 cursor-pointer fill-red-500"
                      onClick={() => rejectAppliantStatus(entry.id)}
                    >
                      <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                    </svg>
                  </div>
                </div>
              ))
            ) : (
              <Warning text={notification} />
            )
          ) : (
            <Warning text={notification} />
          )}
        </div>
      </div>

      {/**Contenedor de visualización de perfil de estudiante */}
      <div
        className={`${
          anchoPantalla <= 768 && applicantChosen === null
            ? 'hidden'
            : 'flex h-screen w-full md:w-2/3 flex-col rounded-lg'
        }`}
      >
        {/**Header */}
        <Header text="Perfil del postulante" />
        {applicantChosen !== null && (
          //Body
          <div className="flex flex-col gap-4 p-6 grow overflow-auto rounded-b-lg bg-white">
            {/*Foto y datos personales*/}
            <div className="flex flex-col items-center p-9">
              <Image
                className="rounded-full"
                src={applicantChosen.Applicant.image || ''}
                width={95}
                height={100}
                alt="Logo"
              />
              <p className="text-m text-base font-medium text-gray-700">
                {applicantChosen.Applicant.name}
              </p>
              <p className="text-sm font-normal text-gray-500">
                {applicantChosen.Applicant.email}
              </p>
              <div className="flex flex-row cursor-pointer gap-2 mt-4 items-center bg-sky-500 rounded-lg drop-shadow-lg px-2 py-1">
                <svg
                  className="h-4 w-4 cursor-pointer focus:outline-none fill-white"
                  viewBox="0 0 576 512"
                >
                  <path d="M160 368c26.5 0 48 21.5 48 48v16l72.5-54.4c8.3-6.2 18.4-9.6 28.8-9.6H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16V352c0 8.8 7.2 16 16 16h96zm48 124l-.2 .2-5.1 3.8-17.1 12.8c-4.8 3.6-11.3 4.2-16.8 1.5s-8.8-8.2-8.8-14.3V474.7v-6.4V468v-4V416H112 64c-35.3 0-64-28.7-64-64V64C0 28.7 28.7 0 64 0H448c35.3 0 64 28.7 64 64V352c0 35.3-28.7 64-64 64H309.3L208 492z" />
                </svg>
                <p className="text-white text-base font-medium">Charlar</p>
              </div>
            </div>
            {/*Documentos*/}
            <DocumentSmallScreen userId={applicantChosen.Applicant.id} />
            {/*Vídeo*/}
            <VideoSmallScreen userId={applicantChosen.Applicant.id} />
            {/**Calificaciones */}
            <Rating />
          </div>
        )}
        {applicantChosen === null && (
          <Warning text="No ha seleccionado a ningún postulante" />
        )}
      </div>
    </>
  );
}
