import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { trpc } from 'utils/trpc';
import type { RouterOutputs } from 'utils/trpc';

export default function VideoSmallCard({
  objects,
  userId,
}: {
  objects: RouterOutputs['video']['getUserVideos'];
  userId: string;
}) {
  const { data: session } = useSession();
  const userData = trpc.user.findOne.useQuery(userId);
  const videoRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!objects || objects.length === 0 || !videoRef.current) return;

    videoRef.current.contentWindow?.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*',
    );
  }, [objects]);

  if (!objects || objects.length === 0) {
    return (
      <div className="flex flex-row gap-4">
        <svg className="h-6 fill-gray-400" viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>

        <p className="text-slate-500 justify-content">
          {session?.user?.id === userId
            ? 'Ups, parece que aún no has subido ningún vídeo'
            : 'El postulante aún no ha subido ningún vídeo'}
        </p>
      </div>
    );
  }

  return (
    <>
      {objects.map((object) => (
        <div
          key={object?.key}
          className="w-full rounded-lg bg-white drop-shadow-lg"
        >
          <iframe
            src={`https://somosleandro.s3.amazonaws.com/videos/${
              userId || ''
            }/${object?.key}`}
            title={object?.key}
            className="h-40 w-full rounded-t-lg"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
            allowFullScreen
            ref={videoRef}
          ></iframe>
          <div className="px-4 py-2 flex flex-row items-center gap-4">
            <Image
              className="h-12 w-12 rounded-full"
              src={userData.data?.image || ''}
              width={100}
              height={100}
              alt="Logo"
            />
            <div className="flex flex-col">
              <p className="text-base font-medium text-black">
                {object?.title}
              </p>
              <p className="text-sm font-light text-gray-400">
                Autor: {object?.author}
              </p>
              <p className="text-sm font-light text-gray-400">
                Interpreta: {userData.data?.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
