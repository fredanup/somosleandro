import type { IUserCalling } from 'utils/auth';
import ApplyingSmallScreen from './applyingSmallScreen';
import ApplyingFullScreen from './applyingFullScreen';
import ScreenDesign from 'pages/template/screenDesign';
import { useState } from 'react';
import Menu from 'pages/utilities/menu';

export default function Jobs() {
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
        menu={<Menu optSelected={3} />}
        smallScreenBody={
          <ApplyingSmallScreen onCardSelect={handleCardSelect} />
        }
        fullScreenBody={
          <ApplyingFullScreen
            selectedCard={selectedCard}
            onBackSelect={handleCardSelect}
          />
        }
      />
    </>
  );
}
