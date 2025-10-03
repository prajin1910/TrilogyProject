import { useEffect, useRef, useState } from 'react';
import { FiMapPin, FiX } from 'react-icons/fi';
import { formatAirportDisplay, searchAirports } from '../data/airports';

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  icon: Icon = FiMapPin,
  required = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(value || '');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.length >= 2) {
      const results = searchAirports(newValue);
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
    
    onChange(newValue);
  };

  const handleSuggestionClick = (airport) => {
    const formattedValue = formatAirportDisplay(airport);
    setInputValue(formattedValue);
    onChange(formattedValue);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  const clearInput = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          listRef.current && !listRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative group">
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 w-5 h-5 z-10 transition-colors duration-300 group-focus-within:text-primary-500" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= 2) {
              const results = searchAirports(inputValue);
              setSuggestions(results);
              setIsOpen(results.length > 0);
            }
          }}
          placeholder={placeholder}
          required={required}
          className="w-full pl-12 pr-12 py-4 sm:py-4.5 md:py-4 lg:py-4 text-base sm:text-lg md:text-base lg:text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl sm:rounded-2xl md:rounded-xl lg:rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 transition-all duration-300 placeholder-secondary-400 dark:placeholder-secondary-500 hover:border-secondary-300/80 dark:hover:border-secondary-500/80 backdrop-blur-sm shadow-sm hover:shadow-medium focus:shadow-large font-body"
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 hover:text-error-500 dark:hover:text-error-400 z-10 p-1 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-300 hover:scale-110"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={listRef}
          className="absolute top-full left-0 right-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-2xl border border-secondary-200/60 dark:border-secondary-700/60 rounded-2xl sm:rounded-2xl md:rounded-xl lg:rounded-xl shadow-extra-large dark:shadow-2xl z-50 mt-3 max-h-80 overflow-y-auto"
        >
          {suggestions.map((airport, index) => (
            <div
              key={`${airport.code}-${index}`}
              onClick={() => handleSuggestionClick(airport)}
              className={`px-5 py-4 cursor-pointer transition-all duration-300 border-b border-secondary-100/60 dark:border-secondary-700/60 last:border-b-0 group ${
                index === selectedIndex 
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-700 dark:text-primary-300 shadow-sm' 
                  : 'hover:bg-gradient-to-r hover:from-secondary-50 hover:to-secondary-100/50 dark:hover:from-secondary-800/60 dark:hover:to-secondary-700/60 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${
                    index === selectedIndex
                      ? 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800/50 dark:to-primary-700/50 shadow-medium'
                      : 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 group-hover:shadow-medium'
                  }`}>
                    <span className={`font-bold text-sm transition-colors duration-300 ${
                      index === selectedIndex
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300'
                    }`}>
                      {airport.code}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-base text-secondary-900 dark:text-white truncate transition-colors duration-300 font-display">
                    {airport.city}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-300 truncate font-body">
                    {airport.name}
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-400 font-body">
                    {airport.country} • {airport.region}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;