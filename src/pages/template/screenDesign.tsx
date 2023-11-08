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
        <div className="relative flex h-full w-full flex-col rounded-lg bg-violet-100 pb-8 drop-shadow-lg md:w-1/3 md:pb-0">
          <div className="border-b border-gray-200 flex flex-row items-center justify-center py-2">
            <Image
              className="h-14 w-14 drop-shadow-lg"
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
