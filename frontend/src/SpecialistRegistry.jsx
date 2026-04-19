import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const SpecialistRegistry = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getDashboardPath = (tab = '') => {
    if (!user) return '/login';
    let path = '/dashboard';
    if (user.role === 'doctor') path = '/doctor-dashboard';
    if (user.role === 'admin') path = '/admin-dashboard';
    return tab ? `${path}?tab=${tab}` : path;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/doctors`);
        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error('Failed to fetch doctors', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredDoctors = doctors.filter(doc => 
    `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col">
      {/* TopNavBar Component */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 h-16 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            className="md:hidden p-2 text-slate-900 dark:text-slate-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
          <Link to="/" className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-50 font-headline tracking-tight hover:opacity-80">
            Clinic 360
          </Link>
          <nav className="hidden md:flex items-center gap-6 font-manrope tracking-tight font-semibold">
            <Link to={getDashboardPath()} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Dashboard</Link>
            <Link to={getDashboardPath('patients')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Patients</Link>
            <Link to="/specialists" className="text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1">Schedule</Link>
            <Link to={getDashboardPath('reports')} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Reports</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => alert('No new notifications')} className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">notifications</span>
          </button>
          <Link to="/dashboard" className="hidden sm:block p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">settings</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-transparent hover:ring-secondary transition-all">
                <div className="w-full h-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                  {user.firstName?.[0] || 'U'}
                </div>
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-error/10 text-error transition-all">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-secondary transition-colors">Login</Link>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 md:hidden animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-6 gap-4 font-semibold">
              <Link to={getDashboardPath()} className="text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to={getDashboardPath('patients')} className="text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Patients</Link>
              <Link to="/specialists" className="text-teal-600 dark:text-teal-400" onClick={() => setIsMenuOpen(false)}>Schedule</Link>
              <Link to={getDashboardPath('reports')} className="text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMenuOpen(false)}>Reports</Link>
            </nav>
          </div>
        )}
      </header>
      
      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto flex-1 w-full">
        {/* Hero Section */}
        <section className="mb-8 md:mb-12">
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">Find Your Specialist</h1>
          <p className="text-on-surface-variant max-w-2xl text-base md:text-lg leading-relaxed">Expert care tailored to your wellness journey. Browse our directory of world-class practitioners committed to your health.</p>
        </section>

        {/* Filter Shell */}
        <section className="mb-12">
          <div className="bg-surface-container-low p-4 md:p-6 rounded-xl flex flex-col lg:flex-row gap-4 md:gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-primary mb-2 font-label">Search by Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input 
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm outline-none" 
                  placeholder="Search specialists..." 
                  type="text"
                  value={query}
                  onChange={(e) => {
                    const newParams = new URLSearchParams(searchParams);
                    newParams.set('query', e.target.value);
                    setSearchParams(newParams);
                  }}
                />
              </div>
            </div>
            <div className="w-full lg:w-48">
              <label className="block text-sm font-semibold text-primary mb-2 font-label">Specialization</label>
              <select className="w-full py-3 px-4 bg-surface-container-lowest border-none focus:ring-2 focus:ring-secondary rounded-lg text-sm outline-none">
                <option>All</option>
                <option>Cardiology</option>
                <option>Neurology</option>
                <option>Pediatrics</option>
              </select>
            </div>
            <button className="w-full lg:w-auto bg-gradient-to-br from-[#00193c] to-[#002d62] text-white px-8 py-3 rounded-lg font-semibold text-sm shadow-lg shadow-primary/10 transition-all hover:opacity-90 active:scale-95">
                Apply Filters
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-6">
            <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] md:text-xs font-semibold font-label flex items-center gap-1">
                Available Today <span className="material-symbols-outlined text-[14px]">close</span>
            </span>
            <button className="text-xs font-medium text-secondary hover:underline ml-2">Clear filters</button>
          </div>
        </section>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <p className="text-on-surface-variant text-lg animate-pulse">Loading specialists...</p>
            </div>
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div key={doc._id} className="group bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 border border-slate-100 flex flex-col h-full">
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img 
                    alt={`Dr. ${doc.firstName} ${doc.lastName}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={doc.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBm9Sol-5Th4rDmft7lt-Gco2d8No154S3A9_eajzvMV9q1gh-XhAprsf4TI0dPs7x36aSaDXoiIPuTXf1AgQNgZyjLgtaNCgqOdPgiEpzsgUabqCAdm2QR_chExD7h99MGrXUe_4QCKM6ddWr_-S4K7AGLI0Xofh1dQrmeurRO7CcFppePqFe6mpAYvjwZeM2QHWE9W2Udwsu0yrLOv9Sg_25Ck6HT_NexmO61qN_uAZzE5GbeywRepO63zQIRmNVPjykq1h7-Hnih"}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-amber-500 text-lg" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="text-xs font-bold text-primary">4.9</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-headline text-lg md:text-xl font-bold text-primary mb-1">Dr. {doc.firstName} {doc.lastName}</h3>
                  <p className="text-secondary font-semibold text-xs md:text-sm mb-4">{doc.specialization || "General Specialist"}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      <span className="text-[10px] md:text-xs font-medium">{doc.experience || "10+"}y exp.</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      <span className="text-[10px] md:text-xs font-medium">Certified</span>
                    </div>
                  </div>
                  <Link to={`/doctor?id=${doc._id}`} className="mt-auto w-full py-3 bg-gradient-to-br from-[#00193c] to-[#002d62] text-white rounded-lg font-bold text-xs md:text-sm transition-all hover:shadow-xl active:scale-95 block text-center">
                      Book Appointment
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-on-surface-variant text-lg">No specialists found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-16 flex justify-center items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-sm">1</button>
          <button className="hidden sm:block w-10 h-10 rounded-lg bg-surface-container-low text-primary font-bold text-sm hover:bg-surface-container-high transition-colors">2</button>
          <button className="hidden sm:block w-10 h-10 rounded-lg bg-surface-container-low text-primary font-bold text-sm hover:bg-surface-container-high transition-colors">3</button>
          <span className="px-2 text-outline">...</span>
          <button className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* Footer Area */}
      <footer className="bg-surface-container py-12 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <span className="font-headline text-2xl font-extrabold text-primary tracking-tighter">Clinic 360</span>
            <p className="text-on-surface-variant mt-2 max-w-xs text-sm">Redefining health administration through elegance and precision.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs uppercase tracking-widest text-primary mb-2">Connect</span>
              <a className="text-sm text-on-surface-variant hover:text-secondary" href="#">Patient Portal</a>
              <a className="text-sm text-on-surface-variant hover:text-secondary" href="#">Provider Login</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-xs uppercase tracking-widest text-primary mb-2">Policy</span>
              <a className="text-sm text-on-surface-variant hover:text-secondary" href="#">Privacy Policy</a>
              <a className="text-sm text-on-surface-variant hover:text-secondary" href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SpecialistRegistry;
