export default function Warning({ text }: { text: string }) {
  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-center text-lg font-black text-gray-500">{text}</p>
      </div>
    </>
  );
}
