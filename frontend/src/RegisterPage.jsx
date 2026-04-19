import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const RegisterPage = () => {
  const { register, sendRegistrationOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient', // default
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendRegistrationOtp(formData.email);
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password, formData.role, otp);
      
      // Navigate to dashboard automatically upon successful registration
      if (formData.role === 'patient') navigate('/dashboard');
      else if (formData.role === 'doctor') navigate('/doctor-dashboard');
      else if (formData.role === 'admin') navigate('/admin-dashboard');

    } catch (err) {
      setError(err.message || 'Failed to register account. Invalid OTP.');
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
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-secondary to-tertiary"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-primary font-headline tracking-tight mb-2">Create Account</h2>
          <p className="text-on-surface-variant font-medium text-sm">Join the Clinic 360 network.</p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container text-sm p-3 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="firstName">First Name</label>
                <input 
                  id="firstName" name="firstName" type="text" required 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm"
                  placeholder="John"
                  value={formData.firstName} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="lastName">Last Name</label>
                <input 
                  id="lastName" name="lastName" type="text" required 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm"
                  placeholder="Doe"
                  value={formData.lastName} onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="email">Email Address</label>
              <input 
                id="email" name="email" type="email" required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm"
                placeholder="john@example.com"
                value={formData.email} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="password">Password</label>
              <input 
                id="password" name="password" type="password" required 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm"
                placeholder="••••••••"
                value={formData.password} onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="role">Account Type</label>
              <div className="relative">
                <select 
                  id="role" name="role" required 
                  className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-sm font-semibold text-slate-700 cursor-pointer"
                  value={formData.role} onChange={handleChange}
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Medical Provider</option>
                  <option value="admin">Administrator</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Sending OTP...' : 'Continue to Verification'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndRegister} className="space-y-5">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600">We've sent a 6-digit verification code to <strong>{formData.email}</strong>.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest mb-1.5" htmlFor="otp">Verification Code</label>
              <input 
                id="otp" name="otp" type="text" required 
                maxLength="6"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none text-center text-xl font-bold tracking-[0.5em]"
                placeholder="------"
                value={otp} onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-6 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full mt-2 py-2 text-slate-500 font-semibold hover:text-primary transition-all text-sm"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary font-bold hover:underline transition-all">Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
