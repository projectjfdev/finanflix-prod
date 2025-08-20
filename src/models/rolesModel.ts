import mongoose, { Schema } from 'mongoose';

const statusEnum = ['claimed', 'expired', 'pending', 'notClaimed'];

const rolSchema = new Schema<any>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users'},
    discordId: {
      type: String,
    },
    courses: [
      {
        rolId: {
          type: String,
        },
        rolIdExpired: {
          type: String,
        },
        title: {
          type: String,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'notClaimed',
        },
        orderDate: {
          type: Date,
        },
        source: { type: String, enum: ['manual', 'subscription'], default: 'manual' },
        subscriptionType: { type: String, enum: ['mensual', 'semestral', 'anual', null] },
        rolNumber: {
          type: Number,
          enum: [0, 1, 2], // Trading pro (Primer mes 1 rol, 2do mes otro rol y 3er mes rol vencido) // Si es 0 no es Trading Pro
        },
      },
    ],
    sub: {
      type: {
        type: String,
      },
      rol: {
        id: {
          type: String,
          default: process.env.DISCORD_ROLE_BASIC_MENSUAL,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'notClaimed',
        },
        orderDate: {
          type: Date,
        },
        rolNumber: {
          type: Number,
          enum: [0, 1, 2], // Para basica, si tiene menos de 3 cursos completados tiene el rol 1, si tiene 3 o más se asigna el rol 2
        },
      },
      rolVencido: {
        id: {
          type: String,
          default: process.env.DISCORD_ROLE_BASIC_MENSUAL_VENCIDO,
        },
        status: {
          type: String,
          enum: statusEnum,
          default: 'notClaimed',
        },
        orderDate: {
          type: Date,
        },
      },
    },
  },
  { timestamps: true }
);

rolSchema.index({ userId: 1 });
rolSchema.index({ 'courses.status': 1, 'courses.orderDate': 1 });

const Rol = mongoose.models.Rol || mongoose.model('Rol', rolSchema);
export default Rol;
