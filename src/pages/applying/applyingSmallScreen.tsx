import Image from 'next/image';
import { trpc } from 'utils/trpc';
import { useEffect, useState } from 'react';
import { type IUserCalling } from '../../utils/auth';
import Spinner from 'pages/utilities/spinner';

export default function ApplyingSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: IUserCalling) => void;
}) {
  //Obtener los registros de bd
  const { data: userCallings, isLoading } = trpc.calling.getCallings.useQuery();
  //Control de expansión de llave angular
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);

  useEffect(() => {
    // Si es que hay registros en bd, establecer tamaño de arreglo y dar el valor de false a cada registro
    if (userCallings) {
      setExpandedStates(Array(userCallings.length).fill(false));
    }
  }, [userCallings]);

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

  if (isLoading) {
    return <Spinner />;
  }

  if (!userCallings || userCallings.length === 0) {
    return (
      <li className="m-6 text-slate-500">
        Aún no se ha creado ninguna convocatoria
      </li>
    );
  }

  const handleCardClick = (data: IUserCalling) => {
    onCardSelect(data);
  };

  return (
    /**Card*/
    <>
      {userCallings.map((entry, index) => (
        //Contenedor principal
        <div
          key={index}
          className="cursor-pointer flex flex-col gap-4 p-4 rounded-lg drop-shadow-lg bg-white border-blue-200 m-4"
          onClick={() => handleCardClick(entry)}
        >
          {/**Header */}
          <div className="flex flex-row gap-4 items-center">
            {/**Datos del creador de la convocatoria */}
            <Image
              className="h-12 w-12 rounded-full"
              src={entry.User?.image || '/avatar.jpg'}
              width={100}
              height={100}
              alt="Logo"
            />
            <div>
              <p className="text-base font-medium text-black">
                {entry.User?.name}
              </p>
              <p className="text-sm font-normal text-gray-500">
                {entry.User?.email}
              </p>
            </div>
          </div>

          {/**Body */}

          <div className="flex flex-row gap-4">
            {/**Items listados */}
            <p className="text-sm font-normal text-gray-500">
              Postulantes:
              <span className="text-sm font-medium text-black">
                {' ' + entry.applicantNumber}
              </span>
            </p>
            <p className="text-sm font-normal text-gray-500">
              Estado:
              {entry.callingTaken === true && (
                <span className="text-sm font-medium text-red-400"> Llena</span>
              )}
              {entry.callingTaken === false && (
                <span className="text-sm font-medium text-green-400">
                  {' '}
                  Vigente
                </span>
              )}
            </p>
            <p className="text-sm font-normal text-gray-500">
              Fecha límite de postulación:
              <span className="text-sm font-medium text-black">
                {' ' + entry.deadlineAt.toLocaleDateString()}
              </span>
            </p>
          </div>

          {/**Drop down menu */}
          <div className="cursor-pointer flex flex-row items-center justify-between border-t border-gray-200">
            <p className="text-base font-medium text-gray-700">
              Requiere: {entry.callingType}
            </p>
            <svg
              viewBox="0 0 320 512"
              className="h-4 w-4 cursor-pointer fill-gray-500 focus:outline-none"
              onClick={() => handleToggle(index)}
              aria-label={expandedStates[index] ? 'Collapse' : 'Expand'}
            >
              {expandedStates[index] ? (
                <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
              ) : (
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              )}
            </svg>
          </div>

          {/**Descripción de card */}
          {entry.callingType === 'Músico(s) para evento' &&
            expandedStates[index] && (
              <div className="pb-4 pt-2">
                {/**Header de datos del servicio */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
                    <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                  </svg>

                  <p className="text-base font-medium text-black">
                    Datos del evento
                  </p>
                </div>
                {/**Descripción de datos del servicio */}
                <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                  <p>
                    Tipo de evento: <span>{entry.eventType}</span>
                  </p>
                  <p>
                    Fecha del evento:{' '}
                    <span>{entry.eventDate?.toLocaleDateString()}</span>
                  </p>
                  <p>
                    Lugar del evento: <span>{entry.eventAddress}</span>
                  </p>
                </div>
                {/**Header de datos del estudiante */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
                    <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                  </svg>

                  <p className="text-base font-medium text-black">
                    Datos del servicio
                  </p>
                </div>
                {/**Descripción de datos del estudiante */}
                <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                  <p>Duración del servicio: {entry.serviceLength}</p>
                  <p>
                    Dispone de equipo de sonido:{' '}
                    {(entry.hasSoundEquipment == true && <span>Si</span>) ||
                      (entry.hasSoundEquipment == false && <span>No</span>)}
                  </p>
                  <p>Tipo de músico requerido: {entry.musicianRequired}</p>
                </div>
                {/**Header de datos de postulación */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
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
                    <span>{entry.deadlineAt.toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            )}
          {/**Caso se convocatoria de docente */}
          {entry.callingType === 'Clases de música' &&
            expandedStates[index] && (
              <div className="pb-4 pt-2">
                {/**Header de datos del servicio */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
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
                    {(entry.atHome == true && <span>Si</span>) ||
                      (entry.atHome == false && <span>No</span>)}
                  </p>
                  <p>
                    Duración del servicio: <span>{entry.contractTime}</span>
                  </p>
                  <p>
                    Horario disponible: <span>{entry.availableSchedule}</span>
                  </p>
                </div>
                {/**Header de datos del estudiante */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
                    <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
                  </svg>

                  <p className="text-base font-medium text-black">
                    Datos del estudiante
                  </p>
                </div>
                {/**Descripción de datos del estudiante */}
                <div className="mb-2 ml-10 mr-4 text-sm font-light text-gray-700">
                  <p>
                    Instrumento deseado: <span>{entry.instrumentLiked}</span>
                  </p>
                  <p>
                    Cuenta con instrumento:{' '}
                    {(entry.hasInstrument == true && <span>Si</span>) ||
                      (entry.hasInstrument == false && <span>No</span>)}
                  </p>
                  <p>Edad del estudiante: {entry.studentAge}</p>
                  <p>Repertorio de interés: {entry.repertoireLiked}</p>
                </div>
                {/**Header de datos de postulación */}
                <div className="ml-2 flex items-center">
                  <svg
                    viewBox="0 0 512 512"
                    className="h-8 w-8 fill-sky-500 p-2"
                  >
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
                    <span>{entry.deadlineAt.toLocaleDateString()}</span>
                  </p>
                </div>
              </div>
            )}
        </div>
      ))}
    </>
  );
}
