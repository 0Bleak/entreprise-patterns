import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import FAQ, { IFAQ } from '../models/FAQ';

const app = express();
const PORT = 3003;

app.use(express.json());

async function checkFAQsInDB() {
  try {
    const faqs = await FAQ.find();
    console.log('FAQs in database:', faqs);
    if (faqs.length === 0) {
      console.log('WARNING: No FAQs found in database!');
    }
  } catch (error) {
    console.error('Error checking FAQs:', error);
  }
}

mongoose.connect('mongodb://localhost:27017/crm')
  .then(() => {
    console.log('Connected to MongoDB (CRM)');
    checkFAQsInDB();
  })
  .catch((err) => console.error('Failed to connect to MongoDB', err));

app.get('/health', (req: Request, res: Response): void => {
  res.status(200).send('OK');
});


app.get('/faqs', async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.query as string;
    const faqs = query
      ? await FAQ.find({ question: { $regex: query, $options: 'i' } })
      : await FAQ.find();
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`FAQ backend running on http://localhost:${PORT}`);
});
