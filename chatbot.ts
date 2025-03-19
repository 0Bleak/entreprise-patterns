import express, { Application } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { fetchFAQs, fetchTickets, checkFAQ } from "./services/chatbotServices";

dotenv.config();

const app: Application = express();
const server: http.Server = http.createServer(app);
const io: Server = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }
});

app.use(express.json());
app.use(cors());

interface UserMessage {
  message: string;
  customerId: string;
}

interface BotResponse {
  type: "faq" | "ticket" | "human";
  answer?: string;
  status?: string;
  message?: string;
}

io.on("connection", (socket: Socket) => {
  console.log(`[+] User connected: ${socket.id}`);

  socket.on("user_connected", async (customerId: string) => {
    console.log(`[*] Fetching data for user: ${customerId}`);

    try {
      const [tickets, faqs] = await Promise.all([fetchTickets(customerId), fetchFAQs()]);
      socket.emit("user_data", { tickets, faqs });
    } catch (error) {
      console.error("[!] Error fetching user data:", (error as Error).message);
      socket.emit("error", { message: "Failed to fetch user data" });
    }
  });

  socket.on("user_message", async ({ message, customerId }: UserMessage) => {
    console.log(`[*] User ${customerId} sent: ${message}`);

    try {
      let response: BotResponse;

      if (message.toLowerCase().includes("ticket") || message.toLowerCase().includes("issue")) {
        const tickets = await fetchTickets(customerId);
        response = { type: "ticket", status: tickets[0]?.status || "No tickets found" };
      } else {
        const faqAnswer = await checkFAQ(message);
        response = faqAnswer ? { type: "faq", answer: faqAnswer } : { type: "human", message: "Forwarding to a human agent..." };
      }

      socket.emit("bot_response", response);
    } catch (error) {
      console.error("[!] Message processing error:", (error as Error).message);
      socket.emit("error", { message: "Error processing your request" });
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] User disconnected: ${socket.id}`);
  });
});

const PORT: number = parseInt(process.env.PORT || "3004", 10);
server.listen(PORT, () => console.log(`Chatbot server running on http://localhost:${PORT}`));