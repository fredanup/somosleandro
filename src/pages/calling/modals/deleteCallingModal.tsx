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

  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
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
            className="absolute left-1/2 top-1/2 z-20 w-11/12 -translate-x-1/2 -translate-y-1/2 transform flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg"
          >
            {/**Header y botón de cierre */}
            <div className="flex flex-row gap-4">
              <svg className="h-16 w-16 fill-red-500" viewBox="0 0 512 512">
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
              </svg>

              <div className="flex flex-col gap-2">
                <h1 className="text-black text-base font-semibold">
                  Eliminar convocatoria
                </h1>
                <p className="text-sm font-light text-gray-500 text-justify">
                  ¿Esta seguro de eliminar el registro seleccionado? Todos los
                  datos y las conversaciones de esta convocatoria serán
                  removidos permamente del servidor. Esta acción no se puede
                  deshacer.
                </p>
                <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
                  <button
                    type="button"
                    className="rounded-lg border bg-gray-500 px-4 py-1 text-base font-medium text-white"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg border bg-red-500 px-4 py-1 text-base font-medium text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
