import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import './Auth.css';

export default function Auth() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const flipCard = () => setIsFlipped(!isFlipped);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/login`, loginData);
      localStorage.setItem('token', res.data.token);
      // Redireciona para a página de pagamento (ou diretamente para aulas se já tiver comprado? Melhor ir para pagamento)
      navigate('/courses');
    } catch (err: any) {
      setError(err.response?.data?.error || 'E-mail ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/register`, {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/courses');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar. Tente outro e-mail.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flip-container">
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Frente: Login */}
        <div className="flip-front">
          <div className="auth-card">
            <h2>Bem-vindo de volta</h2>
            <p>Faça login para acessar sua conta</p>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            <p className="toggle-text">
              Ainda não tem conta?{' '}
              <button type="button" onClick={flipCard} className="toggle-link">
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        {/* Verso: Cadastro */}
        <div className="flip-back">
          <div className="auth-card">
            <h2>Criar conta</h2>
            <p>Preencha os dados para começar</p>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Nome completo"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="E-mail"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Senha"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  required
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Confirmar senha"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="submit" disabled={loading} className="auth-button">
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>
            <p className="toggle-text">
              Já possui conta?{' '}
              <button type="button" onClick={flipCard} className="toggle-link">
                Fazer login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}