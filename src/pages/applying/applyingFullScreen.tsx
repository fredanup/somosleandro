import Image from 'next/image';
import { type IUserCalling } from '../../utils/auth';
import { trpc } from 'utils/trpc';
import { useState, type FormEvent, useEffect } from 'react';

export default function ApplyingFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  const utils = trpc.useContext();
  const [userId, setUserId] = useState('');
  const [callingId, setCallingId] = useState('');
  const userData = trpc.user.findOne.useQuery(userId);
  const [isApplied, setIsApplied] = useState(false);
  const myAppliantsByCalling =
    trpc.applicantRoom.getMyApplicantsByCalling.useQuery({
      callingId,
    });

  const createApplicant = trpc.applicantRoom.createApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
      setIsApplied(true);
    },
  });
  const deleteStakeholder = trpc.applicantRoom.deleteApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
      setIsApplied(false);
    },
  });

  useEffect(() => {
    if (selectedCard) {
      setUserId(selectedCard.User.id);
      setCallingId(selectedCard.id);

      // Verifica si se obtuvieron datos de la consulta
      if (myAppliantsByCalling.data?.length) {
        setIsApplied(true); // Usuario no postulado
      } else {
        setIsApplied(false); // Usuario postulado
      }
    }
  }, [selectedCard, myAppliantsByCalling.data]);

  if (!selectedCard) {
    return (
      <div className="flex h-full w-full flex-row gap-2 bg-slate-100">
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-white drop-shadow-lg">
          <p className="text-center text-lg font-black text-black">
            Ud. debe seleccionar una convocatoria
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isApplied) {
      // Usuario ya ha postulado, realizar acción para cancelar
      deleteStakeholder.mutate({ callingId: selectedCard.id });
      setIsApplied(false);
    } else {
      // Usuario no postulado, realizar acción para postular
      const stakeholderData = {
        callingId: selectedCard.id,
      };
      createApplicant.mutate(stakeholderData);
      setIsApplied(true);
    }
  };

  return (
    <>
      <form
        className="flex h-full w-full flex-row gap-2 bg-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="w-full rounded-lg bg-white drop-shadow-lg">
          {/**Header */}
          <div className="flex w-full flex-row bg-green-400 px-4 py-2">
            <h1 className="text-xl font-semibold text-white">
              Perfil del solicitante
            </h1>
          </div>
          {/**Body */}
          <div className="p-6">
            <div className="flex flex-row gap-6">
              {/**User profile */}
              <div className="h-48 w-48 rounded-lg bg-white p-2 drop-shadow-lg ">
                <Image
                  className="m-auto mb-4 items-center justify-center rounded-full"
                  src={selectedCard.User.image || '/avatar.jpg'}
                  width={100}
                  height={100}
                  alt="Logo"
                />
                <p className="text-m mt-2 text-center text-base font-medium text-gray-700">
                  {selectedCard.User.name}
                </p>
                <p className="text-center text-sm font-normal text-gray-500">
                  {selectedCard.User.email}
                </p>
              </div>
              {/**User details */}
              <div>
                <div className="flex flex-row gap-4">
                  <h1 className="text-xl font-medium text-black">
                    Datos del cliente
                  </h1>
                  <button
                    className={`${
                      isApplied
                        ? 'rounded-full bg-slate-400 px-3 text-center text-sm text-white '
                        : 'rounded-full bg-slate-600 px-3 text-center text-sm text-white hover:bg-slate-500 active:bg-slate-400'
                    }`}
                    type="submit"
                  >
                    {isApplied ? 'Cancelar' : 'Postular'}
                  </button>
                </div>

                <div className="mt-4 text-base font-normal text-gray-500">
                  <p>
                    Datos: {userData.data?.name} {userData.data?.lastName}
                  </p>
                  <p>Correo: {userData.data?.email}</p>
                  <p>Dni: -----</p>
                  <p>Teléfono: {userData.data?.phone}</p>
                  <p>Dirección: {userData.data?.address}</p>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h1 className="text-xl font-medium text-black">
                Requiere: {selectedCard.callingType}
              </h1>
              {/**Descripción caso de convocatoria de música */}
              {selectedCard.callingType === 'Músico(s) para evento' && (
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
                      Tipo de evento: <span>{selectedCard.eventType}</span>
                    </p>
                    <p>
                      Fecha del evento:{' '}
                      <span>
                        {selectedCard.eventDate?.toLocaleDateString()}
                      </span>
                    </p>
                    <p>
                      Lugar del evento: <span>{selectedCard.eventAddress}</span>
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
                    <p>Duración del servicio: {selectedCard.serviceLength}</p>
                    <p>
                      Dispone de equipo de sonido:{' '}
                      {(selectedCard.hasSoundEquipment == true && (
                        <span>Si</span>
                      )) ||
                        (selectedCard.hasSoundEquipment == false && (
                          <span>No</span>
                        ))}
                    </p>
                    <p>
                      Tipo de músico requerido: {selectedCard.musicianRequired}
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
                        {selectedCard.deadlineAt.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
              {/**Caso se convocatoria de docente */}
              {selectedCard.callingType === 'Clases de música' && (
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
                      {(selectedCard.atHome == true && <span>Si</span>) ||
                        (selectedCard.atHome == false && <span>No</span>)}
                    </p>
                    <p>
                      Duración del servicio:{' '}
                      <span>{selectedCard.contractTime}</span>
                    </p>
                    <p>
                      Horario disponible:{' '}
                      <span>{selectedCard.availableSchedule}</span>
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
                      <span>{selectedCard.instrumentLiked}</span>
                    </p>
                    <p>
                      Cuenta con instrumento:{' '}
                      {(selectedCard.hasInstrument == true && (
                        <span>Si</span>
                      )) ||
                        (selectedCard.hasInstrument == false && (
                          <span>No</span>
                        ))}
                    </p>
                    <p>
                      Edad del estudiante:{' '}
                      {(selectedCard.hasSoundEquipment == true && (
                        <span>Si</span>
                      )) ||
                        (selectedCard.hasSoundEquipment == false && (
                          <span>No</span>
                        ))}
                    </p>
                    <p>Repertorio de interés: {selectedCard.repertoireLiked}</p>
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
                        {selectedCard.deadlineAt.toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
