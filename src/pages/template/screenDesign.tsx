import Header from 'pages/utilities/header';
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
        {/* Contenedor izquierdo [SmallScreen].Dato importante: El padding de bottom es bastante para que el menú no tape al contenido */}
        <div className="relative flex h-full w-full flex-col rounded-lg bg-sky-950 pb-12 drop-shadow-lg md:w-1/3 md:pb-0">
          {/**Header */}
          <Header text={header} />
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
