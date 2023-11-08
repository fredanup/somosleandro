import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { documentSchema } from '../../utils/auth';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const documentRouter = createTRPCRouter({
  //Creación de url firmada para el documento registrado con clave Key en S3
  createS3UserDocument: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { s3 } = ctx;
      const userId = ctx.session.user.id;
      const { key } = input;
      const putObjectCommand = new PutObjectCommand({
        Bucket: 'somosleandro',
        Key: `documents/${userId}/${key}`, //key: es la ruta dónde se alojará el objeto
      });
      return await getSignedUrl(s3, putObjectCommand);
    }),

  //Creación de documento en Prisma
  createDbUserDocument: protectedProcedure
    .input(documentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.document.create({
          data: {
            document: input.document,
            key: input.key,
            userId: ctx.session.user.id,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),

  getUserDocuments: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const documentMetaData = await ctx.prisma.document.findMany({
        select: {
          document: true,
          key: true,
        },
        where: {
          userId: input.userId,
        },
      });

      const { s3 } = ctx;
      const listObjectsOutput = await s3.listObjectsV2({
        Bucket: 'somosleandro',
        Prefix: `documents/${input.userId}`, //Prefix: es la ruta de donde se listarán los objetos
      });

      const combinedList = documentMetaData.map((document) => {
        let s3Object;
        if (listObjectsOutput.Contents) {
          s3Object = listObjectsOutput.Contents.find(
            (obj) => obj.Key === document.key,
          );
        }
        return {
          ...document,
          s3Object,
        };
      });

      return combinedList;
    }),
});
