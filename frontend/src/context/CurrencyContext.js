import { createContext, useContext, useEffect, useState } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Currency and country data
const COUNTRIES_CURRENCIES = {
  'US': {
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    rate: 1, // Base currency
    flag: '🇺🇸'
  },
  'IN': {
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    rate: 83.12, // 1 USD = 83.12 INR (approximate)
    flag: '🇮🇳'
  },
  'GB': {
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    rate: 0.79, // 1 USD = 0.79 GBP (approximate)
    flag: '🇬🇧'
  },
  'EU': {
    name: 'European Union',
    currency: 'EUR',
    symbol: '€',
    rate: 0.92, // 1 USD = 0.92 EUR (approximate)
    flag: '🇪🇺'
  },
  'CA': {
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    rate: 1.36, // 1 USD = 1.36 CAD (approximate)
    flag: '🇨🇦'
  },
  'AU': {
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    rate: 1.53, // 1 USD = 1.53 AUD (approximate)
    flag: '🇦🇺'
  },
  'JP': {
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    rate: 149.50, // 1 USD = 149.50 JPY (approximate)
    flag: '🇯🇵'
  },
  'SG': {
    name: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    rate: 1.35, // 1 USD = 1.35 SGD (approximate)
    flag: '🇸🇬'
  },
  'AE': {
    name: 'UAE',
    currency: 'AED',
    symbol: 'د.إ',
    rate: 3.67, // 1 USD = 3.67 AED (approximate)
    flag: '🇦🇪'
  },
  'CN': {
    name: 'China',
    currency: 'CNY',
    symbol: '¥',
    rate: 7.31, // 1 USD = 7.31 CNY (approximate)
    flag: '🇨🇳'
  }
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [currencyData, setCurrencyData] = useState(COUNTRIES_CURRENCIES['US']);

  // Load saved country from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry && COUNTRIES_CURRENCIES[savedCountry]) {
      setSelectedCountry(savedCountry);
      setCurrencyData(COUNTRIES_CURRENCIES[savedCountry]);
    }
  }, []);

  // Save country to localStorage when changed
  useEffect(() => {
    localStorage.setItem('selectedCountry', selectedCountry);
    setCurrencyData(COUNTRIES_CURRENCIES[selectedCountry]);
  }, [selectedCountry]);

  // Convert price from USD to selected currency
  const convertPrice = (usdPrice) => {
    if (!usdPrice || typeof usdPrice !== 'number') return 0;
    const convertedPrice = usdPrice * currencyData.rate;
    
    // Format based on currency
    if (currencyData.currency === 'JPY' || currencyData.currency === 'CNY') {
      // No decimal places for JPY and CNY
      return Math.round(convertedPrice);
    } else {
      // Two decimal places for other currencies
      return Math.round(convertedPrice * 100) / 100;
    }
  };

  // Format price with currency symbol
  const formatPrice = (usdPrice) => {
    const convertedPrice = convertPrice(usdPrice);
    
    // Format based on currency
    if (currencyData.currency === 'JPY' || currencyData.currency === 'CNY') {
      return `${currencyData.symbol}${convertedPrice.toLocaleString()}`;
    } else if (currencyData.currency === 'INR') {
      // Indian number format
      return `${currencyData.symbol}${convertedPrice.toLocaleString('en-IN')}`;
    } else {
      return `${currencyData.symbol}${convertedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  // Get all available countries
  const getAvailableCountries = () => {
    return Object.entries(COUNTRIES_CURRENCIES).map(([code, data]) => ({
      code,
      ...data
    }));
  };

  const value = {
    selectedCountry,
    setSelectedCountry,
    currencyData,
    convertPrice,
    formatPrice,
    getAvailableCountries,
    allCountries: COUNTRIES_CURRENCIES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};