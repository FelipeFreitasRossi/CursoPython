// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error(
    '❌ VITE_API_URL não está definida! Verifique as variáveis de ambiente na Vercel.\n' +
    'Em desenvolvimento local, crie um arquivo .env.local com VITE_API_URL=http://localhost:3001'
  );
}