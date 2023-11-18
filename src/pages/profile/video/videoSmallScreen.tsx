import { useState } from 'react';
import { trpc } from 'utils/trpc';
import VideoSmallCard from './card/videoSmallCard';
import VideoModal from './modal/videoModal';
import { useSession } from 'next-auth/react';
import Spinner from 'pages/utilities/spinner';

export default function VideoSmallScreen({ userId }: { userId: string }) {
  /**
   * Declaraciones de hooks de estado
   */
  //Hook de estado que controla la apertura del modal de creación de documentos
  const [isOpen, setIsOpen] = useState(false);

  //Hook para la obtención de la sesión
  const { data: session, status } = useSession();

  /**
   * Consultas a base de datos
   */
  //Obtener los registros de bd
  const { data, isLoading } = trpc.video.getUserVideos.useQuery({ userId });

  /**
   * Funciones de apertura y cierre de modales
   */
  //Función de apertura del modal VideoModal
  const openModal = () => {
    setIsOpen(true);
  };
  //Función de cierre del modal VideoModal
  const closeModal = () => {
    setIsOpen(false);
  };

  if (status === 'loading') {
    return <Spinner text="Cargando sesión" />;
  }

  return (
    <>
      {/**Vídeos */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-2 justify-between items-center">
          <h1 className="text-lg font-medium text-black ">Vídeos</h1>
          {userId === session?.user?.id ? (
            <svg
              viewBox="0 0 512 512"
              onClick={openModal}
              className="h-5 w-5 cursor-pointer fill-gray-500"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
            </svg>
          ) : null}
        </div>
        {isLoading && <Spinner text="Cargando registros" />}
        {!isLoading && data && (
          <VideoSmallCard objects={data} userId={userId} />
        )}

        <VideoModal isOpen={isOpen} onClose={closeModal} />
      </div>
    </>
  );
}
