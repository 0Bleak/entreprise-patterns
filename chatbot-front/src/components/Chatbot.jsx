import { useState, useEffect } from "react";
import { Container, TextField, Button, Paper, Typography } from "@mui/material";
import io from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:3004");

export default function Chatbot() {
  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id || "";
        console.log("Decoded customerId:", id); 
        setCustomerId(id);

        socket.emit("user_connected", id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }

    socket.on("bot_response", (response) => {
      let responseText = "";

      if (response.type === "faq" && response.answer) {
        responseText = response.answer;
      } else if (response.type === "ticket" && response.status) {
        responseText = `Your ticket status is: ${response.status}`;
      } else if (response.type === "human" && response.message) {
        responseText = response.message;
      }

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: responseText, sender: "bot" },
      ]);
    });

    socket.on("error", (error) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: error.message, sender: "bot" },
      ]);
    });

    return () => {
      socket.off("bot_response");
      socket.off("error");
      socket.off("user_data");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("user_message", { message: input, customerId });

    setInput("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper sx={{ p: 2, height: "500px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Chatbot</Typography>
        {messages.map((msg, i) => (
          <Typography
            key={i}
            sx={{
              p: 1,
              mb: 1,
              bgcolor: msg.sender === "user" ? "primary.light" : "grey.300",
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              borderRadius: 1,
            }}
          >
            {msg.text}
          </Typography>
        ))}
      </Paper>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        sx={{ mt: 2 }}
      />
      <Button fullWidth variant="contained" color="primary" onClick={sendMessage} sx={{ mt: 1 }}>
        Send
      </Button>
    </Container>
  );
}