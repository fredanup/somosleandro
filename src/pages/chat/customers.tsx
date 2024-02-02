import ScreenDesign from 'pages/template/screenDesign';

import { useState } from 'react';
import type { ApplicantRoomType } from 'server/routers/room';
import CallingAcceptedSmallScreen from './applicant/callingAcceptedSmallScreen';
import ApplicantChatFullScreen from './applicant/applicantChatFullScreen';
import Menu from 'pages/utilities/menu';

export default function ApprovedApplicant() {
  //Declaración de variable que recibe el objeto seleccionado de tipo ApplicantRoomType de un componente
  const [roomCard, setRoomCard] = useState<ApplicantRoomType | null>(null);

  // Función que recibe los datos de la tarjeta seleccionada de tipo ApplicantRoomType y establece el valor de selectedCard, es un tipo de descriptor de acceso
  const handleRoomCardSelect = (data: ApplicantRoomType | null) => {
    setRoomCard(data);
  };

  return (
    <>
      {/**
       * Contenedor principal
       * Ocupa toda la pantalla
       */}
      <ScreenDesign
        selectedCard={roomCard as ApplicantRoomType}
        menu={<Menu optSelected={4} />}
        smallScreenBody={
          <CallingAcceptedSmallScreen onCardSelect={handleRoomCardSelect} />
        }
        fullScreenBody={
          <ApplicantChatFullScreen
            selectedCard={roomCard}
            onBackSelect={handleRoomCardSelect}
          />
        }
      />
    </>
  );
}
