import { useCallback, useEffect, useMemo, useState } from 'react';
import { trpc } from 'utils/trpc';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const DocumentModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  //1. y 2. van de la mano
  //1. Hook que maneja estados de la prefirma con url, presignedUrl está vinculado a s3Url
  const [presignedUrl, setPresignedUrl] = useState<string | null>(null);
  //2. Limpiar campos
  const [academicDocument, setDocument] = useState('');

  //Mutación para cancelar o permitir la subida de archivos
  const [submitDisabled, setSubmitDisabled] = useState(true);

  //Hook que permite usar queries
  const apiUtils = trpc.useContext();

  //Mutación para subir archivos
  const { mutateAsync: fetchPresignedUrls } =
    trpc.document.createS3UserDocument.useMutation();

  //Mutación para la base de datos
  const createUserDocument = trpc.document.createDbUserDocument.useMutation();

  useEffect(() => {
    // Bloquear el cuerpo de la página cuando se abre el modal
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    // Limpiar la clase y remover el bloqueo al desmontar el modal
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  //Hook de dropzone que permite almacenar los objetos a subir
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      maxFiles: 1,
      maxSize: 5 * 2 ** 30, // roughly 5GB
      multiple: false,
      onDropAccepted: (files) => {
        const file = files[0] as File;

        fetchPresignedUrls({
          key: file.name,
        })
          .then((url) => {
            setPresignedUrl(url);
            setSubmitDisabled(false);
          })
          .catch((err) => console.error(err));
      },
    });

  //Esta función retorna un componente con el nombre del archivo y su tamaño
  const files = useMemo(() => {
    if (!submitDisabled)
      return acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ));
    return null;
  }, [acceptedFiles, submitDisabled]);

  //Función que controla el envío de datos de un formulario
  const handleSubmit = useCallback(async () => {
    if (acceptedFiles.length > 0 && presignedUrl !== null) {
      const file = acceptedFiles[0];

      await axios
        .put(presignedUrl, file.slice(), {
          headers: { 'Content-Type': file.type },
        })
        .then((response) => {
          console.log(response);
          console.log('Successfully uploaded ', file.name);
        })
        .catch((err) => console.error(err));

      await apiUtils.document.getUserDocuments.invalidate();

      setSubmitDisabled(true);
    }
  }, [acceptedFiles, apiUtils.document.getUserDocuments, presignedUrl]);

  if (!isOpen) return null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        presignedUrl !== null && acceptedFiles[0]?.name !== undefined
          ? createUserDocument.mutate({
              document: academicDocument,
              key: acceptedFiles[0]?.name,
            })
          : null;
        void handleSubmit();
        onClose();
        setDocument('');
      }}
      className="fixed left-1/2 top-1/2 z-10 w-11/12 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white p-6 drop-shadow-lg"
    >
      <h1 className="mb-4 text-2xl font-bold text-gray-500">Subir vídeo</h1>
      <p className="mb-4 text-base font-light text-gray-500">
        Seleccione el vídeo a subir y complete los datos de formulario
      </p>

      <div
        {...getRootProps()}
        className="dropzone-container mb-6 grid h-40 w-full cursor-pointer grid-cols-1 place-items-center rounded-lg bg-slate-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          className="justify-content h-16"
        >
          <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9-.1-2.7-.2-5.4-.2-8.1 0-88.4 71.6-160 160-160 59.3 0 111 32.2 138.7 80.2A95.51 95.51 0 0 1 448 96c53 0 96 43 96 96 0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-217c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l39-39V392c0 13.3 10.7 24 24 24s24-10.7 24-24V257.9l39 39c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-80-80c-9.4-9.4-24.6-9.4-33.9 0l-80 80z" />
        </svg>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-gray-500">Arrastre su vídeo aquí</p>
        ) : (
          <p className="text-gray-500">Haga click o arrastre su vídeo aquí</p>
        )}
      </div>
      <aside>
        <h4 className="font-semibold text-slate-900">Files pending upload</h4>
        <ul className="text-base font-light text-gray-500">{files}</ul>
      </aside>

      <div className="flex gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 640 512"
          fill="fill-gray-700"
        >
          <path d="M256 0h320c35.3 0 64 28.7 64 64v224c0 35.3-28.7 64-64 64H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64zm220 106.7C471.5 100 464 96 456 96s-15.5 4-20 10.7l-56 84-17.3-21.7c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4S270.8 288 280 288h272c8.9 0 17-4.9 21.2-12.7s3.7-17.3-1.2-24.6l-96-144zM336 96a32 32 0 1 0-64 0 32 32 0 1 0 64 0zM64 128h96v288c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32v-32h160v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64zm8 64c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16H72zm0 104c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16H72zm336 16v16c0 8.8 7.2 16 16 16h16c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16h-16c-8.8 0-16 7.2-16 16z" />
        </svg>
        <label className="text-m mb-2 block font-bold text-gray-700">
          Datos del documento
        </label>
      </div>
      <div>
        <div className="mb-4 grid grid-cols-2 place-content-around items-center gap-4">
          <label className="text-base font-light text-gray-500">
            Tipo de documento
          </label>
          <input
            type="text"
            className="focus:shadow-outline appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 shadow focus:outline-none"
            value={academicDocument}
            onChange={(event) => setDocument(event.target.value)}
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="submit-button w-full rounded-lg border border-slate-500 bg-slate-500 px-4 py-1 text-base font-semibold text-white"
            disabled={
              presignedUrl === null ||
              acceptedFiles.length === 0 ||
              submitDisabled
            }
          >
            Continuar
          </button>
          <button
            type="button"
            className="w-full rounded-lg border border-green-600 bg-green-600 px-4 py-1 text-base font-semibold text-white"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
};

export default DocumentModal;
