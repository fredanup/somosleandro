import { useEffect, useState } from 'react';
import Image from 'next/image';
import { trpc } from 'utils/trpc';
import type { ApplicantRoomType } from 'server/routers/room';

import Spinner from 'pages/utilities/spinner';
import Advise from 'pages/utilities/advise';

export default function CallingAcceptedSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: ApplicantRoomType | null) => void;
}) {
  //Obtener registros de la bd
  const { data: userApplicationsAccepted, isLoading } =
    trpc.applicantRoom.getUserApplicationsAccepted.useQuery();
  //Control de expansión de llave angular u ojo
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  //Constantes para la comparación con registros de la base de datos
  const musico = 'Músico(s) para evento';
  const docente = 'Clases de música';
  //Efecto para cerrar inicialmente todas las llaves angulares
  useEffect(() => {
    // Si es que hay registros en bd, establecer tamaño de arreglo y dar el valor de false a cada registro
    if (userApplicationsAccepted) {
      setExpandedStates(Array(userApplicationsAccepted.length).fill(false));
    }
  }, [userApplicationsAccepted]);

  //Función para controlar la apertura y cierre de cada llave angular
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

  //Mostrar spinner mientras se obtienen datos de la base de datos
  if (isLoading) {
    return <Spinner text="Cargando registros" />;
  }

  const handleCardClick = (data: ApplicantRoomType | null) => {
    onCardSelect(data);
  };

  if (!userApplicationsAccepted || userApplicationsAccepted.length === 0) {
    return (
      <Advise
        text={
          'Que mala suerte, aún no tienes un cliente interesado pero sigue intentando puedes mejorar tu perfil'
        }
      />
    );
  }

  return (
    //Card
    <>
      {userApplicationsAccepted?.map((entry, index) => (
        <div
          key={index}
          className="cursor-pointer flex flex-col gap-4 p-6 rounded-lg drop-shadow-lg bg-white m-4"
          onClick={() => handleCardClick(entry)}
        >
          {/**Header */}
          <div className="flex flex-row gap-4 items-center">
            {/**Datos del creador de la convocatoria */}
            <Image
              className="h-14 w-14 rounded-lg"
              src={entry.Calling.User?.image || '/avatar.jpg'}
              width={100}
              height={100}
              alt="Logo"
            />
            <div className="w-full">
              <div className="flex flex-row items-center justify-between">
                <p className="text-base font-medium text-black">
                  {entry.Calling.User?.name}
                </p>
                <p className="text-sm font-light text-gray-500">16:39 p.m.</p>
              </div>

              <p className="text-sm font-light text-gray-500 italic">
                Haga clic para iniciar la conversación
              </p>
              <p className="text-sm font-light text-gray-500">
                Vence: {entry.Calling.deadlineAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/**Drop down menu */}
          <div className="cursor-pointer flex flex-row items-center gap-4 border-t border-gray-200 pt-2">
            <div className="flex flex-row gap-2 items-center">
              <svg
                className="h-4 w-4 cursor-pointer focus:outline-none fill-gray-500"
                viewBox="0 0 576 512"
              >
                <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
              </svg>
              <p className="text-gray-500 text-sm font-medium">Calificación</p>
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
                onClick={() => handleToggle(index)}
              >
                Detalles
              </p>
            </div>
          </div>

          {/**Descripción de card */}
          {entry.Calling.callingType === musico && expandedStates[index] && (
            <div className="pb-4 pt-2">
              {/**Header de datos del servicio */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>

                <p className="text-base font-medium text-black">
                  Datos del evento
                </p>
              </div>
              {/**Descripción de datos del servicio */}
              <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                <p>
                  Tipo de evento: <span>{entry.Calling.eventType}</span>
                </p>
                <p>
                  Fecha del evento:{' '}
                  <span>{entry.Calling.eventDate?.toLocaleDateString()}</span>
                </p>
                <p>
                  Lugar del evento: <span>{entry.Calling.eventAddress}</span>
                </p>
              </div>
              {/**Header de datos del estudiante */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>

                <p className="text-base font-medium text-black">
                  Datos del servicio
                </p>
              </div>
              {/**Descripción de datos del estudiante */}
              <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                <p>Duración del servicio: {entry.Calling.serviceLength}</p>
                <p>
                  Dispone de equipo de sonido:{' '}
                  {(entry.Calling.hasSoundEquipment == true && (
                    <span>Si</span>
                  )) ||
                    (entry.Calling.hasSoundEquipment == false && (
                      <span>No</span>
                    ))}
                </p>
                <p>
                  Tipo de músico requerido: {entry.Calling.musicianRequired}
                </p>
              </div>
              {/**Header de datos de postulación */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>
                <p className="text-base font-medium text-black">
                  Datos de postulación
                </p>
              </div>
              {/**Descripción de datos de postulación */}
              <div className="ml-10 mr-4 text-sm font-light text-gray-700">
                <p>
                  Fecha límite de postulación:{' '}
                  <span>{entry.Calling.deadlineAt.toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
          {/**Caso se convocatoria de docente */}
          {entry.Calling.callingType === docente && expandedStates[index] && (
            <div className="pb-4 pt-2">
              {/**Header de datos del servicio */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>

                <p className="text-base font-medium text-black">
                  Datos del servicio
                </p>
              </div>
              {/**Descripción de datos del servicio */}
              <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                <p>
                  En casa del docente:
                  {(entry.Calling.atHome == true && <span>Si</span>) ||
                    (entry.Calling.atHome == false && <span>No</span>)}
                </p>
                <p>
                  Duración del servicio:{' '}
                  <span>{entry.Calling.contractTime}</span>
                </p>
                <p>
                  Horario disponible:{' '}
                  <span>{entry.Calling.availableSchedule}</span>
                </p>
              </div>
              {/**Header de datos del estudiante */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>

                <p className="text-base font-medium text-black">
                  Datos del estudiante
                </p>
              </div>
              {/**Descripción de datos del estudiante */}
              <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                <p>
                  Instrumento deseado:{' '}
                  <span>{entry.Calling.instrumentLiked}</span>
                </p>
                <p>
                  Cuenta con instrumento:{' '}
                  {(entry.Calling.hasInstrument == true && <span>Si</span>) ||
                    (entry.Calling.hasInstrument == false && <span>No</span>)}
                </p>
                <p>
                  Edad del estudiante:{' '}
                  {(entry.Calling.hasSoundEquipment == true && (
                    <span>Si</span>
                  )) ||
                    (entry.Calling.hasSoundEquipment == false && (
                      <span>No</span>
                    ))}
                </p>
                <p>Repertorio de interés: {entry.Calling.repertoireLiked}</p>
              </div>
              {/**Header de datos de postulación */}
              <div className="ml-2 flex items-center">
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
                  <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                </svg>
                <p className="text-base font-medium text-black">
                  Datos de postulación
                </p>
              </div>
              {/**Descripción de datos de postulación */}
              <div className="ml-10 mr-4 text-sm font-light text-gray-700">
                <p>
                  Fecha límite de postulación:{' '}
                  <span>{entry.Calling.deadlineAt.toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
