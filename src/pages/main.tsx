import { signOut, useSession } from 'next-auth/react';
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
      <div className="m-0 box-border h-screen w-screen border-0 bg-slate-200 drop-shadow-lg rounded-lg md:flex md:flex-row md:h-screen md:w-screen md:gap-2">
        {/**Nota como se puede apreciar hay un desborde en la pantalla principal pero este es necesario para que el menú aparezca y desaparezca */}

        {/**Menú de navegación */}
        <nav
          className={`fixed inset-x-0 bottom-0 z-10 h-12 border-t border-gray-200 flex flex-row bg-white drop-shadow-lg justify-evenly items-center md:static md:border-r md:border-gray-200 md:flex md:h-full md:flex-col md:border-0 ${
            isMenuVisible ? 'block' : 'hidden'
          }`}
        >
          {/**El menú tiene dos contenedores.
        *1. El primer contenedor es para el menú en móviles e incluye a las opciones [salida y configuración]
         2. El segundo contenedor sólo incluye a las opciones de salida y configuración, esto es para que se vea bien en dispositivos de pantalla completa
        */}
          {/**Logo se oculta en dispositivos móviles */}

          <div className="flex flex-row items-center justify-center">
            <svg
              viewBox="0 0 512 512"
              className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
                opt === 1 ? 'fill-pink-500' : ''
              }`}
              onClick={() => {
                setOpt(1);
                setSelectedCard(null);
              }}
            >
              <path d="M278.5 215.6L23 471c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l74.8-74.8c7.4 4.6 15.3 8.2 23.8 10.5C200.3 452.8 270 454.5 338 409.4c12.2-8.1 5.8-25.4-8.8-25.4l-16.1 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l97.7-29.3c3.4-1 6.4-3.1 8.4-6.1c4.4-6.4 8.6-12.9 12.6-19.6c6.2-10.3-1.5-23-13.5-23l-38.6 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l80.9-24.3c4.6-1.4 8.4-4.8 10.2-9.3C494.5 163 507.8 86.1 511.9 36.8c.8-9.9-3-19.6-10-26.6s-16.7-10.8-26.6-10C391.5 7 228.5 40.5 137.4 131.6C57.3 211.7 56.7 302.3 71.3 356.4c2.1 7.9 12 9.6 17.8 3.8L253.6 195.8c6.2-6.2 16.4-6.2 22.6 0c5.4 5.4 6.1 13.6 2.2 19.8z" />
            </svg>
            <p className="hidden md:block">Publicaciones</p>
          </div>

          <svg
            viewBox="0 0 640 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 2 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(2);
              setSelectedCard(null);
            }}
          >
            <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
          </svg>

          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 3 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(3);
              setSelectedCard(null);
            }}
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
          </svg>

          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 4 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(4);
              setSelectedCard(null);
              setRoomCard(null);
            }}
          >
            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z" />
          </svg>

          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 5 ? 'fill-pink-500' : ''
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
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 6 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(6);
              setSelectedCard(null);
            }}
          >
            <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
          </svg>
          <svg
            viewBox="0 0 512 512"
            className="h-8 w-8 cursor-pointer fill-gray-500 p-1.5"
            onClick={() => {
              signOut({
                callbackUrl: 'https://trpc-websockets-807m.onrender.com',
              }).catch(console.log);
            }}
          >
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64z" />
          </svg>
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
