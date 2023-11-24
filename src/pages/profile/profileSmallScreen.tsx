import { useSession } from 'next-auth/react';
import Image from 'next/image';
import DocumentSmallScreen from './document/documentSmallScreen';
import VideoSmallScreen from './video/videoSmallScreen';
import Rating from './rating/rating';
import Spinner from 'pages/utilities/spinner';

const ProfileSmallScreen = () => {
  const { data: session, status } = useSession();

  //Se obtiene la sesión de la base de datos si es que la hay y mientras se muestra un spinner
  if (status === 'loading') {
    // Se muestra el spinner mientra se verifica el estado de autenticación
    return <Spinner text="Cargando sesión" />;
  }
  return (
    <div>
      <div className="flex flex-col gap-4 p-6">
        {/*Foto y datos personales*/}
        <div className="flex flex-col items-center p-9">
          <Image
            className="rounded-full"
            src={session?.user?.image || ''}
            width={95}
            height={100}
            alt="Logo"
          />
          <p className="text-m text-base font-medium text-gray-700">
            {session?.user?.name}
          </p>
          <p className="text-sm font-normal text-gray-500">
            {session?.user?.email}
          </p>
        </div>
        {/*Documentos*/}
        <DocumentSmallScreen userId={session?.user?.id ?? ''} />
        {/*Vídeo*/}
        <VideoSmallScreen userId={session?.user?.id ?? ''} />
        {/**Calificaciones */}
        <Rating />
      </div>
    </div>
  );
};

export default ProfileSmallScreen;
