import { z } from 'zod';
import { randomUUID } from 'crypto';
import { observable } from '@trpc/server/observable';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { EventEmitter } from 'events';
import { prisma, Prisma } from '../prisma';

//Valida qué campos de la tabla mensaje se van a poder seleccionar o consultar
const message = Prisma.validator<Prisma.MessageDefaultArgs>()({
  select: {
    id: true,
    text: true,
    createdAt: true,
    userName: true,
    userId: true,
    applicantRoomId: true,
  },
});

const calling=Prisma.validator<Prisma.CallingDefaultArgs>()({
  select:{
    id: true,
    applicantNumber: true,
    deadlineAt: true,
    instrumentLiked: true,
    hasInstrument: true,
    studentAge: true,
    repertoireLiked: true,
    atHome: true,
    contractTime: true,
    availableSchedule: true,
    details: true,
    callingTaken: true,
    eventType: true,
    eventDate: true,
    eventAddress: true,
    serviceLength: true,
    hasSoundEquipment: true,
    musicianRequired: true,
    callingType: true,
    User: true,
  }
});

//Valida qué campos de la tabla usuario se van a poder seleccionar o consultar
const applicantRoom = Prisma.validator<Prisma.ApplicantRoomDefaultArgs>()({
  select: {
    id: true,
    callingId: true,
    applicantId: true,
    applyStatus: true,
    createdAt: true,
    Applicant: true,
    Calling: {
      select: {
        id: true,
        applicantNumber: true,
        deadlineAt: true,
        instrumentLiked: true,
        hasInstrument: true,
        studentAge: true,
        repertoireLiked: true,
        atHome: true,
        contractTime: true,
        availableSchedule: true,
        details: true,
        callingTaken: true,
        createdAt: true,
        eventType: true,
        eventDate: true,
        eventAddress: true,
        serviceLength: true,
        hasSoundEquipment: true,
        musicianRequired: true,
        callingType: true,
        userId: true,
        User: true,
      },
    },
  },
});

const user = Prisma.validator<Prisma.UserDefaultArgs>()({
  select: {
    id: true,
    name: true,
    lastName: true,
    email: true,
    address: true,
    phone: true,
    emailVerified: true,
    image: true,
    roomId: true,
  },
});

//Exporta el tipo MessageType y UserType en base a los tipos de message y user de prisma
export type MessageType = Prisma.MessageGetPayload<typeof message>;
export type ApplicantRoomType = Prisma.ApplicantRoomGetPayload<
  typeof applicantRoom
>;
export type UserType = Prisma.UserGetPayload<typeof user>;
export type CallingType = Prisma.CallingGetPayload<typeof calling>;
//Definición de tipo contiene un mensaje y un arreglo de usuarios
type MessageOutputType = {
  message: MessageType;
  users: UserType[];
};

export enum Events {
  SEND_MESSAGE = 'SEND_MESSAGE',
  ENTER_ROOM = 'ENTER_ROOM',
  APPLICANT_CHANGE = 'APPLICANT_CHANGE',
  CALLING_CHANGE='CALLING_CHANGE'
}

export const ee = new EventEmitter();

export const roomRouter = createTRPCRouter({
  //Retorna un mensaje y añade el mensaje el emisor de eventos, LLENA TODOS LOS CAMPOS DE MESSAGE MENOS UPDATE
  //Y emite el evento SEND_MESSAGE con el mensaje creado en "caché"
  //En términos simples: Se crea un objeto mensaje con el texto ingresado por el usuario y con el id de la sala seleccionado por el usuario y se hace conocer a los oyentes sobre el mensaje creado
  sendMessage: protectedProcedure
    .input(z.object({ text: z.string(), applicantRoomId: z.string() }))
    .mutation(({ ctx, input }) => {
      const message: MessageType = {
        id: randomUUID(),
        createdAt: new Date(),
        userName: ctx.session.user.name || 'unknown',
        userId: ctx.session.user.id,
        ...input,
      };
      ee.emit(Events.SEND_MESSAGE, message);
      return message;
    }),

  //Emite el evento ENTER_ROOM con el id de la sala proporcionado por el usuario,
  enterRoom: publicProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(({ input }) => {
      ee.emit(Events.ENTER_ROOM, input);
    }),

  findManyAccepted: protectedProcedure
    .input(z.object({ callingId: z.string() }))
    .query(async ({ input }) => {
      //Lista a todos los usuarios y lo más importante es que se pueden obtener a TODOS LOS USUARIOS DE LA SALA
      return await prisma.applicantRoom.findMany({
        include: {
          Applicant: true,
          Calling: {
            select: {
              id: true,
              applicantNumber: true,
              deadlineAt: true,
              instrumentLiked: true,
              hasInstrument: true,
              studentAge: true,
              repertoireLiked: true,
              atHome: true,
              contractTime: true,
              availableSchedule: true,
              details: true,
              callingTaken: true,
              createdAt: true,
              eventType: true,
              eventDate: true,
              eventAddress: true,
              serviceLength: true,
              hasSoundEquipment: true,
              musicianRequired: true,
              callingType: true,
              userId: true,
              User: true,
            },
          },
        },
        where: { callingId: input.callingId, applyStatus: 'accepted', },
      });
    }),

  findOne: publicProcedure.input(z.string()).query(async ({ input }) => {
    const room = await prisma.applicantRoom.findUnique({
      where: { id: input },
      include: { Applicant: true },
    });
    return room;
  }),
  //retorna el mensaje redactado por el usuario y la lista de todos los usuarios de la sala
  onSendMessage: publicProcedure.subscription(() => {
    return observable<MessageOutputType>((emit) => {
      //Retorna el mensaje pasado como argumento junto a la lista de usuarios. onMessage debe ser del mismo tipo que el argumento del observable, es decir, MessageOutputType
      const onMessage = async (message: MessageType) => {
        //Listar a todos los usuarios
        const users = await prisma.user.findMany();
        // emit data to client
        // Emite el mensaje recibido mediante el evento y adicionalmente la lista de todos los usuarios
        emit.next({ message, users });
      };
      //Parece que el mensaje que se crea al emitirse el evento SEND_MESSAGE se pasa como argumento de la función onMessage
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ee.on(Events.SEND_MESSAGE, onMessage);
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ee.off(Events.SEND_MESSAGE, onMessage);
      };
    });
  }),
  //Retorno a los usuarios de la sala ingresada
  onEnterRoom: publicProcedure.subscription(() => {
    return observable<UserType[]>((emit) => {
      const onMessage = async (data: { roomId: string }) => {
        //busca a los usuarios de la sala especificada
        const users = await prisma.user.findMany({
          where: { roomId: data.roomId },
        });
        // emit data to client
        emit.next(users);
      };
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ee.on(Events.ENTER_ROOM, onMessage);
      return () => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ee.off(Events.ENTER_ROOM, onMessage);
      };
    });
  }),
});
