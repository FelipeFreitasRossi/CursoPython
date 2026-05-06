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

// ========== BANCO DE DADOS EM MEMÓRIA (substitua por banco real depois) ==========
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}
const users: User[] = [];

interface Purchase {
  userId: number;
  courseId: string;
  date: Date;
}
const purchases: Purchase[] = [];

// ========== MIDDLEWARES ==========
const allowedOrigins = [
  'https://cursopython.vercel.app',                         // domínio principal
  'https://cursopython-5xazq41f5-projetosfeitos.vercel.app', // preview dinâmico (substitua pelo seu)
  'https://cursopython-97q6.onrender.com',                  // próprio backend
  'http://localhost:5173',                                  // desenvolvimento local
  'http://localhost:3001'                                   // loopback (opcional)
];

// Opcional: permitir qualquer subdomínio da Vercel via regex
const isVercelPreview = (origin: string | undefined) => {
  return origin?.endsWith('.vercel.app') || origin === 'https://cursopython.vercel.app';
};

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS bloqueado para: ${origin}`);
      callback(new Error('Origin not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.post('/api/Auth', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    const hasPurchased = purchases.some(p => p.userId === user.id && p.courseId === 'python-completo');
    res.json({ id: user.id, name: user.name, email: user.email, hasPurchased });
  } catch {
    res.status(403).json({ error: 'Token inválido' });
  }
});

// ========== PAGAMENTO – MERCADO PAGO ==========
app.post('/api/create-preference', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });
  const token = authHeader.split(' ')[1];
  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    userId = decoded.id;
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }

  try {
    const preference = new Preference(client);
    const body = {
      items: [
        {
          id: 'curso-python-completo',
          title: 'Curso Python Completo',
          quantity: 1,
          unit_price: 19.90,
          currency_id: 'BRL',
          description: 'Do zero ao avançado com projetos reais e correção automática.',
        },
      ],
      payer: { email: 'comprador@exemplo.com' },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses?success=true`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses?canceled=true`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/courses?pending=true`,
      },
      auto_return: 'approved',
      external_reference: userId.toString(),
      notification_url: `${process.env.WEBHOOK_URL || 'https://cursopython-97q6.onrender.com'}/webhook`,
    };
    const response = await preference.create({ body });
    res.json({ checkoutUrl: response.init_point });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Erro ao criar sessão de pagamento' });
  }
});

app.post('/webhook', express.json(), async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === 'payment') {
      const payment = await new Payment(client).get({ id: data.id });
      if (payment.status === 'approved') {
        const userId = parseInt(payment.external_reference!);
        if (!isNaN(userId)) {
          purchases.push({ userId, courseId: 'python-completo', date: new Date() });
          console.log(`✅ Pagamento confirmado para o usuário ${userId}`);
        }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).send('Erro no webhook');
  }
});

// ========== ROTA DE AULAS (MOCK) ==========
app.get('/api/aulas', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Não autorizado' });
  const token = authHeader.split(' ')[1];
  let userId: number;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    userId = decoded.id;
  } catch {
    return res.status(403).json({ error: 'Token inválido' });
  }
  const hasPurchased = purchases.some(p => p.userId === userId && p.courseId === 'python-completo');
  if (!hasPurchased) {
    return res.status(403).json({ error: 'Acesso negado. Você precisa adquirir o curso.' });
  }
  const aulas = [
    { id: 1, titulo: 'Introdução ao Python', descricao: 'Instalação, primeiro programa e conceitos básicos.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '15min' },
    { id: 2, titulo: 'Variáveis e tipos de dados', descricao: 'Números, strings, booleanos, conversões.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '20min' },
  ];
  res.json(aulas);
});

// ========== INICIALIZAÇÃO ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

export default app;