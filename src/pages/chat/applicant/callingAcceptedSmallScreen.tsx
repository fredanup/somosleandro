import { useEffect, useState } from 'react';
import Image from 'next/image';
import { trpc } from 'utils/trpc';
import type { ApplicantRoomType } from 'server/routers/room';

export default function CallingAcceptedSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: ApplicantRoomType | null) => void;
}) {
  //Obtener los registros de bd
  const { data: userApplicationsAccepted, isLoading } =
    trpc.applicantRoom.getUserApplicationsAccepted.useQuery();
  //Control de expansión de llave angular
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);

  useEffect(() => {
    // Si es que hay registros en bd, establecer tamaño de arreglo y dar el valor de false a cada registro
    if (userApplicationsAccepted) {
      setExpandedStates(Array(userApplicationsAccepted.length).fill(false));
    }
  }, [userApplicationsAccepted]);

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
    return <div>Fetching callings...</div>;
  }

  const handleCardClick = (data: ApplicantRoomType | null) => {
    onCardSelect(data);
  };

  return (
    <>
      {!userApplicationsAccepted || userApplicationsAccepted.length === 0 ? (
        <div className="flex flex-row gap-4 m-6">
          <svg className="h-6 fill-gray-400" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>

          <p className="text-slate-500">
            Que mala suerte, aún nadie te ha elegido, pero sigue postulando
          </p>
        </div>
      ) : (
        userApplicationsAccepted?.map((entry, index) => (
          <div
            key={index}
            className="mb-1 cursor-pointer border-b-2 border-gray-200"
            onClick={() => handleCardClick(entry)}
          >
            {/**Encabezado de la card */}
            <div className="mb-4 flex pt-4">
              {/**Datos del creador de la convocatoria */}
              <div className="flex items-center">
                <Image
                  className="ml-4 mr-2 rounded-full"
                  src={entry.Calling.User.image || '/avatar.jpg'}
                  width={55}
                  height={100}
                  alt="Logo"
                />
                <div>
                  <p className="text-base font-medium text-black">
                    {entry.Calling.User.name}
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    {entry.Calling.User.email}
                  </p>
                </div>
              </div>
            </div>
            {/**Resumen de la convocatoria */}
            <div className="pb-2">
              <div className="flex">
                {/**Items listados */}
                <div className="ml-4 mr-4 md:mr-1">
                  <p className="text-sm font-normal text-gray-500">
                    Postulantes:
                    <span className="ml-2 text-sm font-medium text-black">
                      4/{entry.Calling.applicantNumber}
                    </span>
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    Estado:
                    {entry.Calling.callingTaken === true && <span>Tomada</span>}
                    {entry.Calling.callingTaken === false && (
                      <span>Vigente</span>
                    )}
                  </p>
                </div>
                {/**Ítem de caja y texto de nuevos postulantes */}
                <div className="flex items-center">
                  <div className="relative h-full w-16 justify-center">
                    <p className="absolute left-2 rounded-full bg-red-500 p-0.5 text-center text-xs text-white">
                      +2
                    </p>
                    <svg
                      viewBox="0 0 640 512"
                      className="absolute left-1 top-4 h-8 w-8 cursor-pointer fill-gray-500"
                    >
                      <path d="M58.9 42.1c3-6.1 9.6-9.6 16.3-8.7L320 64 564.8 33.4c6.7-.8 13.3 2.7 16.3 8.7l41.7 83.4c9 17.9-.6 39.6-19.8 45.1L439.6 217.3c-13.9 4-28.8-1.9-36.2-14.3L320 64 236.6 203c-7.4 12.4-22.3 18.3-36.2 14.3L37.1 170.6c-19.3-5.5-28.8-27.2-19.8-45.1L58.9 42.1zM321.1 128l54.9 91.4c14.9 24.8 44.6 36.6 72.5 28.6L576 211.6v167c0 22-15 41.2-36.4 46.6l-204.1 51c-10.2 2.6-20.9 2.6-31 0l-204.1-51C79 419.7 64 400.5 64 378.5v-167L191.6 248c27.8 8 57.6-3.8 72.5-28.6L318.9 128h2.2z" />
                    </svg>
                  </div>
                  <p className="w-full text-xs font-medium text-black">
                    ¡Tienes 2 nuevos postulantes!
                  </p>
                </div>
              </div>
            </div>
            {/**Drop down menu */}
            <div className="flex cursor-pointer items-center border-t-2 border-gray-200">
              <p className="ml-4 text-base font-bold text-gray-600">
                Requiere: {entry.Calling.callingType}
              </p>

              <svg
                viewBox="0 0 320 512"
                className="ml-auto h-8 w-8 cursor-pointer items-center justify-center fill-gray-500 p-2 focus:outline-none"
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
            {entry.Calling.callingType === 'Músico(s) para evento' &&
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
                      Tipo de evento: <span>{entry.Calling.eventType}</span>
                    </p>
                    <p>
                      Fecha del evento:{' '}
                      <span>
                        {entry.Calling.eventDate?.toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      Lugar del evento:{' '}
                      <span>{entry.Calling.eventAddress}</span>
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
                      <span>
                        {entry.Calling.deadlineAt.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            {/**Caso se convocatoria de docente */}
            {entry.Calling.callingType === 'Clases de música' &&
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
                      Instrumento deseado:{' '}
                      <span>{entry.Calling.instrumentLiked}</span>
                    </p>
                    <p>
                      Cuenta con instrumento:{' '}
                      {(entry.Calling.hasInstrument == true && (
                        <span>Si</span>
                      )) ||
                        (entry.Calling.hasInstrument == false && (
                          <span>No</span>
                        ))}
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
                    <p>
                      Repertorio de interés: {entry.Calling.repertoireLiked}
                    </p>
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
                      <span>
                        {entry.Calling.deadlineAt.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
          </div>
        ))
      )}
    </>
  );
}
