import Image from 'next/image';
import { memo } from 'react';

import type { ApplicantRoomType } from 'server/routers/room';

const Header = ({
  arrowVisible,
  text,
  valueCarrier,
}: {
  arrowVisible: boolean;
  text: string;
  valueCarrier: (value: ApplicantRoomType | null) => void;
}) => {
  //Hook de estado que almacena los datos de un objeto ApplicantRoomType seleccionado por el usuario de una lista de objetos ApplicantRoomType
  const handleBackClick = (value: ApplicantRoomType | null) => {
    valueCarrier(value);
  };
  return (
    <div className="bg-sky-950 rounded-t-lg flex-none flex flex-row items-center justify-between px-4 py-1.5">
      {/**Botón atrás */}
      <svg
        viewBox="0 0 448 512"
        className={
          arrowVisible
            ? `h-6 w-6 fill-white cursor-pointer md:hidden`
            : `hidden`
        }
        onClick={() => {
          handleBackClick(null);
        }}
      >
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
      <p className="text-white text-lg font-semibold">{text}</p>
      <Image
        className="h-10 w-10 drop-shadow-lg rounded-lg bg-white p-1.5"
        src="/icons/Logo.svg"
        width={100}
        height={100}
        alt="Logo"
      />
    </div>
  );
};

export default memo(Header);
