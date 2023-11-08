import React, { type FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { type IEditCalling } from '../../../utils/auth';
import { trpc } from 'utils/trpc';

const EventCallingModal = ({
  isOpen,
  onClose,
  onCloseModal,
  selectedCalling,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCloseModal: () => void;
  selectedCalling: IEditCalling | null;
}) => {
  //2. Limpiar campos
  const [nroPostulantes, setNroPostulante] = useState('');
  const [fechaLimitePostulacion, setFechaPostulacion] = useState<Date | null>(
    null,
  );
  const [tipoEvento, setTipoEvento] = useState('');
  const [fechaEvento, setFechaEvento] = useState<Date | null>(null);
  const [direccionEvento, setDireccionEvento] = useState('');
  const [duracionServicio, setDuracionServicio] = useState('');
  const [musicoRequerido, setMusicoRequerido] = useState('');
  const [tieneEquipoSonido, setTieneEquipoSonido] = useState(false);
  const [detalles, setDetalles] = useState('');
  const utils = trpc.useContext();
  //Mutación para la base de datos
  const createCalling = trpc.calling.createCalling.useMutation({
    onSettled: async () => {
      await utils.calling.getUserCallings.invalidate();
    },
  });
  const editCalling = trpc.calling.editCalling.useMutation({
    onSettled: async () => {
      await utils.calling.getUserCallings.invalidate();
    },
  });

  useEffect(() => {
    if (selectedCalling !== null) {
      setNroPostulante(selectedCalling.applicantNumber.toString());
      setFechaPostulacion(selectedCalling.deadlineAt);
      setTipoEvento(selectedCalling.eventType);
      setFechaEvento(selectedCalling.eventDate);
      setDireccionEvento(selectedCalling.eventAddress);
      setDuracionServicio(selectedCalling.serviceLength);
      setMusicoRequerido(selectedCalling.musicianRequired);
      setTieneEquipoSonido(selectedCalling.hasSoundEquipment);
      if (selectedCalling.details !== null) {
        setDetalles(selectedCalling.details);
      }
    }
  }, [selectedCalling]);

  const handlePostulacionDateChange = (date: Date | null) => {
    setFechaPostulacion(date);
  };

  const handleEventoDateChange = (date: Date | null) => {
    setFechaEvento(date);
  };

  const handleToggle = () => {
    setTieneEquipoSonido(!tieneEquipoSonido);
  };
  if (status === 'loading') {
    // Aquí puedes mostrar un spinner o cualquier indicador de carga mientras se verifica el estado de autenticación
    return <div className="text-center">Cargando...</div>;
  }
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (fechaEvento !== null && fechaLimitePostulacion !== null) {
      const callingData = {
        applicantNumber: parseInt(nroPostulantes),
        details: detalles,
        eventType: tipoEvento,
        eventDate: fechaEvento,
        serviceLength: duracionServicio,
        musicianRequired: musicoRequerido,
        deadlineAt: fechaLimitePostulacion,
        eventAddress: direccionEvento,
        hasSoundEquipment: tieneEquipoSonido,
        callingTaken: false,
        instrumentLiked: '',
        hasInstrument: null,
        studentAge: null,
        repertoireLiked: '',
        atHome: null,
        contractTime: '',
        availableSchedule: '',
        callingType: 'Músico(s) para evento',
      };

      if (selectedCalling !== null) {
        editCalling.mutate({
          id: selectedCalling.id,
          ...callingData,
        });
      } else {
        createCalling.mutate(callingData);
      }

      onCloseModal();
      onClose();
      setNroPostulante('');
      setFechaPostulacion(null);
      setTipoEvento('');
      setFechaEvento(null);
      setDireccionEvento('');
      setDuracionServicio('');
      setMusicoRequerido('');
      setTieneEquipoSonido(false);
      setDetalles('');
    }
  };
  if (!isOpen) {
    return null; // No renderizar el modal si no está abierto
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute left-0 top-0 z-30 h-full w-full overflow-auto bg-white px-6 pb-12 pt-6 md:pb-6"
    >
      <h1 className="mb-2 text-xl font-medium text-slate-900">
        Crear convocatoria
      </h1>
      <p className="mb-2 text-justify text-sm font-light text-gray-500">
        Complete cada uno de los campos presentados a continuación:
      </p>
      {/**header y cuerpo de datos de convocatoria */}
      {/**HEADER 1*/}
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 512 512"
          className="h-4 w-4 cursor-pointer items-center justify-center fill-gray-500"
        >
          <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
        </svg>
        <p className="text-base font-bold text-gray-700">
          Datos de convocatoria
        </p>
      </div>
      {/**CUERPO 1*/}
      <div className="grid grid-cols-2 items-center gap-4 text-sm font-light text-gray-700">
        <p>Nro de postulantes:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={nroPostulantes}
          onChange={(event) => setNroPostulante(event.target.value)}
        />
        <p>Fecha límite de postulación:</p>
        <DatePicker
          id="datepicker1"
          selected={fechaLimitePostulacion}
          onChange={handlePostulacionDateChange}
          dateFormat="dd/MM/yyyy"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
        />
      </div>
      {/**header y cuerpo de datos del evento */}
      {/**HEADER 2*/}
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 512 512"
          className="h-4 w-4 cursor-pointer items-center justify-center fill-gray-500"
        >
          <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
        </svg>
        <p className="text-base font-bold text-gray-700">Datos del evento</p>
      </div>
      {/**CUERPO 2*/}
      <div className="grid grid-cols-2 items-center gap-4 text-sm font-light text-gray-700">
        <p>Tipo de evento:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={tipoEvento}
          onChange={(event) => setTipoEvento(event.target.value)}
        />
        <p>Fecha del evento:</p>
        <DatePicker
          id="datepicker2"
          selected={fechaEvento}
          dateFormat="dd/MM/yyyy"
          onChange={handleEventoDateChange}
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
        />
        <p>Lugar del evento:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={direccionEvento}
          onChange={(event) => setDireccionEvento(event.target.value)}
        />
      </div>
      {/**header y cuerpo de datos del servicio */}
      {/**HEADER 3*/}
      <div className="mb-2 flex items-center gap-2">
        <svg
          viewBox="0 0 512 512"
          className="h-4 w-4 cursor-pointer items-center justify-center fill-gray-500"
        >
          <path d="M184 48H328c4.4 0 8 3.6 8 8V96H176V56c0-4.4 3.6-8 8-8zm-56 8V96H64C28.7 96 0 124.7 0 160v96H192 320 512V160c0-35.3-28.7-64-64-64H384V56c0-30.9-25.1-56-56-56H184c-30.9 0-56 25.1-56 56zM512 288H320v32c0 17.7-14.3 32-32 32H224c-17.7 0-32-14.3-32-32V288H0V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V288z" />
        </svg>
        <p className="text-base font-bold text-gray-700">Datos del servicio</p>
      </div>
      {/**CUERPO 2*/}
      <div className="grid grid-cols-2 items-center gap-4 text-sm font-light text-gray-700">
        <p>Duración del servicio:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={duracionServicio}
          onChange={(event) => setDuracionServicio(event.target.value)}
        />
        <p>Agrupación musical de interés:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={musicoRequerido}
          onChange={(event) => setMusicoRequerido(event.target.value)}
        />
        <p>Cuenta con equipo de sonido:</p>

        <label className="relative flex items-center">
          <Toggle
            className={'text-sm font-medium text-white'}
            checked={tieneEquipoSonido}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleToggle}
          />
        </label>
      </div>
      <div className="mt-2 text-sm font-light text-gray-700">
        <p>Detalles adicionales:</p>
        <textarea
          value={detalles}
          onChange={(event) => setDetalles(event.target.value)}
          className=" h-14 w-full rounded-md border border-gray-300 p-2"
        ></textarea>
      </div>
      <div className="mt-4">
        <div className="flex justify-center gap-2">
          <button
            type="submit"
            className="w-full rounded-full border bg-green-500 px-4 py-1 text-base font-semibold text-white"
          >
            Continuar
          </button>
          <button
            type="button"
            className="w-full rounded-full border bg-gray-600 px-4 py-1 text-base font-semibold text-white"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default EventCallingModal;
