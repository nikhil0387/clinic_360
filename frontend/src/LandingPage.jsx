import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Clinic 360 Medical Plaza');
  const [showEmergency, setShowEmergency] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const [activeSection, setActiveSection] = useState('home');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['services', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      if (window.scrollY < 300) {
        setActiveSection('home');
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! Your message has been received and our team will get back to you shortly.');
    e.target.reset();
  };

  const handleSearch = () => {
    navigate(`/specialists?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div className="text-on-surface">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#00193c]/90 backdrop-blur-md dark:bg-slate-950/90 shadow-2xl shadow-[#00193c]/10 flex justify-between items-center px-6 md:px-8 py-4 no-line-rule">
        <div className="text-2xl font-bold tracking-tighter text-white font-['Manrope']">Clinic 360</div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/specialists" className={`font-['Manrope'] font-semibold tracking-tight transition-all duration-300 pb-1 ${activeSection === 'home' ? 'text-white border-b-2 border-[#0c6780]' : 'text-slate-300 hover:text-white'}`}>Find a Doctor</Link>
          <a href="#services" onClick={() => setActiveSection('services')} className={`font-['Manrope'] font-semibold tracking-tight transition-all duration-300 pb-1 ${activeSection === 'services' ? 'text-white border-b-2 border-[#0c6780]' : 'text-slate-300 hover:text-white'}`}>Services</a>
          <a href="#about" onClick={() => setActiveSection('about')} className={`font-['Manrope'] font-semibold tracking-tight transition-all duration-300 pb-1 ${activeSection === 'about' ? 'text-white border-b-2 border-[#0c6780]' : 'text-slate-300 hover:text-white'}`}>About Us</a>
          <a href="#contact" onClick={() => setActiveSection('contact')} className={`font-['Manrope'] font-semibold tracking-tight transition-all duration-300 pb-1 ${activeSection === 'contact' ? 'text-white border-b-2 border-[#0c6780]' : 'text-slate-300 hover:text-white'}`}>Contact</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 md:gap-4">
            {user ? (
              <Link to={user.role === 'patient' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'} className="px-5 py-2 text-sm font-bold text-white bg-[#0c6780] rounded-lg hover:bg-[#0c6780]/80 transition-all scale-95 active:opacity-80">
                Board Access
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2 text-sm font-bold text-white bg-[#0c6780] rounded-lg hover:bg-[#0c6780]/80 transition-all scale-95 active:opacity-80">Login</Link>
            )}
            <button onClick={() => setShowEmergency(true)} className="px-5 py-2 text-sm font-bold text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all">Emergency</button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#00193c] border-t border-white/10 md:hidden animate-in slide-in-from-top duration-300 p-6 flex flex-col gap-6 shadow-2xl">
            <Link to="/specialists" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold text-white">Find a Doctor</Link>
            <a href="#services" onClick={() => { setActiveSection('services'); setIsMenuOpen(false); }} className="text-lg font-semibold text-slate-300">Services</a>
            <a href="#about" onClick={() => { setActiveSection('about'); setIsMenuOpen(false); }} className="text-lg font-semibold text-slate-300">About Us</a>
            <a href="#contact" onClick={() => { setActiveSection('contact'); setIsMenuOpen(false); }} className="text-lg font-semibold text-slate-300">Contact</a>
            <hr className="border-white/10" />
            <div className="flex flex-col gap-4">
              {user ? (
                <Link to={user.role === 'patient' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/admin-dashboard'} onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center font-bold text-white bg-[#0c6780] rounded-lg">
                  Board Access
                </Link>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center font-bold text-white bg-[#0c6780] rounded-lg">Login</Link>
              )}
              <button onClick={() => { setShowEmergency(true); setIsMenuOpen(false); }} className="w-full py-3 text-center font-bold text-white border border-white/20 rounded-lg">Emergency</button>
            </div>
          </div>
        )}
      </nav>
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[700px] md:min-h-[870px] flex items-center justify-center px-6 overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover opacity-15 grayscale brightness-125" 
              data-alt="Modern high-end hospital lobby" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD76LSPvH0irwC8e33PrM7NNBw7rXbRzcBVdBo_AXCvKsK4oWoddV7WKZ5l2Yfxsl7-gbKy59qrWmzT4oWynIGD4rjv6Zo8PFNeeKBPjbUfTOfF2qD_AsRYNiy_3h3gTgswUawH5y1j3JpAzCUGpr50pXh-jzAnfaYJjKV_omtoSLIR66vHkt1K30Ay7m2z9szr4BcJXqDnPEZOy2m9XTX8dX2d_HSJkjCgnXft35GLCSfmEzcHRCp9ZygwPloXv1N0vJZ5nLLrWv9z" 
              alt="Background" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-low to-surface-container-low"></div>
          </div>
          <div className="relative z-10 max-w-5xl w-full text-center space-y-8 md:space-y-10">
            <div className="space-y-4">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Excellence in Healthcare
              </span>
              <h1 className="font-headline text-4xl md:text-7xl font-extrabold text-primary tracking-tight leading-tight md:leading-[1.1]">
                  Find the Right Care <br/><span className="text-secondary">for Your Family</span>
              </h1>
              <p className="max-w-2xl mx-auto text-base md:text-lg text-on-surface-variant font-body leading-relaxed px-4">
                  Access world-class medical expertise with a human touch. Our specialized clinical teams are dedicated to your long-term wellness.
              </p>
            </div>
            
            {/* Search Bento */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/specialists?query=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
              }}
              className="bg-surface-container-lowest/80 backdrop-blur-xl p-3 md:p-3 rounded-2xl shadow-2xl shadow-primary/5 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-surface-container-high rounded-lg h-14 transition-all focus-within:ring-2 ring-secondary/20">
                <span className="material-symbols-outlined text-secondary">search</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-primary font-medium placeholder:text-outline outline-none" 
                  placeholder="Doctor or specialty..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex-1 w-full flex items-center px-4 gap-3 bg-surface-container-high rounded-lg h-14 transition-all focus-within:ring-2 ring-secondary/20">
                <span className="material-symbols-outlined text-secondary">location_on</span>
                <input 
                  className="bg-transparent border-none focus:ring-0 w-full text-primary font-medium placeholder:text-outline outline-none" 
                  placeholder="Location" 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full md:w-auto h-14 px-10 bg-primary text-white font-bold rounded-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer z-50 relative pointer-events-auto"
              >
                  Find Care
              </button>
            </form>
          </div>
        </section>

        {/* Stats Grid (Tonal Layering) */}
        <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 border-secondary">
              <div className="text-3xl font-headline font-extrabold text-primary">500+</div>
              <div className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Expert Doctors</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 border-primary">
              <div className="text-3xl font-headline font-extrabold text-primary">25+</div>
              <div className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Specialties</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 border-secondary">
              <div className="text-3xl font-headline font-extrabold text-primary">15k+</div>
              <div className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Happy Families</div>
            </div>
            <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border-b-4 border-primary">
              <div className="text-3xl font-headline font-extrabold text-primary">24/7</div>
              <div className="text-sm font-label text-on-surface-variant uppercase tracking-wider">Emergency Support</div>
            </div>
          </div>
        </section>

        {/* Featured Doctors */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">World-Class Specialists</h2>
              <p className="text-on-surface-variant max-w-md">Our lead clinicians are pioneers in their respective fields, bringing decades of experience to your care.</p>
            </div>
            <Link to="/specialists" className="flex items-center gap-2 text-secondary font-bold hover:gap-4 transition-all">
                Explore All Specialists <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Dr Card 1 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdaBxnWQ2fTuBvHgvywTiIxAf3VHLcCvfe2QgdMyn7iTNdWVI1DbUKybc8LfD2ORP5NaEaTDGCGSepa637h_SBs3ObRqHotyy7fBA2MptHesw1RRFDYafEeWXnE-u8881DoNnI5YUbf1gnTyOO1YoKuBRZhMz26B_3QmPDpNeXowcDwCK6AldLrB7NjQ_01zijusNngrGZlnXIHBg_UtW2WAfqgoNv4WaHElg0IrK0kSMAdwnt30YT8g43UY_sE4y6wDFUdLUuEPjB" alt="Dr Julian Vance" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-xs font-bold text-primary">4.9</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-1">Dr. Julian Vance</h3>
                  <p className="text-sm text-secondary font-semibold mb-4">Senior Nephrologist</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Specializing in chronic kidney disease management and advanced dialysis treatments.</p>
                </div>
                <Link to="/doctor" className="w-full py-3 rounded-lg border-2 border-surface-variant text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all text-center block">
                    View Profile
                </Link>
              </div>
            </div>
            
            {/* Dr Card 2 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7JmvqVGOuWbleR80eCyJpHVKYOvk1E17ffyhp417HONfB0l4gUomHAeBT5W840RugBJ8mRF1FdulK2YNDO0JuHY1Jyoo_TgTvRkyog6jUtjnhsz_pKgKp2pwYm5CKl_n2tptnOEtpKNZiD4a9SPY7TBZCPgTqR26TPcxyMMF7dLA0Xja_jp_N0lLgBRNbjoJB9a7lzTCtbYrsjNi8BzkgI7pA-aATquxnYayj4_WZLB1aE4UT--v0jluof9YYkLjc1Rn4RaKImgmv" alt="Dr Sarah Chen" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-xs font-bold text-primary">5.0</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-1">Dr. Sarah Chen</h3>
                  <p className="text-sm text-secondary font-semibold mb-4">Pediatric Cardiologist</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Expert in congenital heart conditions and non-invasive pediatric diagnostics.</p>
                </div>
                <button className="w-full py-3 rounded-lg border-2 border-surface-variant text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                    View Profile
                </button>
              </div>
            </div>
            
            {/* Dr Card 3 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAql3OWnWWHW2O2YLCyUWB3bjrHd4-d9okSIv-YJrIyrxaFNMf7JXB5gZc5jIzSj3RtZ3DtagV6IuEXee-yhRqjJA0O0FfooFp6EE2hzavMpDP0Zw2mUnRd6HgSnkaH8A7CDFCUnWZ7IkNVwt9n76lFdp0iHCTwJI70PpKS_XoB8lqCyYex-nXRTEpovT3-QmxVrR8hOGzmpSp-6JIE0CZ3Y4YXLl8KaLON5bN34rjtXTgYDgtO6FamsQ9Hlao73rWdG1e9yM9MyIXF" alt="Dr Michael Russo" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-xs font-bold text-primary">4.8</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-1">Dr. Michael Russo</h3>
                  <p className="text-sm text-secondary font-semibold mb-4">Orthopedic Surgeon</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Focused on sports medicine and minimally invasive joint replacement surgeries.</p>
                </div>
                <button className="w-full py-3 rounded-lg border-2 border-surface-variant text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                    View Profile
                </button>
              </div>
            </div>
            
            {/* Dr Card 4 */}
            <div className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiGWXqsuBk2DXZKHt08tCIdY6oyKJxMYB9CYxTPMor6YSUbwxGmCcp2Hiq6qukZC98iy-Yjp4DpGAUc_HkmcXSlgX1hAlKhpMUGvacyi0ErIKEwno93zEZAfOLP95wL06FBVYNOoSt5rUzmVbvYrqNPs5N4b5EAokdN_oOG5wuweizEwpdNQYMdP8EVtJI7Lt9--8scd1wNEKXo-Dq1kxfjTWIPSDpcZqpEPJBmFxV6w3ZT_AWkGrRrcNQ5mFrGm7SMeda-iIn7NEL" alt="Dr Elena Rodriguez" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-yellow-500 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="text-xs font-bold text-primary">4.9</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-headline text-xl font-bold text-primary mb-1">Dr. Elena Rodriguez</h3>
                  <p className="text-sm text-secondary font-semibold mb-4">Neurologist</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-6">Specializing in neuro-regenerative therapies and cognitive wellness programs.</p>
                </div>
                <button className="w-full py-3 rounded-lg border-2 border-surface-variant text-primary font-bold hover:bg-primary hover:text-white hover:border-primary transition-all">
                    View Profile
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials (Bento Style) */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">Patient Stories</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto italic">"We measure our success through the lives we've helped restore."</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 h-auto md:h-[500px]">
              <div className="md:col-span-3 bg-surface-container-lowest p-10 rounded-xl shadow-sm flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5">
                  <span className="material-symbols-outlined text-[150px]">format_quote</span>
                </div>
                <div className="flex gap-1 text-secondary mb-6">
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                </div>
                <p className="text-2xl font-headline font-bold text-primary leading-tight mb-8">
                    "The level of professional care at Vitalis is unmatched. From the front desk to the surgical team, I felt like a person, not just a patient file."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4TdFhi1UpHNK5Wk-s5kqXQFOn4rHv_Jh7DKd_XYMP-fcTcHkNupK_UC0mmCU6pREfsY_obZNu0Kd7fLKhdyEd-YCsz2bYU360olu4q6s7jyaHf0bIEwzS6OuDnCZfshTpTDn8PoA9F19VlGMlXNPY5zqVnvoFlZyrzrdm5FhbjY7rJSQ_jN3jJa3Ixl5COttPFOIFqDFRpLLzXgGHyqn53Uum8prG45P6ewfKhX4t7zCJlYyJhvGVU35HO8unUpftqkU931Mg-C5E" alt="Sarah Jenkins" />
                  </div>
                  <div>
                    <div className="font-bold text-primary">Sarah Jenkins</div>
                    <div className="text-sm text-on-surface-variant">Post-Op Recovery Patient</div>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-primary p-8 rounded-xl flex flex-col justify-between text-white">
                  <p className="font-body italic leading-relaxed text-slate-200">
                      "The online portal made scheduling my family's appointments effortless. Truly a modern healthcare experience."
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_ykvh6oiIOAMrRNO9ETsdx3f0JNQHp3Bhn30WM2Zrlyi6KbTeSRtkSNSBRL6R70sOCEBT2_m72eUzXAcAUFPVbGjWTv5FCj_PsIXrbPyZC5CHsXff2OHfQw4dUZzOWsJrfSwSaTLd3TPnd8twpSXVGPpmMyjDBLJDFW9HrGYU0HVvLw4XIZ2Lk0lqhGFPeiBQEgEblGjuFRihibXfw2SyteHt6MVSlPejQwhe0H4KdD-6GwvypaqzG0QWM7DQW1UHwK7ox5ZEVL4X" alt="David Miller" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold">David Miller</div>
                      <div className="text-xs opacity-70">Tech Consultant</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-secondary p-8 rounded-xl flex flex-col justify-between text-white">
                  <p className="font-body italic leading-relaxed text-slate-100">
                      "Dr. Rodriguez took the time to explain everything clearly. I finally felt heard and understood."
                  </p>
                  <div className="mt-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjoZsWI3iUcQyRNYQTe5OT0tX_MDBq9x3ds6okfwCAMoYlFNkTt2Km9TOIETjoHKKKCGQfFWUoyGXOXRJaF1Aj9e44IYlhI09XARV0XEyS0CBwuRxUNoC_Mi82TMVFqfLz789XRXvPAmfFTMB0nWCvABrPYKClpN2ebUYI5f__QhvK1PE_b11pMocHcSXfDuVOBV6v-6ZmtaRuz2S18WdrHv40df9fsY2VlFifhZw-Z2EykJE4MaGjFir9rNkItmxPaZoCmLSizAcV" alt="Maria Gonzales" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold">Maria Gonzales</div>
                      <div className="text-xs opacity-70">Graphic Designer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* About Us Section */}
        <section id="about" className="py-24 bg-surface-container-lowest scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm">About Clinic 360</span>
              <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">Redefining Healthcare Excellence</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Clinic 360 is a state-of-the-art medical facility dedicated to providing comprehensive, patient-centered care. Founded on the principles of compassion, innovation, and clinical excellence, our hospital brings together world-class specialists and cutting-edge technology under one roof.
              </p>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                Whether you need routine preventive care or complex surgical interventions, our multidisciplinary teams work collaboratively to ensure you receive the best possible outcomes in a healing and luxurious environment.
              </p>
            </div>
            <div className="flex-1 relative">
              <img className="rounded-2xl shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiGWXqsuBk2DXZKHt08tCIdY6oyKJxMYB9CYxTPMor6YSUbwxGmCcp2Hiq6qukZC98iy-Yjp4DpGAUc_HkmcXSlgX1hAlKhpMUGvacyi0ErIKEwno93zEZAfOLP95wL06FBVYNOoSt5rUzmVbvYrqNPs5N4b5EAokdN_oOG5wuweizEwpdNQYMdP8EVtJI7Lt9--8scd1wNEKXo-Dq1kxfjTWIPSDpcZqpEPJBmFxV6w3ZT_AWkGrRrcNQ5mFrGm7SMeda-iIn7NEL" alt="Clinic 360 Facility" />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-surface-container-low scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-headline text-4xl font-extrabold text-primary tracking-tight">Our Core Services</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Comprehensive medical departments equipped with the latest technology to serve all your healthcare needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-5xl text-secondary mb-4" style={{fontVariationSettings: "'FILL' 1"}}>cardiology</span>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">Cardiology</h3>
                <p className="text-on-surface-variant">Advanced diagnostics, interventional procedures, and cardiac rehabilitation programs.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-5xl text-secondary mb-4" style={{fontVariationSettings: "'FILL' 1"}}>neurology</span>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">Neurology</h3>
                <p className="text-on-surface-variant">Comprehensive care for neurological disorders, stroke management, and neurosurgery.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-5xl text-secondary mb-4" style={{fontVariationSettings: "'FILL' 1"}}>pediatrics</span>
                <h3 className="font-headline text-2xl font-bold text-primary mb-3">Pediatrics</h3>
                <p className="text-on-surface-variant">Specialized pediatric care ensuring the healthy development and wellness of your children.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-surface-container-lowest scroll-mt-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-primary rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <span className="material-symbols-outlined text-[300px]">map</span>
              </div>
              <div className="relative z-10 flex-1 space-y-6">
                <h2 className="font-headline text-4xl font-extrabold tracking-tight">Get in Touch</h2>
                <p className="text-slate-300 text-lg">We are here to assist you 24/7. Reach out to our dedicated support team for appointments, emergencies, or general inquiries.</p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">location_on</span>
                    <span>123 Wellness Blvd, Healthcare District, NY 10001</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">call</span>
                    <span className="font-bold text-xl">+1 (800) 555-0199</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-secondary">mail</span>
                    <span>contact@clinic360.com</span>
                  </div>
                </div>
              </div>
              <div className="relative z-10 flex-1 w-full max-w-md bg-white p-8 rounded-xl text-slate-800">
                <h3 className="font-headline text-2xl font-bold mb-6">Send a Message</h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input type="text" required placeholder="Your Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary" />
                  <input type="email" required placeholder="Your Email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary" />
                  <textarea required placeholder="How can we help you?" rows="4" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-secondary focus:ring-1 focus:ring-secondary resize-none"></textarea>
                  <button type="submit" className="w-full py-3 bg-secondary text-white font-bold rounded-lg hover:bg-[#094c5e] transition-colors">Submit Request</button>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/* Newsletter CTA */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-xl p-12 md:p-20 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="absolute inset-0 opacity-10">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDq3KhF3I85dpLa2f8wAbp6Y3LfPBRF4DQuoANNczNLnVxmX1KOCTDVXYruInVJ16VO3ePkLjTwPEUpfZdE9li9B_06wD5-DYEBRU9fqCu7Yhxml94PJu7nRZGvVBihzjqp4xG0ezutwJUoUkNIpuBidH8Y8rMeET2Som0lD0QUUMLamPI3je5HzPwaEmm6WdFDWoe4T5w3WcoroALh8QN_ZOtdpemIh_Ext1dPv8HzDHCX6eYDyxxaMty-c7JOkQ-Bc2ib6IYnwi60" alt="Newsletter Background" />
            </div>
            <div className="relative z-10 space-y-4 max-w-xl">
              <h2 className="font-headline text-3xl md:text-5xl font-extrabold text-white leading-tight">Ready to prioritize your health?</h2>
              <p className="text-slate-300 text-lg">Join our newsletter to receive clinical insights, wellness tips, and hospital updates directly to your inbox.</p>
            </div>
            <div className="relative z-10 w-full md:w-auto">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input 
                  className="h-14 px-6 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-secondary focus:outline-none w-full sm:w-80" 
                  placeholder="Enter your email" 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={subscribed}
                />
                <button 
                  type="submit"
                  className={`h-14 px-8 font-bold rounded-lg transition-all ${subscribed ? 'bg-emerald-500 text-white' : 'bg-secondary text-white hover:bg-secondary-container hover:text-on-secondary-container'}`}
                >
                  {subscribed ? 'Subscribed!' : 'Subscribe Now'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 tonal-shift-bg-only">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-12 max-w-8xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="font-['Manrope'] font-bold text-[#00193c] text-2xl">Clinic 360</div>
            <div className="font-['Inter'] text-xs uppercase tracking-widest text-slate-500">© 2024 Clinic 360 Elegance. All rights reserved.</div>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-500 hover:text-[#0c6780] hover:underline transition-all" href="#">Privacy Policy</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-500 hover:text-[#0c6780] hover:underline transition-all" href="#">Terms of Service</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-500 hover:text-[#0c6780] hover:underline transition-all" href="#">HIPAA Compliance</a>
            <a className="font-['Inter'] text-xs uppercase tracking-widest text-slate-500 hover:text-[#0c6780] hover:underline transition-all" href="#">Accessibility</a>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">public</span>
            </Link>
            <a href="mailto:contact@clinic360.com" className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
            <button onClick={() => setShowEmergency(true)} className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-primary cursor-pointer hover:bg-secondary hover:text-white transition-all">
              <span className="material-symbols-outlined text-sm">call</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Emergency Modal */}
      {showEmergency && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowEmergency(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <span className="material-symbols-outlined text-4xl">emergency</span>
              </div>
              <h2 className="text-3xl font-bold font-headline text-slate-900">Emergency Protocol</h2>
              <p className="text-slate-600 text-lg">If you are experiencing a life-threatening medical emergency, please call for an ambulance immediately.</p>
              
              <div className="p-6 bg-slate-50 rounded-xl space-y-4 text-left border border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-error">call</span>
                  <div>
                    <div className="text-sm text-slate-500 font-bold uppercase">Emergency Hotline</div>
                    <div className="text-xl font-black text-slate-900">911</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-error">local_hospital</span>
                  <div>
                    <div className="text-sm text-slate-500 font-bold uppercase">Direct Hospital Line</div>
                    <div className="text-xl font-black text-slate-900">+1 (800) 555-EMRG</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <a href="tel:911" className="flex-1 bg-error text-white font-bold py-4 rounded-xl hover:bg-error/90 transition-colors shadow-lg shadow-error/20 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">call</span> Call 911 Now
                </a>
                <button onClick={() => setShowEmergency(false)} className="px-6 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
