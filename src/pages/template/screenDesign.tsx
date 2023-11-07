import Image from 'next/image';
import { type ReactNode } from 'react';

interface BodyProps {
  header: string;
  smallScreenBody: ReactNode;
  fullScreenBody: ReactNode;
}

export default function ScreenDesign({
  header,
  smallScreenBody,
  fullScreenBody,
}: BodyProps) {
  return (
    <>
      {/*/Contenedor principal de todos los módulos**/}
      <div className="flex h-full w-full flex-col md:flex md:flex-row md:gap-2">
        {/* Encabezado de dispositivos móviles contiene el logo y el menú */}
        <div className="relative flex h-full w-full flex-col rounded-lg bg-orange-500 pb-8 drop-shadow-lg md:w-1/3 md:pb-0">
          <div className="flex items-center px-4 py-2">
            <Image
              className="h-8 w-8 rounded-lg bg-white p-0.5"
              src="/icons/Logo.svg"
              width={100}
              height={100}
              alt="Logo"
            />

            <h1 className="w-full font-poppins text-center text-xl font-semibold text-white">
              {header}
            </h1>
            <svg
              viewBox="0 0 448 512"
              className="ml-auto h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white p-2 drop-shadow-lg"
            >
              <path d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z" />
            </svg>
          </div>
          <div className="grow overflow-auto rounded-b-lg bg-white">
            {smallScreenBody}
          </div>
        </div>
        {/* Componente para dispositivos de pantalla completa */}
        <div className="hidden md:order-last md:block md:w-2/3 md:overflow-auto md:rounded-lg md:drop-shadow-lg ">
          {fullScreenBody}
        </div>
      </div>
    </>
  );
}
