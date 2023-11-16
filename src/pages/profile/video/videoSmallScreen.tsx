import { useState } from 'react';
import { trpc } from 'utils/trpc';
import VideoSmallCard from './card/videoSmallCard';
import VideoModal from './modal/videoModal';
import { useSession } from 'next-auth/react';
import Spinner from 'pages/utilities/spinner';

export default function VideoSmallScreen({ userId }: { userId: string }) {
  const { data, isLoading } = trpc.video.getUserVideos.useQuery({ userId });
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  if (status === 'loading') {
    return <Spinner text="Cargando sesión" />;
  }

  return (
    <div className="border-b-2 border-gray-100 pb-4">
      {/*Encabezado de vídeos*/}
      <div className="mb-4 mt-2 flex items-center border-b-2 border-t-2 border-gray-100">
        <span className="ml-6 mr-6 py-2 text-lg font-medium text-black">
          Vídeos publicados
        </span>

        {userId === session?.user?.id ? (
          <svg
            viewBox="0 0 512 512"
            onClick={openModal}
            className="ml-auto mr-6 h-5 w-5 cursor-pointer fill-gray-400"
          >
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
          </svg>
        ) : null}
      </div>
      {!isLoading && data && (
        <div className="mb-2 ml-6 mr-6 mt-2 flex flex-col gap-6">
          <VideoSmallCard userId={userId} objects={data} />
        </div>
      )}
      <VideoModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
