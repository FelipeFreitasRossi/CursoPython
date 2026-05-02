// src/config.ts
export const API_URL = import.meta.env.VITE_API_URL || 'https://cursopython-97q6.onrender.com';

// Para debug (opcional)
if (!import.meta.env.VITE_API_URL && import.meta.env.PROD) {
  console.warn('VITE_API_URL não definida em produção, usando fallback:', API_URL);
}