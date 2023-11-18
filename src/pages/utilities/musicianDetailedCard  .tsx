import type { IEditCalling } from 'utils/auth';

export default function MusicianDetailedCard({
  entry,
}: {
  entry: IEditCalling;
}) {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/**Ícono de header*/}
      <svg viewBox="0 0 512 512" className="h-10 w-10 fill-sky-500 p-2">
        <path d="M465 7c-9.4-9.4-24.6-9.4-33.9 0L383 55c-2.4 2.4-4.3 5.3-5.5 8.5l-15.4 41-77.5 77.6c-45.1-29.4-99.3-30.2-131 1.6c-11 11-18 24.6-21.4 39.6c-3.7 16.6-19.1 30.7-36.1 31.6c-25.6 1.3-49.3 10.7-67.3 28.6C-16 328.4-7.6 409.4 47.5 464.5s136.1 63.5 180.9 18.7c17.9-17.9 27.4-41.7 28.6-67.3c.9-17 15-32.3 31.6-36.1c15-3.4 28.6-10.5 39.6-21.4c31.8-31.8 31-85.9 1.6-131l77.6-77.6 41-15.4c3.2-1.2 6.1-3.1 8.5-5.5l48-48c9.4-9.4 9.4-24.6 0-33.9L465 7zM208 256a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
      </svg>
      {/**Header*/}
      <h1 className="text-base font-medium text-black">Datos del evento</h1>
      {/**body */}
      <div className="flex flex-col items-center text-sm font-light text-gray-700">
        <p>
          Tipo de evento: <span>{entry.eventType}</span>
        </p>
        <p>
          Fecha del evento: <span>{entry.eventDate?.toLocaleDateString()}</span>
        </p>
        <p>
          Lugar del evento: <span>{entry.eventAddress}</span>
        </p>
      </div>
      {/**Header*/}
      <h1 className="text-base font-medium text-black">Datos del servicio</h1>
      {/**Body*/}
      <div className="flex flex-col items-center text-sm font-light text-gray-700">
        <p>Duración del servicio: {entry.serviceLength}</p>
        <p>
          Dispone de equipo de sonido:{' '}
          {(entry.hasSoundEquipment == true && <span>Si</span>) ||
            (entry.hasSoundEquipment == false && <span>No</span>)}
        </p>
        <p>Tipo de músico requerido: {entry.musicianRequired}</p>
      </div>
      {/**Header */}
      <p className="text-base font-medium text-black">Datos de postulación</p>
      {/**Body */}
      <div className="flex flex-col items-center text-sm font-light text-gray-700">
        <p>
          Fecha límite de postulación:{' '}
          <span>{entry.deadlineAt.toLocaleDateString()}</span>
        </p>
      </div>
    </div>
  );
}
