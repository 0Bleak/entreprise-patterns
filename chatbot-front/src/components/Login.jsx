import { useState } from "react";
import { Container, TextField, Button, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post("http://localhost:3001/login", { email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        console.log(data.token)
        setIsAuthenticated(true);
        navigate("/chat"); 
      } else {
        setError("Invalid credentials");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Login failed");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Login</Typography>
        <TextField fullWidth label="Email" variant="outlined" sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField fullWidth label="Password" type="password" variant="outlined" sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>Login</Button>
      </Paper>
    </Container>
  );
}