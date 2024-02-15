import { useState } from 'react';
import { trpc } from 'utils/trpc';
import DocumentModal from './modals/documentModal';
import DocumentCard from './cards/documentCard';

export default function DocumentFullScreen({ userId }: { userId: string }) {
  const { data, isLoading } = trpc.document.getUserDocuments.useQuery({
    userId,
  });
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    <div>
      {/**Encabezado de documentos*/}
      <div className="flex flex-row gap-4 items-center my-4">
        <p className="text-xl font-medium text-slate-900">Documentos</p>
        <svg
          viewBox="0 0 512 512"
          onClick={openModal}
          className="h-5 w-5 cursor-pointer fill-gray-500"
        >
          <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
        </svg>
      </div>
      {/**Ítems de documentos */}
      {!isLoading && data && (
        <div className="md:flex">
          <DocumentCard objects={data} userId={userId} />
        </div>
      )}
      <DocumentModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
