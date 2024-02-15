import { useSession } from 'next-auth/react';
import DocumentFullScreen from './document/documentFullScreen';
import User from './user/user';
import VideoFullScreen from './video/videoFullScreen';
import Header from 'pages/utilities/header';

const ProfileFullScreen = () => {
  const { data: session } = useSession();
  return (
    <>
      {/*Contenedor principal para dispositivos de pantalla grande, es relative para que el modal sea absolute*/}
      <div className="relative h-full w-full flex flex-col overflow-auto rounded-lg bg-white drop-shadow-lg">
        {/**Header */}
        <Header
          text="Tu perfil"
          valueCarrier={() => null}
          arrowVisible={false}
        />
        <div className="flex flex-col gap-4 p-6">
          <h2 className="mr-auto text-xl font-medium text-slate-900">
            ¡Actualice sus datos!
          </h2>
          {/*Formulario de datos del usuario */}
          <User />
          {/*Documentos*/}
          <DocumentFullScreen userId={session?.user?.id ?? ''} />
          {/*Vídeos*/}
          <VideoFullScreen userId={session?.user?.id ?? ''} />
        </div>
      </div>
    </>
  );
};

export default ProfileFullScreen;
