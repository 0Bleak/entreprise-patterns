import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Ticket, { ITicket } from '../models/Ticket';
import cors from 'cors';
import { ObjectId } from 'mongodb';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/crm')
  .then(() => console.log('Connected to MongoDB (Ticketing)'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/health', (req: Request, res: Response): void => {
  res.status(200).send('OK');
});

app.get('/tickets/user/:customerId', async (req: Request, res: Response): Promise<void> => {
  try {
    const customerId = new ObjectId(req.params.customerId); 
    console.log("Fetching tickets for customerId:", customerId); 
    const tickets = await Ticket.find({ customerId });
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/tickets', async (req: Request, res: Response): Promise<void> => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Ticketing backend running on http://localhost:${PORT}`);
});