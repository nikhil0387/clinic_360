import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: '3 staff members pending approval', time: '5m ago' },
    { id: 2, text: 'Monthly revenue report ready', time: '1h ago' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [appRes, staffRes] = await Promise.all([
          fetch('https://clinic-360.onrender.com/api/appointments', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('https://clinic-360.onrender.com/api/users/doctors', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (appRes.ok) setAppointments(await appRes.json());
        if (staffRes.ok) setStaff(await staffRes.json());
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://clinic-360.onrender.com/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setMessage(data.message || 'Update failed');
      }
    } catch (err) {
      setMessage('Network error, please try again');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter(a => a.status === 'scheduled').length,
    totalStaff: staff.length,
    totalRevenue: appointments.filter(a => a.status === 'completed').length * 150
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SideNavBar Shell */}
      <nav className={`h-screen w-64 fixed left-0 top-0 z-50 bg-slate-900 flex flex-col py-8 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <Link to="/" className="text-white font-manrope font-extrabold text-xl tracking-tight block">Command Center</Link>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Hospital Admin</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="flex-1 space-y-1 px-4">
          <button 
            onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'overview' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">dashboard</span> Overview
          </button>
          <button 
            onClick={() => { setActiveTab('appointments'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">calendar_today</span> Appointments
          </button>
          <button 
            onClick={() => { setActiveTab('patients'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'patients' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">person</span> Patients
          </button>
          <button 
            onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'staff' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">medical_services</span> Staff
          </button>
          <button 
            onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'inventory' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">inventory_2</span> Inventory
          </button>
          <button 
            onClick={() => { setActiveTab('billing'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'billing' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">payments</span> Billing
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'settings' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="material-symbols-outlined mr-3">settings</span> Settings
          </button>
        </div>
        <div className="px-6 mt-auto space-y-4">
          <button className="w-full bg-secondary text-on-secondary py-3 rounded-lg font-semibold text-sm transition-all hover:brightness-110 active:scale-95">
              Quick Admission
          </button>
          <div className="pt-6 border-t border-slate-800 space-y-1">
            <a className="flex items-center py-2 text-slate-400 hover:text-white transition-colors text-sm" href="#">
              <span className="material-symbols-outlined mr-3 text-lg">help</span> Help Center
            </a>
            <button onClick={handleLogout} className="w-full flex items-center py-2 text-slate-400 hover:text-white transition-colors text-sm text-left">
              <span className="material-symbols-outlined mr-3 text-lg">logout</span> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 z-40 bg-white/80 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-lg md:text-xl font-bold text-slate-900 tracking-tight font-manrope truncate">Clinic 360 Admin</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block text-right mr-2 md:mr-4 cursor-pointer" onClick={() => setActiveTab('settings')}>
            <p className="text-sm font-bold text-slate-900 leading-none">{user?.firstName} {user?.lastName}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">{user?.role}</p>
          </div>
          <div className="relative group">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="material-symbols-outlined text-on-surface-variant cursor-pointer p-2 hover:bg-surface-container rounded-full transition-all"
            >
              notifications
            </button>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-100 font-bold text-xs text-primary">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors">
                      <p className="text-xs text-slate-700 font-medium">{n.text}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div 
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high cursor-pointer active:scale-95 duration-200"
          >
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5IIraCrpIGeRXSghewNNJaxVrdNM1HsNgo8nBGKrzKzJ30D2icDoUwAaG0gqenK8SIL0UfII7KHfDU7kpueOQAgfCodsLk6EObfJohF-KViiM6e4cU46UJQqIDD38P7TJcnfotTNj5yyUf0yUhe82teiB0gAtTNgjvGioVngSQ_3z8JUUbTfZZYKkqPr93Lnd5NYSukf5lvU4gmYqQyZc5GJlTEl-lPdUZ532r-uQmdoyqepaLgukODyg42POW0YK5HmafiFb6iaV"/>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 mt-16 p-4 md:p-8 min-h-screen">
        {activeTab === 'overview' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Executive Overview</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Real-time health monitoring of clinical operations.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
              <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Staff</p>
                <h3 className="text-2xl md:text-3xl font-black text-primary">{stats.totalStaff}</h3>
              </div>
              <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Appointments</p>
                <h3 className="text-2xl md:text-3xl font-black text-primary">{stats.totalAppointments}</h3>
              </div>
              <div className="bg-surface-container-lowest p-4 md:p-6 rounded-xl shadow-sm border border-slate-100">
                <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pending</p>
                <h3 className="text-2xl md:text-3xl font-black text-secondary">{stats.pendingAppointments}</h3>
              </div>
              <div className="bg-primary text-white p-4 md:p-6 rounded-xl shadow-lg">
                <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-widest mb-2">Est. Revenue</p>
                <h3 className="text-2xl md:text-3xl font-black">${stats.totalRevenue.toLocaleString()}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-6">Recent Activity</h4>
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((app, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                      <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold flex-shrink-0">
                        {app.patient?.firstName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-primary truncate">{app.patient?.firstName} {app.patient?.lastName}</p>
                        <p className="text-[10px] text-slate-500 truncate">Booked with Dr. {app.doctor?.lastName}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase flex-shrink-0">{new Date(app.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl p-6 border border-slate-100">
                <h4 className="font-bold text-slate-800 mb-6">Department Distribution</h4>
                <div className="space-y-4">
                  {['Cardiology', 'Neurology', 'Surgery', 'Pediatrics'].map((dept, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>{dept}</span>
                        <span>{25 - (i * 5)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-secondary" style={{ width: `${25 - (i * 5)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'staff' && (
          <>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Staff Directory</h2>
                <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Manage {staff.length} registered practitioners.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high text-primary font-semibold rounded-lg hover:bg-surface-container-highest transition-all text-sm">
                  <span className="material-symbols-outlined text-[20px]">file_download</span> Export
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg shadow-lg text-sm">
                  <span className="material-symbols-outlined text-[20px]">add</span> Add Provider
                </button>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Practitioner</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Specialty</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staff.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center font-bold flex-shrink-0">
                          {doc.firstName[0]}{doc.lastName[0]}
                        </div>
                        <span className="font-bold text-primary truncate">Dr. {doc.firstName} {doc.lastName}</span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 truncate">{doc.specialization}</td>
                      <td className="px-6 py-5 text-sm text-slate-600 truncate">{doc.email}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-primary transition-all">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'appointments' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Global Appointments</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Monitoring all clinical schedules.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Doctor</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date/Time</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-800">{app.patient?.firstName} {app.patient?.lastName}</td>
                      <td className="px-6 py-5 text-slate-600">Dr. {app.doctor?.lastName}</td>
                      <td className="px-6 py-5 text-sm">
                        {new Date(app.date).toLocaleDateString()} <span className="text-slate-400 ml-2">{app.timeSlot}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${app.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'billing' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Billing Center</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Financial oversight and transaction monitoring.</p>
            </div>
            <div className="bg-primary text-white p-6 md:p-12 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-white/60 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-2">Total Hospital Revenue</p>
                <h3 className="text-3xl md:text-5xl font-black">${stats.totalRevenue.toLocaleString()}</h3>
                <p className="mt-4 text-emerald-400 flex items-center justify-center md:justify-start gap-2 text-sm">
                  <span className="material-symbols-outlined">trending_up</span>
                  +12.5% from last month
                </p>
              </div>
              <button className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-black/20 text-sm md:text-base w-full md:w-auto">
                Generate Financial Report
              </button>
            </div>
          </>
        )}

        {activeTab === 'inventory' && (
          <div className="flex items-center justify-center min-h-[400px] px-4">
            <div className="text-center max-w-md">
              <span className="material-symbols-outlined text-5xl md:text-6xl text-slate-200 mb-4">inventory_2</span>
              <h3 className="text-lg md:text-xl font-bold text-primary">Inventory Management</h3>
              <p className="text-on-surface-variant mt-2 text-sm">This module is being connected to the central supply chain database. Check back soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Clinic Analytics</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm md:text-base">Real-time performance metrics and patient volume insights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-3xl text-white shadow-xl shadow-primary/20">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Total Patients</p>
                <h3 className="text-4xl font-black">{appointments.length * 2 + 10}</h3>
                <div className="mt-6 flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">trending_up</span>
                  +18% growth this month
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Active Doctors</p>
                <h3 className="text-4xl font-black text-primary">{staff.length}</h3>
                <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">group</span>
                  4 departments active
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Avg. Wait Time</p>
                <h3 className="text-4xl font-black text-primary">12m</h3>
                <div className="mt-6 flex items-center gap-2 text-emerald-500 text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">arrow_downward</span>
                  -4m from last week
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-sm mb-10">
              <h4 className="font-bold text-primary mb-8 text-lg">Patient Volume by Department</h4>
              <div className="space-y-8">
                {[
                  { dept: 'Cardiology', count: 42, color: 'bg-primary' },
                  { dept: 'Neurology', count: 28, color: 'bg-secondary' },
                  { dept: 'Pediatrics', count: 35, color: 'bg-teal-400' },
                  { dept: 'Dermatology', count: 19, color: 'bg-amber-400' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2 items-end">
                      <span className="font-bold text-slate-700 text-sm">{item.dept}</span>
                      <span className="text-slate-400 text-xs font-bold">{item.count} appointments</span>
                    </div>
                    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${(item.count / 42) * 100}%` }} 
                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto py-8 md:py-12">
            <div className="mb-8 px-4 md:px-0">
              <h2 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">Admin Settings</h2>
              <p className="text-on-surface-variant mt-1 text-sm md:text-base">Manage your administrative profile and security.</p>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                {message && (
                  <div className={`p-4 rounded-lg text-sm font-bold ${message.includes('successfully') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-secondary" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-secondary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Update Password</label>
                  <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="Leave blank to keep current" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-secondary" />
                </div>
                <button type="submit" disabled={saveLoading} className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all">
                  {saveLoading ? 'Saving...' : 'Save Admin Details'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
