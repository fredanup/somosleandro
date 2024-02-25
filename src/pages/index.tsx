import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from './utilities/spinner';
import styles from '../styles/styles.module.css';

export default function Home() {
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
        <div className="h-screen w-screen bg-white flex flex-row items-end pb-12 justify-center bg-[url('/images/wallpaper.jpg')] bg-cover bg-center">
          {/**Contenedor principal*/}
          <div
            className={`flex m-6 flex-col gap-6 p-9 bg-black rounded-lg drop-shadow-lg ${styles.parent}`}
          >
            {/**Header */}
            <div
              className={`flex-none items-center flex flex-row gap-4 justify-between opacity-100`}
            >
              <h1 className="font-poppins text-3xl text-white font-bold">
                Iniciar sesión
              </h1>
              <Image
                className="h-14 w-14 items-center bg-white rounded-lg p-2"
                src="/icons/Logo.svg"
                width={100}
                height={100}
                alt="Logo"
              />
            </div>
            <p className="text-base font-light text-white text-justify">
              Un aplicativo para contratar músicos profesionales. Seleccione el
              método de autenticación adecuado
            </p>
            {/**Body */}
            <div className="flex flex-col gap-4">
              {/**Botón de inicio */}
              <div
                className={`${styles.parentTextBox} items-center justify-center p-4 cursor-pointer flex flex-row gap-4 w-full h-12 rounded-lg hover:border-transparent hover:bg-red-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2`}
                onClick={() => {
                  signIn('google').catch(console.log);
                }}
              >
                <svg className="h-6 fill-pink-500" viewBox="0 0 512 512">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
                <p
                  className={`text-white text-base font-semibold ${styles.child} opacity-100`}
                >
                  {' '}
                  Iniciar sesión con Google
                </p>
              </div>

              <div
                className={`${styles.parentTextBox} items-center justify-center p-4 cursor-pointer flex flex-row gap-4 w-full h-12 rounded-lg hover:border-transparent hover:bg-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2`}
                onClick={() => {
                  signIn('facebook').catch(console.log);
                }}
              >
                <svg className="h-6 fill-sky-500" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z" />
                </svg>
                <p
                  className={`text-white text-base font-semibold ${styles.child} opacity-100`}
                >
                  {' '}
                  Iniciar sesión con facebook
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
