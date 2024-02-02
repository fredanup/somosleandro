import type { RouterOutputs } from 'utils/trpc';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function DocumentCard({
  objects,
  userId,
}: {
  objects: RouterOutputs['document']['getUserDocuments'];
  userId: string;
}) {
  const { data: session } = useSession();
  if (!objects || objects.length === 0) {
    return (
      <div className="flex flex-row gap-4">
        <svg className="h-6 fill-gray-400" viewBox="0 0 512 512">
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM159.3 388.7c-2.6 8.4-11.6 13.2-20 10.5s-13.2-11.6-10.5-20C145.2 326.1 196.3 288 256 288s110.8 38.1 127.3 91.3c2.6 8.4-2.1 17.4-10.5 20s-17.4-2.1-20-10.5C340.5 349.4 302.1 320 256 320s-84.5 29.4-96.7 68.7zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
        </svg>

        <p className="text-slate-500 justify-content">
          {session?.user?.id === userId
            ? 'Ups, parece que aún no has subido ningún documento'
            : 'El postulante aún no ha subido ningún documento'}
        </p>
      </div>
    );
  }

  return (
    <>
      {objects.map((object) => (
        //Contenedor de los ítems document
        <div key={object?.key} className="flex flex-row gap-4 items-center">
          {/**Ícono de documento*/}
          <svg
            viewBox="-200 -150 900 900"
            className="h-8 w-8 rounded-full bg-slate-200 fill-gray-900"
          >
            <path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v144H176c-35.3 0-64 28.7-64 64v144H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56h-16v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24h-16v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48h-32c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16v-64c0-8.8-7.2-16-16-16h-16v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16h-32v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V368z" />
          </svg>
          {/**Datos del tipo de documento registrado*/}
          <div className="flex flex-col">
            <Link
              href={`https://somosleandro.s3.amazonaws.com/documents/${
                userId || ''
              }/${object?.key}`}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-light text-black"
            >
              {object.document}
            </Link>
            <p className="text-sm font-light text-gray-400">
              7.5 MB 11:35 A.M.
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
