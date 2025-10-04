import { useEffect, useRef, useState } from 'react';
import { FiChevronDown, FiGlobe } from 'react-icons/fi';
import { useCurrency } from '../context/CurrencyContext';

const CountrySelector = ({ isInNavbar = false }) => {
  const { selectedCountry, setSelectedCountry, currencyData, getAvailableCountries } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const countries = getAvailableCountries();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
  };

  if (isInNavbar) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gradient-to-r hover:from-secondary-100/80 hover:to-secondary-50/80 dark:hover:from-secondary-800/80 dark:hover:to-secondary-700/80 rounded-xl transition-all duration-300 hover:scale-105 group"
          title="Select Country/Currency"
        >
          <FiGlobe className="h-5 w-5" />
          <span className="hidden sm:flex items-center space-x-1">
            <span className="text-lg">{currencyData.flag}</span>
            <span className="text-sm font-medium">{currencyData.currency}</span>
          </span>
          <FiChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl rounded-xl shadow-extra-large border border-secondary-200/60 dark:border-secondary-700/60 py-2 z-20 animate-fade-in-down max-h-80 overflow-y-auto">
              <div className="px-4 py-2 border-b border-secondary-200/60 dark:border-secondary-700/60">
                <p className="text-sm font-bold text-secondary-900 dark:text-secondary-100">Select Country & Currency</p>
              </div>
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountrySelect(country.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/20 dark:hover:to-primary-800/20 transition-all duration-300 ${
                    selectedCountry === country.code
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-secondary-700 dark:text-secondary-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{country.flag}</span>
                    <div className="text-left">
                      <div className="font-medium">{country.name}</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {country.currency} ({country.symbol})
                      </div>
                    </div>
                  </div>
                  {selectedCountry === country.code && (
                    <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Regular form selector (for other pages)
  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-200 mb-2">
        Country & Currency
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-primary-400"
      >
        <div className="flex items-center space-x-3">
          <span className="text-lg">{currencyData.flag}</span>
          <div>
            <div className="font-medium text-secondary-900 dark:text-secondary-100">{currencyData.name}</div>
            <div className="text-sm text-secondary-500 dark:text-secondary-400">
              {currencyData.currency} ({currencyData.symbol})
            </div>
          </div>
        </div>
        <FiChevronDown className={`h-5 w-5 text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-600 rounded-xl shadow-large py-2 z-20 max-h-64 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 ${
                  selectedCountry === country.code
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-secondary-700 dark:text-secondary-200'
                }`}
              >
                <span className="text-lg">{country.flag}</span>
                <div className="text-left">
                  <div className="font-medium">{country.name}</div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">
                    {country.currency} ({country.symbol})
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CountrySelector;