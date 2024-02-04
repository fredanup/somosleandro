import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Spinner from './utilities/spinner';

export default function Home() {
  //Declaración de variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Obtenemos la sesión de la bd
  const { data: session, status } = useSession();

  //Inicialización de ruta
  const router = useRouter();

  //Redireccion al usuario a Main
  useEffect(() => {
    if (status === 'unauthenticated') {
      // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
      return;
    }
    if (session) {
      // Si el usuario está autenticado, redirigir a la página protegida
      router.replace('/calling/calling').catch((error) => {
        // Manejar cualquier error que pueda ocurrir al redirigir
        console.error('Error al redirigir a la página principal:', error);
      });
    }
  }, [status, session, router]);

  return (
    <>
      {status === 'authenticated' || status === 'loading' ? (
        <Spinner text="Cargando" />
      ) : (
        <div className="h-screen w-screen bg-white rounded-lg md:flex md:flex-row">
          {/**Contenedor de la izquierda*/}
          <div className="flex flex-col h-full w-full px-4 md:order-first md:w-2/5">
            {/**Header */}
            <div className="flex-none items-center flex flex-col pt-16 gap-4">
              <h1 className="font-poppins text-3xl text-gray-600 font-bold">
                ¡Bienvenido!
              </h1>
              <Image
                className="h-24 w-24 items-center"
                src="/icons/Logo.svg"
                width={100}
                height={100}
                alt="Logo"
              />
              <p className="text-base font-light text-gray-500">
                Por favor, Ingrese sus datos
              </p>
            </div>
            {/**Body */}
            <form
              className="grow flex flex-col gap-4 w-full h-full px-6 mt-4"
              onSubmit={(event) => {
                event.preventDefault();
                signIn('credentials', {
                  callbackUrl: 'http://localhost:3000/main',
                }).catch(console.log);
                setEmail('');
                setPassword('');
              }}
            >
              {/**Input text y label*/}

              <div className="relative w-full flex flex-col gap-2">
                <label className="block text-lg font-semibold text-slate-900">
                  E-mail
                </label>
                <input
                  placeholder="Ingrese su e-mail"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-lg border pl-12 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:border-violet-300 focus:ring-violet-300"
                />
                <svg
                  className="absolute h-6 fill-gray-300 bottom-2 left-3"
                  viewBox="0 0 512 512"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
              </div>

              {/**Input text y label*/}
              <div className="relative w-full flex flex-col gap-2">
                <label className="block text-lg font-semibold text-slate-900">
                  Contraseña
                </label>
                <input
                  placeholder="Ingrese su contraseña"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className=" w-full rounded-lg border pl-12 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none focus:border-violet-300 focus:ring-sky-300"
                />
                <svg
                  className="absolute h-6 fill-gray-300 bottom-2 left-3"
                  viewBox="0 0 512 512"
                >
                  <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z" />
                </svg>
              </div>

              {/**Botones y cartilla*/}
              <div className="mt-4 flex flex-col items-center gap-4">
                {/**Botón de inicio */}
                <button className="w-full h-10 rounded-lg bg-sky-500 text-base font-semibold text-white hover:border-transparent hover:bg-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2">
                  Iniciar sesión
                </button>

                {/**Label de alternativa */}
                <p className="text-base font-light text-gray-400">
                  o continuar con:
                </p>
                {/**Botones de redes sociales */}
                <div className="items-center flex flex-row gap-4">
                  <svg
                    className="h-8 cursor-pointer"
                    viewBox="0 0 488 512"
                    onClick={() => {
                      signIn('google').catch(console.log);
                    }}
                  >
                    <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                  </svg>
                  <svg
                    className="h-8 cursor-pointer"
                    viewBox="0 0 512 512"
                    onClick={() => {
                      signIn('facebook').catch(console.log);
                    }}
                  >
                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                  </svg>
                </div>
                <p className="text-s text-center text-base font-light text-gray-400">
                  Eres nuevo? <span className="text-sky-500">Regístrate</span>
                </p>
              </div>
            </form>
          </div>
          {/**Este contenedor no aparece en móviles */}
          <div className="hidden md:order-last md:block md:h-screen md:w-3/5 md-rounded-tr-lg md-rounded-br-lg md-rounded-none md:bg-[url('/images/chucky.jpg')] md:bg-cover md:bg-center"></div>
        </div>
      )}
    </>
  );
}
