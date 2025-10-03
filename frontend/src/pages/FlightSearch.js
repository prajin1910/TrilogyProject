import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCalendar, FiCheckCircle, FiMapPin, FiNavigation, FiClock as FiScheduled, FiX } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const FlightSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced search filters - from, to, and date
  const [searchFilters, setSearchFilters] = useState({
    from: '',
    to: '',
    selectedDate: '' // Empty by default to show all flights
  });

  const [isRouteSearch, setIsRouteSearch] = useState(false); // Track if searching by route (from/to)
  const [isDateSearch, setIsDateSearch] = useState(false); // Track if searching by date

  // Parse URL parameters and navigation state on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const departureDateParam = searchParams.get('departureDate');
    
    // Check for prefilled destination from navigation state
    const prefilledDestination = location.state?.prefilledDestination;

    if (fromParam || toParam || departureDateParam || prefilledDestination) {
      setSearchFilters({
        from: fromParam || '',
        to: toParam || prefilledDestination || '',
        selectedDate: departureDateParam || ''
      });
      
      // Set search flags based on what parameters we have
      if (departureDateParam) {
        setIsDateSearch(true);
      }
    }
  }, [location.search, location.state]);

  // Load flights based on current filters
  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      // Load all available flights
      const response = await api.get('/flights/search?page=1&limit=100');
      setFlights(response.data.flights || []);
    } catch (error) {
      console.error('Error loading flights:', error);
      setError('Failed to load flights');
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const filterFlights = useCallback(() => {
    let filtered = flights;

    // If searching by route (from/to), show flights across all dates
    if (searchFilters.from.trim() || searchFilters.to.trim()) {
      setIsRouteSearch(true);
      
      // Filter by departure city/airport/state/country
      if (searchFilters.from.trim()) {
        const fromQuery = searchFilters.from.toLowerCase();
        
        // Extract city name, airport code, and country from formatted queries like "New York, USA (JFK)"
        const cityMatch = fromQuery.match(/^([^,]+)/); // Get text before first comma
        const codeMatch = fromQuery.match(/\(([^)]+)\)/); // Get text inside parentheses
        const countryMatch = fromQuery.match(/,\s*([^(]+)/); // Get text between comma and parentheses
        
        filtered = filtered.filter(flight => {
          const departure = flight.route.departure.airport;
          const cityName = departure.city.toLowerCase();
          const airportName = departure.name.toLowerCase();
          const airportCode = departure.code.toLowerCase();
          const stateName = departure.state ? departure.state.toLowerCase() : '';
          const countryName = departure.country ? departure.country.toLowerCase() : '';
          
          // Check direct matches with the full query
          const directMatch = (
            cityName.includes(fromQuery) ||
            airportName.includes(fromQuery) ||
            airportCode.includes(fromQuery) ||
            stateName.includes(fromQuery) ||
            countryName.includes(fromQuery)
          );
          
          // Check matches with extracted parts
          let partialMatch = false;
          
          if (cityMatch) {
            const extractedCity = cityMatch[1].trim();
            partialMatch = partialMatch || cityName.includes(extractedCity) || airportName.includes(extractedCity);
          }
          
          if (codeMatch) {
            const extractedCode = codeMatch[1].trim();
            partialMatch = partialMatch || airportCode.includes(extractedCode);
          }
          
          if (countryMatch) {
            const extractedCountry = countryMatch[1].trim();
            partialMatch = partialMatch || countryName.includes(extractedCountry) || stateName.includes(extractedCountry);
          }
          
          return directMatch || partialMatch;
        });
      }

      // Filter by arrival city/airport/state/country
      if (searchFilters.to.trim()) {
        const toQuery = searchFilters.to.toLowerCase();
        
        // Extract city name, airport code, and country from formatted queries like "Tokyo, Japan (NRT)"
        const cityMatch = toQuery.match(/^([^,]+)/); // Get text before first comma
        const codeMatch = toQuery.match(/\(([^)]+)\)/); // Get text inside parentheses
        const countryMatch = toQuery.match(/,\s*([^(]+)/); // Get text between comma and parentheses
        
        filtered = filtered.filter(flight => {
          const arrival = flight.route.arrival.airport;
          const cityName = arrival.city.toLowerCase();
          const airportName = arrival.name.toLowerCase();
          const airportCode = arrival.code.toLowerCase();
          const stateName = arrival.state ? arrival.state.toLowerCase() : '';
          const countryName = arrival.country ? arrival.country.toLowerCase() : '';
          
          // Check direct matches with the full query
          const directMatch = (
            cityName.includes(toQuery) ||
            airportName.includes(toQuery) ||
            airportCode.includes(toQuery) ||
            stateName.includes(toQuery) ||
            countryName.includes(toQuery)
          );
          
          // Check matches with extracted parts
          let partialMatch = false;
          
          if (cityMatch) {
            const extractedCity = cityMatch[1].trim();
            partialMatch = partialMatch || cityName.includes(extractedCity) || airportName.includes(extractedCity);
          }
          
          if (codeMatch) {
            const extractedCode = codeMatch[1].trim();
            partialMatch = partialMatch || airportCode.includes(extractedCode);
          }
          
          if (countryMatch) {
            const extractedCountry = countryMatch[1].trim();
            partialMatch = partialMatch || countryName.includes(extractedCountry) || stateName.includes(extractedCountry);
          }
          
          return directMatch || partialMatch;
        });
      }
    } else if (searchFilters.selectedDate && isDateSearch) {
      // Only filter by date if user has selected a date and we're in date search mode
      setIsRouteSearch(false);
      const selectedDate = new Date(searchFilters.selectedDate);
      
      filtered = filtered.filter(flight => {
        const flightDate = new Date(flight.route.departure.time);
        return (
          flightDate.getFullYear() === selectedDate.getFullYear() &&
          flightDate.getMonth() === selectedDate.getMonth() &&
          flightDate.getDate() === selectedDate.getDate()
        );
      });
    } else {
      // No filters applied - show all scheduled flights
      setIsRouteSearch(false);
      // Only show flights that haven't departed yet
      const now = new Date();
      filtered = filtered.filter(flight => {
        const flightTime = new Date(flight.route.departure.time);
        return flightTime >= now; // Only future/current flights
      });
    }

    setFilteredFlights(filtered);
  }, [flights, searchFilters, isDateSearch]);

  // Filter flights in real-time as user types or changes date
  useEffect(() => {
    if (flights.length > 0) {
      filterFlights();
    }
  }, [flights, filterFlights]);

  const handleSearchInputChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value,
      // Clear date when starting route search
      selectedDate: value.trim() ? '' : prev.selectedDate
    }));
    
    // If user starts typing in route fields, disable date search
    if (value.trim()) {
      setIsDateSearch(false);
    }
  };

  const handleDateChange = (date) => {
    setSearchFilters(prev => ({
      ...prev,
      selectedDate: date,
      from: '', // Clear route search when changing date
      to: ''
    }));
    setIsDateSearch(true); // Enable date filtering when user selects a date
    setIsRouteSearch(false);
  };

  const clearSearch = () => {
    setSearchFilters({
      from: '',
      to: '',
      selectedDate: ''
    });
    setIsDateSearch(false);
    setIsRouteSearch(false);
  };

  const getFlightStatus = (departureTime) => {
    const now = new Date();
    const flightTime = new Date(departureTime);
    
    if (flightTime < now) {
      return { status: 'departed', label: 'Departed', icon: FiCheckCircle, color: 'text-red-600' };
    } else {
      return { status: 'scheduled', label: 'Scheduled', icon: FiScheduled, color: 'text-blue-600' };
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (durationObj) => {
    if (typeof durationObj === 'object' && durationObj.hours !== undefined) {
      return `${durationObj.hours}h ${durationObj.minutes || 0}m`;
    }
    // Fallback for legacy format
    const hours = Math.floor(durationObj / 60);
    const mins = durationObj % 60;
    return `${hours}h ${mins}m`;
  };

  const getSelectedDateLabel = () => {
    if (!searchFilters.selectedDate) {
      return 'All Scheduled Flights';
    }
    
    const selected = new Date(searchFilters.selectedDate);
    const today = new Date();
    
    if (selected.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (selected.getTime() < today.getTime()) {
      return 'Past Date';
    } else {
      return 'Future Date';
    }
  };

  const handleFlightSelect = (flightId) => {
    navigate(`/flights/${flightId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-950 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
              <p className="text-secondary-600 dark:text-secondary-300">Loading flights...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg p-3 sm:p-4 md:p-6 lg:p-6 xl:p-8">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 md:px-6">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-2 sm:mb-3 font-display">
            {isRouteSearch ? (
              <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 bg-clip-text text-transparent">
                Route Search Results
              </span>
            ) : isDateSearch ? (
              <span className="bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                Flights on {getSelectedDateLabel()}
              </span>
            ) : (
              <span className="bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                All Scheduled Flights
              </span>
            )}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-300 text-base sm:text-lg md:text-lg lg:text-xl font-body">
            {isRouteSearch 
              ? `${filteredFlights.length} flights found across all dates`
              : isDateSearch && searchFilters.selectedDate
                ? `${formatDate(searchFilters.selectedDate)} • ${filteredFlights.length} flights available`
                : `${filteredFlights.length} scheduled flights available`
            }
          </p>
        </div>

        {/* Enhanced Search Controls */}
        <div className="card-elevated bg-white/90 dark:bg-secondary-900/90 backdrop-blur-2xl mb-6 sm:mb-8 md:mb-8 lg:mb-10 p-6 sm:p-8 border-2 border-white/20 dark:border-secondary-700/30">
          {/* Date Selector - Always show but optional */}
          <div className="mb-8">
            <label className="block text-base sm:text-lg font-bold text-secondary-700 dark:text-secondary-300 mb-4 font-display">
              <FiCalendar className="inline w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Filter by Date (Optional)
            </label>
            <div className="relative max-w-md">
              <input
                type="date"
                value={searchFilters.selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                placeholder="Select a date to filter flights"
                className="w-full px-4 py-4 sm:py-4.5 text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl sm:rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 focus:border-primary-500 [color-scheme:dark] shadow-sm hover:shadow-medium focus:shadow-large transition-all duration-300 backdrop-blur-sm font-body"
              />
            </div>
            {!searchFilters.selectedDate && (
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-3 font-body">
                Leave empty to see all scheduled flights
              </p>
            )}
          </div>

          {/* Route Search */}
          <div className="space-y-4">
            <label className="block text-base sm:text-lg font-bold text-secondary-700 dark:text-secondary-300 font-display">
              <FiMapPin className="inline w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Search by Route
            </label>
            
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchFilters.from}
                    onChange={(e) => handleSearchInputChange('from', e.target.value)}
                    placeholder="From (City, Airport, Code)"
                    className="w-full pl-12 pr-4 py-4 text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 focus:border-primary-500 placeholder-secondary-400 dark:placeholder-secondary-500 shadow-sm hover:shadow-medium focus:shadow-large transition-all duration-300 backdrop-blur-sm font-body"
                  />
                </div>
              </div>

              <div className="hidden md:block flex-shrink-0">
                <div className="bg-gradient-to-r from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 p-3 rounded-xl shadow-medium">
                  <FiArrowRight className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
              </div>

              <div className="flex-1 w-full">
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400 dark:text-secondary-500 w-5 h-5" />
                  <input
                    type="text"
                    value={searchFilters.to}
                    onChange={(e) => handleSearchInputChange('to', e.target.value)}
                    placeholder="To (City, Airport, Code)"
                    className="w-full pl-12 pr-4 py-4 text-base border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 focus:border-primary-500 placeholder-secondary-400 dark:placeholder-secondary-500 shadow-sm hover:shadow-medium focus:shadow-large transition-all duration-300 backdrop-blur-sm font-body"
                  />
                </div>
              </div>

              {(searchFilters.from || searchFilters.to) && (
                <button
                  onClick={clearSearch}
                  className="bg-secondary-100/80 dark:bg-secondary-700/80 hover:bg-secondary-200 dark:hover:bg-secondary-600 text-secondary-600 dark:text-secondary-300 p-3 rounded-xl transition-all duration-300 hover:scale-110 flex-shrink-0 backdrop-blur-sm shadow-sm hover:shadow-medium"
                  title="Clear search"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Search Summary */}
          {(searchFilters.from || searchFilters.to) && (
            <div className="mt-6 pt-6 border-t border-secondary-200/60 dark:border-secondary-700/60 text-center">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-sm sm:text-base text-secondary-700 dark:text-secondary-300 font-medium font-body">
                  Showing <span className="font-bold text-primary-600 dark:text-primary-400">{filteredFlights.length}</span> flights
                  {searchFilters.from && <span className="font-semibold"> from {searchFilters.from}</span>}
                  {searchFilters.to && <span className="font-semibold"> to {searchFilters.to}</span>}
                  <span className="text-xs text-secondary-500 dark:text-secondary-400 ml-2">(across all dates)</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Flight Results */}
        {error ? (
          <div className="card text-center max-w-lg mx-auto">
            <div className="text-error-500 dark:text-error-400 mb-4">
              <FiX className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">Error Loading Flights</h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-4">{error}</p>
            <button
              onClick={loadFlights}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        ) : filteredFlights.length === 0 ? (
          <div className="card text-center max-w-lg mx-auto">
            <FiNavigation className="w-16 h-16 text-secondary-400 dark:text-secondary-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
              {isRouteSearch ? 'No flights available for this route' : 
               isDateSearch ? 'No flights scheduled for this date' : 'No flights available'}
            </h3>
            <p className="text-secondary-600 dark:text-secondary-300 mb-6">
              {isRouteSearch 
                ? `No flights found ${searchFilters.from ? `from ${searchFilters.from}` : ''}${searchFilters.to ? ` to ${searchFilters.to}` : ''} at this time. Try searching different cities, states, or countries.`
                : isDateSearch
                  ? `There are no flights scheduled for ${formatDate(searchFilters.selectedDate)}.`
                  : 'There are no scheduled flights available at this time.'
              }
            </p>
            <div className="space-y-3">
              <button
                onClick={clearSearch}
                className="btn-primary mr-3"
              >
                Clear Search
              </button>
              {isRouteSearch && (
                <div className="text-sm text-secondary-500 dark:text-secondary-400 mt-4">
                  <p>Search tips:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Try searching by city names (e.g., "New York", "London")</li>
                    <li>Use state names for domestic searches (e.g., "California", "Texas")</li>
                    <li>Search by country for international routes (e.g., "India", "Japan")</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFlights.map((flight) => {
              const flightStatus = getFlightStatus(flight.route.departure.time);
              const StatusIcon = flightStatus.icon;
              
              return (
                <div 
                  key={flight._id} 
                  className={`card-elevated bg-white/90 dark:bg-secondary-900/90 backdrop-blur-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-extra-large border-2 ${
                    flightStatus.status === 'departed' 
                      ? 'border-red-200/60 dark:border-red-700/60 opacity-60 cursor-not-allowed' 
                      : 'border-white/20 dark:border-secondary-700/30 hover:border-primary-200/80 dark:hover:border-primary-600/80'
                  }`}
                  onClick={() => {
                    if (flightStatus.status !== 'departed') {
                      handleFlightSelect(flight._id);
                    } else {
                      toast.error('This flight has already departed and cannot be booked');
                    }
                  }}
                >
                  <div className="space-y-6">
                    {/* Header with Airline, Date and Status */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-xl flex items-center justify-center shadow-medium">
                          <FiNavigation className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-secondary-900 dark:text-white font-display">{flight.airline.name}</h3>
                          <p className="text-sm text-secondary-600 dark:text-secondary-300 font-body">{flight.flightNumber} • {flight.aircraft.model}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {/* Flight Date */}
                        <div className="text-sm font-medium text-secondary-600 dark:text-secondary-300 font-body">
                          {formatDate(flight.route.departure.time)}
                        </div>
                        
                        {/* Flight Status */}
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl backdrop-blur-sm ${
                          flightStatus.status === 'departed' 
                            ? 'bg-red-100/80 dark:bg-red-900/40' 
                            : 'bg-blue-100/80 dark:bg-blue-900/40'
                        }`}>
                          <StatusIcon className={`w-4 h-4 ${flightStatus.color}`} />
                          <span className={`text-sm font-bold ${flightStatus.color} font-display`}>
                            {flightStatus.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Route Information */}
                    <div className="flex items-center justify-between px-4">
                      {/* Departure */}
                      <div className="text-left flex-1">
                        <div className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-2 font-display">
                          {formatTime(flight.route.departure.time)}
                        </div>
                        <div className="text-base font-bold text-secondary-900 dark:text-white mb-1 font-display">
                          {flight.route.departure.airport.code}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1 font-body">
                          {flight.route.departure.airport.name}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400 font-body">
                          {flight.route.departure.airport.city}, {flight.route.departure.airport.country}
                        </div>
                      </div>
                      
                      {/* Flight Duration & Path */}
                      <div className="flex-1 flex flex-col items-center justify-center mx-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 rounded-2xl flex items-center justify-center mb-3 shadow-large">
                          <FiNavigation className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="text-center">
                          <div className="text-base font-bold text-secondary-900 dark:text-white mb-1 font-display">
                            {formatDuration(flight.duration)}
                          </div>
                          <div className="text-sm text-success-600 dark:text-success-400 font-bold font-body">
                            Non-stop
                          </div>
                        </div>
                        {/* Connection line */}
                        <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary-300 dark:via-primary-600 to-transparent mt-2"></div>
                      </div>
                      
                      {/* Arrival */}
                      <div className="text-right flex-1">
                        <div className="text-3xl sm:text-4xl font-bold text-secondary-900 dark:text-white mb-2 font-display">
                          {formatTime(flight.route.arrival.time)}
                        </div>
                        <div className="text-base font-bold text-secondary-900 dark:text-white mb-1 font-display">
                          {flight.route.arrival.airport.code}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400 mb-1 font-body">
                          {flight.route.arrival.airport.name}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400 font-body">
                          {flight.route.arrival.airport.city}, {flight.route.arrival.airport.country}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row - Pricing and Action */}
                    <div className="flex items-center justify-between pt-6 border-t border-secondary-200/60 dark:border-secondary-700/60 flex-wrap gap-4">
                      <div className="flex items-center space-x-6">
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 font-display">
                            ${flight.pricing.economy.price}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-300 font-body">Economy Class</div>
                        </div>
                        <div className="text-sm text-success-600 dark:text-success-400 font-bold bg-success-50 dark:bg-success-900/20 px-3 py-1 rounded-lg font-body">
                          {flight.pricing.economy.availableSeats} seats left
                        </div>
                      </div>
                      
                      <button 
                        className={`px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 font-bold text-base group ${
                          flightStatus.status === 'departed' 
                            ? 'bg-red-100 dark:bg-red-600/20 text-red-700 dark:text-red-400 cursor-not-allowed border border-red-200 dark:border-red-600/40' 
                            : 'btn-primary hover:scale-105 shadow-medium hover:shadow-large'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (flightStatus.status !== 'departed') {
                            handleFlightSelect(flight._id);
                          } else {
                            toast.error('This flight has already departed and cannot be booked');
                          }
                        }}
                        disabled={flightStatus.status === 'departed'}
                      >
                        <span className="font-display">{flightStatus.status === 'departed' ? 'Flight Departed' : 'Select Flight'}</span>
                        {flightStatus.status !== 'departed' && <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;