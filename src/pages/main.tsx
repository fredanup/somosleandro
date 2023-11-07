import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import CallingSmallScreen from './calling/callingSmallScreen';

import CallingFullScreen from './calling/callingFullScreen';

import ProfileSmallScreen from './profile/profileSmallScreen';
import ProfileFullScreen from './profile/profileFullScreen';

import ScreenDesign from './template/screenDesign';

import ApplyingSmallScreen from './applying/applyingSmallScreen';
import ApplyingFullScreen from './applying/applyingFullScreen';

import { type IUserCalling } from '../utils/auth';

import CallingRoomSmallScreen from './chat/creator/callingRoomSmallScreen';

import ChatFullScreen from './chat/creator/chatFullScreen';
import CallingAcceptedSmallScreen from './chat/applicant/callingAcceptedSmallScreen';

import { ApplicantRoomType } from 'server/routers/room';
import ApplicantChatFullScreen from './chat/applicant/applicantChatFullScreen';
import Spinner from './utilities/spinner';

export default function Main() {
  //Obtención de la sesión
  const { data: session, status } = useSession();
  //Declaración de router empleado en caso de no obtener la sesión
  const router = useRouter();

  //Declaración de variable que controla la selección de opciones del menú
  const [opt, setOpt] = useState(1);

  //Declaración de variable que recibe el objeto seleccionado de tipo IUserCalling en un componente
  const [selectedCard, setSelectedCard] = useState<IUserCalling | null>(null);

  //Declaración de variable que recibe el objeto seleccionado de tipo ApplicantRoomType de un componente
  const [roomCard, setRoomCard] = useState<ApplicantRoomType | null>(null);

  //Declaración de variable que controla la visibilidad del menú en dispositivos móviles
  const [isMenuVisible, setIsMenuVisible] = useState(true);

  //límite de desplazamiento hacia abajo en píxeles antes de que el menú se oculte.
  const threshold = 200;

  //Se ejecuta al renderizarse el componente por primera vez
  useEffect(() => {
    //representa la posición actual(en la coordenada Y <-a,a>) del scroll vertical de la página
    let prevScrollY = window.scrollY;
    //Declaración de la función manejadora del evento scroll
    const handleScroll = () => {
      //Se obtiene el valor actual del scroll vertical (en la coordenada Y <-a,a>)
      const currentScrollY = window.scrollY;
      //Se muestra el valor de la posición Y a fines de prueba
      console.log(`valor de scroll ${currentScrollY}`);
      //Cambia el valor de la variable isMenuVisible a true si el scroll actual es menor o igual a 200 píxeles, es decir, cuando estamos al inicio de la pantalla
      //o si la posición del scroll actual en el eje Y es menor que el anterior, es decir, si estando abajo subimos ligeramente el cursor.
      //En el caso que hayamos bajo más de 200 píxeles y además que nuestra posición actual sea menor (en el eje y) se ocultará el menú.
      setIsMenuVisible(
        currentScrollY <= threshold || currentScrollY < prevScrollY,
      );
      //se actualiza el valor de prevScrollY con el valor actual de currentScrollY, para que en el próximo ciclo del efecto se pueda comparar correctamente el scroll actual con el valor anterior.
      prevScrollY = currentScrollY;
      //Se muestra el valor de la posición del scroll actua a fines de verificación
      console.log(`valor de scroll ${prevScrollY}`);
    };
    //Se agrega un evento de escucha al objeto global window para detectar el evento de scroll. Cuando se desencadena el evento, se llamará a la función handleScroll.
    window.addEventListener('scroll', handleScroll);
    //La función de retorno de useEffect se utiliza para limpiar el efecto. En este caso, se elimina el evento de escucha del scroll cuando el componente se desmonta para evitar fugas de memoria.
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  //Nota. Es necesario unificar los tipos usados para evitar redundancia y para obtener simplicidad
  // Función que recibe los datos de la tarjeta seleccionada de tipo IUseCalling y establece el valor de selectedCard, es un tipo de descriptor de acceso PODRÍA OMITIRSE
  const handleCardSelect = (data: IUserCalling | null) => {
    setSelectedCard(data);
  };

  // Función que recibe los datos de la tarjeta seleccionada de tipo ApplicantRoomType y establece el valor de selectedCard, es un tipo de descriptor de acceso PODRÍA OMITIRSE
  const handleRoomCardSelect = (data: ApplicantRoomType | null) => {
    setRoomCard(data);
  };

  //Se obtiene la sesión de la base de datos si es que la hay y mientras se muestra un spinner
  if (status === 'loading') {
    // Se muestra el spinner mientra se verifica el estado de autenticación
    return <Spinner />;
  }

  //Si la sesión no existe se redirige al inicio de sesión
  if (!session) {
    router.replace('/').catch((error) => {
      // Se muestra el error identificado en el enrutadomiento. F(x): manejo de errores
      console.error(
        'Error al redirigir a la página de inicio de sesión:',
        error,
      );
    });
  }

  return (
    <>
      <div className="m-0 box-border h-screen w-screen border-0 bg-slate-200 drop-shadow-lg md:p-2 md:flex md:h-screen md:w-screen md:gap-2 ">
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
                setSelectedCard(null);
              }}
            >
              <path d="M278.5 215.6L23 471c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l74.8-74.8c7.4 4.6 15.3 8.2 23.8 10.5C200.3 452.8 270 454.5 338 409.4c12.2-8.1 5.8-25.4-8.8-25.4l-16.1 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l97.7-29.3c3.4-1 6.4-3.1 8.4-6.1c4.4-6.4 8.6-12.9 12.6-19.6c6.2-10.3-1.5-23-13.5-23l-38.6 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l80.9-24.3c4.6-1.4 8.4-4.8 10.2-9.3C494.5 163 507.8 86.1 511.9 36.8c.8-9.9-3-19.6-10-26.6s-16.7-10.8-26.6-10C391.5 7 228.5 40.5 137.4 131.6C57.3 211.7 56.7 302.3 71.3 356.4c2.1 7.9 12 9.6 17.8 3.8L253.6 195.8c6.2-6.2 16.4-6.2 22.6 0c5.4 5.4 6.1 13.6 2.2 19.8z" />
            </svg>

            <svg
              viewBox="0 0 640 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-gray-600 p-1.5 md:mb-6 ${
                opt === 2 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(2);
                setSelectedCard(null);
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
                setSelectedCard(null);
              }}
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM228 104c0-11-9-20-20-20s-20 9-20 20v14c-7.6 1.7-15.2 4.4-22.2 8.5c-13.9 8.3-25.9 22.8-25.8 43.9c.1 20.3 12 33.1 24.7 40.7c11 6.6 24.7 10.8 35.6 14l1.7 .5c12.6 3.8 21.8 6.8 28 10.7c5.1 3.2 5.8 5.4 5.9 8.2c.1 5-1.8 8-5.9 10.5c-5 3.1-12.9 5-21.4 4.7c-11.1-.4-21.5-3.9-35.1-8.5c-2.3-.8-4.7-1.6-7.2-2.4c-10.5-3.5-21.8 2.2-25.3 12.6s2.2 21.8 12.6 25.3c1.9 .6 4 1.3 6.1 2.1l0 0 0 0c8.3 2.9 17.9 6.2 28.2 8.4V312c0 11 9 20 20 20s20-9 20-20V298.2c8-1.7 16-4.5 23.2-9c14.3-8.9 25.1-24.1 24.8-45c-.3-20.3-11.7-33.4-24.6-41.6c-11.5-7.2-25.9-11.6-37.1-15l-.7-.2c-12.8-3.9-21.9-6.7-28.3-10.5c-5.2-3.1-5.3-4.9-5.3-6.7c0-3.7 1.4-6.5 6.2-9.3c5.4-3.2 13.6-5.1 21.5-5c9.6 .1 20.2 2.2 31.2 5.2c10.7 2.8 21.6-3.5 24.5-14.2s-3.5-21.6-14.2-24.5c-6.5-1.7-13.7-3.4-21.1-4.7V104z" />
            </svg>

            <svg
              viewBox="0 0 640 512"
              className={`m-auto h-8 w-8 cursor-pointer fill-sky-600 p-1.5 md:mb-6 ${
                opt === 4 ? 'rounded-lg bg-sky-100 ' : ''
              }`}
              onClick={() => {
                setOpt(4);
                setSelectedCard(null);
                setRoomCard(null);
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
                setSelectedCard(null);
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
                setSelectedCard(null);
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
              <CallingSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<CallingFullScreen selectedCard={selectedCard} />}
          />
        )}

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
