import Image from 'next/image';

export default function Header({ text }: { text: string }) {
  return (
    <div className="bg-sky-950 rounded-t-lg flex flex-row items-center justify-between px-4 py-1.5">
      <p className="text-white text-lg font-semibold">{text}</p>
      <Image
        className="h-10 w-10 drop-shadow-lg rounded-lg bg-white p-1.5"
        src="/icons/Logo.svg"
        width={100}
        height={100}
        alt="Logo"
      />
    </div>
  );
}
