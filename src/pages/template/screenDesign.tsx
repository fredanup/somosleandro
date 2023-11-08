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
        <div className="relative flex h-full w-full flex-col rounded-lg bg-sky-500 pb-8 drop-shadow-lg md:w-1/3 md:pb-0">
          <div className="border-b border-sky-500 flex flex-row items-center justify-between py-4 px-6">
            <p className="text-white text-lg font-medium">{header}</p>
            <Image
              className="h-9 w-9 drop-shadow-lg rounded-lg bg-white p-1"
              src="/icons/Logo.svg"
              width={100}
              height={100}
              alt="Logo"
            />
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
