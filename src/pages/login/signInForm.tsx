import { type NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';

const SignInForm: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="mt-2"
      onSubmit={(event) => {
        event.preventDefault();
        signIn('credentials', {
          callbackUrl: 'http://localhost:3000/main',
        }).catch(console.log);
        setEmail('');
        setPassword('');
      }}
    >
      {/**Input text y label de inicio de sesión */}
      <div>
        <div>
          <label className="mb-2 block text-lg font-medium text-black">
            E-mail
          </label>
          <input
            placeholder="Ingrese su e-mail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus:shadow-outline w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 mt-2 block text-lg font-medium text-black">
            Contraseña
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
      </div>
      {/**Botón de inicio de sesión e inicio con redes sociales */}
      <div className="mt-8 grid place-items-center justify-center">
        <button
          type="submit"
          className="mt-4 w-48 rounded-full bg-sky-500 px-3 py-1.5 text-base font-semibold text-white hover:border-transparent hover:bg-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          Iniciar sesión
        </button>
        <span className="mb-2 mt-2 text-base font-light text-gray-400">
          o continuar con:
        </span>
        <div className="ml-auto mr-auto inline-flex">
          <Image
            className="mr-4 cursor-pointer"
            src="/icons/google.svg"
            width={25}
            height={100}
            alt="Logo"
            onClick={() => {
              signIn('google', {
                callbackUrl: 'https://trpc-websockets-807m.onrender.com/main',
              }).catch(console.log);
            }}
          />
          <Image
            className="cursor-pointer"
            src="/icons/facebook.svg"
            width={29}
            height={100}
            alt="Logo"
            onClick={() => {
              signIn('facebook').catch(console.log);
            }}
          />
        </div>
      </div>
    </form>
  );
};
export default SignInForm;
