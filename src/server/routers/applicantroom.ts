
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { type ApplicantRoomType, Events, ee } from "./room";
import { observable } from "@trpc/server/observable";
import { prisma } from "../../db";

export const applicantRoomRouter = createTRPCRouter({ 
    applicantChange: publicProcedure    
    .mutation(() => {
      ee.emit(Events.APPLICANT_CHANGE);
    }),

    createApplicant: protectedProcedure
    .input(z.object({callingId: z.string()}))
    .mutation(async ({ ctx, input }) => {      
      try {       
        const newApplicant=await ctx.prisma.applicantRoom.create({
          data: {          
            callingId:input.callingId,
            applyStatus:"pending",   
            applicantId:ctx.session.user.id,
          },
        });  
        ee.emit(Events.APPLICANT_CHANGE);
        return newApplicant;      
      } catch (error) {
        console.log(error);
      }       
    }),    

  deleteApplicant: protectedProcedure
  .input(z.object({callingId: z.string()}))
  .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.applicantRoom.deleteMany({
        where: { applicantId: ctx.session.user.id, callingId:input.callingId },    
      });
      ee.emit(Events.APPLICANT_CHANGE);
      
    } catch (error) {
      console.log(error);
    }
  }),
  
  getApplicantsByCalling: protectedProcedure
  .input(z.object({callingId: z.string()}))
  .query(async ({ ctx,input }) => {
    try {
      return await ctx.prisma.applicantRoom.findMany({         
        orderBy: {
          createdAt: "desc",
        },
        where:{
          applyStatus:{
            in:["pending","accepted"]
          },
          callingId:input.callingId,               
        },
        include:{
          Applicant:true,
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
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  getUserApplicationsAccepted: protectedProcedure
  .query(async ({ ctx }) => {
    try {
      return await ctx.prisma.applicantRoom.findMany({         
        orderBy: {
          createdAt: "desc",
        },
        where:{
          applyStatus:{
            in:["accepted"]
          },          
          applicantId:ctx.session.user.id               
        },
        include:{          
          Calling: {
            include: {
              User: true, // Include the User relation
            },
          },
          Applicant:true
        },
      });
    } catch (error) {
      console.log("error", error);
    }
  }),

  
  getMyApplicantsByCalling: protectedProcedure
  .input(z.object({callingId: z.string()}))
  .query(async ({ ctx,input }) => {
    try {
      return await ctx.prisma.applicantRoom.findMany({
        select: {        
          id:true,    
          applicantId:true,
          callingId:true,          
          applyStatus:true,           
          createdAt:true,
        },          
        orderBy: {
          createdAt: "desc",
        },
        where:{
          applicantId:ctx.session.user.id,
          callingId:input.callingId
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }),
  acceptApplicant:protectedProcedure
  .input(z.object({id: z.string()}))
  .mutation(async ({ ctx, input }) => {      
    try {
      const applicantRoom=await ctx.prisma.applicantRoom.update({
        where:{
          id:input.id
        },
        data: {            
          applyStatus:"accepted"
        },
      }); 
      
      await prisma.user.updateMany({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          roomId: input.id,
        },
      });
      await prisma.user.updateMany({
        where: {
          id: applicantRoom.applicantId,
        },
        data: {
          roomId: input.id,
        },
      });
      ee.emit(Events.ENTER_ROOM, {
        roomId: input.id,
        userId: ctx.session.user.id,
      });   
   
    } catch (error) {
      console.log(error);
    }       
    
  }),    
  rejectApplicant: protectedProcedure
  .input(z.object({id: z.string()}))
  .mutation(async ({ ctx, input }) => {      
    try {
      await ctx.prisma.applicantRoom.update({
        where:{
          id:input.id
        },
        data: {            
          applyStatus:"rejected"
        },
      });     
      ee.emit(Events.APPLICANT_CHANGE);
    } catch (error) {
      console.log(error);
    }       
  
  }),    

      //Actualiza la sala del usuario logeado y emite un evento personalizado llamado INGRESAR SALA mostrando al resto los atributos roomId y userId proporcionados,
  //se ha "agregado una sala a un usuario"
  addRoom: publicProcedure
  .input(z.object({ roomId: z.string(), userId: z.string() }))
  .mutation(async ({ input }) => {
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

  onApplicantChange: publicProcedure.subscription(() => {
    return observable<ApplicantRoomType[]>((emit) => {
      const onMessage = async () => {
        //busca a los usuarios de la sala especificada
        const applicantRooms = await prisma.applicantRoom.findMany({
          orderBy: {
            createdAt: "desc",
          },
          where:{
            applyStatus:{
              in:["pending","accepted"]
            },   
          },
          include:{
            Applicant:true,Calling:{
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
});