import { useSession } from 'next-auth/react';
import Image from 'next/image';
import DocumentSmallScreen from './document/documentSmallScreen';
import VideoSmallScreen from './video/videoSmallScreen';
import Rating from './rating/rating';

const ProfileSmallScreen = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <main className="flex flex-col items-center pt-4">Loading...</main>;
  }
  return (
    <>
      <div>
        {/*Foto y datos personales*/}
        <div className="pb-2">
          <Image
            className="m-auto mt-4 rounded-full"
            src={session?.user?.image || ''}
            width={95}
            height={100}
            alt="Logo"
          />
          <p className="text-m mt-2 text-center text-base font-medium text-gray-700">
            {session?.user?.name}
          </p>
          <p className="text-center text-sm font-normal text-gray-500">
            {session?.user?.email}
          </p>
        </div>
        {/*Documentos*/}
        <DocumentSmallScreen userId={session?.user?.id!} />
        {/*Vídeo*/}
        <VideoSmallScreen userId={session?.user?.id!} />
        {/**Calificaciones */}
        <Rating />
      </div>
    </>
  );
};

export default ProfileSmallScreen;
