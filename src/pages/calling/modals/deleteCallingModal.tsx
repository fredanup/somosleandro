import { type FormEvent } from 'react';
import { type IEditCalling } from '../../../utils/auth';
import { trpc } from 'utils/trpc';

export default function DeleteCallingModal({
  isOpen,
  onClose,
  selectedCalling,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedCalling: IEditCalling | null;
}) {
  const utils = trpc.useContext();
  const deleteCalling = trpc.calling.deleteCalling.useMutation({
    onSettled: async () => {
      await utils.calling.getUserCallings.invalidate();
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedCalling !== null) {
      deleteCalling.mutate({ id: selectedCalling.id });
      onClose();
    }
  };

  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full bg-gray-800 opacity-60 z-20'
    : 'hidden';

  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  return (
    <>
      {isOpen && (
        <div>
          {/* Fondo borroso y no interactivo */}
          <div className={overlayClassName}></div>
          <form
            onSubmit={handleSubmit}
            className="absolute left-1/2 top-1/2 z-20 w-11/12 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 drop-shadow-lg"
          >
            <svg
              viewBox="0 0 512 512"
              className="ml-auto h-4 w-4 cursor-pointer items-center justify-center fill-black"
              onClick={onClose}
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
            </svg>

            <h1 className="mb-2 text-base text-xl font-bold text-gray-700">
              Ventana de confirmación
            </h1>
            <p className="mb-6 text-base font-normal text-gray-500">
              ¿Desea eliminar el registro seleccionado?
            </p>
            <div className="flex h-8 flex-row gap-4">
              <button className="w-full rounded-full bg-red-500 text-white">
                Eliminar
              </button>
              <button
                className="w-full rounded-full bg-gray-600 text-white"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
