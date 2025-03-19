import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    customerId: string;
    issue: string;
    status: string;
}

const TicketSchema: Schema = new Schema({
    customerId: { type: String, required: true },
    issue: { type: String, required: true },
    status: { type: String, default: 'Open' }
});

export default mongoose.model<ITicket>('Ticket', TicketSchema);