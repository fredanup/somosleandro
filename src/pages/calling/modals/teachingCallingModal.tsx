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
    if (selectedCalling !== null) {
      setNroPostulante(selectedCalling.applicantNumber.toString());
      setFechaPostulacion(selectedCalling.deadlineAt);
      setInstrumentoInteres(selectedCalling.instrumentLiked);
      if (
        selectedCalling.hasInstrument !== null &&
        selectedCalling.studentAge !== null &&
        selectedCalling.repertoireLiked !== null &&
        selectedCalling.atHome !== null &&
        selectedCalling.details !== null
      ) {
        setTieneInstrumento(selectedCalling.hasInstrument);
        setEdadEstudiante(selectedCalling.studentAge.toString());
        setRepertorioInteres(selectedCalling.repertoireLiked);
        setClasesADomicilio(selectedCalling.atHome);
        setDetalles(selectedCalling.details);
      }

      setTiempoContrata(selectedCalling.contractTime);
      setHorarioDisponible(selectedCalling.availableSchedule);
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform z-30 h-5/6 w-11/12 overflow-auto rounded-lg bg-white p-6"
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-medium text-black">Crear convocatoria</h1>
        <p className="text-justify text-base font-light text-gray-500">
          Complete cada uno de los campos presentados a continuación:
        </p>
        {/**header y cuerpo de datos de convocatoria */}

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
          />
        </div>

        {/**CUERPO 2*/}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Instrumento de interés:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={instrumentoInteres}
            onChange={(event) => setInstrumentoInteres(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Edad del estudiante:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={edadEstudiante}
            onChange={(event) => setEdadEstudiante(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Repertorio que desea aprender:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={repertorioInteres}
            onChange={(event) => setRepertorioInteres(event.target.value)}
          />
        </div>

        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-slate-900">
            Cuenta con el instrumento:
          </p>
          <Toggle
            className={
              'text-sm font-medium text-white inline-block align-middle '
            }
            checked={tieneInstrumento}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleInstrumentoToggle}
          />
        </div>

        {/**CUERPO 2*/}
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-medium text-slate-900">
            Desea clases a domicilio:
          </p>
          <Toggle
            className={
              'text-sm font-medium text-white inline-block align-middle '
            }
            checked={clasesADomicilio}
            icons={{
              checked: 'Si',
              unchecked: 'No',
            }}
            onChange={handleClasesADomicilioToggle}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Tiempo que desea recibir el servicio:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={tiempoContrata}
            onChange={(event) => setTiempoContrata(event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-900">
            Qué horario tiene disponible:
          </p>
          <input
            type="text"
            className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
            value={horarioDisponible}
            onChange={(event) => setHorarioDisponible(event.target.value)}
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
        <button
          type="submit"
          className="rounded-lg border bg-sky-500 px-4 py-1 text-base font-medium text-white"
        >
          Continuar
        </button>
      </div>
    </form>
  );
};

export default TeachingCallingModal;
