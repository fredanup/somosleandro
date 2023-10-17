import { useState } from 'react';
import { trpc } from 'utils/trpc';
import DocumentModal from './modals/documentModal';
import DocumentCard from './cards/documentCard';
import { useSession } from 'next-auth/react';

export default function DocumentSmallScreen({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const { data, isLoading } = trpc.document.getUserDocuments.useQuery({
    userId,
  });

  const openModal = () => {
    setIsOpen(true);
  };

  if (status === 'loading') {
    return <div>Cargando...</div>;
  }
  const closeModal = () => {
    setIsOpen(false);
  };
  return (
    /*Documentos*/
    <>
      <div className="pb-4">
        {/**Encabezado */}
        <div className="mb-4 mt-2 flex items-center border-b-2 border-t-2 border-gray-100">
          <span className="ml-6 mr-6 py-2 text-lg font-medium text-black">
            Currículum Vitae
          </span>
          {userId === session?.user?.id ? (
            <svg
              viewBox="0 0 512 512"
              onClick={openModal}
              className="ml-auto mr-6 h-5 w-5 cursor-pointer fill-gray-400"
            >
              <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM385 231c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-71-71V376c0 13.3-10.7 24-24 24s-24-10.7-24-24V193.9l-71 71c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L239 119c9.4-9.4 24.6-9.4 33.9 0L385 231z" />
            </svg>
          ) : null}
        </div>

        {!isLoading && data && (
          <div className="mb-2 ml-6 mr-6">
            <DocumentCard objects={data} userId={userId} />
          </div>
        )}
      </div>
      <DocumentModal isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
