import { useSession } from 'next-auth/react';
import Image from 'next/image';
import DocumentSmallScreen from './document/documentSmallScreen';
import VideoSmallScreen from './video/videoSmallScreen';
import Rating from './rating/rating';

import Header from 'pages/utilities/header';
import { useState } from 'react';
import UserData from './user/userData';

const ProfileSmallScreen = () => {
  //Hook de estado que controla la apertura del modal de creación de documentos
  const [isOpen, setIsOpen] = useState(false);

  const { data: session } = useSession();

  //Función de apertura del modal ChooseCallingModal
  const openModal = () => {
    setIsOpen(true);
  };

  //Función de apertura del modal ChooseCallingModal
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Header arrowVisible={false} text="Tu perfil" valueCarrier={() => null} />
      <div className="flex flex-col gap-4 p-6">
        {/*Foto y datos personales*/}
        <div className="flex flex-col items-center p-9">
          <Image
            className="rounded-full"
            src={session?.user?.image || ''}
            width={95}
            height={100}
            alt="Logo"
          />
          <p className="text-m text-base font-medium text-gray-700">
            {session?.user?.name}
          </p>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm font-normal text-gray-500">
              {session?.user?.email}
            </p>
            {/**Este es el botón de edición */}
            <svg
              viewBox="0 0 512 512"
              className="h-4 w-4 cursor-pointer fill-sky-500"
              onClick={openModal}
            >
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </div>
        </div>
        {/*Documentos*/}
        <DocumentSmallScreen userId={session?.user?.id ?? ''} />
        {/*Vídeo*/}
        <VideoSmallScreen userId={session?.user?.id ?? ''} />
        {/**Calificaciones */}
        <Rating />
      </div>
      {/**Ventana modal que se abre cuando se hace clic en editar */}
      <UserData isOpen={isOpen} onClose={closeModal} />
    </>
  );
};

export default ProfileSmallScreen;
