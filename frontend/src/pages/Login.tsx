import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();
  const isRegister = tab === 'register';

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="rp-logo" style={{ textAlign: 'center', marginBottom: 6 }}>RUN<span>PEAK</span></div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--rp-gray)', marginBottom: 28 }}>Accede en segundos y sigue tu ritmo.</p>

        <div className="login-tabs">
          <button className={'login-tab' + (!isRegister ? ' login-tab--active' : '')} onClick={() => setTab('login')}>Iniciar sesión</button>
          <button className={'login-tab' + (isRegister ? ' login-tab--active' : '')} onClick={() => setTab('register')}>Crear cuenta</button>
        </div>

        <button className="google-btn" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.27h2.92C16.66 14.2 17.64 11.9 17.64 9.2z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z" />
            <path fill="#FBBC05" d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.96H.96C.35 6.17 0 7.55 0 9s.35 2.83.96 4.04l3.01-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
          </svg>
          Continuar con Google
        </button>

        <div className="login-divider">
          <div className="login-divider-line" />
          <span style={{ fontSize: 11, color: 'var(--rp-gray)', textTransform: 'uppercase', letterSpacing: 0.5 }}>o</span>
          <div className="login-divider-line" />
        </div>

        {isRegister && (
          <div className="rp-field" style={{ marginBottom: 14 }}>
            <label>Nombre completo</label>
            <div className="rp-field-value" style={{ color: 'var(--rp-gray)' }}>Tu nombre</div>
          </div>
        )}
        <div className="rp-field" style={{ marginBottom: 14 }}>
          <label>Correo electrónico</label>
          <div className="rp-field-value" style={{ color: 'var(--rp-gray)' }}>tu@email.com</div>
        </div>
        <div className="rp-field" style={{ marginBottom: 22 }}>
          <label>Contraseña</label>
          <div className="rp-field-value" style={{ color: 'var(--rp-gray)' }}>&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;</div>
        </div>

        <button className="rp-btn-primary" style={{ width: '100%' }} onClick={() => navigate('/')}>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--rp-gray)', marginTop: 20 }}>
          {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setTab(isRegister ? 'login' : 'register'); }} style={{ fontWeight: 700 }}>
            {isRegister ? 'Iniciar sesión' : 'Crear cuenta'}
          </a>
        </p>
      </div>
    </div>
  );
}
