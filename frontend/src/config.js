// Lógica para escolher a URL da API
export const API_URL = window.location.href.includes('localhost')
  ? 'http://localhost:3001' // URL do backend local
  : process.env.REACT_APP_API_URL; // URL do backend na Vercel  