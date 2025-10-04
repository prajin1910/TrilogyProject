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
        setSelectedIndex(prev => {
          const newIndex = prev < suggestions.length - 1 ? prev + 1 : prev;
          // Smooth scroll to selected item
          setTimeout(() => {
            if (listRef.current) {
              const selectedElement = listRef.current.children[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest'
                });
              }
            }
          }, 0);
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : -1;
          // Smooth scroll to selected item
          setTimeout(() => {
            if (listRef.current && newIndex >= 0) {
              const selectedElement = listRef.current.children[newIndex];
              if (selectedElement) {
                selectedElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'nearest'
                });
              }
            }
          }, 0);
          return newIndex;
        });
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
        <Icon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 w-4 h-4 sm:w-5 sm:h-5 z-10 transition-colors duration-300 group-focus-within:text-primary-500" />
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
          className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-3 lg:py-3 text-sm sm:text-base md:text-sm lg:text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 transition-all duration-300 placeholder-secondary-400 dark:placeholder-secondary-500 hover:border-secondary-300/80 dark:hover:border-secondary-500/80 backdrop-blur-sm shadow-sm hover:shadow-medium focus:shadow-large font-body"
          autoComplete="off"
        />
        {inputValue && (
          <button
            type="button"
            onClick={clearInput}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 hover:text-error-500 dark:hover:text-error-400 z-10 p-1 rounded-lg hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-300 hover:scale-110"
          >
            <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div 
          ref={listRef}
          className="absolute top-full left-0 right-0 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl shadow-2xl z-50 mt-2 max-h-72 overflow-y-auto"
        >
          {suggestions.map((airport, index) => (
            <div
              key={`${airport.code}-${index}`}
              onClick={() => handleSuggestionClick(airport)}
              className={`px-4 py-3 cursor-pointer transition-all duration-200 border-b border-secondary-100 dark:border-secondary-700 last:border-b-0 group ${
                index === selectedIndex 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                  : 'bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 hover:bg-secondary-50 dark:hover:bg-secondary-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === selectedIndex
                      ? 'bg-primary-100 dark:bg-primary-800'
                      : 'bg-secondary-100 dark:bg-secondary-700'
                  }`}>
                    <span className={`font-bold text-xs ${
                      index === selectedIndex
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-secondary-700 dark:text-secondary-300'
                    }`}>
                      {airport.code}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">
                    {airport.city}
                  </div>
                  <div className="text-xs text-secondary-600 dark:text-secondary-400 truncate">
                    {airport.name}
                  </div>
                  <div className="text-xs text-secondary-500 dark:text-secondary-500">
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