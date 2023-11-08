import { type FormEvent, useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import { useSession } from 'next-auth/react';

export default function User() {
  //Limpieza e inicialización de campos
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // const [account, setAccount] = useState("");
  const { data: session, status } = useSession();

  const userData = trpc.user.findOne.useQuery(session?.user?.id ?? '');
  const editUser = trpc.user.updateUser.useMutation();

  useEffect(() => {
    if (userData !== null) {
      setName(userData.data?.name ?? '');
      setLastName(userData.data?.lastName ?? '');
      setPhone(userData.data?.phone ?? '');
      setAddress(userData.data?.address ?? '');
    }

    // setAccount(userData.data?.acc as string);
  }, [
    userData.data?.address,
    userData.data?.lastName,
    userData.data?.name,
    userData.data?.phone,
  ]);
  if (status === 'loading') {
    // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
    return <div className="text-center">Cargando...</div>;
  }

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
  };

  return (
    <form className="mt-6 grid grid-cols-3 gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-500">
          Nombres
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          type="text"
          placeholder="Nombres"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-500">
          Apellidos
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          type="text"
          placeholder="Apellidos"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-gray-500">
          Teléfono
        </label>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          placeholder="+51 984 256 245"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-500">
          Dirección
        </label>
        <input
          placeholder="Dirección"
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
        />
      </div>

      {/**
      <div>
        <label className="mb-2 block text-sm font-bold text-gray-500">
          Cuenta de depósito
        </label>
        <input
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          type="text"
          placeholder="Cuenta de depósito"
        />
      </div>
       */}
      <button
        type="submit"
        className="w-full rounded-full border bg-green-500 px-4 py-1 text-base font-semibold text-white"
      >
        Continuar
      </button>
    </form>
  );
}
