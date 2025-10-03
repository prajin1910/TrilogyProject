import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiLock, FiMail, FiNavigation } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(`Welcome back, ${result.user.username}!`);
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Enhanced background with professional gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-white to-secondary-50/90 dark:from-secondary-950/95 dark:via-secondary-900/90 dark:to-primary-950/95"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/3 via-transparent to-secondary-600/3 dark:from-primary-500/5 dark:via-transparent dark:to-secondary-500/5"></div>
      </div>
      
      {/* Enhanced floating elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-primary-400/15 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-700/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 h-48 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-96 lg:h-96 bg-gradient-to-br from-secondary-400/10 to-accent-400/15 dark:from-secondary-500/15 dark:to-accent-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-md w-full">
        {/* Professional login card */}
        <div className="relative">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-2xl rounded-3xl border-2 border-white/30 dark:border-secondary-700/40 shadow-extra-large"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white/20 to-secondary-50/30 dark:from-primary-900/10 dark:via-secondary-800/20 dark:to-secondary-900/10 rounded-3xl"></div>
          
          <div className="relative p-8 sm:p-10 md:p-8 lg:p-10">
            <div className="text-center mb-8 sm:mb-10 md:mb-8 lg:mb-10">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-br from-primary-100/80 to-primary-200/80 dark:from-primary-900/50 dark:to-primary-800/50 p-4 sm:p-5 md:p-4 lg:p-5 rounded-2xl shadow-large">
                  <FiNavigation className="h-8 w-8 sm:h-10 sm:w-10 md:h-8 md:w-8 lg:h-10 lg:w-10 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-3 lg:mb-4 font-display">
                <span className="bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                  Welcome Back
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-base lg:text-lg text-secondary-600 dark:text-secondary-300 font-body">
                Sign in to access your account
              </p>
              <p className="mt-4 text-sm sm:text-base text-secondary-500 dark:text-secondary-400 font-body">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-300 font-display"
                >
                  Create one here
                </Link>
              </p>
            </div>

            <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-bold text-secondary-700 dark:text-secondary-300 mb-3 font-display">
                    <FiMail className="inline w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 sm:px-5 sm:py-4.5 md:px-4 md:py-4 lg:px-5 lg:py-4.5 text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 transition-all duration-300 placeholder-secondary-400 dark:placeholder-secondary-500 hover:border-secondary-300/80 dark:hover:border-secondary-500/80 backdrop-blur-sm shadow-sm hover:shadow-medium focus:shadow-large font-body"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm sm:text-base font-bold text-secondary-700 dark:text-secondary-300 mb-3 font-display">
                    <FiLock className="inline w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 sm:px-5 sm:py-4.5 md:px-4 md:py-4 lg:px-5 lg:py-4.5 pr-12 text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 transition-all duration-300 placeholder-secondary-400 dark:placeholder-secondary-500 hover:border-secondary-300/80 dark:hover:border-secondary-500/80 backdrop-blur-sm shadow-sm hover:shadow-medium focus:shadow-large font-body"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-transform duration-300"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-5 w-5 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300" />
                      ) : (
                        <FiEye className="h-5 w-5 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-4 sm:py-5 text-base sm:text-lg font-bold flex items-center justify-center space-x-3 group font-display"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner-sm"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Your Account</span>
                      <FiNavigation className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </button>
              </div>

              {/* Enhanced Demo Credentials Section */}
              <div className="text-center space-y-5">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-secondary-300/60 dark:border-secondary-600/60" />
                  </div>
                  <div className="relative flex justify-center text-sm sm:text-base">
                    <span className="px-4 bg-white/95 dark:bg-secondary-900/95 text-secondary-500 dark:text-secondary-400 font-semibold font-body">
                      Demo Credentials
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ email: 'admin@flights.com', password: 'trilogy123' })}
                    className="relative bg-white/90 dark:bg-secondary-800/90 backdrop-blur-lg p-4 rounded-xl border border-secondary-200/60 dark:border-secondary-700/60 hover:border-primary-300/80 dark:hover:border-primary-600/80 transition-all duration-300 group hover:shadow-large text-left w-full max-w-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 p-2 rounded-xl shadow-medium group-hover:shadow-large transition-all duration-300">
                        <FiLock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary-900 dark:text-white text-sm font-display">Admin Access</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 font-body">admin@flights.com</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;