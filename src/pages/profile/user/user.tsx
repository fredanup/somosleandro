import { trpc } from 'utils/trpc';
import { useSession } from 'next-auth/react';

export default function User() {
  const { data: session, status } = useSession();
  const userData = trpc.user.findOne.useQuery(session?.user?.id ?? '');

  if (status === 'loading') {
    // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="text-gray-500 text-base font-normal">
      <p>
        Datos: {userData.data?.name} {userData.data?.lastName}
      </p>
      <p>Correo: {userData.data?.email}</p>
      <p>Teléfono: {userData.data?.phone}</p>
      <p>Dirección: {userData.data?.address}</p>
    </div>
  );
}
