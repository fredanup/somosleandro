import type { Session } from 'next-auth';
import type { MessageType } from 'server/routers/room';

export default function Message({
  message,
  session,
}: {
  message: MessageType;
  session: Session | null;
}) {
  return (
    /**Si el atributo del mensaje con nombre de usuario corresponde al del usuario que se acaba de logear estilizar contenedor de una manera y si no de otra
     * En términos simples: Si el mensaje recibido corresponde al usuario actual estilizar el inbox de morado suave y el texto de negro; de lo contrario de morado fuerte y texto blanco
     */
    <div
      className={`flex flex-col mb-4 w-7/12 rounded-md p-4 ${
        message.userName === session?.user?.name
          ? 'self-end bg-white'
          : 'bg-sky-950'
      }`}
    >
      <time
        className={`${
          message.userName === session?.user?.name
            ? 'text-sm font-light text-gray-500'
            : 'text-sm font-light text-white'
        }`}
      >
        {/** Se da formato a la hora y nombre del usuario dentro del contenedor*/}
        {message.createdAt.toLocaleTimeString('en-AU', {
          timeStyle: 'short',
        })}{' '}
        - {message.userName}
      </time>
      <p
        className={`${
          message.userName === session?.user?.name
            ? 'text-base font-medium text-gray-950'
            : 'text-base font-medium text-white'
        }`}
      >
        {message.text}
      </p>
    </div>
  );
}
