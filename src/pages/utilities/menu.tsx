import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useEffect, useState } from 'react';

const Menu = ({ optSelected }: { optSelected: number }) => {
  const router = useRouter();

  //Declaración de variable que controla la selección de opciones del menú
  const [opt, setOpt] = useState(0);
  const handleClick = (route: string) => {
    router.push(route).catch((error) => {
      console.error('Error al redirigir a la página solicitada:', error);
    });
  };

  //Redireccion al usuario a Main
  useEffect(() => {
    setOpt(optSelected);
  }, [optSelected]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Verificar si la nueva ruta es /applying/jobs
      if (url === '/applying/jobs') {
        // Cerrar la aplicación o realizar cualquier otra acción deseada
        // En este ejemplo, simplemente cerramos la ventana/tab actual
        window.close();
      }
    };

    const handlePopState = () => {
      // Manejar el evento de retroceso del navegador aquí
      // Puedes verificar la ruta actual usando router.pathname
      if (router.pathname === '/applying/jobs') {
        // Cerrar la aplicación o realizar cualquier otra acción deseada
        window.close();
      }
    };

    // Suscribirse a los eventos
    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('popstate', handlePopState);

    // Limpiar suscripciones al desmontar el componente
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  return (
    <>
      {/**
       * Menú de navegación
       * En móviles es fijo y se ubica en la parte inferior. En escritorio se ubica a la izquierda
       */}
      <nav
        className={`fixed inset-x-0 bottom-0 z-10 p-1 border-t border-gray-200 flex flex-row bg-white drop-shadow-lg justify-evenly md:rounded-lg md:justify-normal items-center md:items-stretch  md:static md:flex md:h-full md:flex-col md:border-0 md:gap-8 md:pt-8 md:bg-sky-950`}
      >
        <div className="hidden md:block md:w-full md:flex md:flex-row md:justify-center">
          <Image
            className="h-12 w-12 drop-shadow-lg rounded-lg bg-white p-1.5"
            src="/icons/Logo.svg"
            width={100}
            height={100}
            alt="Logo"
          />
        </div>

        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 1 ? 'fill-pink-500' : ''
            }`}
            onClick={() => handleClick('/calling/calling')}
          >
            <path d="M278.5 215.6L23 471c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l74.8-74.8c7.4 4.6 15.3 8.2 23.8 10.5C200.3 452.8 270 454.5 338 409.4c12.2-8.1 5.8-25.4-8.8-25.4l-16.1 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l97.7-29.3c3.4-1 6.4-3.1 8.4-6.1c4.4-6.4 8.6-12.9 12.6-19.6c6.2-10.3-1.5-23-13.5-23l-38.6 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l80.9-24.3c4.6-1.4 8.4-4.8 10.2-9.3C494.5 163 507.8 86.1 511.9 36.8c.8-9.9-3-19.6-10-26.6s-16.7-10.8-26.6-10C391.5 7 228.5 40.5 137.4 131.6C57.3 211.7 56.7 302.3 71.3 356.4c2.1 7.9 12 9.6 17.8 3.8L253.6 195.8c6.2-6.2 16.4-6.2 22.6 0c5.4 5.4 6.1 13.6 2.2 19.8z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => handleClick('/calling/calling')}
          >
            Tus posts
          </p>
        </div>

        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 640 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 2 ? 'fill-pink-500' : ''
            }`}
            onClick={() => handleClick('/chat/approvedApplicant')}
          >
            <path d="M88.2 309.1c9.8-18.3 6.8-40.8-7.5-55.8C59.4 230.9 48 204 48 176c0-63.5 63.8-128 160-128s160 64.5 160 128s-63.8 128-160 128c-13.1 0-25.8-1.3-37.8-3.6c-10.4-2-21.2-.6-30.7 4.2c-4.1 2.1-8.3 4.1-12.6 6c-16 7.2-32.9 13.5-49.9 18c2.8-4.6 5.4-9.1 7.9-13.6c1.1-1.9 2.2-3.9 3.2-5.9zM0 176c0 41.8 17.2 80.1 45.9 110.3c-.9 1.7-1.9 3.5-2.8 5.1c-10.3 18.4-22.3 36.5-36.6 52.1c-6.6 7-8.3 17.2-4.6 25.9C5.8 378.3 14.4 384 24 384c43 0 86.5-13.3 122.7-29.7c4.8-2.2 9.6-4.5 14.2-6.8c15.1 3 30.9 4.5 47.1 4.5c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176zM432 480c16.2 0 31.9-1.6 47.1-4.5c4.6 2.3 9.4 4.6 14.2 6.8C529.5 498.7 573 512 616 512c9.6 0 18.2-5.7 22-14.5c3.8-8.8 2-19-4.6-25.9c-14.2-15.6-26.2-33.7-36.6-52.1c-.9-1.7-1.9-3.4-2.8-5.1C622.8 384.1 640 345.8 640 304c0-94.4-87.9-171.5-198.2-175.8c4.1 15.2 6.2 31.2 6.2 47.8l0 .6c87.2 6.7 144 67.5 144 127.4c0 28-11.4 54.9-32.7 77.2c-14.3 15-17.3 37.6-7.5 55.8c1.1 2 2.2 4 3.2 5.9c2.5 4.5 5.2 9 7.9 13.6c-17-4.5-33.9-10.7-49.9-18c-4.3-1.9-8.5-3.9-12.6-6c-9.5-4.8-20.3-6.2-30.7-4.2c-12.1 2.4-24.7 3.6-37.8 3.6c-61.7 0-110-26.5-136.8-62.3c-16 5.4-32.8 9.4-50 11.8C279 439.8 350 480 432 480z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => handleClick('/chat/approvedApplicant')}
          >
            Salas de chat
          </p>
        </div>

        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 3 ? 'fill-pink-500' : ''
            }`}
            onClick={() => handleClick('/applying/jobs')}
          >
            <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => handleClick('/applying/jobs')}
          >
            Empleos
          </p>
        </div>
        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 4 ? 'fill-pink-500' : ''
            }`}
            onClick={() => handleClick('/chat/customers')}
          >
            <path d="M272.2 64.6l-51.1 51.1c-15.3 4.2-29.5 11.9-41.5 22.5L153 161.9C142.8 171 129.5 176 115.8 176H96V304c20.4 .6 39.8 8.9 54.3 23.4l35.6 35.6 7 7 0 0L219.9 397c6.2 6.2 16.4 6.2 22.6 0c1.7-1.7 3-3.7 3.7-5.8c2.8-7.7 9.3-13.5 17.3-15.3s16.4 .6 22.2 6.5L296.5 393c11.6 11.6 30.4 11.6 41.9 0c5.4-5.4 8.3-12.3 8.6-19.4c.4-8.8 5.6-16.6 13.6-20.4s17.3-3 24.4 2.1c9.4 6.7 22.5 5.8 30.9-2.6c9.4-9.4 9.4-24.6 0-33.9L340.1 243l-35.8 33c-27.3 25.2-69.2 25.6-97 .9c-31.7-28.2-32.4-77.4-1.6-106.5l70.1-66.2C303.2 78.4 339.4 64 377.1 64c36.1 0 71 13.3 97.9 37.2L505.1 128H544h40 40c8.8 0 16 7.2 16 16V352c0 17.7-14.3 32-32 32H576c-11.8 0-22.2-6.4-27.7-16H463.4c-3.4 6.7-7.9 13.1-13.5 18.7c-17.1 17.1-40.8 23.8-63 20.1c-3.6 7.3-8.5 14.1-14.6 20.2c-27.3 27.3-70 30-100.4 8.1c-25.1 20.8-62.5 19.5-86-4.1L159 404l-7-7-35.6-35.6c-5.5-5.5-12.7-8.7-20.4-9.3C96 369.7 81.6 384 64 384H32c-17.7 0-32-14.3-32-32V144c0-8.8 7.2-16 16-16H56 96h19.8c2 0 3.9-.7 5.3-2l26.5-23.6C175.5 77.7 211.4 64 248.7 64H259c4.4 0 8.9 .2 13.2 .6zM544 320V176H496c-5.9 0-11.6-2.2-15.9-6.1l-36.9-32.8c-18.2-16.2-41.7-25.1-66.1-25.1c-25.4 0-49.8 9.7-68.3 27.1l-70.1 66.2c-10.3 9.8-10.1 26.3 .5 35.7c9.3 8.3 23.4 8.1 32.5-.3l71.9-66.4c9.7-9 24.9-8.4 33.9 1.4s8.4 24.9-1.4 33.9l-.8 .8 74.4 74.4c10 10 16.5 22.3 19.4 35.1H544zM64 336a16 16 0 1 0 -32 0 16 16 0 1 0 32 0zm528 16a16 16 0 1 0 0-32 16 16 0 1 0 0 32z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => handleClick('/chat/customers')}
          >
            Clientes
          </p>
        </div>

        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 512 512"
            className={`h-8 w-8 cursor-pointer fill-gray-500 p-1.5  ${
              opt === 5 ? 'fill-pink-500' : ''
            }`}
            onClick={() => handleClick('/profile/profile')}
          >
            <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320H224c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3h64c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => handleClick('/profile/profile')}
          >
            Tu perfil
          </p>
        </div>

        <div className="flex flex-col items-center md:flex md:flex-row md:gap-1">
          <svg
            viewBox="0 0 512 512"
            className="h-8 w-8 cursor-pointer fill-gray-500 p-1.5"
            onClick={() => {
              signOut({ callbackUrl: '/' }).catch((error) => {
                console.error('Error signing out:', error);
              });
            }}
          >
            <path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l73.4 73.4H192c-17.7 0-32 14.3-32 32s14.3 32 32 32h210.7l-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128v256c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32h64z" />
          </svg>
          <p
            className="text-gray-500 text-sm cursor-pointer md:text-white"
            onClick={() => {
              signOut({ callbackUrl: '/' }).catch((error) => {
                console.error('Error signing out:', error);
              });
            }}
          >
            Salir
          </p>
        </div>
      </nav>
    </>
  );
};

export default memo(Menu);
