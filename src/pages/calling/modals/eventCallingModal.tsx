import React, { type FormEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { type IEditCalling } from '../../../utils/auth';
import { trpc } from 'utils/trpc';
import CommitButton from 'pages/utilities/commitButton';

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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-30 h-5/6 w-11/12 overflow-auto rounded-lg bg-white p-6"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium text-black">Crear convocatoria</h1>
        <p className="text-justify text-base font-light text-gray-500">
          Complete cada uno de los campos presentados a continuación:
        </p>
        {/**CUERPO 1*/}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Nro de postulantes:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={nroPostulantes}
            onChange={(event) => setNroPostulante(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">Fecha límite:</p>
          <DatePicker
            id="datepicker1"
            selected={fechaLimitePostulacion}
            onChange={handlePostulacionDateChange}
            dateFormat="dd/MM/yyyy"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            required
          />
        </div>
        {/**CUERPO 2*/}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">Tipo de evento:</p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={tipoEvento}
            onChange={(event) => setTipoEvento(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Fecha del evento:
          </p>
          <DatePicker
            id="datepicker2"
            selected={fechaEvento}
            dateFormat="dd/MM/yyyy"
            onChange={handleEventoDateChange}
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Lugar del evento:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={direccionEvento}
            onChange={(event) => setDireccionEvento(event.target.value)}
            required
          />
        </div>
        {/**CUERPO 3*/}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Duración del servicio:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={duracionServicio}
            onChange={(event) => setDuracionServicio(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Tipo de músico requerido:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={musicoRequerido}
            onChange={(event) => setMusicoRequerido(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-slate-900">
            Cuenta con equipo de sonido:
          </p>
          <Toggle
            className={
              'text-sm font-medium text-white inline-block align-middle '
            }
            checked={tieneEquipoSonido}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleToggle}
          />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Detalles adicionales:
          </p>
          <textarea
            value={detalles}
            onChange={(event) => setDetalles(event.target.value)}
            className="h-14 w-full rounded-md border border-gray-300 p-2"
          ></textarea>
        </div>
      </div>

      <div className="mt-4 pt-4 flex flex-row justify-end gap-2 border-t border-gray-200">
        <button
          type="button"
          className="rounded-lg border bg-gray-500 px-4 py-1 text-base font-medium text-white"
          onClick={onClose}
        >
          Cancelar
        </button>
        <CommitButton />
      </div>
    </form>
  );
};

export default EventCallingModal;
