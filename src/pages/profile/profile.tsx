import ScreenDesign from 'pages/template/screenDesign';
import ProfileSmallScreen from './profileSmallScreen';
import ProfileFullScreen from './profileFullScreen';
import Menu from 'pages/utilities/menu';

export default function ApprovedApplicant() {
  return (
    <>
      {/**
       * Contenedor principal
       * Ocupa toda la pantalla
       */}
      <ScreenDesign
        selectedCard={null}
        menu={<Menu optSelected={5} />}
        smallScreenBody={<ProfileSmallScreen />}
        fullScreenBody={<ProfileFullScreen />}
      />
    </>
  );
}
