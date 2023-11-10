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
  const musico = 'Músico(s) para evento';
  const docente = 'Clases de música';
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
          className="cursor-pointer flex flex-col gap-4 p-6 rounded-lg drop-shadow-lg bg-white m-4"
          onClick={() => handleCardClick(entry)}
        >
          {/**Header */}
          <div className="flex flex-row gap-4 items-center">
            {/**Datos del creador de la convocatoria */}
            <Image
              className="h-14 w-14 rounded-full"
              src={entry.User?.image || '/avatar.jpg'}
              width={100}
              height={100}
              alt="Logo"
            />
            <div>
              <p className="text-base font-medium text-black">
                {entry.User?.name}
              </p>
              <p className="text-sm font-light text-gray-500">
                Requiere: {entry.callingType}
              </p>
              <p className="text-sm font-light text-gray-500">
                Fecha límite: {entry.deadlineAt.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/**Drop down menu */}
          <div className="cursor-pointer flex flex-row items-center justify-between border-t border-gray-200 pt-1">
            <p className="text-base font-medium text-gray-700">
              Detalles adicionales
            </p>
            <svg
              viewBox="0 0 320 512"
              className={`h-4 w-4 cursor-pointer focus:outline-none ${
                expandedStates[index] ? 'fill-pink-500' : 'fill-sky-500'
              }`}
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

          {/**Detalles adicionales*/}
          {entry.callingType === musico && expandedStates[index] && (
            <div className="flex flex-col gap-4 items-center">
              {/**Ícono de header*/}
              <svg viewBox="0 0 512 512" className="h-10 w-10 fill-sky-500 p-2">
                <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
              {/**Header*/}
              <h1 className="text-base font-medium text-black">
                Datos del evento
              </h1>
              {/**body */}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
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
              {/**Header*/}
              <h1 className="text-base font-medium text-black">
                Datos del servicio
              </h1>
              {/**Body*/}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
                <p>Duración del servicio: {entry.serviceLength}</p>
                <p>
                  Dispone de equipo de sonido:{' '}
                  {(entry.hasSoundEquipment == true && <span>Si</span>) ||
                    (entry.hasSoundEquipment == false && <span>No</span>)}
                </p>
                <p>Tipo de músico requerido: {entry.musicianRequired}</p>
              </div>
              {/**Header */}
              <p className="text-base font-medium text-black">
                Datos de postulación
              </p>
              {/**Body */}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
                <p>
                  Fecha límite de postulación:{' '}
                  <span>{entry.deadlineAt.toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
          {/**Caso se convocatoria de docente */}
          {entry.callingType === docente && expandedStates[index] && (
            <div className="flex flex-col gap-2 items-center">
              {/**Ícono de header*/}
              <svg viewBox="0 0 512 512" className="h-10 w-10 fill-sky-500 p-2">
                <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
              </svg>
              {/**Header*/}
              <h1 className="text-base font-medium text-black">
                Datos del servicio
              </h1>
              {/**Body */}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
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
              {/**Header */}
              <h1 className="text-base font-medium text-black">
                Datos del estudiante
              </h1>
              {/**Body */}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
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
              {/**Header */}
              <p className="text-base font-medium text-black">
                Datos de postulación
              </p>
              {/**Body */}
              <div className="flex flex-col items-center text-sm font-light text-gray-700">
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
