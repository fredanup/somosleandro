import { useEffect, type FormEvent, useState } from 'react';
import { trpc } from 'utils/trpc';
import CommitButton from 'pages/utilities/commitButton';
import { useSession } from 'next-auth/react';

export default function UserData({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  //Limpieza e inicialización de campos
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const { data: session } = useSession();
  const userData = trpc.user.findCurrentOne.useQuery();
  const editUser = trpc.user.updateUser.useMutation();

  useEffect(() => {
    setName(userData.data?.name as string);
    setLastName(userData.data?.lastName as string);
    setPhone(userData.data?.phone as string);
    //setAddress(userData.data?.address);

    // setAccount(userData.data?.acc as string);
  }, [userData.data?.lastName, userData.data?.name, userData.data?.phone]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = {
      name: name,
      lastName: lastName,
      phone: phone,
      address: address,
    };

    editUser.mutate({
      ...userData,
    });

    onClose();
  };

  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';

  if (!isOpen || session == null) {
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
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-medium text-black">
                Actualizar datos
              </h1>
              <p className="text-justify text-base font-light text-gray-500">
                Complete cada uno de los campos presentados a continuación:
              </p>
              {/**CUERPO 1*/}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-900">Nombres:</p>
                <input
                  type="text"
                  className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </div>

              {/**CUERPO 2*/}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-900">Apellidos:</p>
                <input
                  type="text"
                  className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-900">Teléfono:</p>
                <input
                  type="text"
                  className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                />
              </div>
              {/**CUERPO 3*/}
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-slate-900">Dirección:</p>
                <input
                  type="text"
                  className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
              <button
                type="button"
                className="rounded-lg border bg-gray-500 px-4 py-1 text-base font-medium text-white"
                onClick={onClose}
              >
                Cancelar
              </button>
              <CommitButton />
            </div>
          </form>
        </div>
      )}
    </>
  );
}
