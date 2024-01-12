import Image from 'next/image';
import { type IUserCalling } from '../../utils/auth';
import { trpc } from 'utils/trpc';
import { useState, useEffect } from 'react';
import Warning from 'pages/utilities/warning';
import Header from 'pages/utilities/header';
import MusicianDetailedCard from 'pages/utilities/musicianDetailedCard  ';
import TeacherDetailedCard from 'pages/utilities/teacherDetailedCard';

export default function ApplyingFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  const [userId, setUserId] = useState('');
  const [callingId, setCallingId] = useState('');
  const userData = trpc.user.findOne.useQuery(userId);
  const myAppliantsByCalling =
    trpc.applicantRoom.getMyApplicantsByCalling.useQuery({
      callingId,
    });

  useEffect(() => {
    if (selectedCard) {
      setUserId(selectedCard.User.id);
      setCallingId(selectedCard.id);
    }
  }, [selectedCard, myAppliantsByCalling.data]);

  if (!selectedCard) {
    return <Warning text="Ud. debe seleccionar una convocatoria" />;
  }

  return (
    <>
      <div className="flex flex-col h-full w-full rounded-lg drop-shadow-lg">
        {/**Header */}
        <Header
          text="Perfil del cliente"
          valueCarrier={() => null}
          visible={false}
        />
        {/**Body */}
        <div className="flex flex-col gap-4 p-6 h-full grow overflow-auto rounded-b-lg bg-white">
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
    </>
  );
}
