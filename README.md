#Customer Support Chatbot
A full-stack customer support application with a real-time chatbot interface that connects customers to FAQ information, ticket status, and human agents.
Features

Real-time chat interface using Socket.IO
User authentication with JWT
Automated FAQ responses
Ticket tracking system
Seamless handoff to human agents when needed


#project directory
.
├── chatbot-front               # React frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Chatbot.jsx     # Chat interface
│   │   │   └── Login.jsx       # User authentication
├── models                      # MongoDB schemas
│   ├── Customer.ts             # Customer data model
│   ├── FAQ.ts                  # FAQ data model
│   └── Ticket.ts               # Support ticket model
├── servers                     # Microservices
│   ├── crmServer.ts            # Customer authentication service
│   ├── faqServer.ts            # FAQ lookup service
│   └── ticketingServer.ts      # Ticket management service
├── services
│   └── chatbotServices.ts      # Shared business logic
├── chatbot.ts                  # Main Socket.IO server
└── initDB.ts                   # Database initialization script

# instalation 
git clone https://github.com/0Bleak/entreprise-patterns.git
cd entreprise-patterns 
npm i
cd chatbot-front 
npm i
cd ..
ts-node initDB.ts
npm run dev
cd chatbot-front
npm run dev
