import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  name: z.string(),
});

export const videoSchema = z.object({
  title: z.string(),
  author: z.string(),
  key: z.string(),
});

export const documentSchema = z.object({
  document: z.string(),
  key: z.string(),
});

export const eventCallSchema = z.object({
  nroPostulantes: z.number(),
  fechaLimitePostulacion: z.date(),
  tipoEvento: z.string(),
  fechaEvento: z.date(),
  direccionEvento: z.string(),
  duracionServicio: z.string(),
  tieneEquipoSonido: z.boolean(),
  detalles: z.string(),
  musicoRequerido: z.string(),
  convocatoriaTomada: z.boolean(),
});

export const teachingCallSchema = z.object({
  nroPostulantes: z.number(),
  fechaLimitePostulacion: z.date(),
  instrumentoInteres: z.string(),
  tieneInstrumento: z.boolean(),
  edadEstudiante: z.number(),
  repertorioInteres: z.string(),
  clasesADomicilio: z.boolean(),
  tiempoContrata: z.string(),
  horarioDisponible: z.string(),
  detalles: z.string(),
  convocatoriaTomada: z.boolean(),
});

export const callingSchema = z.object({
  applicantNumber: z.number(),
  deadlineAt: z.date(),
  instrumentLiked: z.string(),
  hasInstrument: z.boolean().nullable(),
  studentAge: z.number().nullable(),
  repertoireLiked: z.string().nullable(),
  atHome: z.boolean().nullable(),
  contractTime: z.string(),
  availableSchedule: z.string(),
  details: z.string().nullable(),
  callingTaken: z.boolean(),
  eventType: z.string(),
  eventDate: z.date().nullable(),
  eventAddress: z.string(),
  serviceLength: z.string(),
  hasSoundEquipment: z.boolean(),
  musicianRequired: z.string(),
  callingType: z.string(),
});

export const editCallingSchema = callingSchema.extend({
  id: z.string(),
});

export const userCallingSchema = editCallingSchema.extend({
  User: z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
  }),
});

export const userSchema = z.object({
  name: z.string().nullable(),
  lastName: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
});

export const userTypeSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    phone: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
  })
  .nullable();

export const stakeholderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  callingId: z.string(),
  roomId: z.string(),
  stakeholderType: z.string(),
  applyStatus: z.string(),
});

export const userStakeholderSchema = stakeholderSchema.extend({
  createdAt: z.date(),
  User: z.object({
    id: z.string(),
    name: z.string().nullable(),
    lastName: z.string().nullable(),
    email: z.string().nullable(),
    address: z.string().nullable(),
    phone: z.string().nullable(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
  }),
});

export const paymentSchema = z.object({
  transactionAmount: z.number(),
  token: z.string(),
  description: z.string(),
  installments: z.number(),
  paymentMethodId: z.string(),
  issuerId: z.string(),
  docType: z.string(),
  docNumber: z.string(),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
export type IVideoDemo = z.infer<typeof videoSchema>;
export type IEventCall = z.infer<typeof eventCallSchema>;
export type ITeachingCall = z.infer<typeof teachingCallSchema>;
export type ICalling = z.infer<typeof callingSchema>;
export type IEditCalling = z.infer<typeof editCallingSchema>;
export type IUserCalling = z.infer<typeof userCallingSchema>;
export type IStakeholder = z.infer<typeof stakeholderSchema>;
export type IUser = z.infer<typeof userSchema>;
export type IUserStakeHolder = z.infer<typeof userStakeholderSchema>;
export type IUserType = z.infer<typeof userTypeSchema>;
export type IPaymentType = z.infer<typeof paymentSchema>;
