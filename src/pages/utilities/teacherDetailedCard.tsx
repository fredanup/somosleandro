import type { IEditCalling } from 'utils/auth';

export default function TeacherDetailedCard({
  entry,
}: {
  entry: IEditCalling;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/**Ícono de header*/}
      <svg viewBox="0 0 512 512" className="h-10 w-10 fill-sky-500 p-2">
        <path d="M192 96a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm-8 384V352h16V480c0 17.7 14.3 32 32 32s32-14.3 32-32V192h56 64 16c17.7 0 32-14.3 32-32s-14.3-32-32-32H384V64H576V256H384V224H320v48c0 26.5 21.5 48 48 48H592c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H368c-26.5 0-48 21.5-48 48v80H243.1 177.1c-33.7 0-64.9 17.7-82.3 46.6l-58.3 97c-9.1 15.1-4.2 34.8 10.9 43.9s34.8 4.2 43.9-10.9L120 256.9V480c0 17.7 14.3 32 32 32s32-14.3 32-32z" />
      </svg>
      {/**Header*/}
      <h1 className="text-base font-medium text-black">Datos del servicio</h1>
      {/**Body */}
      <div className="flex flex-col text-sm font-light text-gray-700">
        <p>
          En casa del docente:
          {(entry.atHome == true && <span>Si</span>) ||
            (entry.atHome == false && <span>No</span>)}
        </p>
        <p>
          Duración del servicio: <span>{entry.contractTime}</span>
        </p>
        <p>
          Horario disponible: <span>{entry.availableSchedule}</span>
        </p>
      </div>
      {/**Header */}
      <h1 className="text-base font-medium text-black">Datos del estudiante</h1>
      {/**Body */}
      <div className="flex flex-col text-sm font-light text-gray-700">
        <p>
          Instrumento deseado: <span>{entry.instrumentLiked}</span>
        </p>
        <p>
          Cuenta con instrumento:{' '}
          {(entry.hasInstrument == true && <span>Si</span>) ||
            (entry.hasInstrument == false && <span>No</span>)}
        </p>
        <p>Edad del estudiante: {entry.studentAge}</p>
        <p>Repertorio de interés: {entry.repertoireLiked}</p>
      </div>
      {/**Header */}
      <p className="text-base font-medium text-black">Datos de postulación</p>
      {/**Body */}
      <div className="flex flex-col text-sm font-light text-gray-700">
        <p>
          Fecha límite de postulación:{' '}
          <span>{entry.deadlineAt.toLocaleDateString()}</span>
        </p>
      </div>
    </div>
  );
}
