import ScreenDesign from 'pages/template/screenDesign';
import type { IUserCalling } from 'utils/auth';
import CallingSmallScreen from './callingSmallScreen';
import CallingFullScreen from './callingFullScreen';
import { useState } from 'react';
import Menu from 'pages/utilities/menu';

export default function Calling() {
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
        smallScreenBody={<CallingSmallScreen onCardSelect={handleCardSelect} />}
        fullScreenBody={
          <CallingFullScreen
            selectedCard={selectedCard}
            onBackSelect={handleCardSelect}
          />
        }
        menu={<Menu optSelected={1} />}
      />
    </>
  );
}
