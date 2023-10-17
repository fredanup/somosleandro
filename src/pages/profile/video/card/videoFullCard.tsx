import Image from 'next/image';
import { trpc } from 'utils/trpc';
import type { RouterOutputs } from 'utils/trpc';

export default function VideoFullCard({
  objects,
  userId,
}: {
  objects: RouterOutputs['video']['getUserVideos'];
  userId: string;
}) {
  const userData = trpc.user.findOne.useQuery(userId);
  if (!objects || objects.length === 0) {
    return <li className="text-slate-500">No objects uploaded yet.</li>;
  }

  return (
    <>
      {objects.map((object) => (
        <div
          key={object?.key}
          className="w-80 rounded-lg bg-white drop-shadow-lg"
        >
          <iframe
            src={`https://somosleandro.s3.amazonaws.com/videos/${
              userId || ''
            }/${object?.key}`}
            title={object?.key}
            className="m-auto w-full"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;"
            allowFullScreen
          ></iframe>

          <div className="ml-4 mr-4 flex">
            <Image
              className="mb-auto mr-2 mt-2 rounded-full"
              src={userData.data?.image || ''}
              width={45}
              height={100}
              alt="Logo"
            />
            <div>
              <p className="font-medium text-gray-900">{object?.title}</p>
              <p className="mb-2 text-sm text-slate-500">{object?.author}</p>
              <p className="mb-2 text-sm text-slate-500">
                {userData.data?.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
