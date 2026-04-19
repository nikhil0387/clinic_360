import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const PatientDashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [fetchingAppointments, setFetchingAppointments] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchAppointments = async () => {
      setFetchingAppointments(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://clinic-360.onrender.com/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Failed to fetch appointments', err);
      } finally {
        setFetchingAppointments(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://clinic-360.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        updateProfile(data);
        setMessage('Settings updated successfully!');
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (error) {
      setMessage('Network error, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const upcomingAppointment = appointments.find(app => new Date(app.date) > new Date()) || appointments[0];

  return (
    <div className="text-on-background bg-slate-50 min-h-screen">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SideNavBar Component */}
      <nav className={`bg-[#00193c] dark:bg-slate-950 fixed left-0 top-0 h-screen w-64 flex flex-col py-6 shadow-2xl z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 py-4 flex justify-between items-center mb-4">
          <Link to="/" className="text-xl font-black text-white">Clinic 360</Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 space-y-1 px-4">
          <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span>
            Dashboard
          </button>
          <button onClick={() => { setActiveTab('appointments'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'appointments' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="event">event</span>
            Appointments
          </button>
          <button onClick={() => { setActiveTab('records'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'records' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="personal_injury">personal_injury</span>
            Patient Records
          </button>
          <button onClick={() => { setActiveTab('prescriptions'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'prescriptions' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="medical_services">medical_services</span>
            Prescriptions
          </button>
          <button onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'analytics' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="monitoring">monitoring</span>
            Analytics
          </button>
          <button onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} className={`w-full text-left rounded-xl flex items-center px-4 py-3 font-['Inter'] text-sm font-medium active:scale-98 transition-all duration-200 ${activeTab === 'settings' ? 'bg-[#0c6780] text-white shadow-lg shadow-[#0c6780]/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="settings">settings</span>
            Settings
          </button>
        </div>
        <div className="px-4 mt-auto space-y-1">
          <div className="flex items-center px-4 py-4 mb-4 bg-white/5 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs mr-3 flex-shrink-0">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold leading-none truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mt-1">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-slate-400 hover:text-white flex items-center px-4 py-2 font-['Inter'] text-xs font-medium transition-all">
            <span className="material-symbols-outlined mr-3 text-sm" data-icon="logout">logout</span>
            Logout
          </button>
        </div>
      </nav>

      {/* Header for Mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center px-4 z-40">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-primary">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="ml-4 font-bold text-primary">Patient Dashboard</span>
      </header>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 min-h-screen p-4 md:p-8 lg:p-12 pt-20 lg:pt-12">
        {activeTab === 'dashboard' && (
          <>
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:12 gap-6">
          <div>
            <p className="text-secondary font-semibold tracking-widest uppercase text-[10px] md:text-xs mb-2">Welcome Back</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Hello, {user?.firstName}.</h1>
            <p className="text-on-surface-variant mt-2 max-w-md text-sm md:text-base">
              {appointments.length > 0 
                ? `You have ${appointments.length} appointment${appointments.length > 1 ? 's' : ''} total. Next: ${upcomingAppointment ? new Date(upcomingAppointment.date).toLocaleDateString() : 'N/A'}`
                : "No appointments scheduled yet."}
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={() => setActiveTab('analytics')}
              className="flex-1 md:flex-none bg-surface-container-high hover:bg-surface-container-highest text-primary font-bold py-3 px-6 rounded-lg transition-all active:scale-95 flex items-center justify-center text-sm"
            >
              <span className="material-symbols-outlined mr-2" data-icon="download">download</span>
              Report
            </button>
            <Link to="/specialists" className="flex-1 md:flex-none bg-gradient-to-br from-primary to-primary-container text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 inline-block text-center text-sm">
              Book Now
            </Link>
          </div>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Health Stats Overview */}
          <section className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Stat Card: Blood Pressure */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-secondary-container/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary" data-icon="favorite" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                </div>
                <span className="text-[10px] font-bold text-on-tertiary-container bg-tertiary-fixed/30 px-2 py-1 rounded-full">OPTIMAL</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Blood Pressure</p>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">118/76 <span className="text-xs font-normal text-on-surface-variant">mmHg</span></h3>
            </div>

            {/* Stat Card: Heart Rate */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-secondary-container/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary" data-icon="speed">speed</span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant bg-surface-variant px-2 py-1 rounded-full">RESTING</span>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Heart Rate</p>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">68 <span className="text-xs font-normal text-on-surface-variant">BPM</span></h3>
            </div>

            {/* Stat Card: BMI */}
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-secondary-container/30 p-2 rounded-lg">
                  <span className="material-symbols-outlined text-secondary" data-icon="monitor_weight">monitor_weight</span>
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Body Mass Index</p>
              <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">24.2 <span className="text-xs font-normal text-on-surface-variant">BMI</span></h3>
            </div>

            {/* Featured Card: Wellness Timeline */}
            <div className="col-span-1 sm:col-span-3 bg-surface-container-low p-6 md:p-8 rounded-xl relative overflow-hidden border border-slate-100">
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-primary mb-6">Wellness Journey</h3>
                <div className="flex items-start gap-4 md:gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-xs" data-icon="check">check</span>
                    </div>
                    <div className="h-12 w-0.5 bg-secondary/30 my-1"></div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/30">
                      <span className="material-symbols-outlined text-xs" data-icon="radio_button_checked">radio_button_checked</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-8 md:space-y-12">
                    <div className="cursor-pointer hover:bg-white/40 p-2 rounded-lg transition-colors" onClick={() => setActiveTab('records')}>
                      <h4 className="font-bold text-primary text-sm md:text-base">Wellness Check</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Dr. Jenkins completed your physical. All markers within range.</p>
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-2">Oct 12</p>
                    </div>
                    <div className="cursor-pointer hover:bg-white/40 p-2 rounded-lg transition-colors" onClick={() => setActiveTab('records')}>
                      <h4 className="font-bold text-primary text-sm md:text-base">Dental Hygiene</h4>
                      <p className="text-xs text-on-surface-variant leading-relaxed">Routine cleaning and X-ray imaging scheduled.</p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-2">Nov 05</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>
          </section>

          {/* Side Module: Medications */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Medications</h3>
                <span className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">2 ACTIVE</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">medication</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">Lisinopril 10mg</p>
                    <p className="text-[10px] text-white/60">Daily • After Breakfast</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">pill</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">Vitamin D3 2000IU</p>
                    <p className="text-[10px] text-white/60">Mon, Wed, Fri</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('prescriptions')}
                className="w-full mt-8 py-3 bg-white text-primary font-bold rounded-lg text-xs hover:bg-slate-50 transition-colors"
              >
                Refill List
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-widest">Specialists</h3>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  Array.from(new Map(appointments.map(app => [app.doctor?._id, app.doctor])).values()).slice(0, 3).map((doc, idx) => (
                    <Link to={`/doctor?id=${doc?._id}`} key={doc?._id || idx} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20">
                        <span className="material-symbols-outlined text-secondary text-sm">medical_services</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-primary truncate group-hover:text-secondary">Dr. {doc?.lastName}</p>
                        <p className="text-[9px] text-on-surface-variant font-medium truncate">{doc?.specialization}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-[10px] text-on-surface-variant italic">No data yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Appointments</h2>
                <p className="text-on-surface-variant mt-1 text-sm md:text-base">Manage your health schedule.</p>
              </div>
              <Link to="/specialists" className="w-full sm:w-auto bg-secondary text-white font-bold py-2.5 px-6 rounded-lg shadow hover:bg-secondary/90 transition-colors text-center text-sm">Book New</Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Date & Time</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Doctor</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fetchingAppointments ? (
                    <tr><td colSpan="3" className="py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : appointments.length > 0 ? (
                    appointments.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800 text-sm">
                          {new Date(app.date).toLocaleDateString()} {app.timeSlot}
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-sm">Dr. {app.doctor?.lastName}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${new Date(app.date) > new Date() ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {new Date(app.date) > new Date() ? 'Upcoming' : 'Completed'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="py-8 text-center text-slate-500">No appointments found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Health Records</h2>
              <p className="text-on-surface-variant mt-1 text-sm md:text-base">Your medical history and results.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center gap-4">
                <div className="flex gap-4 items-center min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0"><span className="material-symbols-outlined">science</span></div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm md:text-base truncate">Metabolic Panel</h4>
                    <p className="text-[10px] md:text-xs text-slate-500 truncate">Oct 15, 2023</p>
                  </div>
                </div>
                <button className="text-secondary font-bold text-xs md:text-sm hover:underline flex-shrink-0">View</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Prescriptions</h2>
                <p className="text-on-surface-variant mt-1 text-sm md:text-base">Active medications.</p>
              </div>
              <button 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    setMessage('Refill request sent to your doctor successfully!');
                    setActiveTab('dashboard');
                    window.scrollTo(0, 0);
                  }, 1500);
                }}
                className="w-full sm:w-auto bg-secondary text-white font-bold py-2.5 px-6 rounded-lg shadow hover:bg-secondary/90 transition-colors text-sm"
              >
                {loading ? 'Processing...' : 'Refill'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-lg text-slate-800">Lisinopril 10mg</h4>
                <p className="text-xs text-slate-600 mt-1">1 tablet daily</p>
                <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-500">
                  <p>Refills: 2</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Health Analytics</h2>
              <p className="text-on-surface-variant mt-1 text-sm md:text-base">Comprehensive insights into your health journey.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Visits</p>
                <h3 className="text-3xl font-black text-primary">{appointments.length}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-2">+12% from last month</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Upcoming</p>
                <h3 className="text-3xl font-black text-secondary">{appointments.filter(a => new Date(a.date) > new Date()).length}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2">Next: {upcomingAppointment ? new Date(upcomingAppointment.date).toLocaleDateString() : 'None'}</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Completed</p>
                <h3 className="text-3xl font-black text-emerald-600">{appointments.filter(a => new Date(a.date) <= new Date()).length}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2">100% attendance rate</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Records</p>
                <h3 className="text-3xl font-black text-amber-600">8</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-2">Lab results & scans</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-primary mb-6">Blood Pressure History</h4>
                <div className="h-48 flex items-end gap-3 px-4">
                  {[60, 80, 75, 90, 85, 95, 80].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-secondary/10 rounded-t-lg relative group">
                        <div style={{height: `${h}%`}} className="w-full bg-secondary rounded-t-lg transition-all group-hover:brightness-110"></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">118/76</div>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">{['M','T','W','T','F','S','S'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h4 className="font-bold text-primary mb-6">Specialist Distribution</h4>
                <div className="space-y-6">
                  {[
                    { label: 'Cardiology', val: 45, color: 'bg-red-400' },
                    { label: 'Pediatrics', val: 30, color: 'bg-blue-400' },
                    { label: 'General Medicine', val: 25, color: 'bg-emerald-400' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="text-primary">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div style={{width: `${item.val}%`}} className={`h-full ${item.color}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="mb-8 px-2 md:px-0">
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Settings</h2>
              <p className="text-on-surface-variant mt-1 text-sm md:text-base">Profile preferences.</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 max-w-2xl mx-auto md:mx-0">
              <form className="space-y-6" onSubmit={handleSaveSettings}>
                {message && (
                  <div className={`p-4 rounded-lg text-sm font-bold ${message.includes('successfully') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">First Name</label>
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-secondary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Last Name</label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-secondary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-widest">Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-secondary" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow hover:bg-primary/90 transition-colors text-sm">
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="w-full mt-24 border-t border-slate-200 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="font-bold text-primary">Clinic 360</div>
          <div className="flex gap-4 md:gap-8 flex-wrap justify-center">
            <a className="text-[10px] uppercase tracking-widest text-slate-500" href="#">Privacy</a>
            <a className="text-[10px] uppercase tracking-widest text-slate-500" href="#">Terms</a>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-slate-400">© 2024 Clinic 360.</p>
        </footer>
      </main>
    </div>
  );
};

export default PatientDashboard;
