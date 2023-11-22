import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { z } from 'zod';
import { type ApplicantRoomType, Events, ee } from './room';
import { observable } from '@trpc/server/observable';
import { prisma } from '../prisma';

export const applicantRoomRouter = createTRPCRouter({
  getApplicantsAvailable: protectedProcedure  
  .query(async ({ ctx }) => {
    try {
      return await ctx.prisma.applicantRoom.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          applyStatus: {
            in: ['pending', 'accepted'],
          }    
        },
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
      });
    } catch (error) {
      console.log('error', error);
    }
  }),
  getApplicantsByCalling: protectedProcedure
    .input(z.object({ callingId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.applicantRoom.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            applyStatus: {
              in: ['pending', 'accepted'],
            },
            callingId: input.callingId,
          },
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
        });
      } catch (error) {
        console.log('error', error);
      }
    }),
    getOnlyMyApplicants: protectedProcedure  
    .query(async ({ ctx }) => {
      try {
        return await ctx.prisma.applicantRoom.findMany({
          select: {        
            id:true,    
            applicantId:true,
            callingId:true,          
            applyStatus:true,   
            Applicant:true,        
            createdAt:true,
            Calling:{
              select: {
                id:true,
                applicantNumber:true,
                deadlineAt:true,
                instrumentLiked:true,
                hasInstrument:true,
                studentAge:true,
                repertoireLiked:true,
                atHome:true,
                contractTime:true,
                availableSchedule:true,
                details:true,
                callingTaken:true,
                createdAt:true,
                eventType:true,
                eventDate:true,
                eventAddress:true,
                serviceLength:true,
                hasSoundEquipment:true,
                musicianRequired:true,
                callingType:true,   
                userId:true,
                User:true,
              }
            }     
          },          
          orderBy: {
            createdAt: "desc",
          },
          where:{
            applicantId:ctx.session.user.id,          
          },
  
        });
      } catch (error) {
        console.log("error", error);
      }
    }),
  getUserApplicationsAccepted: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.prisma.applicantRoom.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          applyStatus: {
            in: ['accepted'],
          },
          applicantId: ctx.session.user.id,
        },
        include: {
          Calling: {
            include: {
              User: true, // Include the User relation
            },
          },
          Applicant: true,
        },
      });
    } catch (error) {
      console.log('error', error);
    }
  }),

  getMyApplicantsByCalling: protectedProcedure
    .input(z.object({ callingId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.applicantRoom.findMany({
          select: {
            id: true,
            applicantId: true,
            callingId: true,
            applyStatus: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          where: {
            applicantId: ctx.session.user.id,
            callingId: input.callingId,
          },
        });
      } catch (error) {
        console.log('error', error);
      }
    }),
    createApplicant: protectedProcedure
    .input(z.object({ callingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const newApplicant = await ctx.prisma.applicantRoom.create({
          data: {
            callingId: input.callingId,
            applyStatus: 'pending',
            applicantId: ctx.session.user.id,
          },
        });
        ee.emit(Events.APPLICANT_CHANGE);
        return newApplicant;
      } catch (error) {
        console.log(error);
      }
    }),
  acceptApplicant: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        /**
         * En términos simples. ESTA MUTACIÓN APRUEBA UNA SALA CREADA Y ENROLA AL CREADOR Y AL POSTULANTE
         * Las dos funciones siguientes se basan en que el usuario actual sabe de alguna forma en qué la sala debe operar
         */
        //Actualiza el estado de una sala al valor "aceptado" a partir del id de sala ingresado por el usuario
        //Actualiza el atributo applyStatus de la tabla applicantRoom. No depende de la sesión para realizar la mutación.
        //En términos simples SE APRUEBA LA SALA SELECCIONADA A TRAVÉS DE LA INTERFAZ POR EL USUARIO ACTUAL
        const applicantRoom = await ctx.prisma.applicantRoom.update({
          where: {
            id: input.id,
          },
          data: {
            applyStatus: 'accepted',
          },
        });
        //Actualiza el atributo sala del usuario con la sesión actual, con el valor del id de sala ingresado por el mismo
        //Actualiza el atributo roomId de la tabla user del usuario actual. Depende de la sesión para realizar la mutación
        //En términos simples EL USUARIO SE ENROLA A LA SALA APROBADA
        await prisma.user.updateMany({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            roomId: input.id,
          },
        });
        //Actualiza el atributo roomId de la tabla user del usuario actual. No depende de la sesión para realizar la mutación
        //En términos simples EL USUARIO ENROLA AL POSTULANTE A LA NUEVA SALA APROBADA.
        await prisma.user.updateMany({
          where: {
            id: applicantRoom.applicantId,
          },
          data: {
            roomId: input.id,
          },
        });
        //En términos simples DA A CONOCER A LOS OYENTES CUÁL ES LA SALA APROBADA Y QUIÉN LA APROBÓ
        ee.emit(Events.ENTER_ROOM, {
          roomId: input.id,
          userId: ctx.session.user.id,
        });
      } catch (error) {
        console.log(error);
      }
    }),
  rejectApplicant: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        //Mutación que actualiza la sala en la que se encuentra el postulante para que no sea capaz de poder comunicarse con el cliente. Una vez que se produce la actualización en base de datos
        //se comunica a todos los oyentes del cambio.
        await ctx.prisma.applicantRoom.update({
          where: {
            id: input.id,
          },
          data: {
            applyStatus: 'rejected',
          },
        });
        ee.emit(Events.APPLICANT_CHANGE);
      } catch (error) {
        console.log(error);
      }
    }),
    
    //TIP SÚPER IMPORTANTE: **LOS EVENTOS QUE TIENEN EL MISMO NOMBRE QUE LA MUTACIÓN ES PORQUE SON "SU INSTANCIA" Y TIENEN UNA SUSCRIPCIÓN ASOCIADA**
    applicantChange: publicProcedure.mutation(() => {
      //Emite el evento APPLICANT_CHANGE.
      ee.emit(Events.APPLICANT_CHANGE);
    }),
  
    deleteApplicant: protectedProcedure
      .input(z.object({ callingId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        try {
          await ctx.prisma.applicantRoom.deleteMany({
            where: {
              applicantId: ctx.session.user.id,
              callingId: input.callingId,
            },
          });
          ee.emit(Events.APPLICANT_CHANGE);
        } catch (error) {
          console.log(error);
        }
      }),
  
      onApplicantChange: publicProcedure.subscription(() => {
        return observable<ApplicantRoomType[]>((emit) => {
          const onMessage = async () => {
            //Lista las salas que están pendientes de aprobación o que fueron aceptadas en forma descendente de creación
            const applicantRooms = await prisma.applicantRoom.findMany({
              orderBy: {
                createdAt: 'desc',
              },
              where: {
                applyStatus: {
                  in: ['pending', 'accepted'],
                },
              
              },
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
            });
            // emit data to client
            emit.next(applicantRooms);
          };
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          ee.on(Events.APPLICANT_CHANGE, onMessage);
          return () => {
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            ee.off(Events.APPLICANT_CHANGE, onMessage);
          };
        });
      }),

  addRoom: publicProcedure
    .input(z.object({ roomId: z.string(), userId: z.string() }))
    .mutation(async ({ input }) => {
        //Actualiza la sala del usuario logeado y emite un evento personalizado llamado INGRESAR SALA mostrando al resto los atributos roomId y userId proporcionados,
        //se ha "agregado una sala a un usuario"
      const user = await prisma?.user.updateMany({
        where: {
          id: input.userId,
        },
        data: {
          roomId: input.roomId,
        },
      });
      ee.emit(Events.ENTER_ROOM, {
        roomId: input.roomId,
        userId: input.userId,
      });
      return user;
    }),

});
