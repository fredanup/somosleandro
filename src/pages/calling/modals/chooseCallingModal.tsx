import { useState } from 'react';
import EventCallingModal from './eventCallingModal';
import TeachingCallingModal from './teachingCallingModal';

export default function ChooseCallingModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  //Hooks de estado que controlan la apertura de los modales 1 y 2
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);

  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';
  //Función de apertura del modal 1
  const openModal1 = () => {
    setIsModal1Open(true);
  };
  //Función de cierre del modal 1
  const closeModal1 = () => {
    setIsModal1Open(false);
  };
  //Función de apertura del modal 2
  const openModal2 = () => {
    setIsModal2Open(true);
  };
  //Función de cierre del modal 2
  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  return (
    <>
      {isOpen && (
        <div>
          {/* Fondo borroso y no interactivo */}
          <div className={overlayClassName}></div>
          <div className="absolute left-1/2 top-1/2 z-20 w-11/12 -translate-x-1/2 -translate-y-1/2 transform flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
            {/**Header y botón de cierre */}
            <div className="flex flex-row gap-2 items-center justify-between">
              <h1 className="text-black text-lg font-semibold">
                Tipo de convocatoria
              </h1>
              <svg
                viewBox="0 0 512 512"
                className="h-4 w-4 cursor-pointer fill-gray-600"
                onClick={onClose}
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
            </div>
            {/**Text */}
            <p className="text-base font-normal text-gray-500">
              Seleccione el servicio requerido:
            </p>
            {/**Header 1. Card de clases de música*/}
            <div
              className="flex flex-row cursor-pointer gap-4 rounded-lg items-center bg-white p-4 drop-shadow-lg"
              onClick={openModal1}
            >
              <div>
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500">
                  <path d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 384V352h16V480c0 17.7 14.3 32 32 32s32-14.3 32-32V192h56 64 16c17.7 0 32-14.3 32-32s-14.3-32-32-32H384V64H576V256H384V224H320v48c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48v80H243.1 177.1c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9V480c0 17.7 14.3 32 32 32s32-14.3 32-32z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <p className="text-lg font-medium text-black">
                  Clases de música
                </p>
                <p className="text-sm font-light text-gray-400">
                  Solicitar la enseñanza de un instrumento musical
                </p>
              </div>
            </div>
            {/**Header 2. Card de músico para evento*/}
            <div
              className="flex flex-row cursor-pointer gap-4 rounded-lg items-center bg-white p-4 drop-shadow-lg"
              onClick={openModal2}
            >
              <div>
                <svg viewBox="0 0 512 512" className="h-8 w-8 fill-sky-500">
                  <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
              </div>

              <div className="flex flex-col">
                <p className="text-lg font-medium text-black">
                  Músico(s) para evento
                </p>
                <p className="text-sm font-light text-gray-400">
                  Solicitar los servicios de un músico(s) para un evento
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {isModal1Open && (
        <TeachingCallingModal
          isOpen={isModal1Open}
          onClose={closeModal1}
          onCloseModal={onClose}
          selectedCalling={null}
        />
      )}

      {isModal2Open && (
        <EventCallingModal
          isOpen={isModal2Open}
          onClose={closeModal2}
          onCloseModal={onClose}
          selectedCalling={null}
        />
      )}
    </>
  );
}
