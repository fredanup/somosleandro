import { useEffect, useState } from 'react';
import ChooseCallingModal from './modals/chooseCallingModal';
import { type IEditCalling, type IUserCalling } from '../../utils/auth';
import DeleteCallingModal from './modals/deleteCallingModal';
import TeachingCallingModal from './modals/teachingCallingModal';
import EventCallingModal from './modals/eventCallingModal';
import { trpc } from 'utils/trpc';
import Message from 'pages/utilities/message';

export default function CallingSmallScreen({
  onCardSelect,
}: {
  onCardSelect: (data: IUserCalling) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

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
  //Constantes para la comparación con registros de la base de datos
  const musico = 'Músico(s) para evento';
  const docente = 'Clases de música';
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

  if (isLoading) {
    return <div>Fetching callings...</div>;
  }

  const handleCardClick = (data: IUserCalling) => {
    onCardSelect(data);
  };

  if (!userCallings || userCallings.length === 0) {
    return (
      <Message
        text={
          'Ups, parece que usted no ha creado ninguna convocatoria. Pulse el botón (+)'
        }
      />
    );
  }

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

      {userCallings?.map((entry, index) => (
        <div
          key={index}
          className="cursor-pointer flex flex-col gap-4 p-6 rounded-lg drop-shadow-lg bg-white m-4"
          onClick={() => handleCardClick(entry)}
        >
          {/**Header */}
          <div className="flex flex-row justify-between">
            <p className="text-base font-medium text-black">
              Solicitas: {entry.callingType}
            </p>
            {/**Opciones de edición*/}
            <div className="flex flex-row gap-2">
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
              <svg
                className="h-4 w-4 cursor-pointer focus:outline-none fill-gray-500"
                viewBox="0 0 576 512"
              >
                <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
              </svg>

              <p className="text-gray-500 text-sm font-medium">Postulantes</p>
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
          {entry.callingType === musico && expandedStates[index] && (
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
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500 p-2">
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
                  <span>{entry.deadlineAt.toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
          {/**Caso se convocatoria de docente */}
          {entry.callingType === docente && expandedStates[index] && (
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
                  <span>{entry.deadlineAt.toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
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
