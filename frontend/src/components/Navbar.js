import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiLogOut, FiMenu, FiMoon, FiNavigation, FiSettings, FiSun, FiX } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
    console.log('New state will be:', !isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="sticky top-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl border-b border-secondary-200/60 dark:border-secondary-700/60 shadow-large z-50" style={{ zIndex: 1000 }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20 lg:h-18">
          {/* Enhanced Professional Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 md:space-x-3 lg:space-x-3 group">
              <div className="relative">
                <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 p-2.5 sm:p-3 md:p-3 lg:p-3 rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-xl shadow-large group-hover:shadow-extra-large transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3">
                  <FiNavigation className="h-5 w-5 sm:h-6 sm:w-6 md:h-6 md:w-6 lg:h-6 lg:w-6 text-white transition-transform duration-500 group-hover:rotate-12" />
                </div>
                <div className="absolute inset-0 bg-primary-500/40 dark:bg-primary-400/40 rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent tracking-tight font-display">
                  SkyBooker
                </span>
                <span className="hidden sm:block text-xs text-secondary-500 dark:text-secondary-400 font-medium tracking-wider uppercase font-body">
                  Professional Flight Booking
                </span>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link to="/" className="nav-link group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20">
              <span className="relative z-10">Home</span>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
            </Link>
            <Link to="/flights/search" className="nav-link group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20">
              <span className="relative z-10">Search Flights</span>
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
            </Link>
            
            {isAuthenticated() && (
              <Link to="/my-bookings" className="nav-link group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20">
                <span className="relative z-10">My Bookings</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
              </Link>
            )}

            {isAdmin() && (
              <Link to="/admin" className="nav-link group relative px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-gradient-to-r hover:from-accent-50 hover:to-accent-100 dark:hover:from-accent-900/20 dark:hover:to-accent-800/20">
                <span className="relative z-10 text-accent-600 dark:text-accent-400">Admin Panel</span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-accent-600 to-accent-700 dark:from-accent-400 dark:to-accent-500 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
              </Link>
            )}

            {/* Enhanced Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 md:p-2.5 lg:p-2.5 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-secondary-100/80 hover:to-secondary-50/80 dark:hover:from-secondary-800/80 dark:hover:to-secondary-700/80 rounded-xl md:rounded-xl lg:rounded-xl transition-all duration-300 hover:scale-110 group ml-2"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FiSun className="h-5 w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <FiMoon className="h-5 w-5 md:h-5 md:w-5 lg:h-5 lg:w-5 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {!isAuthenticated() ? (
              <div className="flex items-center space-x-3 md:space-x-3 lg:space-x-3 ml-3 md:ml-4 lg:ml-4">
                <Link to="/login" className="btn-ghost px-5 py-2.5 font-semibold">
                  Login
                </Link>
                <Link to="/register" className="btn-primary px-6 py-2.5 font-semibold">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="relative ml-3 md:ml-4 lg:ml-4">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-3 md:space-x-3 lg:space-x-3 text-secondary-700 dark:text-secondary-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 md:px-3 md:py-2 lg:px-3 lg:py-2 rounded-xl md:rounded-xl lg:rounded-xl hover:bg-gradient-to-r hover:from-secondary-100/80 hover:to-secondary-50/80 dark:hover:from-secondary-800/80 dark:hover:to-secondary-700/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-900 group"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 lg:w-9 lg:h-9 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white font-bold text-sm md:text-base lg:text-base shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-110">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm md:text-sm lg:text-sm font-display">{user?.username}</span>
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl rounded-2xl shadow-extra-large border border-secondary-200/60 dark:border-secondary-700/60 py-2 z-20 animate-fade-in-down">
                      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-secondary-200/60 dark:border-secondary-700/60">
                        <p className="text-base font-bold text-secondary-900 dark:text-secondary-100 font-display">{user?.username}</p>
                        <p className="text-sm sm:text-sm text-secondary-500 dark:text-secondary-400 font-body">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 sm:px-5 py-3 sm:py-4 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 hover:text-primary-700 dark:hover:text-primary-300 transition-all duration-300 group"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FiSettings className="mr-3 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-45 transition-transform duration-300" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 sm:px-5 py-3 sm:py-4 text-sm font-medium text-error-600 dark:text-error-400 hover:bg-gradient-to-r hover:from-error-50 hover:to-error-100 dark:hover:from-error-900/20 dark:hover:to-error-800/20 transition-all duration-300 group"
                      >
                        <FiLogOut className="mr-3 sm:mr-4 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-secondary-100/80 hover:to-secondary-50/80 dark:hover:from-secondary-800/80 dark:hover:to-secondary-700/80 rounded-xl transition-all duration-300 hover:scale-110"
            >
              {isDark ? <FiSun className="h-5 w-5 sm:h-6 sm:w-6" /> : <FiMoon className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="p-2 sm:p-2.5 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-secondary-100/80 hover:to-secondary-50/80 dark:hover:from-secondary-800/80 dark:hover:to-secondary-700/80 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 hover:scale-110"
            >
              {isMenuOpen ? <FiX className="h-6 w-6 sm:h-7 sm:w-7" /> : <FiMenu className="h-6 w-6 sm:h-7 sm:w-7" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu - Portal Version */}
        {isMenuOpen && createPortal(
          <div 
            className="lg:hidden fixed inset-0" 
            style={{ 
              zIndex: 999999,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          >
            {/* Enhanced Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              style={{ 
                zIndex: 999998,
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
              }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Enhanced Professional Sidebar */}
            <div 
              className="absolute top-0 left-0 h-full w-80 max-w-[90vw] bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl shadow-extra-large overflow-y-auto border-r border-secondary-200/60 dark:border-secondary-700/60"
              style={{ 
                zIndex: 999999,
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100vh',
                maxHeight: '100vh'
              }}
            >
              {/* Enhanced Header */}
              <div className="flex items-center justify-between p-6 border-b border-secondary-200/60 dark:border-secondary-700/60 bg-gradient-to-r from-primary-50/80 to-secondary-50/80 dark:from-primary-900/20 dark:to-secondary-800/20">
                <div className="flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 p-3 rounded-2xl shadow-large">
                    <FiNavigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-bold text-secondary-900 dark:text-white font-display">SkyBooker</span>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 font-medium tracking-wider uppercase">Professional Flight Booking</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2.5 text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 rounded-xl hover:bg-secondary-100/80 dark:hover:bg-secondary-800/80 transition-all duration-300 hover:scale-110"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              {/* Enhanced Content */}
              <div className="p-6">
                {/* Enhanced User Profile */}
                {isAuthenticated() && (
                  <div className="mb-8 p-5 bg-gradient-to-br from-primary-50/80 to-secondary-50/80 dark:from-primary-900/20 dark:to-secondary-800/20 rounded-2xl border border-primary-200/60 dark:border-primary-700/60">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-large">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-secondary-900 dark:text-white font-display">{user?.username}</h3>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400 font-body">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Navigation Links */}
                <nav className="space-y-2">
                  <Link 
                    to="/" 
                    className="flex items-center px-4 py-4 text-secondary-700 dark:text-secondary-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 hover:text-primary-700 dark:hover:text-primary-300 rounded-xl font-semibold transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
                    <span className="font-display">Home</span>
                  </Link>
                  
                  <Link 
                    to="/flights/search" 
                    className="flex items-center px-4 py-4 text-secondary-700 dark:text-secondary-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 hover:text-primary-700 dark:hover:text-primary-300 rounded-xl font-semibold transition-all duration-300 group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300">✈️</span>
                    <span className="font-display">Search Flights</span>
                  </Link>
                  
                  {isAuthenticated() && (
                    <Link 
                      to="/my-bookings" 
                      className="flex items-center px-4 py-4 text-secondary-700 dark:text-secondary-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 hover:text-primary-700 dark:hover:text-primary-300 rounded-xl font-semibold transition-all duration-300 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300">📋</span>
                      <span className="font-display">My Bookings</span>
                    </Link>
                  )}

                  {isAdmin() && (
                    <Link 
                      to="/admin" 
                      className="flex items-center px-4 py-4 text-accent-700 dark:text-accent-300 hover:bg-gradient-to-r hover:from-accent-50 hover:to-accent-100 dark:hover:from-accent-900/20 dark:hover:to-accent-800/20 hover:text-accent-800 dark:hover:text-accent-200 rounded-xl font-semibold transition-all duration-300 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-4 text-xl group-hover:scale-110 transition-transform duration-300">⚙️</span>
                      <span className="font-display">Admin Panel</span>
                    </Link>
                  )}
                </nav>

                {/* Enhanced Auth Buttons */}
                <div className="mt-8 pt-6 border-t border-secondary-200/60 dark:border-secondary-700/60">
                  {!isAuthenticated() ? (
                    <div className="space-y-3">
                      <Link 
                        to="/login" 
                        className="btn-secondary w-full justify-center py-3 font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        className="btn-primary w-full justify-center py-3 font-semibold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-error-600 dark:text-error-400 hover:bg-gradient-to-r hover:from-error-50 hover:to-error-100 dark:hover:from-error-900/20 dark:hover:to-error-800/20 rounded-xl font-semibold transition-all duration-300 group"
                    >
                      <FiLogOut className="mr-4 h-5 w-5 group-hover:translate-x-0.5 transition-transform duration-300" />
                      <span className="font-display">Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </nav>
  );
};

export default Navbar;