import { useSession } from "next-auth/react";
import DocumentFullScreen from "./document/documentFullScreen";
import User from "./user/user";
import VideoFullScreen from "./video/videoFullScreen";

const ProfileFullScreen = () => {
  const { data: session } = useSession();
  return (
    <>
      {/*Contenedor principal para dispositivos de pantalla grande, es relative para que el modal sea absolute*/}
      <div className="relative h-full w-full overflow-auto bg-white p-6 drop-shadow-lg">
        {/*Encabezado */}
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-900">
            ¡Actualice sus datos!
          </h2>
          <svg
            height="1em"
            viewBox="0 0 384 512"
            className="md:flex md:h-8 md:w-8 md:cursor-pointer md:items-center md:justify-center md:rounded-lg md:bg-white md:p-2 md:drop-shadow-lg"
          >
            <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zm-40 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
          </svg>
        </div>
        {/*Formulario de datos del usuario */}
        <User />
        {/*Documentos*/}
        <DocumentFullScreen userId={session?.user?.id as string} />
        {/*Vídeos*/}
        <VideoFullScreen userId={session?.user?.id as string} />
      </div>
    </>
  );
};

export default ProfileFullScreen;
