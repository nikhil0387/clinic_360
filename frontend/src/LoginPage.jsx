import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // login, forgot, reset

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const data = await login(email, password);
        if (data.role === 'patient') navigate('/dashboard');
        else if (data.role === 'doctor') navigate('/doctor-dashboard');
        else if (data.role === 'admin') navigate('/admin-dashboard');
      } else if (mode === 'forgot') {
        const res = await fetch('https://clinic-360.onrender.com/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
          setMessage('OTP sent to your email.');
          setMode('reset');
        } else {
          throw new Error(data.message);
        }
      } else if (mode === 'reset') {
        const res = await fetch('https://clinic-360.onrender.com/api/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, newPassword })
        });
        const data = await res.json();
        if (res.ok) {
          setMessage('Password reset successful. You can now login.');
          setMode('login');
        } else {
          throw new Error(data.message);
        }
      }
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface antialiased min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      
      {/* TopNavBar Simplified */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 h-16 shadow-sm shadow-slate-200/50">
        <Link to="/" className="text-lg md:text-xl font-bold text-slate-900 font-headline tracking-tight">Clinic 360</Link>
        <Link to="/" className="text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Return Home
        </Link>
      </header>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative overflow-hidden mt-20 md:mt-16 border border-slate-100">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-secondary"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight mb-2">
            {mode === 'login' ? 'Welcome Back' : mode === 'forgot' ? 'Forgot Password' : 'Reset Password'}
          </h2>
          <p className="text-on-surface-variant font-medium text-sm">
            {mode === 'login' ? 'Please enter your credentials to log in.' : mode === 'forgot' ? 'Enter your email to receive a reset OTP.' : 'Enter the OTP and your new password.'}
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-100 text-emerald-700 text-sm p-3 rounded-lg mb-6 border border-emerald-200 font-bold">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'login' || mode === 'forgot' || mode === 'reset' ? (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="email">Email Address</label>
              <input 
                id="email" type="email" required 
                readOnly={mode === 'reset'}
                className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm font-medium ${mode === 'reset' ? 'opacity-70' : ''}`}
                placeholder="name@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : null}

          {mode === 'login' && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest" htmlFor="password">Password</label>
                <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-bold text-secondary hover:underline uppercase tracking-tight">Forgot Password?</button>
              </div>
              <input 
                id="password" type="password" required 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm font-medium"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="otp">Enter OTP</label>
                <input 
                  id="otp" type="text" required 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm font-medium"
                  placeholder="6-digit OTP"
                  value={otp} onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="newPassword">New Password</label>
                <input 
                  id="newPassword" type="password" required 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm font-medium"
                  placeholder="••••••••"
                  value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'forgot' ? 'Send Reset OTP' : 'Reset Password'}
          </button>

          {mode !== 'login' && (
             <button type="button" onClick={() => setMode('login')} className="w-full text-center text-xs font-bold text-slate-500 hover:text-primary transition-colors">
                Back to Login
             </button>
          )}
        </form>

        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-secondary font-bold hover:underline transition-all">Sign Up</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
