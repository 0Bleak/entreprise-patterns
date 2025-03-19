import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const FAQ_API = process.env.FAQ_API || "http://localhost:3003/faqs";
const TICKET_API = process.env.TICKET_API || "http://localhost:3002/tickets";


export async function fetchFAQs() {
  try {
    const response = await axios.get(FAQ_API);
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}


export async function fetchTickets(customerId: string) {
  try {
    const response = await axios.get(`${TICKET_API}/user/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

export async function checkFAQ(userMessage: string) {
  try {
    const faqs = await fetchFAQs();
    const foundFAQ = faqs.find((faq: any) =>
      faq.question.toLowerCase() === userMessage.toLowerCase() ||
      faq.question.toLowerCase().includes(userMessage.toLowerCase())
    );
    return foundFAQ ? foundFAQ.answer : null;
  } catch (error) {
    console.error("Error checking FAQ:", error);
    return null;
  }
}




export async function scatterGather(customerId: string, message: string) {
  const [faqAnswer, tickets] = await Promise.all([
    checkFAQ(message),
    fetchTickets(customerId),
  ]);

  return { faqAnswer, tickets };
}