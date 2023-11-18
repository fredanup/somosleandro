import { useCallback, useEffect, useMemo, useState } from 'react';
import { trpc } from 'utils/trpc';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const VideoModal = ({
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
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  //Hook de estado para cancelar o permitir la subida de archivos
  const [submitDisabled, setSubmitDisabled] = useState(true);

  //Hook que permite usar queries
  const apiUtils = trpc.useContext();

  //Mutación para subir archivos
  const { mutateAsync: fetchPresignedUrls } =
    trpc.video.createS3UserVideo.useMutation();

  //Mutación para la base de datos
  const createUserVideo = trpc.video.createDbUserVideo.useMutation();

  //Estilizado del fondo detrás del modal. Evita al usuario salirse del modal antes de elegir alguna opción
  const overlayClassName = isOpen
    ? 'fixed top-0 left-0 w-full h-full rounded-lg bg-gray-800 opacity-60 z-20'
    : 'hidden';

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

      await apiUtils.video.getUserVideos.invalidate();

      setSubmitDisabled(true);
    }
  }, [acceptedFiles, apiUtils.video.getUserVideos, presignedUrl]);

  return (
    <>
      {isOpen && (
        <div>
          {/* Fondo borroso y no interactivo */}
          <div className={overlayClassName}></div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              presignedUrl !== null && acceptedFiles[0]?.name !== undefined
                ? createUserVideo.mutate({
                    title: title,
                    author: author,
                    key: acceptedFiles[0]?.name,
                  })
                : null;
              void handleSubmit();
              onClose();
              setTitle('');
              setAuthor('');
            }}
            className="absolute left-1/2 top-1/2 z-20 w-11/12 -translate-x-1/2 -translate-y-1/2 transform flex flex-col gap-4 rounded-lg bg-white p-6 drop-shadow-lg"
          >
            <h1 className="text-xl font-medium text-black">Subir vídeo</h1>
            <p className="text-justify text-base font-light text-gray-500">
              Seleccione el vídeo a subir y complete los datos del formulario
            </p>

            <div
              {...getRootProps()}
              className="dropzone-container flex flex-col gap-2 h-40 w-full items-center justify-center cursor-pointer rounded-lg border-dashed border-2 border-gray-400"
            >
              <svg viewBox="0 0 512 512" className="w-10 h-10 fill-gray-500">
                <path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM48 368v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V368c0-8.8-7.2-16-16-16H416zM48 240v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zm368-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H416zM48 112v32c0 8.8 7.2 16 16 16H96c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H64c-8.8 0-16 7.2-16 16zM416 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H416zM160 128v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V128c0-17.7-14.3-32-32-32H192c-17.7 0-32 14.3-32 32zm32 160c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V320c0-17.7-14.3-32-32-32H192z" />
              </svg>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-base font-medium text-slate-900">
                  Arrastre su vídeo aquí
                </p>
              ) : (
                <p className="text-base font-medium text-slate-900">
                  Haga clic o arrastre su vídeo aquí
                </p>
              )}
            </div>
            <aside>
              <p className="text-sm font-medium text-slate-900">
                Archivo cargado:
              </p>
              <ul className="text-sm font-light text-gray-500">{files}</ul>
            </aside>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-900">
                Título del vídeo:
              </p>
              <input
                type="text"
                className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-900">
                Autor del tema:
              </p>
              <input
                type="text"
                className="focus:shadow-outline w-full appearance-none rounded-lg border px-2 py-1 leading-tight text-gray-700 focus:outline-none"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
              />
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
                className="rounded-lg border bg-amber-600 px-4 py-1 text-base font-medium text-white"
                disabled={
                  presignedUrl === null ||
                  acceptedFiles.length === 0 ||
                  submitDisabled
                }
              >
                Continuar
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default VideoModal;
