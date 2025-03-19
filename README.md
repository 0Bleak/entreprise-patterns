# Customer Support Chatbot

A full-stack customer support application with a real-time chatbot interface that connects customers to FAQ information, ticket status, and human agents.

## Features

- **Real-time chat interface** using Socket.IO
- **User authentication** with JWT
- **Automated FAQ responses**
- **Ticket tracking system**
- **Seamless handoff to human agents** when needed

## Project Directory Structure
```
.
├── chatbot-front          # React frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Chatbot.jsx      # Chat interface
│   │   │   └── Login.jsx        # User authentication
├── models                 # MongoDB schemas
│   ├── Customer.ts        # Customer data model
│   ├── FAQ.ts             # FAQ data model
│   └── Ticket.ts          # Support ticket model
├── servers                # Microservices
│   ├── crmServer.ts       # Customer authentication service
│   ├── faqServer.ts       # FAQ lookup service
│   └── ticketingServer.ts # Ticket management service
├── services
│   └── chatbotServices.ts  # Shared business logic
├── chatbot.ts             # Main Socket.IO server
└── initDB.ts              # Database initialization script
```

## Installation

Follow these steps to set up and run the project:

```sh
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
```

## Usage
- Start the backend and frontend services as mentioned in the installation steps.
- Access the chatbot interface via the frontend.
- The chatbot will provide automated responses to FAQs and allow ticket tracking.
- If necessary, the chatbot can escalate conversations to human support agents.

## Technologies Used
- **Frontend:** React, Socket.IO
- **Backend:** Node.js, TypeScript, Express
- **Database:** MongoDB
- **Authentication:** JWT

