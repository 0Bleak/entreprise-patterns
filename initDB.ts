import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { ObjectId } from 'mongodb';
import Customer from './models/Customer';
import FAQ from './models/FAQ';
import Ticket from './models/Ticket';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/crm';

interface CustomerType {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
}

const fakeCustomers: CustomerType[] = [
  { _id: new ObjectId(), name: 'John Doe', email: 'john@example.com', phone: '1234567890', password: 'password123' },
  { _id: new ObjectId(), name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', password: 'password456' },
  { _id: new ObjectId(), name: 'Alice Johnson', email: 'alice@example.com', phone: '1122334455', password: 'password789' }
];

const fakeFAQs = [
  { question: 'How do I reset my password?', answer: 'Use the "Forgot Password" link on the login page.' },
  { question: 'How do I update my email?', answer: 'Go to your account settings and update your email.' },
  { question: 'How do I contact support?', answer: 'Call us at 1-800-123-4567 or email support@example.com.' }
];

const fakeTickets = [
  { customerId: fakeCustomers[0]._id, issue: 'Login problem', status: 'Open' },
  { customerId: fakeCustomers[1]._id, issue: 'Payment failed', status: 'Open' },
  { customerId: fakeCustomers[2]._id, issue: 'Account locked', status: 'Closed' }
];

async function initDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { dbName: 'crm' });
    console.log('Connected to MongoDB (CRM database)');

    console.log('Dropping the database...');
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully.');

    console.log('Hashing passwords...');
    const hashedCustomers = await Promise.all(
      fakeCustomers.map(async (customer) => ({
        ...customer,
        password: await bcrypt.hash(customer.password, 10)
      }))
    );

    console.log('Inserting customers...');
    await Customer.insertMany(hashedCustomers);
    console.log('Customers inserted successfully.');

    console.log('Inserting FAQs...');
    await FAQ.insertMany(fakeFAQs);
    console.log('FAQs inserted successfully.');

    console.log('Inserting tickets...');
    await Ticket.insertMany(fakeTickets);
    console.log('Tickets inserted successfully.');

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

initDB();