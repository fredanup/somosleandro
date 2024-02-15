import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import Spinner from 'pages/utilities/spinner';
import MusicianDetailedCard from 'pages/utilities/musicianDetailedCard  ';
import TeacherDetailedCard from 'pages/utilities/teacherDetailedCard';
import Advise from 'pages/utilities/advise';
import Header from 'pages/utilities/header';
import type { IUserCalling } from 'utils/auth';

export default function CompetitorSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: IUserCalling) => void;
}) {
  /**
   * Declaraciones de hooks de estado
   */

  const [applicantNumber, setApplicantNumber] = useState<{
    [key: string]: number;
  }>({});

  //Control de expansión de llave angular
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  //Hook de estado utilizado para recordar en qué card se encuentra el usuario
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null,
  );
  /**
   * Declaraciones de constantes
   */
  //Constantes para la comparación con registros de la base de datos
  const musico = 'Músico(s) para evento';
  const docente = 'Clases de música';

  /**
   * Consultas a base de datos
   */
  //Obtener las convocatorias creadas por el usuario actual
  const { data: userCallings, isLoading } =
    trpc.calling.getUserCallings.useQuery();

  //Obtener las postulaciones por convocatoria
  const applicantsAvailable =
    trpc.applicantRoom.getApplicantsAvailable.useQuery();

  /**
   * Hook de efecto inicial: Cierra inicialmente todas las llaves angulares
   */
  useEffect(() => {
    // Si es que hay registros en bd
    if (userCallings) {
      //Establece el tamaño del arreglo y da el valor inicial de false a cada registro que controla la llave angular
      setExpandedStates(Array(userCallings.length).fill(false));
      //Se establece una variable temporal para almacenar el tamaño por cada convocatoria el cual se pasará finalmente al hook setApplicantNumber
      const totals: { [key: string]: number } = {};
      //Se toma a cada registro de las postulaciones y se compara con cada registro de las convocatorias del usuario actual para saber qué
      //postulaciones corresponden a qué convocatorias
      applicantsAvailable.data?.forEach((applicant) => {
        const matchingApplicant = userCallings?.find(
          (userCalling) =>
            userCalling.id === applicant.callingId &&
            applicant.applyStatus === 'accepted',
        );
        // Verificar si existe un usuario llamador correspondiente
        if (matchingApplicant) {
          //De existir una coincidencia se crea un acumulador que cuenta el número de postulaciones por convocatoria, si no hay ninguna coincidencia para una convocatoria se establece el valor 0
          totals[matchingApplicant.id.toString()] =
            (totals[matchingApplicant.id.toString()] || 0) + 1;
        }
      });
      //Se guarda el total de postulaciones de cada convocatoria
      setApplicantNumber(totals);
    }
  }, [applicantsAvailable.data, userCallings]);

  /**
   * Función para controlar la apertura y cierre de cada llave angular
   * @param index Parametro utilizado para detectar sobre qué índice del arreglo el usuario hizo clic
   */
  const handleToggle = (index: number) => {
    setExpandedStates((prevStates) => {
      //pasar los elementos de prevStates a newStates
      const newStates = [...prevStates];
      //cambia el valor de newstates de true a false y viceversa de acuerdo a qué registro se seleecionó
      newStates[index] = !newStates[index];
      //Retorno de newstates con valor cambiado
      return newStates;
    });
  };

  trpc.applicantRoom.onApplicantChange.useSubscription(undefined, {
    onData(data) {
      //Se establece una variable temporal para almacenar el tamaño por cada convocatoria el cual se pasará finalmente al hook setApplicantNumber
      const totals: { [key: string]: number } = {};
      //Se toma a cada registro de las postulaciones y se compara con cada registro de las convocatorias del usuario actual para saber qué
      //postulaciones corresponden a qué convocatorias
      data?.forEach((applicant) => {
        const matchingApplicant = userCallings?.find(
          (userCalling) =>
            userCalling.id === applicant.callingId &&
            applicant.applyStatus === 'accepted',
        );
        // Verificar si existe un usuario llamador correspondiente
        if (matchingApplicant) {
          //De existir una coincidencia se crea un acumulador que cuenta el número de postulaciones por convocatoria, si no hay ninguna coincidencia para una convocatoria se establece el valor 0
          totals[matchingApplicant.id.toString()] =
            (totals[matchingApplicant.id.toString()] || 0) + 1;
        }
      });
      //Se guarda el total de postulaciones de cada convocatoria
      setApplicantNumber(totals);
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });

  /**
   *
   * @param data Parámetro utilizado para recibir los datos del registro sobre el cual el usuario hizo clic y pasarlos a la función
   * onCardSelect que es parámetro del componente hijo y es enviado como argumento desde el componente padre mediante la función handleCardSelect
   * definido en el padre para poder obtener los datos del hijo y almacenarlos en la variable de estado selectedCard mediante la función de estado
   * setSelectedCard. Además guarda el valor del índice seleccionado en la card por el usuario. Este valor se utilizará posteriormente para dar color
   * a la card y el usuario entienda en qué card se encuentra
   */
  const handleCardClick = (data: IUserCalling, index: number | null) => {
    onCardSelect(data);
    setSelectedCardIndex(index);
  };

  //Mostrar spinner mientras se obtienen datos de la base de datos
  if (isLoading) {
    return <Spinner text="Cargando registros" />;
  }

  return (
    <div>
      <Header
        arrowVisible={false}
        text="Tus salas creadas"
        valueCarrier={() => null}
      />

      {!userCallings || userCallings.length === 0 ? (
        <Advise
          text={'Debes crear al menos una convocatoria para habilitar una sala'}
        />
      ) : (
        <>
          {userCallings?.map((entry, index) => (
            //Card
            <div
              key={index}
              className={`cursor-pointer flex flex-col gap-4 p-6 rounded-lg drop-shadow-lg m-4 ${
                selectedCardIndex === index ? 'bg-sky-100' : ' bg-white' // Cambia el color si es la tarjeta seleccionada
              }`}
              onClick={() => handleCardClick(entry, index)}
            >
              {/**Header */}
              <div className="flex flex-row justify-between">
                <p className="text-base font-medium text-black">
                  Tema a tratar: {entry.callingType}
                </p>
              </div>
              {/**Body */}
              <div className="grid grid-rows-2 grid-flow-col">
                {entry.callingType == docente ? (
                  <p className="text-sm font-light text-gray-500">
                    Instrumento de interés: {entry.instrumentLiked}
                  </p>
                ) : (
                  <p className="text-sm font-light text-gray-500">
                    Músico requerido: {entry.musicianRequired}
                  </p>
                )}
                {entry.callingType == docente ? (
                  <p className="text-sm font-light text-gray-500">
                    Repertorio de interés: {entry.repertoireLiked}
                  </p>
                ) : (
                  <p className="text-sm font-light text-gray-500">
                    Evento: {entry.eventType}
                  </p>
                )}
                {entry.callingType == docente ? (
                  <p className="text-sm font-light text-gray-500">
                    A domicilio:{' '}
                    {entry.atHome == true ? <span>Si</span> : <span>No</span>}
                  </p>
                ) : (
                  <p className="text-sm font-light text-gray-500">
                    Dirección: {entry.eventAddress}
                  </p>
                )}
                <p className="text-sm font-light text-gray-500">
                  Vence: {entry.deadlineAt.toLocaleDateString()}
                </p>
              </div>

              {/**Drop down menu */}
              <div className="cursor-pointer flex flex-row items-center gap-4 border-t border-gray-200 pt-2">
                <div className="flex flex-row gap-2 items-center">
                  <p className="inline-flex items-center rounded bg-sky-500 p-1.5 text-sm font-semibold text-white">
                    {applicantNumber[entry.id.toString()] ?? 0}
                  </p>
                  <p className="text-gray-500 text-sm font-medium">
                    Postulantes aprobados
                  </p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <svg
                    viewBox="0 0 576 512"
                    className={`h-4 w-4 cursor-pointer focus:outline-none ${
                      expandedStates[index] ? 'fill-pink-500' : 'fill-gray-500'
                    }`}
                    onClick={() => handleToggle(index)}
                    aria-label={expandedStates[index] ? 'Collapse' : 'Expand'}
                  >
                    {expandedStates[index] ? (
                      <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z" />
                    ) : (
                      <path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z" />
                    )}
                  </svg>
                  <p
                    className="text-gray-500 text-sm font-medium"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleToggle(index);
                    }}
                  >
                    Detalles
                  </p>
                </div>
              </div>

              {/**Descripción de card */}
              {entry.callingType === musico && expandedStates[index] && (
                <MusicianDetailedCard entry={entry} />
              )}
              {/**Caso se convocatoria de docente */}
              {entry.callingType === docente && expandedStates[index] && (
                <TeacherDetailedCard entry={entry} />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
