import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { register, login, getProfile } from './auth';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rotas públicas
app.get('/', (req, res) => {
  res.json({ message: 'Backend Node está funcionando!' });
});

app.post('/api/register', register);
app.post('/api/login', login);

// Rota protegida (exige token)
app.get('/api/profile', authenticateToken, getProfile);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});