//C:\Users\Ecotech\Desktop\Jeronimo Alderete\finanflix-prod-main\src\models\userModel.ts

import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

const userSchema = new Schema<IUser>(
  {
    discordId: { type: String },
    discordConnected: { type: Boolean, default: false },
    discordConnectedAt: { type: Date },
    username: {
      type: String,
      unique: [true, 'El nombre de usuario ya existe'],
      // maxlength: [15, "The username cannot be longer than 15 characters."],
    },
    firstName: {
      type: String,
      validate: {
        validator: function (v: string) {
          return v === '' || (v.length >= 2 && v.length <= 20);
        },
        message: 'El nombre debe tener entre 2 y 20 caracteres',
      },
    },
    lastName: {
      type: String,
      validate: {
        validator: function (v: string) {
          return v === '' || (v.length >= 2 && v.length <= 20);
        },
        message: 'El apellido debe tener entre 2 y 20 caracteres',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password length should be greater than 6 characters'],
      // maxlength: [50, "Password cannot be longer than 50 characters"],
      select: true,
    },
    profileImage: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tel: { type: Number },
    coursesToClaim: [{ type: String }],
    enrolledCourses: [{ type: Schema.Types.ObjectId, ref: 'Courses' }],
    suscription: {
      type: { type: String },
      isActive: { type: Boolean },
      orderDate: { type: Date },
      endDate: { type: Date },
      status: { type: String, enum: ['active', 'cancelled', 'expired', 'unpaid'] },
    },
    status: {
      type: String,
      enum: {
        values: ['Activo', 'Inactivo', 'Bloqueado'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'Activo',
    },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// export default mongoose.models.Users || mongoose.model('Users', userSchema);

const UsersModel =
  (mongoose.models && mongoose.models.Users) || mongoose.model('Users', userSchema);

export default UsersModel;
