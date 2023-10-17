import Image from 'next/image';
import type { RouterOutputs } from 'utils/trpc';
import { trpc } from 'utils/trpc';

export default function VideoSmallCard({
  objects,
  userId,
}: {
  objects: RouterOutputs['video']['getUserVideos'];
  userId: string;
}) {
  if (!objects || objects.length === 0) {
    return <li className="text-slate-500">No objects uploaded yet.</li>;
  }
  const userData = trpc.user.findOne.useQuery(userId);
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
            className="m-auto h-40 w-full rounded-lg"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
          <div className="ml-4 mr-4 flex">
            <Image
              className="mb-auto mr-2 mt-2 h-12 w-12 rounded-full"
              src={userData.data?.image || ''}
              width={100}
              height={100}
              alt="Logo"
            />
            <div className="pb-2">
              <p className="text-m font-medium text-black">{object?.title}</p>
              <p className="text-sm font-light text-gray-400">
                {object?.author}
              </p>
              <p className="text-sm font-light text-gray-400">
                {userData.data?.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
