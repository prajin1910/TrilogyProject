import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowRight, FiCalendar, FiClock, FiGlobe, FiMapPin, FiNavigation, FiSearch, FiStar, FiTrendingUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import AutocompleteInput from '../components/AutocompleteInput';
import { useCurrency } from '../context/CurrencyContext';
import { flightsAPI } from '../utils/api';

const Home = () => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [searchForm, setSearchForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    tripType: 'one-way'
  });
  
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  const fetchPopularDestinations = async () => {
    try {
      setLoadingDestinations(true);
      const response = await flightsAPI.getPopularDestinations();
      setPopularDestinations(response.data.destinations || []);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      // Fallback to some default destinations based on real flight data
      setPopularDestinations([]);
    } finally {
      setLoadingDestinations(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSearchForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!searchForm.from || !searchForm.to || !searchForm.departureDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (searchForm.from === searchForm.to) {
      toast.error('Departure and arrival cities must be different');
      return;
    }

    if (searchForm.tripType === 'round-trip' && !searchForm.returnDate) {
      toast.error('Please select a return date for round trip');
      return;
    }

    // Extract city names from the formatted strings (e.g., "New York, United States (JFK)" -> "New York")
    const extractCityName = (formattedString) => {
      if (formattedString.includes('(') && formattedString.includes(')')) {
        return formattedString.split(',')[0].trim();
      }
      return formattedString;
    };

    // Build search params
    const searchParams = new URLSearchParams({
      from: extractCityName(searchForm.from),
      to: extractCityName(searchForm.to),
      departureDate: searchForm.departureDate
    });

    if (searchForm.tripType === 'round-trip' && searchForm.returnDate) {
      searchParams.append('returnDate', searchForm.returnDate);
    }

    // Navigate to search results
    navigate(`/flights/search?${searchParams.toString()}`);
  };

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const features = [
    {
      icon: FiGlobe,
      title: 'Worldwide Destinations',
      description: 'Search flights to over 1000+ destinations across the globe'
    },
    {
      icon: FiSearch,
      title: 'Smart Search',
      description: 'Find the best deals with our intelligent flight search engine'
    },
    {
      icon: FiClock,
      title: 'Real-time Updates',
      description: 'Get live flight information and instant booking confirmations'
    },
    {
      icon: FiStar,
      title: 'Best Prices',
      description: 'Compare prices across airlines to get the best deals'
    }
  ];

  return (
    <div className="min-h-screen smooth-scroll gpu-accelerated">
      {/* Enhanced Hero Section with Professional Gradient - Made Smaller */}
      <section className="relative py-6 sm:py-8 md:py-10 lg:py-12 xl:py-14 overflow-hidden">
        {/* Professional background with enhanced gradients */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/90 via-white to-secondary-50/90 dark:from-secondary-950/95 dark:via-secondary-900/90 dark:to-primary-950/95"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-600/3 via-transparent to-secondary-600/3 dark:from-primary-500/5 dark:via-transparent dark:to-secondary-500/5"></div>
        </div>
        
        {/* Enhanced floating elements for visual interest - Made smaller */}
        <div className="absolute top-8 sm:top-12 left-4 sm:left-8 w-32 h-32 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-gradient-to-br from-primary-400/15 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-700/15 rounded-full blur-3xl animate-smooth-pulse"></div>
        <div className="absolute bottom-8 sm:bottom-12 right-4 sm:right-8 w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 bg-gradient-to-br from-secondary-400/10 to-accent-400/15 dark:from-secondary-500/15 dark:to-accent-500/20 rounded-full blur-3xl animate-smooth-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-accent-300/8 to-primary-300/8 dark:from-accent-400/12 dark:to-primary-400/12 rounded-full blur-2xl animate-smooth-pulse delay-500"></div>
        
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 animate-smooth-slide-up">
            <h1 className="hero-title-mobile text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight font-display">
              <span className="bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                Discover Your Next
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 dark:from-primary-400 dark:via-primary-500 dark:to-primary-600 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed font-body px-4">
              Search, compare, and book flights to destinations worldwide with our 
              <span className="font-bold text-primary-600 dark:text-primary-400 font-display"> professional booking platform</span>
            </p>
          </div>

          {/* Enhanced Search Form with Professional Design - Made Smaller */}
          <div className="max-w-5xl mx-auto animate-smooth-slide-up">
            <div className="relative smooth-transition">
              {/* Professional background with glass morphism */}
              <div className="absolute inset-0 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-2xl rounded-2xl border-2 border-white/30 dark:border-secondary-700/40 shadow-extra-large"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50/30 via-white/20 to-secondary-50/30 dark:from-primary-900/10 dark:via-secondary-800/20 dark:to-secondary-900/10 rounded-2xl"></div>
              
              <div className="relative p-3 sm:p-4 md:p-5 lg:p-6">
                <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-5">
                  {/* Professional Trip Type Selection - Made smaller */}
                  <div className="flex items-center justify-center mb-3 sm:mb-4 md:mb-5 lg:mb-5">
                    <div className="bg-gradient-to-r from-secondary-100/90 to-secondary-50/90 dark:from-secondary-800/90 dark:to-secondary-700/90 p-1.5 sm:p-2 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl backdrop-blur-sm border border-secondary-200/60 dark:border-secondary-600/60 shadow-medium">
                      <button
                        type="button"
                        onClick={() => handleInputChange('tripType', 'one-way')}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-2.5 lg:px-6 lg:py-2.5 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg font-bold text-xs sm:text-sm md:text-sm lg:text-sm smooth-transition ${
                          searchForm.tripType === 'one-way'
                            ? 'bg-gradient-to-r from-white to-white/95 dark:from-secondary-700 dark:to-secondary-600 text-primary-600 dark:text-primary-400 shadow-large transform scale-[1.05] font-display'
                            : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-secondary-700/60 font-body'
                        }`}
                      >
                        One Way
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('tripType', 'round-trip')}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-2.5 lg:px-6 lg:py-2.5 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg font-bold text-xs sm:text-sm md:text-sm lg:text-sm smooth-transition ${
                          searchForm.tripType === 'round-trip'
                            ? 'bg-gradient-to-r from-white to-white/95 dark:from-secondary-700 dark:to-secondary-600 text-primary-600 dark:text-primary-400 shadow-large transform scale-[1.05] font-display'
                            : 'text-secondary-600 dark:text-secondary-300 hover:text-secondary-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-secondary-700/60 font-body'
                        }`}
                      >
                        Round Trip
                      </button>
                    </div>
                  </div>

                  {/* Enhanced Search Fields - Made more compact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-3 lg:gap-4">
                    {/* From */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-1.5 sm:mb-2 font-display">
                        <FiMapPin className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 mr-1.5 sm:mr-2 text-primary-600 dark:text-primary-400" />
                        From
                      </label>
                      <AutocompleteInput
                        value={searchForm.from}
                        onChange={(value) => handleInputChange('from', value)}
                        placeholder="Where from?"
                        required
                      />
                    </div>

                    {/* To */}
                    <div className="lg:col-span-2">
                      <label className="block text-xs sm:text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-1.5 sm:mb-2 font-display">
                        <FiNavigation className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 mr-1.5 sm:mr-2 text-primary-600 dark:text-primary-400" />
                        To
                      </label>
                      <AutocompleteInput
                        value={searchForm.to}
                        onChange={(value) => handleInputChange('to', value)}
                        placeholder="Where to?"
                        required
                      />
                    </div>

                    {/* Departure Date */}
                    <div>
                      <label className="block text-xs sm:text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-1.5 sm:mb-2 font-display">
                        <FiCalendar className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 mr-1.5 sm:mr-2 text-primary-600 dark:text-primary-400" />
                        Departure
                      </label>
                      <div className="date-input-container">
                        <input
                          type="date"
                          value={searchForm.departureDate}
                          onChange={(e) => handleInputChange('departureDate', e.target.value)}
                          required
                          className="w-full px-2 py-2.5 sm:px-3 sm:py-3 md:px-3 md:py-3 lg:px-3 lg:py-3 text-xs sm:text-sm md:text-sm lg:text-sm border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 smooth-transition hover:border-secondary-300 dark:hover:border-secondary-500 backdrop-blur-sm font-body"
                        />
                      </div>
                    </div>

                    {/* Return Date (conditional) */}
                    {searchForm.tripType === 'round-trip' && (
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-secondary-700 dark:text-secondary-300 mb-1.5 sm:mb-2 font-display">
                          <FiCalendar className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 mr-1.5 sm:mr-2 text-primary-600 dark:text-primary-400" />
                          Return
                        </label>
                        <div className="date-input-container">
                          <input
                            type="date"
                            value={searchForm.returnDate}
                            onChange={(e) => handleInputChange('returnDate', e.target.value)}
                            min={searchForm.departureDate || tomorrow}
                            required={searchForm.tripType === 'round-trip'}
                            className="w-full px-2 py-2.5 sm:px-3 sm:py-3 md:px-3 md:py-3 lg:px-3 lg:py-3 text-xs sm:text-sm md:text-sm lg:text-sm border-2 border-secondary-200/60 dark:border-secondary-600/60 bg-white/95 dark:bg-secondary-800/95 text-secondary-900 dark:text-white rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100/50 dark:focus:ring-primary-800/50 smooth-transition hover:border-secondary-300 dark:hover:border-secondary-500 backdrop-blur-sm font-body"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Search Button - Made smaller */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="btn-primary py-2.5 px-5 sm:py-3 sm:px-6 md:py-3 md:px-6 lg:py-3 lg:px-7 text-sm sm:text-base md:text-sm lg:text-base font-bold flex items-center justify-center space-x-2 sm:space-x-3 group font-display shadow-extra-large hover:shadow-extra-large smooth-transition gpu-accelerated"
                    >
                      <FiSearch className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 group-hover:rotate-12 smooth-transition" />
                      <span>Find Flights</span>
                      <FiArrowRight className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4 group-hover:translate-x-1 smooth-transition" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-10 sm:py-12 md:py-14 lg:py-16 bg-gradient-to-b from-white via-secondary-50/40 to-white dark:from-secondary-950 dark:via-secondary-900/60 dark:to-secondary-950 relative overflow-hidden smooth-scroll gpu-accelerated">
        {/* Enhanced background elements */}
        <div className="absolute top-0 right-1/4 w-80 h-80 md:w-96 md:h-96 lg:w-96 lg:h-96 bg-gradient-to-br from-primary-200/20 to-primary-400/10 dark:from-primary-500/15 dark:to-primary-700/10 rounded-full blur-3xl animate-smooth-pulse delay-300"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 md:w-88 md:h-88 lg:w-88 lg:h-88 bg-gradient-to-br from-secondary-200/30 to-accent-200/20 dark:from-secondary-500/20 dark:to-accent-500/15 rounded-full blur-3xl animate-smooth-pulse delay-700"></div>
        
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16 animate-smooth-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 font-display">
              <span className="bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
                Why Choose Our Platform?
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed px-4 font-body">
              Experience the difference with our advanced flight booking platform designed for modern travelers who demand excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-6 lg:gap-7">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group relative bg-white/95 dark:bg-secondary-900/95 p-5 sm:p-6 md:p-6 lg:p-7 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-2xl shadow-large hover:shadow-extra-large dark:shadow-2xl smooth-transition-slow transform hover:scale-[1.05] hover:-translate-y-3 border border-secondary-100/60 dark:border-secondary-700/60 hover:border-primary-200/60 dark:hover:border-primary-700/60 backdrop-blur-lg overflow-hidden gpu-accelerated animate-smooth-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Enhanced background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 via-white/30 to-secondary-50/60 dark:from-primary-900/30 dark:via-secondary-800/20 dark:to-secondary-900/30 opacity-0 group-hover:opacity-100 smooth-transition-slow rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-2xl"></div>
                
                {/* Premium shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 smooth-transition transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <div className="relative z-10 text-center">
                  <div className="bg-gradient-to-br from-primary-100/80 to-primary-200/80 dark:from-primary-900/50 dark:to-primary-800/50 w-14 h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl sm:rounded-3xl md:rounded-2xl lg:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-4 lg:mb-5 group-hover:scale-125 smooth-transition shadow-large group-hover:shadow-extra-large border border-primary-200/60 dark:border-primary-700/60">
                    <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-8 md:h-8 lg:w-9 lg:h-9 text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 smooth-transition group-hover:rotate-12" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-lg lg:text-xl font-bold text-secondary-900 dark:text-white mb-2 sm:mb-3 md:mb-3 lg:mb-3 group-hover:text-primary-700 dark:group-hover:text-primary-300 smooth-transition font-display">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-base lg:text-base text-secondary-600 dark:text-secondary-300 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Flight Information Section */}
      <section className="py-12 sm:py-14 md:py-16 lg:py-18 bg-gradient-to-b from-secondary-50 via-white to-secondary-50 dark:from-secondary-900 dark:via-secondary-950 dark:to-secondary-900 relative overflow-hidden smooth-scroll gpu-accelerated">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-80 md:h-80 lg:w-80 lg:h-80 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl animate-smooth-float"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-72 md:h-72 lg:w-72 lg:h-72 bg-secondary-200/30 dark:bg-secondary-500/15 rounded-full blur-3xl animate-smooth-float delay-1000"></div>
        
        <div className="relative w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-10 sm:mb-12 md:mb-12 lg:mb-14 animate-smooth-slide-up">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold mb-4 sm:mb-5 md:mb-5 lg:mb-6 bg-gradient-to-r from-secondary-900 via-primary-700 to-secondary-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
              Flight Information
            </h2>
            <p className="text-base sm:text-lg md:text-lg lg:text-xl text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto leading-relaxed">
              Discover real-time flight data and explore our most popular destinations worldwide
            </p>
          </div>
          
          {loadingDestinations ? (
            <div className="text-center py-10 sm:py-12 md:py-12 lg:py-14 animate-smooth-slide-up">
              <div className="animate-spin rounded-full h-12 w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 border-b-4 border-primary-600 dark:border-primary-400 mx-auto mb-4 sm:mb-5 md:mb-5 lg:mb-6"></div>
              <p className="text-base md:text-lg lg:text-lg text-secondary-600 dark:text-secondary-300 font-medium">Loading flight information...</p>
            </div>
          ) : popularDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-6 lg:gap-7">
              {popularDestinations.map((destination, index) => (
                <div 
                  key={index} 
                  className="group relative bg-white/95 dark:bg-secondary-800/95 backdrop-blur-2xl cursor-pointer smooth-transition-slow transform hover:scale-105 hover:-translate-y-2 border border-secondary-200/60 dark:border-secondary-700/60 rounded-2xl md:rounded-2xl lg:rounded-2xl shadow-large hover:shadow-extra-large dark:shadow-2xl overflow-hidden gpu-accelerated animate-smooth-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    // Navigate to search page with destination pre-filled
                    navigate('/flights/search', {
                      state: {
                        prefilledDestination: `${destination.airport.city}, ${destination.airport.country} (${destination.airport.code})`
                      }
                    });
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-transparent to-secondary-50/80 dark:from-primary-900/30 dark:via-transparent dark:to-secondary-800/30 opacity-0 group-hover:opacity-100 smooth-transition"></div>
                  
                  <div className="relative p-5 sm:p-6 md:p-5 lg:p-6">
                    {/* Header with plane icon */}
                    <div className="flex items-center justify-between mb-4 sm:mb-4 md:mb-4 lg:mb-4">
                      <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 p-2.5 sm:p-3 md:p-2.5 lg:p-3 rounded-xl md:rounded-xl lg:rounded-xl shadow-medium group-hover:scale-110 smooth-transition">
                        <div className="text-xl sm:text-2xl md:text-xl lg:text-2xl transform group-hover:rotate-12 smooth-transition">✈️</div>
                      </div>
                      <FiArrowRight className="w-4 h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 text-secondary-400 dark:text-secondary-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 smooth-transition transform group-hover:translate-x-2" />
                    </div>
                    
                    {/* Destination details */}
                    <div className="space-y-2.5 sm:space-y-3 md:space-y-2.5 lg:space-y-3">
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-lg lg:text-xl font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 smooth-transition mb-1.5">
                          {destination.airport.city}
                        </h3>
                        <p className="text-secondary-600 dark:text-secondary-300 font-medium text-sm sm:text-base md:text-sm lg:text-base">{destination.airport.country}</p>
                      </div>
                      
                      {/* Pricing and availability */}
                      <div className="pt-2.5 sm:pt-3 md:pt-2.5 lg:pt-3 border-t border-secondary-200/50 dark:border-secondary-700/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Starting from</p>
                            <p className="text-primary-600 dark:text-primary-400 font-bold text-lg sm:text-xl md:text-lg lg:text-xl">{destination.startingPrice ? formatPrice(destination.startingPrice) : 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Available</p>
                            <p className="text-secondary-700 dark:text-secondary-300 font-semibold text-sm">{destination.flightCount} flights</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto animate-smooth-slide-up">
              <div className="bg-white/95 dark:bg-secondary-800/95 backdrop-blur-2xl p-8 sm:p-9 md:p-8 lg:p-9 rounded-2xl md:rounded-2xl lg:rounded-2xl shadow-extra-large border border-secondary-200/60 dark:border-secondary-700/60 text-center gpu-accelerated">
                <div className="bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 w-16 h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-2xl md:rounded-2xl lg:rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-6 md:mb-5 lg:mb-6 shadow-large animate-smooth-float">
                  <FiNavigation className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-xl lg:text-2xl font-bold text-secondary-900 dark:text-white mb-2.5 sm:mb-3 md:mb-2.5 lg:mb-3">Ready for Your Next Journey?</h3>
                <p className="text-base sm:text-lg md:text-base lg:text-lg text-secondary-600 dark:text-secondary-300 mb-5 sm:mb-6 md:mb-5 lg:mb-6 leading-relaxed">
                  Search for flights to discover amazing destinations and competitive prices.
                </p>
                <Link 
                  to="/flights/search"
                  className="btn-primary inline-flex items-center space-x-3 text-base sm:text-base md:text-base lg:text-base px-6 py-3 md:px-7 md:py-3.5 lg:px-8 lg:py-3.5 smooth-transition gpu-accelerated"
                >
                  <FiSearch className="w-4 h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
                  <span>Explore Flights</span>
                  <FiArrowRight className="w-4 h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="py-8 sm:py-10 md:py-12 lg:py-14 bg-white dark:bg-secondary-950 smooth-scroll gpu-accelerated">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="text-center mb-8 sm:mb-9 md:mb-8 lg:mb-10 animate-smooth-slide-up">
            <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold text-secondary-900 dark:text-white mb-2.5 sm:mb-3 md:mb-2.5 lg:mb-3">Quick Actions</h2>
            <p className="text-secondary-600 dark:text-secondary-300">Get started with these popular features</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-4 lg:gap-5">
            <Link
              to="/flights/search"
              className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 sm:p-6 md:p-5 lg:p-6 rounded-xl md:rounded-xl lg:rounded-xl hover:from-primary-100 hover:to-primary-200 dark:hover:from-primary-800/30 dark:hover:to-primary-700/30 smooth-transition-fast group border border-primary-200 dark:border-primary-800 gpu-accelerated animate-smooth-slide-up transform hover:scale-105 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="bg-primary-500 dark:bg-primary-600 w-12 h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mx-auto mb-2.5 sm:mb-3 md:mb-2.5 lg:mb-3 group-hover:scale-110 smooth-transition shadow-lg">
                  <FiSearch className="w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-base lg:text-lg font-semibold text-secondary-900 dark:text-white mb-1.5">Browse All Flights</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Explore available flights and destinations</p>
              </div>
            </Link>

            <Link
              to="/my-bookings"
              className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 p-5 sm:p-6 md:p-5 lg:p-6 rounded-xl md:rounded-xl lg:rounded-xl hover:from-success-100 hover:to-success-200 dark:hover:from-success-800/30 dark:hover:to-success-700/30 smooth-transition-fast group border border-success-200 dark:border-success-800 gpu-accelerated animate-smooth-slide-up transform hover:scale-105 hover:-translate-y-1"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="text-center">
                <div className="bg-success-500 dark:bg-success-600 w-12 h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mx-auto mb-2.5 sm:mb-3 md:mb-2.5 lg:mb-3 group-hover:scale-110 smooth-transition shadow-lg">
                  <FiClock className="w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-base lg:text-lg font-semibold text-secondary-900 dark:text-white mb-1.5">My Bookings</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">View and manage your flight reservations</p>
              </div>
            </Link>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/20 dark:to-accent-800/20 p-5 sm:p-6 md:p-5 lg:p-6 rounded-xl md:rounded-xl lg:rounded-xl hover:from-accent-100 hover:to-accent-200 dark:hover:from-accent-800/30 dark:hover:to-accent-700/30 smooth-transition-fast group cursor-pointer border border-accent-200 dark:border-accent-800 gpu-accelerated animate-smooth-slide-up transform hover:scale-105 hover:-translate-y-1"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="text-center">
                <div className="bg-accent-500 dark:bg-accent-600 w-12 h-12 md:w-13 md:h-13 lg:w-14 lg:h-14 rounded-full flex items-center justify-center mx-auto mb-2.5 sm:mb-3 md:mb-2.5 lg:mb-3 group-hover:scale-110 smooth-transition shadow-lg">
                  <FiTrendingUp className="w-6 h-6 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <h3 className="text-base sm:text-lg md:text-base lg:text-lg font-semibold text-secondary-900 dark:text-white mb-1.5">Best Deals</h3>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Discover special offers and discounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;