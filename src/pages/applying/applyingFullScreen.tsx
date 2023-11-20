import Image from 'next/image';
import { type IUserCalling } from '../../utils/auth';
import { trpc } from 'utils/trpc';
import { useState, type FormEvent, useEffect } from 'react';
import Warning from 'pages/utilities/warning';
import Header from 'pages/utilities/header';
import MusicianDetailedCard from 'pages/utilities/musicianDetailedCard  ';
import TeacherDetailedCard from 'pages/utilities/teacherDetailedCard';

export default function ApplyingFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  const utils = trpc.useContext();
  const applicantChange = trpc.applicantRoom.applicantChange.useMutation();
  const [userId, setUserId] = useState('');
  const [callingId, setCallingId] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const userData = trpc.user.findOne.useQuery(userId);
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
    return <Warning text="Ud. debe seleccionar una convocatoria" />;
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
    //Emite el evento APPLICANT_CHANGE que llama a la suscripción onApplicantChange que devuelve a todas las salas de la convocatoria especificada en callingId
    applicantChange.mutate();
  };

  return (
    <>
      <form
        className="flex h-full w-full flex-row gap-2 bg-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="w-full rounded-lg bg-white drop-shadow-lg">
          {/**Header */}
          <Header text="Perfil del cliente" />
          {/**Body */}
          <div className="flex flex-col gap-4 p-6">
            {/**User profile */}
            <div className="flex flex-row gap-4">
              {/**User photo */}
              <div className="bg-white drop-shadow-lg rounded-lg p-4 flex flex-col justify-center">
                <Image
                  src={selectedCard.User.image || '/avatar.jpg'}
                  width={100}
                  height={100}
                  alt="Logo"
                />
              </div>
              {/**User details */}
              <div className="flex flex-col gap-4">
                {/**Header and button */}
                <div className="flex flex-row gap-4">
                  <h1 className="text-gray-950 text-lg font-semibold">
                    Datos del cliente
                  </h1>
                  <button
                    className={`flex flex-row gap-2 items-center rounded-lg drop-shadow-lg px-2 py-1 ${
                      isApplied
                        ? 'bg-gray-400'
                        : 'bg-sky-500 hover:bg-sky-400 active:bg-sky-300'
                    }`}
                    type="submit"
                  >
                    <svg
                      className="h-4 w-4 cursor-pointer focus:outline-none fill-white"
                      viewBox="0 0 576 512"
                    >
                      <path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" />
                    </svg>
                    <p className="text-white text-sm font-medium">
                      {isApplied ? 'Cancelar' : 'Postular'}
                    </p>
                  </button>
                </div>
                {/**Client data */}
                <div className="text-gray-500 text-base font-normal">
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
            {/**Datos de la convocatoria */}
            <div className="flex flex-col">
              <h1 className="text-gray-950 text-lg font-semibold">
                Requiere: {selectedCard.callingType}
              </h1>
              {/**Descripción caso de convocatoria de música */}
              {selectedCard.callingType === 'Músico(s) para evento' && (
                <MusicianDetailedCard entry={selectedCard} />
              )}
              {/**Caso se convocatoria de docente */}
              {selectedCard.callingType === 'Clases de música' && (
                <TeacherDetailedCard entry={selectedCard} />
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
