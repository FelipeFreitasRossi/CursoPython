import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:3001';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro no login');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card max-w-md mx-auto" style={{ marginTop: '3rem' }}>
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Entrar</button>
          </form>
          <p className="text-center mt-4">
            Não tem conta? <Link to="/register" style={{ color: '#3776AB' }}>Cadastre-se</Link>
          </p>
        </div>
      </div>
    </>
  );
}