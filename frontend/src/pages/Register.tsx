import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const API_URL = 'http://localhost:3001';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    try {
      const res = await axios.post(`${API_URL}/api/register`, { email, password });
      localStorage.setItem('token', res.data.token);
      setSuccess('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro no cadastro');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="card max-w-md mx-auto" style={{ marginTop: '3rem' }}>
          <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
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
            <div className="form-group">
              <label>Confirmar senha</label>
              <input
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">Cadastrar</button>
          </form>
          <p className="text-center mt-4">
            Já tem conta? <Link to="/login" style={{ color: '#3776AB' }}>Faça login</Link>
          </p>
        </div>
      </div>
    </>
  );
}