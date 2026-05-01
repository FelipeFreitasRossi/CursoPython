import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users, addUser, findUserByEmail } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

// Cadastro
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Verifica se usuário já existe
  if (findUserByEmail(email)) {
    return res.status(400).json({ error: 'Email já cadastrado' });
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria novo usuário
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword
  };
  addUser(newUser);

  // Gera token JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.status(201).json({ token, user: { id: newUser.id, email: newUser.email } });
};

// Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });

  res.json({ token, user: { id: user.id, email: user.email } });
};

// Rota protegida de exemplo: perfil
export const getProfile = (req: Request, res: Response) => {
  // O middleware (que criaremos depois) adiciona `req.userId`
  const userId = (req as any).userId;
  const user = users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  res.json({ id: user.id, email: user.email });
};