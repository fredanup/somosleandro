import { type NextPage } from 'next';

import { useState } from 'react';

import Image from 'next/image';
import { signIn } from 'next-auth/react';

const SignUpForm: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form className="md:mt-2 md:h-auto md:w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
        {/**Input de formulario */}
        <div>
          <label className="mb-2 block text-lg font-medium text-black">
            Nombres
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            placeholder="Ingrese su nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium text-black">
            Apellidos
          </label>

          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            placeholder="Ingrese su apellido"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium text-black">
            E-mail
          </label>
          <input
            placeholder="Ingrese su correo"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="focus:shadow-outline mb-2 w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-lg font-medium text-black">
            Contraseña
          </label>
          <input
            className="focus:shadow-outline mb-2 w-full appearance-none rounded-full border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      {/**Checkbox y descripción de términos y condiciones */}
      <div className="mt-4">
        <input
          type="checkbox"
          className="mr-2 default:ring-2 checked:bg-blue-500"
        />
        <span className="text-justify text-base font-light text-gray-400">
          La creación de esta cuenta significa que ud. está de acuerdo con los
          <span className="text-justify text-sky-500">
            {' '}
            términos y condiciones{' '}
          </span>
          de la plataforma
        </span>
      </div>
      {/**Botón de registro, y opción de registro con redes sociales */}
      <div className="mt-4 grid place-items-center justify-center md:flex md:items-center">
        <button
          type="submit"
          className="w-48 rounded-full bg-sky-500 px-3 py-1.5 text-base font-semibold text-white hover:border-transparent hover:bg-sky-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          Registrarse
        </button>
        <span className="mb-2 mt-2 text-gray-400 md:mx-auto">
          o continuar con:
        </span>
        <div className="mx-auto inline-flex">
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

export default SignUpForm;
