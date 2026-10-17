// import React, { useState } from 'react';

// export default function User_Register_Login() {
//   // State to track whether the active tab is 'register' or 'login'
//   const [activeTab, setActiveTab] = useState('register');

//   return (
//     <div className="w-full min-h-screen bg-surface-container-low flex flex-col justify-between text-on-surface">
//       {/* Navbar */}
//       <header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-4 lg:px-8 py-2.5 flex items-center justify-between transition-all">
//         <div className="flex items-center space-x-3">
//           <a href="#" className="flex items-center space-x-2.5 group">
//             <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm group-hover:opacity-95 transition-all">
//               <span className="material-symbols-outlined text-lg" data-icon="sensors">sensors</span>
//             </div>
//             <div className="flex flex-col text-left leading-none">
//               <span className="font-headline-md text-[15px] font-bold text-on-surface tracking-tight">AeroSense</span>
//               <span className="font-label-caps text-[10px] text-outline font-semibold tracking-wider uppercase mt-0.5">Telemetry</span>
//             </div>
//           </a>
//           <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-label-caps text-xs font-semibold bg-surface-container text-primary border border-outline-variant/40">
//             Guest Portal
//           </span>
//         </div>

//         <nav className="hidden md:flex items-center space-x-6 text-body-md">
//           <a href="#" className="font-medium text-on-surface hover:text-primary transition-colors text-xs lg:text-sm">Platform Overview</a>
//           <a href="#" className="font-medium text-outline hover:text-on-surface transition-colors text-xs lg:text-sm">Features</a>
//           <a href="#" className="font-medium text-outline hover:text-on-surface transition-colors text-xs lg:text-sm">Documentation</a>
//           <a href="#" className="inline-flex items-center space-x-1.5 font-medium text-outline hover:text-on-surface transition-colors text-xs lg:text-sm">
//             <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
//             <span>System Status</span>
//           </a>
//         </nav>

//         <div className="flex items-center space-x-3">
//           <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-label-sm text-outline">
//             <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
//             <span className="text-[11px] font-medium text-on-surface-variant">All Systems Operational</span>
//           </div>

//           <a href="#" className="hidden sm:inline-flex items-center space-x-1 text-label-md font-medium text-outline hover:text-on-surface px-2 py-1.5 rounded-lg transition-colors">
//             <span className="material-symbols-outlined text-lg" data-icon="help_outline">help_outline</span>
//             <span className="hidden xl:inline text-xs">Help</span>
//           </a>

//           <a href="#" className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-outline-variant/60 bg-surface-container-lowest hover:bg-surface-container-low text-on-surface font-label-md text-xs font-semibold shadow-sm transition-all">
//             <span className="material-symbols-outlined text-base text-primary" data-icon="support_agent">support_agent</span>
//             <span>Support</span>
//           </a>

//           <a href="#" className="p-1.5 text-outline hover:text-on-surface rounded-lg hover:bg-surface-container-low transition-colors" title="Back to Home">
//             <span className="material-symbols-outlined text-lg" data-icon="home">home</span>
//           </a>
//         </div>
//       </header>

//       {/* Background pattern */}
//       <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] [background-size:24px_24px]"></div>

//       {/* Centered Main Form Container */}
//       <main className="relative z-10 w-full max-w-xl mx-auto my-auto pt-24 pb-12 px-4 flex items-center justify-center">
//         <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xl overflow-hidden transition-all duration-300">
//           <section className="p-6 lg:p-8 flex flex-col justify-center">
            
//             {/* Header & Tabs */}
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-outline-variant/30 gap-4">
//               <div>
//                 <h1 className="font-headline-lg text-xl font-bold text-on-surface" id="panel-headline">
//                   {activeTab === 'register' ? 'Create an Account' : 'Welcome Back'}
//                 </h1>
//                 <p className="font-body-md text-sm text-on-surface-variant mt-0.5" id="panel-subheadline">
//                   {activeTab === 'register' 
//                     ? 'Please register to access device telemetry.' 
//                     : 'Please authenticate to access device telemetry.'}
//                 </p>
//               </div>

//               {/* Interactive Tabs */}
//               <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 self-start sm:self-auto" role="tablist">
//                 <button 
//                   aria-selected={activeTab === 'login'} 
//                   onClick={() => setActiveTab('login')}
//                   className={`px-4 py-1.5 rounded-lg font-label-md text-sm transition-all duration-150 ${
//                     activeTab === 'login' 
//                       ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' 
//                       : 'text-outline hover:text-on-surface'
//                   }`} 
//                   id="tab-login" 
//                   role="tab" 
//                   type="button"
//                 >
//                   Sign In
//                 </button>
//                 <button 
//                   aria-selected={activeTab === 'register'} 
//                   onClick={() => setActiveTab('register')}
//                   className={`px-4 py-1.5 rounded-lg font-label-md text-sm transition-all duration-150 ${
//                     activeTab === 'register' 
//                       ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' 
//                       : 'text-outline hover:text-on-surface'
//                   }`} 
//                   id="tab-register" 
//                   role="tab" 
//                   type="button"
//                 >
//                   Register
//                 </button>
//               </div>
//             </div>

//             {/* Register Form */}
//             {activeTab === 'register' && (
//               <form className="space-y-4" id="form-register" onSubmit={(e) => e.preventDefault()}>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-fullname">Full Name</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                         <span className="material-symbols-outlined text-lg" data-icon="person">person</span>
//                       </span>
//                       <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="reg-fullname" placeholder="Dr. Elena Ward" required type="text" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-email">Email Address</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                         <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
//                       </span>
//                       <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="reg-email" placeholder="elena.ward@aerosense.io" required type="email" />
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-password">Password</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                         <span className="material-symbols-outlined text-lg" data-icon="lock">lock</span>
//                       </span>
//                       <input className="w-full pl-9 pr-9 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="reg-password" placeholder="••••••••••••" required type="password" />
//                       <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface" type="button">
//                         <span className="material-symbols-outlined text-lg" data-icon="visibility" id="reg-pass-icon">visibility</span>
//                       </button>
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-repeat-password">Repeat Password</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                         <span className="material-symbols-outlined text-lg" data-icon="lock_reset">lock_reset</span>
//                       </span>
//                       <input className="w-full pl-9 pr-9 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="reg-repeat-password" placeholder="••••••••••••" required type="password" />
//                       <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface" type="button">
//                         <span className="material-symbols-outlined text-lg" data-icon="visibility" id="reg-repeat-pass-icon">visibility</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 space-y-1.5">
//                   <div className="flex items-center justify-between">
//                     <span className="text-xs text-outline">Security Strength:</span>
//                     <span className="text-xs text-outline uppercase font-semibold" id="strength-label">Standard</span>
//                   </div>
//                   <div className="grid grid-cols-4 gap-1.5 h-1.5">
//                     <div className="rounded-full bg-outline-variant/50 transition-colors" id="str-bar-1"></div>
//                     <div className="rounded-full bg-outline-variant/50 transition-colors" id="str-bar-2"></div>
//                     <div className="rounded-full bg-outline-variant/50 transition-colors" id="str-bar-3"></div>
//                     <div className="rounded-full bg-outline-variant/50 transition-colors" id="str-bar-4"></div>
//                   </div>
//                   <span className="block text-xs text-outline">Use 8+ characters with uppercase letters, numbers, and symbols.</span>
//                 </div>

//                 <div className="flex items-start space-x-2.5 pt-1">
//                   <input className="mt-0.5 h-4 w-4 rounded border-outline-variant/80 text-primary-container focus:ring-primary-container/30" id="terms-agree" required type="checkbox" />
//                   <label className="text-xs text-on-surface-variant" htmlFor="terms-agree">
//                     I agree to the AeroSense IoT <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a>, <a className="text-primary hover:underline font-medium" href="#">Telemetry Acceptable Use Policy</a>, and Data Privacy Protocols.
//                   </label>
//                 </div>

//                 <button className="w-full mt-2 py-2.5 px-4 bg-primary-container text-on-primary text-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2" type="submit">
//                   <span>Create Account</span>
//                   <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
//                 </button>
//               </form>
//             )}

//             {/* Sign In Form */}
//             {activeTab === 'login' && (
//               <form className="space-y-4" id="form-login" onSubmit={(e) => e.preventDefault()}>
//                 <div>
//                   <label className="block text-sm text-on-surface mb-1.5" htmlFor="login-email">Email Address</label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                       <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
//                     </span>
//                     <input className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="login-email" placeholder="operator@aerosense.io" required type="email" />
//                   </div>
//                 </div>

//                 <div>
//                   <div className="flex items-center justify-between mb-1.5">
//                     <label className="block text-sm text-on-surface" htmlFor="login-password">Password</label>
//                     <a className="text-xs text-primary hover:underline font-medium" href="#">Forgot Password?</a>
//                   </div>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
//                       <span className="material-symbols-outlined text-lg" data-icon="lock">lock</span>
//                     </span>
//                     <input className="w-full pl-9 pr-9 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" id="login-password" placeholder="••••••••••••" required type="password" />
//                     <button className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface" type="button">
//                       <span className="material-symbols-outlined text-lg" data-icon="visibility" id="login-pass-icon">visibility</span>
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-1">
//                   <div className="flex items-center space-x-2">
//                     <input className="h-4 w-4 rounded border-outline-variant/80 text-primary-container focus:ring-primary-container/30" id="login-remember" type="checkbox" />
//                     <label className="text-xs text-on-surface-variant" htmlFor="login-remember">Remember this workstation for 30 days</label>
//                   </div>
//                 </div>

//                 <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 flex items-center space-x-3">
//                   <span className="material-symbols-outlined text-secondary" data-icon="terminal">terminal</span>
//                   <div className="text-xs text-on-surface-variant">
//                     <span className="font-semibold block text-on-surface">Hardware Token Authenticated</span>
//                     <span>YubiKey and FIDO2 physical keys recognized on USB interface.</span>
//                   </div>
//                 </div>

//                 <button className="w-full mt-2 py-2.5 px-4 bg-primary-container text-on-primary text-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2" type="submit">
//                   <span>Sign In</span>
//                   <span className="material-symbols-outlined text-lg" data-icon="login">login</span>
//                 </button>
//               </form>
//             )}

//           </section>
//         </div>
//       </main>
//     </div>
//   );
// }


// **********************************************************************
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/app';

export default function User_Register_Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  
  // Form input states
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', repeatPassword: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  
  // UI feedback states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Register API submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.repeatPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // 1. Register the user
      await API.post('/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });

      // 2. Automatically log them in right after successful registration
      const loginResponse = await API.post('/auth/login', {
        email: registerData.email,
        password: registerData.password,
      });

      // 3. Save token and redirect
      localStorage.setItem('access_token', loginResponse.data.access_token);
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login API submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await API.post('/auth/login', {
        email: loginData.email,
        password: loginData.password,
      });

      // Save token and redirect
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/');
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-container-low flex flex-col justify-between text-on-surface">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 px-4 lg:px-8 py-2.5 flex items-center justify-between transition-all">
        <div className="flex items-center space-x-3">
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-sm group-hover:opacity-95 transition-all">
              <span className="material-symbols-outlined text-lg" data-icon="sensors">sensors</span>
            </div>
            <div className="flex flex-col text-left leading-none">
              <span className="font-headline-md text-[15px] font-bold text-on-surface tracking-tight">AeroSense</span>
              <span className="font-label-caps text-[10px] text-outline font-semibold tracking-wider uppercase mt-0.5">Telemetry</span>
            </div>
          </a>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-label-caps text-xs font-semibold bg-surface-container text-primary border border-outline-variant/40">
            Guest Portal
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-body-md">
          <a href="#" className="font-medium text-on-surface hover:text-primary transition-colors text-xs lg:text-sm">Platform Overview</a>
          <a href="#" className="font-medium text-outline hover:text-on-surface transition-colors text-xs lg:text-sm">Features</a>
          <a href="#" className="font-medium text-outline hover:text-on-surface transition-colors text-xs lg:text-sm">Documentation</a>
        </nav>

        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-label-sm text-outline">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
            <span className="text-[11px] font-medium text-on-surface-variant">All Systems Operational</span>
          </div>
        </div>
      </header>

      {/* Background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#c3c6d7_1px,transparent_1px)] [background-size:24px_24px]"></div>

      {/* Centered Main Form Container */}
      <main className="relative z-10 w-full max-w-xl mx-auto my-auto pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-xl overflow-hidden transition-all duration-300">
          <section className="p-6 lg:p-8 flex flex-col justify-center">
            
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-outline-variant/30 gap-4">
              <div>
                <h1 className="font-headline-lg text-xl font-bold text-on-surface" id="panel-headline">
                  {activeTab === 'register' ? 'Create an Account' : 'Welcome Back'}
                </h1>
                <p className="font-body-md text-sm text-on-surface-variant mt-0.5" id="panel-subheadline">
                  {activeTab === 'register' 
                    ? 'Please register to access device telemetry.' 
                    : 'Please authenticate to access device telemetry.'}
                </p>
              </div>

              {/* Interactive Tabs */}
              <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30 self-start sm:self-auto" role="tablist">
                <button 
                  aria-selected={activeTab === 'login'} 
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg font-label-md text-sm transition-all duration-150 ${
                    activeTab === 'login' 
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' 
                      : 'text-outline hover:text-on-surface'
                  }`} 
                  role="tab" 
                  type="button"
                >
                  Sign In
                </button>
                <button 
                  aria-selected={activeTab === 'register'} 
                  onClick={() => { setActiveTab('register'); setError(''); }}
                  className={`px-4 py-1.5 rounded-lg font-label-md text-sm transition-all duration-150 ${
                    activeTab === 'register' 
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm' 
                      : 'text-outline hover:text-on-surface'
                  }`} 
                  role="tab" 
                  type="button"
                >
                  Register
                </button>
              </div>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-xs">
                {error}
              </div>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form className="space-y-4" id="form-register" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-fullname">Full Name</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-lg" data-icon="person">person</span>
                      </span>
                      <input 
                        className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                        id="reg-fullname" 
                        placeholder="Dr. Elena Ward" 
                        required 
                        type="text"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-email">Email Address</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
                      </span>
                      <input 
                        className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                        id="reg-email" 
                        placeholder="elena.ward@aerosense.io" 
                        required 
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-password">Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-lg" data-icon="lock">lock</span>
                      </span>
                      <input 
                        className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                        id="reg-password" 
                        placeholder="••••••••••••" 
                        required 
                        type="password"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-label-md text-sm text-on-surface mb-1.5" htmlFor="reg-repeat-password">Repeat Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                        <span className="material-symbols-outlined text-lg" data-icon="lock_reset">lock_reset</span>
                      </span>
                      <input 
                        className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                        id="reg-repeat-password" 
                        placeholder="••••••••••••" 
                        required 
                        type="password"
                        value={registerData.repeatPassword}
                        onChange={(e) => setRegisterData({ ...registerData, repeatPassword: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2.5 pt-1">
                  <input className="mt-0.5 h-4 w-4 rounded border-outline-variant/80 text-primary-container focus:ring-primary-container/30" id="terms-agree" required type="checkbox" />
                  <label className="text-xs text-on-surface-variant" htmlFor="terms-agree">
                    I agree to the AeroSense IoT <a className="text-primary hover:underline font-medium" href="#">Terms of Service</a> and Data Privacy Protocols.
                  </label>
                </div>

                <button 
                  className="w-full mt-2 py-2.5 px-4 bg-primary-container text-on-primary text-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
                </button>
              </form>
            )}

            {/* Sign In Form */}
            {activeTab === 'login' && (
              <form className="space-y-4" id="form-login" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm text-on-surface mb-1.5" htmlFor="login-email">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-lg" data-icon="mail">mail</span>
                    </span>
                    <input 
                      className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                      id="login-email" 
                      placeholder="operator@aerosense.io" 
                      required 
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm text-on-surface" htmlFor="login-password">Password</label>
                    <a className="text-xs text-primary hover:underline font-medium" href="#">Forgot Password?</a>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-lg" data-icon="lock">lock</span>
                    </span>
                    <input 
                      className="w-full pl-9 pr-3 py-2 bg-surface-container-lowest border border-outline-variant/60 rounded-lg text-on-surface text-sm focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all" 
                      id="login-password" 
                      placeholder="••••••••••••" 
                      required 
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  className="w-full mt-2 py-2.5 px-4 bg-primary-container text-on-primary text-sm font-semibold rounded-lg shadow-sm hover:opacity-95 active:scale-[0.99] transition-all duration-150 flex items-center justify-center space-x-2 disabled:opacity-50" 
                  type="submit"
                  disabled={loading}
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                  <span className="material-symbols-outlined text-lg" data-icon="login">login</span>
                </button>
              </form>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}