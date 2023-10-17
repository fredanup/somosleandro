import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { videoSchema } from "utils/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "server/env";
export const videoRouter = createTRPCRouter({ 


    ////Creación de url firmada para el vídeo  registrado con clave Key en S3
    createS3UserVideo: protectedProcedure
      .input(z.object({ key: z.string() }))
      .mutation(async ({ ctx, input }) => {      
        const { s3 } = ctx;
          const userId=ctx.session.user.id;
          const { key } = input;
          const putObjectCommand = new PutObjectCommand({
            Bucket: env.AWS_S3_BUCKET_NAME,
            Key: `videos/${userId}/${key}`,//Key: es la ruta dónde se alojará el objeto y key: es el nombre del archivo
            
          });        
          return await getSignedUrl(s3, putObjectCommand);
  
      }),
  
    //Creación de video en Prisma
      createDbUserVideo: protectedProcedure
      .input(videoSchema)
      .mutation(async ({ ctx, input }) => {      
        
        try {
          await ctx.prisma.video.create({
            data: {
              title: input.title,
              author: input.author,
              key:input.key,
              userId:ctx.session.user.id
            },
          });
        } catch (error) {
          console.log(error);
        }       
  
      }),
  
      getUserVideos: protectedProcedure
      .input(z.object({userId:z.string()}))
      .query(async ({ ctx, input }) => {
        const videoMetaData = await ctx.prisma.video.findMany({
          select: {
            author: true,
            title: true,
            key: true,
          },
          where: {
            userId: input.userId
          }
        });
      
        const { s3 } = ctx;
        const listObjectsOutput = await s3.listObjectsV2({
          Bucket: env.AWS_S3_BUCKET_NAME,
          Prefix: `videos/${input.userId}`,//Prefix: es la ruta de donde se listarán los objetos
        });
      
        const combinedList = videoMetaData.map((video) => {
          let s3Object;
          if (listObjectsOutput.Contents) {
            s3Object = listObjectsOutput.Contents.find((obj) => obj.Key === video.key);
          }
          return {
            ...video,
            s3Object
          };
        });
        
        return combinedList;
      }),
      
            
  });