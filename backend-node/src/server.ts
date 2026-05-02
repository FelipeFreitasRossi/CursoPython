import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

const users: any[] = [];
const purchases: { userId: number; courseId: string; date: Date }[] = [];

// 🔥 CORS CORRETO PARA PRODUÇÃO
const allowedOrigins = [
  'https://cursopython.vercel.app',
  'https://cursopython-97q6.onrender.com',
  'http://localhost:5173',
  'http://localhost:3001'
];

app.use(cors({
  origin: true,  // permite qualquer origem (apenas para testes)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// ========== ROTAS ==========
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, email, password: hashed };
  users.push(user);
  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email } });
});

app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const hasPurchased = purchases.some(p => p.userId === user.id && p.courseId === 'python-completo');
    res.json({ id: user.id, email: user.email, hasPurchased });
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
});

app.post('/api/create-preference', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });
  const token = authHeader.split(' ')[1];
  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    userId = decoded.id;
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
  try {
    const preference = new Preference(client);
    const body = {
      items: [{ id: 'curso-python-completo', title: 'Curso Python Completo', quantity: 1, unit_price: 19.90, currency_id: 'BRL', description: 'Do zero ao avançado com projetos reais e correção automática.' }],
      payer: { email: 'comprador@exemplo.com' },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/aulas?success=true`,
        failure: `${process.env.FRONTEND_URL}/cursos?canceled=true`,
        pending: `${process.env.FRONTEND_URL}/cursos?pending=true`,
      },
      auto_return: 'approved',
      external_reference: userId.toString(),
      notification_url: `${process.env.WEBHOOK_URL}/webhook`
    };
    const response = await preference.create({ body });
    res.json({ checkoutUrl: response.init_point });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/webhook', express.json(), async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === 'payment') {
      const payment = await new Payment(client).get({ id: data.id });
      if (payment.status === 'approved') {
        const userId = parseInt(payment.external_reference!);
        purchases.push({ userId, courseId: 'python-completo', date: new Date() });
        console.log(`✅ Compra registrada para usuário ${userId}`);
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Erro');
  }
});

app.get('/api/aulas', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });
  const token = authHeader.split(' ')[1];
  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    userId = decoded.id;
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
  const hasPurchased = purchases.some(p => p.userId === userId && p.courseId === 'python-completo');
  if (!hasPurchased) return res.status(403).json({ error: 'Acesso negado' });
  const aulas = [
    { id: 1, titulo: 'Introdução ao Python', descricao: 'Instalação, primeiro programa e conceitos básicos.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '15min' },
    { id: 2, titulo: 'Variáveis e tipos de dados', descricao: 'Números, strings, booleanos, conversões.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '20min' },
    { id: 3, titulo: 'Estruturas de controle', descricao: 'if, else, elif, loops for e while.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '25min' },
    { id: 4, titulo: 'Funções e escopo', descricao: 'Definição, parâmetros, retorno e boas práticas.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '22min' },
    { id: 5, titulo: 'Projeto final: Dashboard com dados reais', descricao: 'Aplicando todos os conceitos em um projeto completo.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '45min' },
  ];
  res.json(aulas);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

export default app;