import { paymentSchema } from "../../utils/auth";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";



export const paymentRouter = createTRPCRouter({    
    processPayment: protectedProcedure
    .input(paymentSchema)
    .mutation(async ({ ctx, input }) => {      
      try {      
        /*  
        const paymentData=await ctx.prisma.payment.create({
          data: {            
              transaction_amount:input.transactionAmount,
              token:input.token,
              description:input.description,
              installments:input.installments,
              payment_method_id:input.paymentMethodId,
              issuer_id:input.issuerId,
              payer:ctx.session.user.id,
          },
        }); 
        
        mercadopago.configurations.setAccessToken(env.MERCADO_PAGO_SAMPLE_ACCESS_TOKEN);
        
        const paymentData = {
          transaction_amount: input.transactionAmount,
          token: input.token,
          description: input.description,
          installments:input.installments,
          payment_method_id: input.paymentMethodId,
          issuer_id: input.issuerId,
          payer: {
            email: ctx.session.user.email as string,
            identification: {
              type: input.docType,
              number: input.docNumber
            }
          }};
         
          const response = await mercadopago.payment.save(paymentData);
          return {
            success: true,
            message: 'Pago procesado con éxito',
            data: {              
              status: response.status,              
            },
          };
     */
      } catch (error) {
        console.error(error);
        throw new TRPCError({ message: 'Hubo un error al procesar el pago', code: "BAD_REQUEST" });
      }
    }),
 })