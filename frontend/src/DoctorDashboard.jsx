import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(app => new Date(app.date).toISOString().split('T')[0] === today);
  const uniquePatients = new Set(appointments.map(app => app.patient?._id)).size;
  const shiftEarnings = todaysAppointments.filter(app => app.status === 'completed').length * 150;

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SideNavBar */}
      <aside className={`h-screen w-64 fixed left-0 top-0 z-50 bg-slate-900 flex flex-col py-8 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <Link to="/" className="text-white font-manrope font-extrabold text-xl tracking-tight block">Command Center</Link>
            <p className="text-slate-400 text-xs mt-1">Central Hospital Admin</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-4">
          <button onClick={() => { setActiveTab('overview'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'overview' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span>
            Overview
          </button>
          <button onClick={() => { setActiveTab('appointments'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="event">event</span>
            Appointments
          </button>
          <button onClick={() => { setActiveTab('records'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'records' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="medical_information">medical_information</span>
            Patient Records
          </button>
          <button onClick={() => { setActiveTab('staff'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'staff' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="group">group</span>
            Staff
          </button>
          <button onClick={() => { setActiveTab('inventory'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'inventory' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="inventory_2">inventory_2</span>
            Inventory
          </button>
          <button onClick={() => { setActiveTab('billing'); setIsSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-inter text-sm font-medium ${activeTab === 'billing' ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="payments">payments</span>
            Billing
          </button>
        </nav>
        <div className="px-6 mb-8">
          <button className="w-full py-3 bg-secondary text-white rounded-lg font-semibold text-sm hover:brightness-110 transition-all active:scale-95">
              Quick Admission
          </button>
        </div>
        <div className="px-6 border-t border-slate-800 pt-6 space-y-1">
          <a className="flex items-center py-2 text-slate-400 hover:text-white text-sm transition-colors" href="#">
            <span className="material-symbols-outlined mr-3" data-icon="help">help</span>
            Help Center
          </a>
          <button onClick={handleLogout} className="w-full flex items-center py-2 text-slate-400 hover:text-white text-sm transition-colors text-left">
            <span className="material-symbols-outlined mr-3" data-icon="logout">logout</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-white/80 backdrop-blur-xl h-16 flex items-center justify-between px-4 md:px-8 shadow-sm border-b border-slate-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" data-icon="search">search</span>
              <input className="bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm w-48 md:w-64 focus:ring-2 focus:ring-secondary/20 focus:bg-white transition-all outline-none" placeholder="Search patients..." type="text"/>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all cursor-pointer active:scale-95">
              <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
            </button>
            <div className="flex items-center gap-3 ml-2 border-l pl-2 md:pl-4 border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">Dr. {user?.lastName}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-1 truncate max-w-[100px]">{user?.specialization || 'Provider'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden border border-slate-200">
                <img alt="Provider profile avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxowItKLx45Ym0WBjt4eexDrlof_IUexlPQaPlFql0gwjSkwA2PcWIrujuly_fPN-nP5J93G0fsQYbFH7j9x7RsbdJ2z5EcT80KWFaY9ewQpYboAWh1ylnhumsMeWREp-53mTIT28Dr0l2i3ElmfV-S0T_wLxDeicyAEKCCx2xz5j4MQ_T5SeC_pzlvy-G45hKZ6HBuIJ8xYvDm8pWAgQGvv4itQLnSsvW-gQT4Zq7o4WK7cUAYgIG1raKA3gp-s_3TplDzWUqwPBu"/>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        {activeTab === 'overview' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            {/* Header Section */}
            <div className="mb-10">
            <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-primary tracking-tight">Clinical Overview</h2>
            <p className="text-on-surface-variant font-label text-sm mt-1">Welcome back, Dr. {user?.lastName || 'Doctor'}.</p>
          </div>

          {/* Summary Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
            {/* Total Patients Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm shadow-slate-200/50 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary-fixed rounded-lg">
                  <span className="material-symbols-outlined text-primary" data-icon="group">group</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-on-surface-variant text-sm font-medium font-label">Total Patients</p>
                <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-primary mt-1">{loading ? '...' : uniquePatients}</h3>
              </div>
            </div>

            {/* Appointments Today Card */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm shadow-slate-200/50">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-secondary-container rounded-lg text-on-secondary-container">
                  <span className="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wider">Status</p>
                  <p className="text-secondary font-bold text-xs md:text-sm">{todaysAppointments.filter(app => app.status === 'completed').length} Done</p>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-on-surface-variant text-sm font-medium font-label">Appointments Today</p>
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-3xl md:text-4xl font-headline font-extrabold text-primary mt-1">{loading ? '...' : todaysAppointments.length}</h3>
                </div>
              </div>
            </div>

            {/* Earnings Card (Chart/Metric) */}
            <div className="bg-primary text-white rounded-xl p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center">
                  <p className="text-primary-fixed-dim text-sm font-medium font-label">Shift Earnings</p>
                  <span className="material-symbols-outlined text-primary-fixed" data-icon="trending_up">trending_up</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-headline font-extrabold mt-4">${loading ? '...' : shiftEarnings.toFixed(2)}</h3>
                <div className="mt-6 flex items-end space-x-1 h-12">
                  <div className="w-2 bg-primary-container h-4 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-container h-8 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-container h-6 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-container h-10 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-fixed h-12 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-container h-9 rounded-t-sm"></div>
                  <div className="w-2 bg-primary-container h-5 rounded-t-sm"></div>
                </div>
              </div>
              {/* Decorative Background Element */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl"></div>
            </div>
          </div>

          {/* Content Area: Main Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Upcoming Appointments List (Current Shift) */}
            <div className="lg:col-span-8">
              <div className="bg-surface-container-low rounded-xl overflow-hidden">
                <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row justify-between items-center bg-surface-container-high/50 gap-4">
                  <h4 className="text-xl font-headline font-bold text-primary">Upcoming</h4>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-semibold rounded-lg hover:bg-white transition-all shadow-sm">Filter</button>
                    <button className="px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-semibold rounded-lg hover:bg-white transition-all shadow-sm">Export</button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {loading ? (
                    <p className="text-center text-on-surface-variant py-4">Loading appointments...</p>
                  ) : appointments.length === 0 ? (
                    <p className="text-center text-on-surface-variant py-4">No upcoming appointments scheduled.</p>
                  ) : (
                    appointments.map(app => (
                      <div key={app._id} className="flex items-center bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-transparent hover:border-secondary/20 transition-all cursor-pointer group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-base md:text-lg mr-4 flex-shrink-0">
                          {app.patient?.firstName?.[0] || 'P'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-primary font-bold text-sm md:text-base truncate">{app.patient?.firstName} {app.patient?.lastName}</h5>
                          <p className="text-on-surface-variant text-[10px] md:text-xs font-medium truncate">{app.notes || 'Routine Consultation'}</p>
                        </div>
                        <div className="text-right mr-4 md:mr-8 flex-shrink-0">
                          <p className="text-primary font-extrabold font-headline text-sm md:text-base">{app.timeSlot}</p>
                          <p className="text-secondary text-[10px] md:text-xs font-semibold">{new Date(app.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <span className={`hidden sm:inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full mr-4 ${app.status === 'scheduled' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : app.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                            {app.status}
                          </span>
                          <span className="material-symbols-outlined text-slate-300 group-hover:text-secondary transition-colors" data-icon="chevron_right">chevron_right</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Insights / Status */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Actions Glass Card */}
              <div className="p-6 rounded-xl border border-white/40 shadow-xl shadow-primary/5" style={{ background: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
                <h4 className="text-lg font-headline font-bold text-primary mb-4">Assistant</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-all text-sm font-medium text-primary">
                    <span>Sign Lab Reports</span>
                    <span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full">4</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-all text-sm font-medium text-primary">
                    <span>Prescription Renewals</span>
                    <span className="bg-secondary text-white text-[10px] px-2 py-0.5 rounded-full">2</span>
                  </button>
                </div>
              </div>

              {/* Shift Progress */}
              <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/15">
                <h4 className="text-[10px] md:text-xs font-label font-bold text-primary mb-4 uppercase tracking-widest">Shift Progress</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold inline-block py-1 px-2 uppercase rounded-full text-secondary bg-secondary-container">
                          Morning
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-secondary">
                          75%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-surface-container-highest">
                    <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary transition-all" style={{width: "75%"}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'appointments' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Appointments</h2>
                <p className="text-on-surface-variant text-sm mt-1">Manage your complete schedule.</p>
              </div>
              <button className="w-full sm:w-auto px-5 py-2.5 bg-secondary text-white font-bold rounded-lg shadow hover:bg-secondary/90 transition-all flex items-center justify-center">
                <span className="material-symbols-outlined mr-2">add</span> New
              </button>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Patient</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Date</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Time</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Notes</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">Loading...</td></tr>
                  ) : appointments.length === 0 ? (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-500">None found.</td></tr>
                  ) : (
                    appointments.map(app => (
                      <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-800">{app.patient?.firstName} {app.patient?.lastName}</td>
                        <td className="py-4 px-6 text-slate-600">{new Date(app.date).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-slate-600 font-semibold">{app.timeSlot}</td>
                        <td className="py-4 px-6 text-slate-50 text-xs max-w-[150px] truncate">{app.notes || 'N/A'}</td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${app.status === 'scheduled' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : app.status === 'completed' ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Patient Records</h2>
                <p className="text-on-surface-variant text-sm mt-1">Access EMR.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-secondary text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p className="col-span-full text-center text-slate-500 py-12">Fetching...</p>
              ) : Array.from(new Map(appointments.map(app => [app.patient?._id, app])).values()).map((app, i) => (
                <div key={app.patient?._id || i} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-base md:text-lg flex-shrink-0">
                      {app.patient?.firstName?.[0] || 'P'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{app.patient?.firstName} {app.patient?.lastName}</h4>
                      <p className="text-[10px] text-slate-500 truncate">Last: {new Date(app.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-semibold text-slate-700 truncate ml-2">{app.patient?.email}</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold text-emerald-600">Active</span></div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors">View Chart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Staff Directory</h2>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Name</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Role</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm md:text-base">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Dr. Sarah Jenkins</td>
                    <td className="py-4 px-6 text-slate-600">Cardiology</td>
                    <td className="py-4 px-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">On Shift</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Inventory</h2>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Item</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Category</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Surgical Masks</td>
                    <td className="py-4 px-6 text-slate-600">PPE</td>
                    <td className="py-4 px-6 text-emerald-600 font-bold">500 boxes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="pt-24 px-4 md:px-8 pb-12">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-primary font-headline">Billing</h2>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg md:text-xl text-slate-800 mb-4">Earnings</h3>
              <div className="text-3xl md:text-4xl font-headline font-extrabold text-primary mb-2">${shiftEarnings.toFixed(2)}</div>
              <p className="text-slate-500 text-xs md:text-sm mb-6">Generated today.</p>
              
              <h4 className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2 text-sm">Recent</h4>
              <ul className="space-y-3">
                <li className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-slate-100 gap-2">
                  <span className="font-semibold text-slate-700 text-xs md:text-sm truncate w-full sm:w-auto">Consultation (P1001)</span>
                  <span className="text-emerald-600 font-bold text-xs md:text-sm">$150.00</span>
                </li>
              </ul>
            </div>
          </div>
        )}

      </main>

      {/* Contextual Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined text-3xl" data-icon="add">add</span>
        <span className="absolute right-full mr-4 bg-primary text-white text-xs py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">New Appointment</span>
      </button>
    </div>
  );
};

export default DoctorDashboard;
