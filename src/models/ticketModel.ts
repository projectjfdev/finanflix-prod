import { ITicket } from '@/interfaces/ticket';
import mongoose, { Schema } from 'mongoose';

const ticketSchema = new Schema<ITicket>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    title: String,
    description: String,
    category: String,
    priority: Number,
    progress: Number,
    status: {
      type: String,
      enum: ['Pendiente', 'En revisión', 'Solucionado'],
      default: 'Pendiente',
    },
    active: Boolean,
    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        senderName: { type: String, required: true }, // Add this line
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

ticketSchema.index({ userId: 1 });
const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
export default Ticket;
