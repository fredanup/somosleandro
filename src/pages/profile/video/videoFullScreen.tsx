import { useState } from 'react';
import { trpc } from 'utils/trpc';
import VideoFullCard from './card/videoFullCard';
import VideoModal from './modal/videoModal';

export default function VideoFullScreen({ userId }: { userId: string }) {
  const { data, isLoading } = trpc.video.getUserVideos.useQuery({ userId });
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      {/*Encabezado de vídeos*/}
      <div className="mb-2 mt-2 flex flex items-center">
        <p className="mr-auto text-xl font-medium text-slate-900">
          Videos subidos
        </p>
        <svg
          height="1em"
          viewBox="0 0 384 512"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white p-2 drop-shadow-lg"
          onClick={openModal}
        >
          <path d="M64 0C28.7 0 0 28.7 0 64v384c0 35.3 28.7 64 64 64h256c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zm192 0v128h128L256 0zm-40 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z" />
        </svg>
      </div>
      {!isLoading && data && (
        <div className="md:grid md:grid-cols-2 md:gap-4">
          <VideoFullCard objects={data} userId={userId} />
        </div>
      )}
      <VideoModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
