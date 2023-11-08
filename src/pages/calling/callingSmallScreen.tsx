import { useEffect, useState } from 'react';
import ChooseCallingModal from './modals/chooseCallingModal';
import { type IEditCalling, type IUserCalling } from '../../utils/auth';
import DeleteCallingModal from './modals/deleteCallingModal';
import TeachingCallingModal from './modals/teachingCallingModal';
import EventCallingModal from './modals/eventCallingModal';
import Image from 'next/image';
import { trpc } from 'utils/trpc';
import { useSession } from 'next-auth/react';

export default function CallingSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: IUserCalling) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  //Llamada a la sesión para obtener los datos del usuario
  const { data: session, status } = useSession();
  //Obtener los registros de bd
  const { data: userCallings, isLoading } =
    trpc.calling.getUserCallings.useQuery();
  //Control de expansión de llave angular
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  //Control de apertura de modal de edición
  const [editIsOpen, setEditIsOpen] = useState(false);
  //Control de apertura de modal de eliminación
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  //Selección de registro en interfaz
  const [selectedCalling, setSelectedCalling] = useState<IEditCalling | null>(
    null,
  );

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  //Apertura de modal y envío de datos del registro
  const openEditModal = (calling: IEditCalling) => {
    setSelectedCalling(calling);
    setEditIsOpen(true);
  };

  //Cierre de modal
  const closeEditModal = () => {
    setEditIsOpen(false);
  };

  //Apertura de modal y envío de datos del registro
  const openDeleteModal = (calling: IEditCalling) => {
    setSelectedCalling(calling);
    setDeleteIsOpen(true);
  };

  //Cierre de modal
  const closeDeleteModal = () => {
    setDeleteIsOpen(false);
  };

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

  if (status === 'loading') {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }

  if (isLoading) {
    return <div>Fetching callings...</div>;
  }

  const handleCardClick = (data: IUserCalling) => {
    onCardSelect(data);
  };

  return (
    <>
      {/**Encabezado
       * Botón para agregar nueva convocatoria
       */}
      <svg
        viewBox="0 0 512 512"
        className="absolute bottom-12 right-3 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-lg fill-sky-500 drop-shadow-lg md:bottom-6 md:w-auto"
        onClick={openModal}
      >
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
      </svg>

      {!userCallings || userCallings.length === 0 ? (
        <li className="m-6 text-slate-500">
          Usted no ha creado ninguna convocatoria
        </li>
      ) : (
        userCallings?.map((entry, index) => (
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
                  src={session?.user?.image || '/avatar.jpg'}
                  width={55}
                  height={100}
                  alt="Logo"
                />
                <div>
                  <p className="text-base font-medium text-black">
                    {session?.user?.name}
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    {session?.user?.email}
                  </p>
                </div>
              </div>

              {/**Opciones de edición la convocatoria */}
              <div className="ml-auto mr-2 flex h-8 items-center gap-2">
                {/**Este es el botón de edición */}
                <svg
                  viewBox="0 0 512 512"
                  className="h-4 w-4 cursor-pointer fill-sky-500"
                  onClick={() => openEditModal(entry)}
                >
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
                </svg>

                <svg
                  viewBox="0 0 512 512"
                  className="h-4 w-4 cursor-pointer fill-sky-500"
                  onClick={() => openDeleteModal(entry)}
                >
                  <path d="M163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3C140.6 6.8 151.7 0 163.8 0zM32 128H416L394.8 467c-1.6 25.3-22.6 45-47.9 45H101.1c-25.3 0-46.3-19.7-47.9-45L32 128zm192 64c-6.4 0-12.5 2.5-17 7l-80 80c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V408c0 13.3 10.7 24 24 24s24-10.7 24-24V273.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-4.5-4.5-10.6-7-17-7z" />
                </svg>
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
                      4/{entry.applicantNumber}
                    </span>
                  </p>
                  <p className="text-sm font-normal text-gray-500">
                    Estado:
                    {entry.callingTaken === true && <span>Tomada</span>}
                    {entry.callingTaken === false && <span>Vigente</span>}
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
                Requiere: {entry.callingType}
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
                    <p>
                      Edad del estudiante:{' '}
                      {(entry.hasSoundEquipment == true && <span>Si</span>) ||
                        (entry.hasSoundEquipment == false && <span>No</span>)}
                    </p>
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
        ))
      )}
      {editIsOpen &&
        selectedCalling?.callingType === 'Músico(s) para evento' && (
          <EventCallingModal
            isOpen={editIsOpen}
            onClose={closeEditModal}
            onCloseModal={closeEditModal}
            selectedCalling={selectedCalling}
          />
        )}

      {editIsOpen && selectedCalling?.callingType === 'Clases de música' && (
        <TeachingCallingModal
          isOpen={editIsOpen}
          onClose={closeEditModal}
          onCloseModal={closeEditModal}
          selectedCalling={selectedCalling}
        />
      )}

      {deleteIsOpen && (
        <DeleteCallingModal
          isOpen={deleteIsOpen}
          onClose={closeDeleteModal}
          selectedCalling={selectedCalling}
        />
      )}
      {/**Ventana modal que se abre cuando se hace clic en agregar */}
      <ChooseCallingModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
