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

import ChatFullScreen from './chat/creator/chatFullScreen';
import CallingAcceptedSmallScreen from './chat/applicant/callingAcceptedSmallScreen';

import type { ApplicantRoomType } from 'server/routers/room';
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
  // Función que recibe los datos de la tarjeta seleccionada de tipo IUseCalling y establece el valor de selectedCard, es un tipo de descriptor de acceso
  const handleCardSelect = (data: IUserCalling | null) => {
    setSelectedCard(data);
  };

  // Función que recibe los datos de la tarjeta seleccionada de tipo ApplicantRoomType y establece el valor de selectedCard, es un tipo de descriptor de acceso
  const handleRoomCardSelect = (data: ApplicantRoomType | null) => {
    setRoomCard(data);
  };

  //Se obtiene la sesión de la base de datos si es que la hay y mientras se muestra un spinner
  if (status === 'loading') {
    // Se muestra el spinner mientra se verifica el estado de autenticación
    return <Spinner text="Cargando sesión" />;
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
      {/**
       * Contenedor principal
       * Ocupa toda la pantalla
       */}
      <div className="m-0 box-border h-screen w-screen border-0 bg-slate-200 drop-shadow-lg rounded-lg md:flex md:flex-row md:h-screen md:w-screen md:gap-2">
        {/**
         * Menú de navegación
         * En móviles es fijo y se ubica en la parte inferior. En escritorio se ubica a la izquierda
         */}
        <nav
          className={`fixed inset-x-0 bottom-0 z-10 p-2 border-t border-gray-200 flex flex-row bg-white drop-shadow-lg justify-evenly items-center md:static md:flex md:h-full md:flex-col md:border-0 ${
            isMenuVisible ? 'block' : 'hidden'
          }`}
        >
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

          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 2 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(2);
              setSelectedCard(null);
            }}
          >
            <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z" />
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
            <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
          </svg>

          <svg
            viewBox="0 0 640 512"
            className={`h-9 w-9 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 4 ? 'fill-pink-500' : ''
            }`}
            onClick={() => {
              setOpt(4);
              setSelectedCard(null);
              setRoomCard(null);
            }}
          >
            <path d="M272.2 64.6l-51.1 51.1c-15.3 4.2-29.5 11.9-41.5 22.5L153 161.9C142.8 171 129.5 176 115.8 176H96V304c20.4 .6 39.8 8.9 54.3 23.4l35.6 35.6 7 7 0 0L219.9 397c6.2 6.2 16.4 6.2 22.6 0c1.7-1.7 3-3.7 3.7-5.8c2.8-7.7 9.3-13.5 17.3-15.3s16.4 .6 22.2 6.5L296.5 393c11.6 11.6 30.4 11.6 41.9 0c5.4-5.4 8.3-12.3 8.6-19.4c.4-8.8 5.6-16.6 13.6-20.4s17.3-3 24.4 2.1c9.4 6.7 22.5 5.8 30.9-2.6c9.4-9.4 9.4-24.6 0-33.9L340.1 243l-35.8 33c-27.3 25.2-69.2 25.6-97 .9c-31.7-28.2-32.4-77.4-1.6-106.5l70.1-66.2C303.2 78.4 339.4 64 377.1 64c36.1 0 71 13.3 97.9 37.2L505.1 128H544h40 40c8.8 0 16 7.2 16 16V352c0 17.7-14.3 32-32 32H576c-11.8 0-22.2-6.4-27.7-16H463.4c-3.4 6.7-7.9 13.1-13.5 18.7c-17.1 17.1-40.8 23.8-63 20.1c-3.6 7.3-8.5 14.1-14.6 20.2c-27.3 27.3-70 30-100.4 8.1c-25.1 20.8-62.5 19.5-86-4.1L159 404l-7-7-35.6-35.6c-5.5-5.5-12.7-8.7-20.4-9.3C96 369.7 81.6 384 64 384H32c-17.7 0-32-14.3-32-32V144c0-8.8 7.2-16 16-16H56 96h19.8c2 0 3.9-.7 5.3-2l26.5-23.6C175.5 77.7 211.4 64 248.7 64H259c4.4 0 8.9 .2 13.2 .6zM544 320V176H496c-5.9 0-11.6-2.2-15.9-6.1l-36.9-32.8c-18.2-16.2-41.7-25.1-66.1-25.1c-25.4 0-49.8 9.7-68.3 27.1l-70.1 66.2c-10.3 9.8-10.1 26.3 .5 35.7c9.3 8.3 23.4 8.1 32.5-.3l71.9-66.4c9.7-9 24.9-8.4 33.9 1.4s8.4 24.9-1.4 33.9l-.8 .8 74.4 74.4c10 10 16.5 22.3 19.4 35.1H544zM64 336a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm528 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
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
            <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
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
            <path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm169.8-90.7c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
          </svg>

          <svg
            viewBox="0 0 512 512"
            className="h-8 w-8 cursor-pointer fill-gray-500 p-1.5"
            onClick={() => {
              signOut().catch(console.log);
            }}
          >
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64z" />
          </svg>
        </nav>
        {/**Módulos */}
        {opt === 1 && (
          <ScreenDesign
            header="Tus convocatorias"
            selectedCard={selectedCard as IUserCalling}
            opt={opt}
            smallScreenBody={
              <CallingSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<CallingFullScreen selectedCard={selectedCard} />}
          />
        )}
        {opt === 2 && (
          <ScreenDesign
            header="Salas con postulantes aprobados"
            selectedCard={selectedCard as IUserCalling}
            opt={opt}
            smallScreenBody={
              <CallingSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<ChatFullScreen selectedCard={selectedCard} />}
          />
        )}
        {opt === 3 && (
          <ScreenDesign
            header="Trabajos disponibles"
            selectedCard={selectedCard as IUserCalling}
            opt={opt}
            smallScreenBody={
              <ApplyingSmallScreen onCardSelect={handleCardSelect} />
            }
            fullScreenBody={<ApplyingFullScreen selectedCard={selectedCard} />}
          />
        )}
        {opt === 4 && (
          <ScreenDesign
            header="Tus clientes"
            selectedCard={roomCard as ApplicantRoomType}
            opt={opt}
            smallScreenBody={
              <CallingAcceptedSmallScreen onCardSelect={handleRoomCardSelect} />
            }
            fullScreenBody={<ApplicantChatFullScreen selectedCard={roomCard} />}
          />
        )}
        {opt === 5 && (
          <ScreenDesign
            header="Tu perfil"
            selectedCard={null}
            opt={opt}
            smallScreenBody={<ProfileSmallScreen />}
            fullScreenBody={<ProfileFullScreen />}
          />
        )}
        {opt === 6 && <Spinner text="demo" />}
      </div>
    </>
  );
}
