import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const DoctorProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get('id');

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [error, setError] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  useEffect(() => {
    const fetchDoctorAndSlots = async () => {
      try {
        setFetchingSlots(true);
        const res = await fetch('http://localhost:5000/api/users/doctors');
        if (res.ok) {
          const data = await res.json();
          const selectedDoc = idParam ? data.find(d => d._id === idParam) : data[0];
          if (selectedDoc) {
            setDoctorId(selectedDoc._id);
            setDoctorData(selectedDoc);

            // Now fetch booked slots for this doctor
            const token = localStorage.getItem('token');
            const appointmentsRes = await fetch(`http://localhost:5000/api/appointments`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (appointmentsRes.ok) {
              const appointmentsData = await appointmentsRes.json();
              // Filter appointments for THIS doctor specifically
              const doctorAppointments = appointmentsData.filter(app => app.doctor._id === selectedDoc._id);
              // Store booked time slots (simplified: assuming today for now)
              setBookedSlots(doctorAppointments.map(app => app.timeSlot));
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch doctor data or slots', err);
      } finally {
        setFetchingSlots(false);
      }
    };
    fetchDoctorAndSlots();
  }, [idParam]);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot first.');
      return;
    }
    if (!doctorId) {
      setError('Doctor information is unavailable.');
      return;
    }

    setIsBooking(true);
    setError('');
    setBookingSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to book an appointment.');
        setIsBooking(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          doctorId: doctorId,
          date: new Date().toISOString(),
          timeSlot: selectedSlot,
          notes: 'Consultation request from Profile Page'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBookingSuccess('Appointment successfully booked!');
      } else {
        setError(data.message || 'Failed to book appointment.');
      }
    } catch (err) {
      setError('An error occurred during booking.');
    } finally {
      setIsBooking(false);
    }
  };
  return (
    <div className="bg-background font-body text-on-surface antialiased min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full lg:w-[calc(100%-16rem)] lg:left-64 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-6 h-16 shadow-sm shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold text-slate-900 dark:text-slate-50 font-headline tracking-tight">Clinic 360</Link>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => setActiveTab('overview')} className={`font-headline tracking-tight font-semibold cursor-pointer active:scale-95 duration-200 ${activeTab === 'overview' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'}`}>Overview</button>
            <button onClick={() => setActiveTab('patients')} className={`font-headline tracking-tight font-semibold cursor-pointer active:scale-95 duration-200 ${activeTab === 'patients' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'}`}>Patients</button>
            <button onClick={() => setActiveTab('schedule')} className={`font-headline tracking-tight font-semibold cursor-pointer active:scale-95 duration-200 ${activeTab === 'schedule' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'}`}>Schedule</button>
            <button onClick={() => setActiveTab('reports')} className={`font-headline tracking-tight font-semibold cursor-pointer active:scale-95 duration-200 ${activeTab === 'reports' ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-600 dark:border-teal-400 pb-1' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors'}`}>Reports</button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => alert('No new notifications')} className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer active:scale-95 duration-200" title="Notifications">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">notifications</span>
          </button>
          <Link to="/dashboard" className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer active:scale-95 duration-200" title="Settings">
            <span className="material-symbols-outlined text-slate-900 dark:text-slate-50">settings</span>
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="h-8 w-8 rounded-full overflow-hidden bg-slate-200 ring-2 ring-transparent hover:ring-secondary transition-all" title="Dashboard">
                <div className="w-full h-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                  {user.firstName?.[0] || 'U'}
                </div>
              </Link>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-error/10 text-error transition-all cursor-pointer active:scale-95 duration-200" title="Logout">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-secondary transition-colors">Login</Link>
          )}
        </div>
      </header>

      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl lg:ml-64 lg:max-w-none">
        {/* Profile Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="relative flex-shrink-0">
              <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
                <img 
                  className="w-full h-full object-cover" 
                  data-alt="medical doctor" 
                  src={doctorData?.profileImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuBkzknOzLcLgwsH816Wp8nSW6I77CwRUYzCEjVH7jPSe0Wae7N76uf8fjTXxiVUi-hVu0byz74tpkrrX7paPss35O0HRC-DiSD2tEwPlZVy_FSqrYFDGoPJVRAePbAPszmsonWhn-7d6XUs0sKwMjXXRqTdVSN8OV4_N3mNSsiTpX3EnuTTw31qoAcz1mjvKzR_AGx1v5TTs8ZN3j-SeVFfQBMG52hhVfUdAtJek8Rav8hQQbeEtHrbueo2DvbAPsNeAnD5eu5G8ZAJ"}
                  alt={`Dr. ${doctorData?.firstName || 'Alistair'} ${doctorData?.lastName || 'Thorne'}`}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-secondary text-white px-4 py-2 rounded-full font-headline font-bold flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                Verified
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold font-label">{doctorData?.specialization?.toUpperCase() || "NEUROSURGERY"}</span>
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-semibold font-label">FELLOWSHIP TRAINED</span>
                </div>
                <h2 className="text-4xl font-extrabold text-primary font-headline tracking-tight">Dr. {doctorData?.firstName || 'Alistair'} {doctorData?.lastName || 'Thorne'}</h2>
                <p className="text-lg text-secondary font-medium font-headline">{doctorData?.specialization || "Senior Consultant, Neurological Institute"}</p>
              </div>
              <p className="text-on-surface-variant leading-relaxed max-w-2xl">
                  {doctorData?.bio || "Dr. Thorne specializes in complex spinal reconstructive surgery and minimally invasive neurosurgical techniques. With over 15 years of experience, he leads the Clinic 360's advanced neurology wing."}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">star</span>
                  <span className="font-bold text-primary">4.9</span>
                  <span className="text-on-surface-variant text-sm">(1,240 Reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">work_history</span>
                  <span className="font-bold text-primary">{doctorData?.experience || "15+"} Years</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">language</span>
                  <span className="font-bold text-primary">English, German, French</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="lg:col-span-4 bg-primary text-white rounded-xl p-6 shadow-2xl shadow-primary/20 sticky top-24 h-fit">
            <h3 className="text-xl font-bold font-headline mb-4">Book Appointment</h3>
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-primary-fixed-dim font-label">Available Slots (Oct 24)</p>
                <div className="grid grid-cols-3 gap-2">
                  {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'].map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button 
                        key={slot} 
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot)} 
                        className={`py-2 rounded font-medium text-sm transition-all duration-200 border ${
                          selectedSlot === slot 
                            ? 'bg-secondary text-white border-secondary shadow-lg shadow-secondary/20' 
                            : isBooked 
                              ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed opacity-50' 
                              : 'bg-primary-container text-white hover:bg-secondary border-on-primary-container/20 active:scale-95'
                        }`}
                      >
                        {slot}
                        {isBooked && <span className="block text-[8px] mt-0.5">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-primary-fixed-dim font-label">Consultation Type</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input defaultChecked={true} className="text-secondary focus:ring-secondary bg-primary-container" name="type" type="radio"/>
                    <span className="text-sm">In-person</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="text-secondary focus:ring-secondary bg-primary-container" name="type" type="radio"/>
                    <span className="text-sm">Video Call</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t border-white/10 mt-2">
                <span className="text-sm font-label text-primary-fixed-dim">Consultation Fee</span>
                <span className="text-xl font-bold text-secondary">$150.00</span>
              </div>
              {error && <p className="text-error text-sm text-center bg-error-container/20 py-2 rounded">{error}</p>}
              {bookingSuccess && <p className="text-teal-400 text-sm text-center font-bold bg-teal-500/10 py-2 rounded">{bookingSuccess}</p>}
              <button onClick={handleBookAppointment} disabled={isBooking || bookingSuccess} className={`w-full py-4 text-white font-bold rounded-lg shadow-lg active:scale-[0.98] transition-all ${isBooking || bookingSuccess ? 'bg-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-secondary to-on-secondary-container hover:shadow-secondary/20'}`}>
                  {isBooking ? 'Booking...' : bookingSuccess ? 'Booked!' : 'Confirm Appointment'}
              </button>
              <p className="text-center text-xs text-primary-fixed-dim/60">No payment required at this stage</p>
            </div>
          </div>
        </section>

        {/* Main Conditional Rendering */}
        {activeTab === 'overview' && (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Experience */}
          <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">history_edu</span>
              <h3 className="text-xl font-bold text-primary font-headline">Clinical Experience</h3>
            </div>
            <div className="space-y-6">
              <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-outline-variant">
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-secondary"></div>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest font-label">2018 - Present</p>
                <h4 className="font-bold text-primary">Head of Neurosurgery</h4>
                <p className="text-sm text-on-surface-variant">Central Hospital Foundation</p>
              </div>
              <div className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-outline-variant">
                <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-outline-variant"></div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest font-label">2012 - 2018</p>
                <h4 className="font-bold text-primary">Senior Attending Surgeon</h4>
                <p className="text-sm text-on-surface-variant">Metropolitan Health Center</p>
              </div>
            </div>
          </div>
          
          {/* Qualifications */}
          <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">school</span>
              <h3 className="text-xl font-bold text-primary font-headline">Education</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-on-tertiary-container mt-1">check_circle</span>
                <div>
                  <p className="font-bold text-primary">Doctor of Medicine (MD)</p>
                  <p className="text-sm text-on-surface-variant">Johns Hopkins School of Medicine</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-on-tertiary-container mt-1">check_circle</span>
                <div>
                  <p className="font-bold text-primary">PhD in Neural Sciences</p>
                  <p className="text-sm text-on-surface-variant">Stanford University</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="material-symbols-outlined text-on-tertiary-container mt-1">check_circle</span>
                <div>
                  <p className="font-bold text-primary">Board Certified</p>
                  <p className="text-sm text-on-surface-variant">American Board of Neurological Surgery</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Specializations */}
          <div className="bg-surface-container-low p-8 rounded-xl space-y-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">clinical_notes</span>
              <h3 className="text-xl font-bold text-primary font-headline">Specializations</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">Brain Tumors</span>
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">Spinal Fusion</span>
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">CyberKnife</span>
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">Parkinson's Surgery</span>
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">Pediatric Neuro</span>
              <span className="px-4 py-2 bg-surface-container-lowest text-primary rounded-lg text-sm font-medium">Neural Mapping</span>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-extrabold text-primary font-headline">Patient Experiences</h3>
              <p className="text-on-surface-variant mt-2">Hear from those who've entrusted their care to Dr. Thorne.</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Review Card 1 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center font-bold text-secondary font-headline">MS</div>
                <div>
                  <h4 className="font-bold text-primary">Marianne S.</h4>
                  <div className="flex text-on-tertiary-container">
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">
                  "Dr. Thorne performed my spinal fusion surgery three months ago. His attention to detail and calm demeanor made a terrifying process manageable. I'm back to walking 5 miles a day thanks to him."
              </p>
            </div>

            {/* Review Card 2 */}
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center font-bold text-secondary font-headline">RK</div>
                <div>
                  <h4 className="font-bold text-primary">Robert K.</h4>
                  <div className="flex text-on-tertiary-container">
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                    <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star_half</span>
                  </div>
                </div>
              </div>
              <p className="text-on-surface-variant italic leading-relaxed">
                  "Excellent consultation for my father's tremor. He took the time to explain the neuroscience behind the treatment options in a way we could understand. Truly a professional."
              </p>
            </div>
          </div>
          </section>
          </>
        )}

        {activeTab === 'patients' && (
          <div className="bg-surface-container-lowest rounded-xl p-8 mb-12 shadow-sm border border-slate-100">
            <div className="mb-8 flex justify-between items-center border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary font-headline">Patient List</h2>
                <p className="text-on-surface-variant mt-1">Your complete roster of active patients.</p>
              </div>
              <button className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow hover:bg-secondary transition-colors text-sm">
                Add New Patient
              </button>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Patient Name</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">DOB</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Condition</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Last Visit</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Robert K.</td>
                    <td className="py-4 px-6 text-slate-600">1965-04-12</td>
                    <td className="py-4 px-6 text-slate-600">Essential Tremor</td>
                    <td className="py-4 px-6 text-slate-500">2026-03-15</td>
                    <td className="py-4 px-6"><button className="text-secondary font-bold text-sm hover:underline">View Chart</button></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Marianne S.</td>
                    <td className="py-4 px-6 text-slate-600">1970-08-22</td>
                    <td className="py-4 px-6 text-slate-600">Spinal Fusion Recovery</td>
                    <td className="py-4 px-6 text-slate-500">2026-04-10</td>
                    <td className="py-4 px-6"><button className="text-secondary font-bold text-sm hover:underline">View Chart</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="bg-surface-container-lowest rounded-xl p-8 mb-12 shadow-sm border border-slate-100">
            <div className="mb-8 flex justify-between items-center border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary font-headline">Your Schedule</h2>
                <p className="text-on-surface-variant mt-1">Manage your availability and shift logs.</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><span className="material-symbols-outlined text-slate-600">chevron_left</span></button>
                <button className="px-4 py-2 border border-slate-200 rounded-lg font-bold text-slate-700 hover:bg-slate-50">Today</button>
                <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"><span className="material-symbols-outlined text-slate-600">chevron_right</span></button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-24 text-center border-r border-slate-200 pr-4">
                  <div className="text-xl font-bold text-primary">09:00 AM</div>
                  <div className="text-xs text-slate-500 uppercase font-bold mt-1">1 Hour</div>
                </div>
                <div className="pl-6 flex-1">
                  <h4 className="font-bold text-slate-800 text-lg">Consultation: Robert K.</h4>
                  <p className="text-slate-600">Follow-up on tremor medication adjustments.</p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Confirmed</span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-24 text-center border-r border-slate-200 pr-4">
                  <div className="text-xl font-bold text-primary">10:30 AM</div>
                  <div className="text-xs text-slate-500 uppercase font-bold mt-1">1 Hour</div>
                </div>
                <div className="pl-6 flex-1">
                  <h4 className="font-bold text-slate-800 text-lg">MRI Review: Sarah J.</h4>
                  <p className="text-slate-600">Reviewing lower lumbar spine imaging.</p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full">Pending</span>
                </div>
              </div>

              <div className="flex items-center p-4 bg-slate-100 rounded-xl border border-slate-200 border-dashed opacity-75">
                <div className="w-24 text-center border-r border-slate-300 pr-4">
                  <div className="text-xl font-bold text-slate-500">12:00 PM</div>
                </div>
                <div className="pl-6 flex-1">
                  <h4 className="font-bold text-slate-500 text-lg italic">Lunch Break / Blocked</h4>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-surface-container-low rounded-xl p-12 flex flex-col items-center justify-center h-[50vh] mb-12">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4" data-icon="insert_chart">insert_chart</span>
            <h2 className="text-2xl font-bold text-primary font-headline">Clinical Reports</h2>
            <p className="text-on-surface-variant mt-2 text-center max-w-md">Generate and view analytics on patient outcomes, shift earnings, and practice performance.</p>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="bg-surface-container-low rounded-xl p-12 flex flex-col items-center justify-center h-[50vh] mb-12">
            <span className="material-symbols-outlined text-6xl text-secondary mb-4" data-icon="event">event</span>
            <h2 className="text-2xl font-bold text-primary font-headline">Upcoming Appointments</h2>
            <p className="text-on-surface-variant mt-2 text-center max-w-md">View and manage all upcoming patient consultations.</p>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="bg-surface-container-lowest rounded-xl p-8 mb-12 shadow-sm border border-slate-100">
            <div className="mb-8 flex justify-between items-center border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary font-headline">Patient Records</h2>
                <p className="text-on-surface-variant mt-1">Access comprehensive patient histories and EMR.</p>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input type="text" placeholder="Search by name or ID" className="pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-secondary w-64 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Mock Patient Cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-lg">P{i}</div>
                    <div>
                      <h4 className="font-bold text-slate-800">Patient #{1000 + i}</h4>
                      <p className="text-xs text-slate-500">Last visited: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-slate-500">Blood Type</span><span className="font-semibold text-slate-700">O+</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Allergies</span><span className="font-semibold text-slate-700">Penicillin</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="font-semibold text-emerald-600">Stable</span></div>
                  </div>
                  <button className="w-full mt-6 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-sm transition-colors shadow-sm">View Full Chart</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-surface-container-lowest rounded-xl p-8 mb-12 shadow-sm border border-slate-100">
            <div className="mb-8 flex justify-between items-center border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-bold text-primary font-headline">Staff Directory</h2>
                <p className="text-on-surface-variant mt-1">Connect with colleagues across the hospital network.</p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Name</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Role/Department</th>
                    <th className="py-4 px-6 font-bold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Dr. Sarah Jenkins</td>
                    <td className="py-4 px-6 text-slate-600">Cardiology</td>
                    <td className="py-4 px-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">On Shift</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">Nurse Mark Davis</td>
                    <td className="py-4 px-6 text-slate-600">ER Triage</td>
                    <td className="py-4 px-6"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full">On Shift</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      
      {/* Sidebar (Hidden on small, showing structure) */}
      <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 z-50 bg-slate-900 dark:bg-black flex-col py-8 shadow-2xl shadow-slate-950/20 transform -translate-x-full lg:-translate-x-0 transition-transform duration-300">
        <div className="px-6 mb-10">
          <h2 className="text-white font-headline font-extrabold text-lg">Command Center</h2>
          <p className="text-slate-400 text-xs font-medium font-inter">Central Hospital Admin</p>
        </div>
        <nav className="flex-grow space-y-1">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left flex items-center gap-4 px-6 py-3 transition-all duration-300 ease-in-out font-inter text-sm font-medium ${activeTab === 'overview' ? 'bg-teal-700/20 text-teal-400 border-r-4 border-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <span className="material-symbols-outlined">dashboard</span> Overview
          </button>
          <button onClick={() => setActiveTab('appointments')} className={`w-full text-left flex items-center gap-4 px-6 py-3 transition-all duration-300 ease-in-out font-inter text-sm font-medium ${activeTab === 'appointments' ? 'bg-teal-700/20 text-teal-400 border-r-4 border-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <span className="material-symbols-outlined">event</span> Appointments
          </button>
          <button onClick={() => setActiveTab('records')} className={`w-full text-left flex items-center gap-4 px-6 py-3 transition-all duration-300 ease-in-out font-inter text-sm font-medium ${activeTab === 'records' ? 'bg-teal-700/20 text-teal-400 border-r-4 border-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <span className="material-symbols-outlined">medical_information</span> Patient Records
          </button>
          <button onClick={() => setActiveTab('staff')} className={`w-full text-left flex items-center gap-4 px-6 py-3 transition-all duration-300 ease-in-out font-inter text-sm font-medium ${activeTab === 'staff' ? 'bg-teal-700/20 text-teal-400 border-r-4 border-teal-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50 hover:translate-x-1'}`}>
            <span className="material-symbols-outlined">group</span> Staff Directory
          </button>
        </nav>
        <div className="px-6 mt-auto space-y-4">
          <button className="w-full bg-secondary py-3 rounded-lg text-white font-bold text-sm shadow-lg shadow-secondary/20 active:scale-95 transition-all">
              Quick Admission
          </button>
          <div className="pt-6 border-t border-slate-800">
            <a className="flex items-center gap-4 px-2 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium" href="#">
              <span className="material-symbols-outlined">help</span> Help Center
            </a>
            <Link to="/" className="flex items-center gap-4 px-2 py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium">
              <span className="material-symbols-outlined">logout</span> Logout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default DoctorProfile;
