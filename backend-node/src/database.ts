// Simula um banco de dados
export interface User {
  id: number;
  email: string;
  password: string; // hash
}

export const users: User[] = [];

// Função para buscar usuário por email
export const findUserByEmail = (email: string) => users.find(u => u.email === email);

// Função para adicionar usuário
export const addUser = (user: User) => {
  users.push(user);
  return user;
};