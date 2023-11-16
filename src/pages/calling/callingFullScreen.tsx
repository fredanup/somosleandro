import Image from 'next/image';
import DocumentSmallScreen from '../profile/document/documentSmallScreen';
import VideoSmallScreen from '../profile/video/videoSmallScreen';
import Rating from '../profile/rating/rating';
import { type IUserCalling } from '../../utils/auth';
import { trpc } from 'utils/trpc';
import { useEffect, useState } from 'react';
import { type ApplicantRoomType } from 'server/routers/room';

export default function CallingFullScreen({
  selectedCard,
}: {
  selectedCard: IUserCalling | null;
}) {
  /**
   * Declaraciones de hooks de estado
   */
  const [notification, setNotification] = useState('');
  const [callingId, setCallingId] = useState('');
  const [applicantChosen, setAppliantChosen] =
    useState<ApplicantRoomType | null>(null);
  const [applicants, setApplicants] = useState<ApplicantRoomType[] | null>([]);

  /**
   * Consultas a base de datos
   */
  const utils = trpc.useContext();
  const applicantChange = trpc.applicantRoom.applicantChange.useMutation();
  const applicantsQuery = trpc.applicantRoom.getApplicantsByCalling.useQuery({
    callingId: callingId,
  });
  const acceptApplicant = trpc.applicantRoom.acceptApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
      await utils.user.findMany.invalidate();
    },
  });
  const rejectApplicant = trpc.applicantRoom.rejectApplicant.useMutation({
    onSettled: async () => {
      await utils.applicantRoom.getApplicantsByCalling.invalidate();
    },
  });

  /**
   * Hook de efecto inicial
   */
  useEffect(() => {
    if (selectedCard) {
      // Verifica si se obtuvieron datos de la consulta
      setNotification('No tiene a ningún postulante en esta convocatoria.');
      setCallingId(selectedCard.id);
      if (applicantsQuery.data?.length) {
        setApplicants(applicantsQuery.data);
        applicantChange.mutate();
        setNotification(''); // Limpia la notificación si hay datos
      }
    } else {
      setNotification('No ha seleccionado ninguna card.');
    }
  }, [selectedCard, applicantsQuery.data]);

  function rejectAppliantStatus(appliantId: string) {
    rejectApplicant.mutate({
      id: appliantId,
    });
  }

  function acceptAppliantStatus(appliantId: string) {
    acceptApplicant.mutate({
      id: appliantId,
    });
  }

  //Retorna a los usuarios de la sala especificada y llena la variable users con los datos obtenidos
  trpc.applicantRoom.onApplicantChange.useSubscription(undefined, {
    onData(data) {
      const filteredData = data.filter((item) => item.callingId === callingId);
      setApplicants(filteredData);
    },
    onError(err) {
      console.error('Subscription error:', err);
    },
  });

  return (
    <>
      {/**Contenedor general */}
      <div className="flex flex-row h-full w-full gap-2">
        {/**Contenedor de postulantes */}
        <div className="flex flex-col w-1/3 rounded-lg ">
          {/**Header */}
          <div className="bg-sky-950 rounded-t-lg flex flex-row items-center justify-between px-6 py-1.5">
            <p className="text-white text-lg font-semibold">Postulantes</p>
            <Image
              className="h-10 w-10 drop-shadow-lg rounded-lg bg-white p-1.5"
              src="/icons/Logo.svg"
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          {/**Body */}
          <div className="grow overflow-auto rounded-b-lg bg-white">
            {selectedCard ? (
              applicants !== null && applicants.length > 0 ? (
                applicants?.map((entry, index) => (
                  //Card de postulante
                  <div
                    className={`flex w-full cursor-pointer flex-row items-center gap-2 border-b-2 border-gray-100 p-2 ${
                      entry.applyStatus === 'accepted' ? 'bg-green-200' : ''
                    }`} // Aplicar la clase si la tarjeta está aprobada
                    key={index}
                    onClick={() => setAppliantChosen(entry)}
                  >
                    <Image
                      className="h-8 w-8 rounded-full"
                      src={entry.Applicant.image || '/avatar.png'}
                      width={100}
                      height={100}
                      alt="Logo"
                    />
                    <div className="w-full">
                      <div className="mb-1 flex flex-row items-center gap-2">
                        <p className="text-xs font-medium text-black">
                          {entry.Applicant.name} {entry.Applicant.lastName}
                        </p>
                        <div className="ml-auto flex flex-row gap-2">
                          <svg
                            viewBox="0 0 512 512"
                            className={`h-6 w-6 cursor-pointer rounded-full bg-green-100 p-1.5 ${
                              entry.applyStatus === 'accepted'
                                ? 'hidden'
                                : 'block'
                            }`}
                            onClick={() => acceptAppliantStatus(entry.id)}
                          >
                            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                          </svg>
                          <svg
                            viewBox="0 0 512 512"
                            className="h-6 w-6 cursor-pointer rounded-full bg-red-100 p-1.5"
                            onClick={() => rejectAppliantStatus(entry.id)}
                          >
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                          </svg>
                        </div>
                      </div>
                      <p className="grow text-xs font-black text-gray-600">
                        {entry.createdAt.toISOString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center ">
                  <p className="text-center text-lg font-black text-gray-500">
                    {notification}
                  </p>
                </div>
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <p className="text-center text-lg font-black text-gray-500">
                  {notification}
                </p>
              </div>
            )}
          </div>
        </div>

        {/**Contenedor de visualización de perfil de estudiante */}
        <div className="flex h-full w-2/3 flex-col rounded-lg bg-white">
          {/**Header */}
          <div className="flex w-full flex-row rounded-t-lg bg-green-400 px-4 py-2">
            <h1 className="text-xl font-semibold text-white">
              Perfil de postulante
            </h1>
          </div>
          {applicantChosen !== null && (
            <div>
              {/*Foto y datos personales*/}
              <div className="pb-2">
                <Image
                  className="m-auto mt-4 rounded-full"
                  src={applicantChosen.Applicant.image || ''}
                  width={95}
                  height={100}
                  alt="Logo"
                />
                <p className="text-m mt-2 text-center text-base font-medium text-gray-700">
                  {applicantChosen.Applicant.name}
                </p>
                <p className="text-center text-sm font-normal text-gray-500">
                  {applicantChosen.Applicant.email}
                </p>
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
            <div className="flex h-full w-full flex-col items-center justify-center">
              <p className="text-center text-lg font-black text-gray-500">
                No ha seleccionado a ningún postulante
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
