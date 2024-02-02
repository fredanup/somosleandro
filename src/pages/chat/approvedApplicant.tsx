import ScreenDesign from 'pages/template/screenDesign';
import type { IUserCalling } from 'utils/auth';

import { useState } from 'react';
import ChatFullScreen from './creator/chatFullScreen';
import Menu from 'pages/utilities/menu';
import CompetitorSmallScreen from './creator/competitorSmallScreen';

export default function ApprovedApplicant() {
  //Declaración de variable que recibe el objeto seleccionado de tipo IUserCalling en un componente
  const [selectedCard, setSelectedCard] = useState<IUserCalling | null>(null);

  //Nota. Es necesario unificar los tipos usados para evitar redundancia y para obtener simplicidad
  // Función que recibe los datos de la tarjeta seleccionada de tipo IUseCalling y establece el valor de selectedCard, es un tipo de descriptor de acceso
  const handleCardSelect = (data: IUserCalling | null) => {
    setSelectedCard(data);
  };
  return (
    <>
      {/**
       * Contenedor principal
       * Ocupa toda la pantalla
       */}
      <ScreenDesign
        selectedCard={selectedCard as IUserCalling}
        menu={<Menu optSelected={2} />}
        smallScreenBody={
          <CompetitorSmallScreen onCardSelect={handleCardSelect} />
        }
        fullScreenBody={
          <ChatFullScreen
            selectedCard={selectedCard}
            onBackSelect={handleCardSelect}
          />
        }
      />
    </>
  );
}
