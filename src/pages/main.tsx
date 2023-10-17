import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CallingSmallScreen from './calling/callingSmallScreen';
/*
import CallingFullScreen from "./calling/callingFullScreen";
*/
import ProfileSmallScreen from './profile/profileSmallScreen';
import ProfileFullScreen from './profile/profileFullScreen';

import ScreenDesign from './template/screenDesign';
/*
import ApplyingSmallScreen from "./applying/applyingSmallScreen";
import ApplyingFullScreen from "./applying/applyingFullScreen";
import { type IUserCalling } from "../utils/auth";
import CallingRoomSmallScreen from "./chat/creator/callingRoomSmallScreen";
import ChatFullScreen from "./chat/creator/chatFullScreen";
import CallingAcceptedSmallScreen from "./chat/applicant/callingAcceptedSmallScreen";
import type { ApplicantRoomType } from "../server/api/routers/room";
import ApplicantChatFullScreen from "./chat/applicant/applicantChatFullScreen";*/

export default function Main() {
  const router = useRouter();
  const { data: session, status } = useSession();
  //Establecemos qué opción del menú se verá primero
  const [opt, setOpt] = useState(1);
  //const [selectedCard, setSelectedCard] = useState<IUserCalling | null>(null);
  //const [roomCard, setRoomCard] = useState<ApplicantRoomType | null>(null);
  // Inicialmente el menu en dispositivos móviles será visible
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  //límite de desplazamiento hacia abajo en píxeles antes de que el menú se oculte.
  const threshold = 200;

  //Se ejecuta al renderizarse el componente por primera vez

  useEffect(() => {
    //representa la posición actual(coordenada y <-a,a>) del scroll vertical de la página
    let prevScrollY = window.scrollY;
    //manejador del evento de scroll
    const handleScroll = () => {
      // se obtiene el valor actual del scroll vertical
      const currentScrollY = window.scrollY;
      console.log(`valor de scroll ${currentScrollY}`);
      //Cambia el valor de isMenuVisible de acuerdo a si el scroll actual es menor o igual a 200 píxeles es true x lo que el menú debe mostrarse, Si el valor actual del scroll (currentScrollY) es menor que el valor anterior del scroll (prevScrollY), también se establece isMenuVisible como true
      //Esto significa que el menú se mostrará nuevamente cuando el usuario haga scroll hacia arriba.
      setIsMenuVisible(
        currentScrollY <= threshold || currentScrollY < prevScrollY,
      );
      //se actualiza el valor de prevScrollY con el valor actual de currentScrollY, para que en el próximo ciclo del efecto se pueda comparar correctamente el scroll actual con el valor anterior.
      prevScrollY = currentScrollY;
      console.log(`valor de scroll ${prevScrollY}`);
    };
    //Se agrega un evento de escucha al objeto global window para detectar el evento de scroll. Cuando se desencadena el evento, se llamará a la función handleScroll.
    window.addEventListener('scroll', handleScroll);
    //La función de retorno de useEffect se utiliza para limpiar el efecto. En este caso, se elimina el evento de escucha del scroll cuando el componente se desmonta para evitar fugas de memoria.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Callback que recibe los datos de la tarjeta seleccionada
  /*
  const handleCardSelect = (data: IUserCalling | null) => {
    setSelectedCard(data);
  };

  const handleRoomCardSelect = (data: ApplicantRoomType | null) => {
    setRoomCard(data);
  };
  */
  if (status === 'loading') {
    // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
    return <div className="text-center">Cargando...</div>;
  }
  if (!session) {
    router.replace('/').catch((error) => {
      // Manejar cualquier error que pueda ocurrir al redirigir
      console.error(
        'Error al redirigir a la página de inicio de sesión:',
        error,
      );
    });
  }
  return (
    <>
      <div className="m-0 box-border h-screen w-screen border-0 bg-slate-100 p-2 md:flex md:h-screen md:w-screen md:gap-2">
        {/**Nota como se puede apreciar hay un desborde en la pantalla principal pero este es necesario para que el menú aparezca y desaparezca */}

        {/**Menú de navegación */}
        <nav
          className={`fixed inset-x-0 bottom-0 z-10 flex justify-center border-t border-gray-200 bg-white p-2 drop-shadow-lg md:static md:grid md:h-full md:w-12 md:grid-cols-1 md:content-between md:rounded-full md:border-0 ${
            isMenuVisible ? 'block' : 'hidden'
          }`}
        >
          {/**El menú tiene dos contenedores.
        *1. El primer contenedor es para el menú en móviles e incluye a las opciones [salida y configuración]
         2. El segundo contenedor sólo incluye a las opciones de salida y configuración, esto es para que se vea bien en dispositivos de pantalla completa
        */}
          <div className="flex gap-4 md:flex-col md:gap-0">
            {/**Logo se oculta en dispositivos móviles */}
            <Image
              className="hidden h-10 w-10 md:mb-6 md:mt-2 md:block md:cursor-pointer"
              src="/icons/Logov10.svg"
              width={100}
              height={100}
              alt="Logo"
            />

            <svg
              viewBox="0 0 512 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 ${
                opt === 1 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(1);
                //setSelectedCard(null);
              }}
            >
              <path d="m410.3 231 11.3-11.3-33.9-33.9-62.1-62.1-33.9-33.9-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2l199.2-199.2 22.6-22.7zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9l-78.2 23 23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7l-14.4 14.5-22.6 22.6-11.4 11.3 33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5l-39.3-39.4c-25-25-65.5-25-90.5 0zm-47.4 168-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>

            <svg
              viewBox="0 0 640 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 ${
                opt === 2 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(2);
                //setSelectedCard(null);
              }}
            >
              <path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" />
            </svg>

            <svg
              viewBox="0 0 512 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-sky-600 p-1.5 md:mb-6 ${
                opt === 3 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(3);
                //setSelectedCard(null);
              }}
            >
              <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6-11 11-18 24.6-21.4 39.6-3.7 16.6-19.1 30.7-36.1 31.6-25.6 1.3-49.3 10.7-67.3 28.6-44.8 44.9-36.4 125.9 18.7 181s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3.9-17 15-32.3 31.6-36.1 15-3.4 28.6-10.5 39.6-21.4 31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
            </svg>

            <svg
              viewBox="0 0 640 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-sky-600 p-1.5 md:mb-6 ${
                opt === 4 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(4);
                //setSelectedCard(null);
                //setRoomCard(null);
              }}
            >
              <path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2 0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.3-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9l0 0 0 0-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" />
            </svg>

            <svg
              viewBox="0 0 512 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 ${
                opt === 5 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(5);
                //setSelectedCard(null);
              }}
            >
              <path d="M32 32c17.7 0 32 14.3 32 32V400c0 8.8 7.2 16 16 16H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H80c-44.2 0-80-35.8-80-80V64C0 46.3 14.3 32 32 32zM160 224c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32s-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm128-64V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V160c0-17.7 14.3-32 32-32s32 14.3 32 32zm64 32c17.7 0 32 14.3 32 32v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V224c0-17.7 14.3-32 32-32zM480 96V320c0 17.7-14.3 32-32 32s-32-14.3-32-32V96c0-17.7 14.3-32 32-32s32 14.3 32 32z" />
            </svg>
            <svg
              viewBox="0 0 512 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 md:hidden ${
                opt === 6 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(6);
                //setSelectedCard(null);
              }}
            >
              <path d="M399 384.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>
            <svg
              viewBox="0 0 512 512"
              className="m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:hidden"
              onClick={() => {
                signOut({
                  callbackUrl: 'https://trpc-websockets-807m.onrender.com',
                }).catch(console.log);
              }}
            >
              <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64z" />
            </svg>
          </div>

          {/**Tiene dos opciones del menú y no se ve en dispositivos móviles */}
          <div className="hidden md:block">
            {/**Profile button */}
            <svg
              viewBox="0 0 512 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 ${
                opt === 6 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(6);
                //setSelectedCard(null);
              }}
            >
              <path d="M399 384.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0 256 256 0 1 1-512 0zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z" />
            </svg>

            {/**SignOut button */}
            <svg
              viewBox="0 0 512 512"
              className="m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6"
              onClick={() => {
                signOut({
                  callbackUrl: 'https://trpc-websockets-807m.onrender.com',
                }).catch(console.log);
              }}
            >
              <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64z" />
            </svg>
          </div>
        </nav>
        {/**Módulos */}

        {opt === 1 && (
          <ScreenDesign
            header="Tus convocatorias"
            smallScreenBody={
              <CallingSmallScreen /*onCardSelect={handleCardSelect}*/ />
            }
            fullScreenBody={'<CallingFullScreen selectedCard={selectedCard} />'}
          />
        )}
        {/*
        {opt === 2 && (
          <ScreenDesign
            header="Chat con postulantes"
            smallScreenBody={
              <CallingRoomSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<ChatFullScreen selectedCard={selectedCard} />}
          />
        )}
        {opt === 3 && (
          <ScreenDesign
            header="Convocatorias disponibles"
            smallScreenBody={
              <ApplyingSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<ApplyingFullScreen selectedCard={selectedCard} />}
          />
        )}
        {opt === 4 && (
          <ScreenDesign
            header="Postulaciones aprobadas"
            smallScreenBody={
              <CallingAcceptedSmallScreen onCardSelect={handleRoomCardSelect} />
            }
            fullScreenBody={<ApplicantChatFullScreen selectedCard={roomCard} />}
          />
        )}
          */}
        {opt === 6 && (
          <ScreenDesign
            header="Mi perfil"
            smallScreenBody={<ProfileSmallScreen />}
            fullScreenBody={<ProfileFullScreen />}
          />
        )}
      </div>
    </>
  );
}
