import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SignUpForm from './login/signUpForm';
import SignInForm from './login/signInForm';
import IndexPage from './indexPage';

export default function Home() {
  const [isSignUp, setIsSignUp] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') {
      // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
      return;
    }

    if (session) {
      // Si el usuario está autenticado, redirigir a la página protegida
      router.replace('/main').catch((error) => {
        // Manejar cualquier error que pueda ocurrir al redirigir
        console.error('Error al redirigir a la página principal:', error);
      });
    }
  }, [status, session, router]);

  return (
    <>
      <div>
        {isSignUp == true && (
          /**Card con la cara de carito */
          <div className="m-0 box-border h-screen w-screen border-0 bg-slate-50 p-6 md:flex md:h-screen md:w-screen">
            {/**Card con la cara de carito */}
            <div className="hidden md:order-first md:block md:max-h-full md:w-2/5 md:rounded-lg md:bg-[url('/images/carito.jpg')] md:bg-cover md:bg-center"></div>
            {/**Content-between se usa para generar que el enlace de iniciar sesión se encuentre en la parte inferior sin salirse del contenedor */}
            <div className="grid h-full grid-cols-1 content-between gap-4 rounded-lg bg-white p-10 drop-shadow-lg md:order-last md:ml-6 md:h-full md:w-3/5">
              {/**Primer contenedor incluye el formulario y demás opciones menos el enlace de iniciar sesión */}
              <div>
                <div className="grid place-items-center md:flex md:h-auto md:items-center">
                  <h1 className="text-3xl font-bold text-black">Regístrese</h1>
                  <Image
                    className="mb-4 mt-6 h-24 w-24 md:ml-auto md:mt-0 md:h-16 md:w-16"
                    src="/icons/Logo.svg"
                    width={100}
                    height={100}
                    alt="Logo"
                  />
                </div>
                <div>
                  <p className="text-justify  text-base font-light text-gray-400">
                    Esta aplicación te permitirá contratar músicos egresados del
                    Instituto Superior de Música Público Leandro Alviña Miranda
                    del Cusco.
                  </p>
                </div>
                <SignUpForm />
              </div>
              {/**Segundo contenedor contiene enlace a inicio de sesión*/}
              <div className="md:flex">
                <p className="text-center text-base font-light text-gray-400 md:text-left">
                  Ya tienes una cuenta?
                </p>
                <p
                  onClick={() => setIsSignUp(false)}
                  className="flex cursor-pointer justify-center text-base font-bold text-sky-400 underline md:ml-10 "
                >
                  Inicia sesión
                </p>
              </div>
            </div>
          </div>
        )}
        {isSignUp == false && (
          <div className="m-0 box-border h-screen w-screen border-0 bg-slate-50 p-6 md:flex md:h-screen md:w-screen">
            {/**Envuelve a dos contenedores y content-between es para que la opción de registro se encuentre en la parte inferior sin salirse de su contenedor */}
            <div className="grid h-full grid-cols-1 content-between rounded-lg bg-white p-8 drop-shadow-lg md:order-first md:mr-6 md:w-2/5">
              <div>
                <div className="grid place-items-center">
                  <Image
                    className="mt-4 h-20 w-20"
                    src="/icons/Logo.svg"
                    width={100}
                    height={100}
                    alt="Logo"
                  />
                  <h1 className="text-3xl font-bold text-black">
                    Iniciar sesión
                  </h1>
                </div>
                <p className="text-center text-base font-light text-gray-400 md:mt-2">
                  Por favor, Ingrese sus datos
                </p>
                <SignInForm />
              </div>
              <div className="text-s text-center">
                <p className="text-base font-light text-gray-400">
                  Eres nuevo por aquí?
                </p>
                <p
                  onClick={() => setIsSignUp(true)}
                  className="cursor-pointer font-bold text-sky-500 underline"
                >
                  Regístrese
                </p>
              </div>
            </div>
            {/**Este contenedor no aparece en móviles */}
            <div className="hidden md:order-last md:block md:h-full md:w-3/5 md:rounded-lg md:bg-[url('/images/milagros.jpg')] md:bg-cover md:bg-center"></div>
            <IndexPage />
          </div>
        )}
      </div>
    </>
  );
}
