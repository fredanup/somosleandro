import { type ChangeEvent, useState } from 'react';
import type { ApplicantRoomType } from 'server/routers/room';
import PaymentDetails from './paymentDetails';

export default function Payment({
  isOpen,
  onClose,
  selectedRoom,
}: {
  isOpen: boolean;
  selectedRoom: ApplicantRoomType | null;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState('');
  const [isCommit, setCommit] = useState(false);

  const commission = 0.06;
  const igv = 0.18;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Validar que solo se ingresen números
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const confirmPayment = () => {
    if (totalAmount > 0) {
      setCommit(true);
    }
  };
  /*
  const cancelPayment = () => {
    setCommit(false);
  };*/
  // Calcular el monto total con la comisión
  const totalAmount = Number(amount) * (1 + igv + commission);

  if (!selectedRoom || !isOpen) {
    return null; // No renderizar el modal si no está abierto
  }
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full bg-gray-800 opacity-60 z-20'
    : 'hidden';
  return (
    <>
      <div>
        {/* Fondo borroso y no interactivo */}
        <div className={overlayClassName}></div>
        <div className="absolute top-1/2 left-1/2 z-30 w-11/12 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 rounded-lg bg-white p-6 drop-shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <h1 className="mb-2 text-base text-xl font-bold text-gray-700">
                Monto a pagar
              </h1>
              <svg
                viewBox="0 0 512 512"
                className="ml-auto h-4 w-4 cursor-pointer items-center justify-center fill-gray-600"
                onClick={onClose}
              >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z" />
              </svg>
            </div>

            <p className="text-base font-normal text-gray-500">
              Ingrese el monto a pagar por el servicio
            </p>

            {/* Header y cuerpo de datos de convocatoria */}
            {/* HEADER 1 */}
            <div className="flex flex-row items-center">
              <svg viewBox="0 0 512 512" className="h-6 w-6 fill-sky-500">
                <path d="M160 0c17.7 0 32 14.3 32 32V67.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.1c-.4-.1-.9-.1-1.3-.2l-.2 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11V32c0-17.7 14.3-32 32-32z" />
              </svg>
              <input
                type="text"
                className="focus:shadow-outline my-6 w-full appearance-none rounded-lg border px-2 py-1 text-right leading-tight text-gray-700 shadow focus:outline-none"
                value={amount}
                onChange={handleChange}
              />
            </div>
            <div className="flex w-full flex-row">
              <p>Servicio: </p>
              <p className="ml-auto text-right">
                {selectedRoom.Calling.callingType}
              </p>
            </div>
            <div className="flex w-full flex-row">
              <p>Músico contratado: </p>
              <p className="ml-auto text-right">
                {selectedRoom.Applicant.name} {selectedRoom.Applicant.lastName}
              </p>
            </div>

            <div className="flex w-full flex-row">
              <p>Comisión (6%): </p>
              <p className="ml-auto text-right">
                S./{(commission * Number(amount)).toFixed(2)}
              </p>
            </div>
            <div className="flex w-full flex-row">
              <p>IGV (18%): </p>
              <p className="ml-auto text-right">
                S./{(igv * Number(amount)).toFixed(2)}
              </p>
            </div>
            <div className="flex w-full flex-row">
              <p>Monto total: </p>
              <p className="ml-auto text-right">S/.{totalAmount.toFixed(2)}</p>
            </div>
            <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
              <button
                type="button"
                className="rounded-lg bg-gray-500 px-4 py-1 text-base font-medium text-white"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                onClick={confirmPayment}
                className="rounded-lg bg-sky-500 px-4 py-1 text-base font-medium text-white"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
        {isCommit && (
          <PaymentDetails totalAmount={totalAmount} onClose={onClose} />
        )}
      </div>
    </>
  );
}
