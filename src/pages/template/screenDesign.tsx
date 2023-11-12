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
      {/*/Contenedor principal se ubica a la derecha del menú en dispositivos de pantalla grande y en toda la pantalla en móviles**/}
      <div className="flex h-full w-full flex-col md:flex md:flex-row md:gap-2">
        {/* Contenedor izquierdo */}
        <div className="relative flex h-full w-full flex-col rounded-lg bg-sky-950 pb-8 drop-shadow-lg md:w-1/3 md:pb-0">
          {/**Header */}
          <div className="border-b border-sky-500 flex flex-row items-center justify-between px-6 py-1.5">
            <p className="text-white text-lg font-semibold">{header}</p>
            <Image
              className="h-10 w-10 drop-shadow-lg rounded-lg bg-white p-1.5"
              src="/icons/Logo.svg"
              width={100}
              height={100}
              alt="Logo"
            />
          </div>
          {/**body */}
          <div className="grow overflow-auto rounded-b-lg bg-white">
            {smallScreenBody}
          </div>
        </div>
        {/* Contenedor derecho */}
        <div className="hidden md:order-last md:block md:w-2/3 md:overflow-auto md:rounded-lg md:drop-shadow-lg ">
          {fullScreenBody}
        </div>
      </div>
    </>
  );
}
