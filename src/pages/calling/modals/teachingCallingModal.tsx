import React, { type FormEvent, useEffect, useState } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { type IEditCalling } from '../../../utils/auth';
import { trpc } from 'utils/trpc';

const TeachingCallingModal = ({
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
  const [instrumentoInteres, setInstrumentoInteres] = useState('');
  const [tieneInstrumento, setTieneInstrumento] = useState(false);
  const [edadEstudiante, setEdadEstudiante] = useState('');
  const [repertorioInteres, setRepertorioInteres] = useState('');
  const [clasesADomicilio, setClasesADomicilio] = useState(false);
  const [tiempoContrata, setTiempoContrata] = useState('');
  const [horarioDisponible, setHorarioDisponible] = useState('');
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
    if (
      selectedCalling !== null &&
      selectedCalling.hasInstrument !== null &&
      selectedCalling.studentAge !== null &&
      selectedCalling.repertoireLiked !== null &&
      selectedCalling.atHome !== null &&
      selectedCalling.details !== null
    ) {
      setNroPostulante(selectedCalling.applicantNumber.toString());
      setFechaPostulacion(selectedCalling.deadlineAt);
      setInstrumentoInteres(selectedCalling.instrumentLiked);
      setTieneInstrumento(selectedCalling.hasInstrument);
      setEdadEstudiante(selectedCalling.studentAge.toString());
      setRepertorioInteres(selectedCalling.repertoireLiked);
      setClasesADomicilio(selectedCalling.atHome);
      setTiempoContrata(selectedCalling.contractTime);
      setHorarioDisponible(selectedCalling.availableSchedule);
      setDetalles(selectedCalling.details);
    }
  }, [selectedCalling]);

  const handlePostulacionDateChange = (date: Date | null) => {
    setFechaPostulacion(date);
  };

  const handleInstrumentoToggle = () => {
    setTieneInstrumento(!tieneInstrumento);
  };

  const handleClasesADomicilioToggle = () => {
    setClasesADomicilio(!clasesADomicilio);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (fechaLimitePostulacion !== null) {
      const callingData = {
        applicantNumber: parseInt(nroPostulantes),
        deadlineAt: fechaLimitePostulacion,
        instrumentLiked: instrumentoInteres,
        hasInstrument: tieneInstrumento,
        studentAge: parseInt(edadEstudiante),
        repertoireLiked: repertorioInteres,
        atHome: clasesADomicilio,
        contractTime: tiempoContrata,
        availableSchedule: horarioDisponible,
        callingTaken: false,
        details: detalles,
        eventType: '',
        eventDate: null,
        serviceLength: '',
        musicianRequired: '',
        eventAddress: '',
        hasSoundEquipment: false,
        callingType: 'Clases de música',
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
      setInstrumentoInteres('');
      setTieneInstrumento(false);
      setEdadEstudiante('');
      setRepertorioInteres('');
      setClasesADomicilio(false);
      setTiempoContrata('');
      setHorarioDisponible('');
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
        <p className="text-base font-bold text-gray-700">
          Datos del estudiante
        </p>
      </div>
      {/**CUERPO 2*/}
      <div className="grid grid-cols-2 items-center gap-4 text-sm font-light text-gray-700">
        <p>Instrumento de interés:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={instrumentoInteres}
          onChange={(event) => setInstrumentoInteres(event.target.value)}
        />
        <p>Cuenta con el instrumento:</p>
        <label className="relative flex items-center">
          <Toggle
            className={'text-sm font-medium text-white'}
            checked={tieneInstrumento}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleInstrumentoToggle}
          />
        </label>
        <p>Edad del estudiante:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={edadEstudiante}
          onChange={(event) => setEdadEstudiante(event.target.value)}
        />
        <p>Repertorio que desea aprender:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={repertorioInteres}
          onChange={(event) => setRepertorioInteres(event.target.value)}
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
        <p>Desea clases a domicilio:</p>

        <label className="relative flex items-center">
          <Toggle
            className={'text-sm font-medium text-white'}
            checked={clasesADomicilio}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleClasesADomicilioToggle}
          />
        </label>
        <p>Tiempo que desea recibir el servicio:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={tiempoContrata}
          onChange={(event) => setTiempoContrata(event.target.value)}
        />
        <p>Qué horario tiene disponible:</p>
        <input
          type="text"
          className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
          value={horarioDisponible}
          onChange={(event) => setHorarioDisponible(event.target.value)}
        />
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

export default TeachingCallingModal;
