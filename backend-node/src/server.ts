import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

// Configuração do Mercado Pago (usando Access Token de produção ou teste)
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// Banco em memória (substituir por PostgreSQL em produção)
const users: any[] = [];
const purchases: { userId: number; courseId: string; date: Date }[] = [];

// ========== MIDDLEWARES ==========
app.use(cors());
app.use(express.json());

// ========== ROTAS DE AUTENTICAÇÃO ==========
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

// ========== CRIA PREFERÊNCIA DE PAGAMENTO (MERCADO PAGO) ==========
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
      items: [
        {
          title: 'Curso Python Completo',
          quantity: 1,
          unit_price: 19.90,
          currency_id: 'BRL',
          description: 'Do zero ao avançado com projetos reais e correção automática.',
        },
      ],
      payer: {
        email: 'comprador@exemplo.com', // será substituído pelo email real do usuário se disponível
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cursos?success=true`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cursos?canceled=true`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cursos?canceled=true`,
      },
      auto_return: 'approved',
      external_reference: userId.toString(),
      notification_url: `${process.env.WEBHOOK_URL || 'https://seudominio.com'}/webhook`,
    };
    const response = await preference.create({ body });
    res.json({ checkoutUrl: response.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
  }
});

// ========== WEBHOOK MERCADO PAGO ==========
app.post('/webhook', express.json(), async (req, res) => {
  try {
    const { type, data } = req.body;
    if (type === 'payment') {
      const paymentId = data.id;
      const payment = await new Payment(client).get({ id: paymentId });
      if (payment.status === 'approved') {
        const userId = parseInt(payment.external_reference!);
        const courseId = 'python-completo';
        if (!isNaN(userId)) {
          purchases.push({ userId, courseId, date: new Date() });
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

// ========== ROTA DE AULAS (PROTEGIDA, APÓS COMPRA) ==========
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
  if (!hasPurchased) {
    return res.status(403).json({ error: 'Acesso negado. Você precisa adquirir o curso.' });
  }
  const aulas = [
    { id: 1, titulo: 'Introdução ao Python', descricao: 'Instalação, primeiro programa e conceitos básicos.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '15min' },
    { id: 2, titulo: 'Variáveis e tipos de dados', descricao: 'Números, strings, booleanos, conversões.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '20min' },
    { id: 3, titulo: 'Estruturas de controle', descricao: 'if, else, elif, loops for e while.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '25min' },
    { id: 4, titulo: 'Funções e escopo', descricao: 'Definição, parâmetros, retorno e boas práticas.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '22min' },
    { id: 5, titulo: 'Projeto final: Dashboard com dados reais', descricao: 'Aplicando todos os conceitos em um projeto completo.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duracao: '45min' },
  ];
  res.json(aulas);
});

export default app;