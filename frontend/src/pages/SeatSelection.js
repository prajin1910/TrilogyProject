import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiArrowRight, FiClock, FiMapPin, FiNavigation, FiUser } from 'react-icons/fi';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FlightPathMap from '../components/FlightPathMap';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { bookingsAPI, flightsAPI } from '../utils/api';

const SeatSelection = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [flight, setFlight] = useState(null);
  const [seatMap, setSeatMap] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [contactDetails, setContactDetails] = useState({
    phone: ''
  });
  const [numSeatsRequired, setNumSeatsRequired] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [paymentMethod, setPaymentMethod] = useState('card');
  // eslint-disable-next-line no-unused-vars
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  // eslint-disable-next-line no-unused-vars
  const [seatRecommendations, setSeatRecommendations] = useState(null);
  const [showFlightPath, setShowFlightPath] = useState(true);
  const [showAIRecommendationModal, setShowAIRecommendationModal] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  // const [seatPreferences, setSeatPreferences] = useState({
  //   windowSeat: true,
  //   aisleSeat: false,
  //   extraLegroom: false,
  //   emergencyExit: false
  // });
  // const [showAlternativeFlights, setShowAlternativeFlights] = useState(false);
  // const [alternativeFlights, setAlternativeFlights] = useState([]);

  const searchCriteria = location.state?.searchCriteria || {};

  const fetchFlightAndSeats = useCallback(async () => {
    try {
      const [flightResponse, seatResponse] = await Promise.all([
        flightsAPI.getById(flightId),
        flightsAPI.getSeatMap(flightId)
      ]);

      setFlight(flightResponse.data.flight);
      setSeatMap(seatResponse.data.seatMap);
    } catch (error) {
      console.error('Error fetching flight data:', error);
      toast.error('Error loading flight information');
      navigate('/flights/search');
    } finally {
      setIsLoading(false);
    }
  }, [flightId, navigate]);

  const initializePassengers = useCallback(() => {
    const passengerList = Array.from({ length: numSeatsRequired }, (_, index) => ({
      title: 'Mr',
      firstName: index === 0 ? user?.username || '' : '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      nationality: 'US',
      passportNumber: '',
      mealPreference: 'none'
    }));
    setPassengers(passengerList);
    
    // Initialize contact details
    setContactDetails({
      phone: user.profile?.phone || ''
    });
  }, [numSeatsRequired, user?.username, user.profile?.phone]);

  // Handle seat recommendations from flight path analysis
  const handleSeatRecommendation = useCallback((recommendations) => {
    setSeatRecommendations(recommendations);
  }, []);

  // AI Seat Recommendation Function
  const generateAIRecommendation = async () => {
    if (!flight) return;
    
    setIsGeneratingAI(true);
    setShowAIRecommendationModal(true);
    
    // Simulate AI analysis (in real implementation, this would call an AI service)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const departureCity = flight.route.departure.airport.city;
    const departureCountry = flight.route.departure.airport.country;
    const arrivalCity = flight.route.arrival.airport.city;
    const arrivalCountry = flight.route.arrival.airport.country;
    const departureTime = new Date(flight.route.departure.time);
    // eslint-disable-next-line no-unused-vars
    const arrivalTime = new Date(flight.route.arrival.time);
    const flightDuration = flight.duration;
    
    // Generate smart recommendations based on route and time
    let recommendation = `🛫 AI Flight Analysis for ${departureCity} to ${arrivalCity}\n\n`;
    
    // Route-specific recommendations
    if (departureCountry === 'UAE' && arrivalCountry === 'USA') {
      recommendation += `🏙️ Scenic Route Analysis:\n`;
      recommendation += `• Left Side Seats (A, B): Perfect for viewing Dubai's iconic skyline including Burj Khalifa, Palm Jumeirah, and Dubai Marina during takeoff\n`;
      recommendation += `• Right Side Seats (E, F): Excellent views of the Arabian Gulf and desert landscapes\n\n`;
    } else if (departureCountry === 'USA' && arrivalCountry === 'UAE') {
      recommendation += `🏜️ Scenic Route Analysis:\n`;
      recommendation += `• Right Side Seats (E, F): Spectacular views of Dubai's futuristic skyline during approach, including Burj Al Arab and The World Islands\n`;
      recommendation += `• Left Side Seats (A, B): Great views of the Persian Gulf and coastal developments\n\n`;
    } else if (departureCity.toLowerCase().includes('new york') || arrivalCity.toLowerCase().includes('new york')) {
      recommendation += `🗽 NYC Route Analysis:\n`;
      recommendation += `• Right Side Seats (E, F): Amazing views of Manhattan skyline, Statue of Liberty, and Central Park\n`;
      recommendation += `• Left Side Seats (A, B): Great views of Brooklyn Bridge and East River\n\n`;
    } else {
      recommendation += `🌍 General Route Analysis:\n`;
      recommendation += `• Window Seats (A, F): Best for scenic views and photography\n`;
      recommendation += `• Aisle Seats (C, D): Easy access for movement during flight\n\n`;
    }
    
    // Time-based recommendations
    const hour = departureTime.getHours();
    if (hour >= 6 && hour <= 18) {
      recommendation += `☀️ Daytime Flight Benefits:\n`;
      recommendation += `• Left Side: Morning sun exposure, warmer and brighter cabin experience\n`;
      recommendation += `• Right Side: Shade side, cooler and more comfortable for sensitive passengers\n`;
      recommendation += `• Window Seats: Perfect for aerial photography and sightseeing\n\n`;
    } else {
      recommendation += `🌙 Night Flight Benefits:\n`;
      recommendation += `• Window Seats: Stunning city lights and stargazing opportunities\n`;
      recommendation += `• Any Side: Equal comfort as sun position is not a factor\n`;
      recommendation += `• Consider: Seats away from galley and restrooms for better sleep\n\n`;
    }
    
    // Duration-based recommendations
    const durationHours = typeof flightDuration === 'object' ? flightDuration.hours : Math.floor(flightDuration / 60);
    if (durationHours >= 8) {
      recommendation += `✈️ Long-Haul Flight Tips:\n`;
      recommendation += `• Aisle Seats: Better for stretching and bathroom access\n`;
      recommendation += `• Front Sections: Quieter, faster boarding/deplaning\n`;
      recommendation += `• Away from Galley: Reduced noise and foot traffic\n\n`;
    } else if (durationHours >= 4) {
      recommendation += `🕐 Medium-Haul Flight Tips:\n`;
      recommendation += `• Window Seats: Great for views and rest\n`;
      recommendation += `• Emergency Exit Rows: Extra legroom if available\n\n`;
    } else {
      recommendation += `⚡ Short Flight Tips:\n`;
      recommendation += `• Any Seat: Comfort differences minimal\n`;
      recommendation += `• Window Seats: Maximize your brief scenic experience\n\n`;
    }
    
    // Class-specific recommendations
    recommendation += `🎯 Class-Specific Recommendations:\n`;
    recommendation += `• First Class: Any seat offers premium experience, choose based on personal preference\n`;
    recommendation += `• Business Class: Forward cabin for priority service and quieter environment\n`;
    recommendation += `• Economy Class: Consider seat pitch, proximity to amenities, and personal preferences\n\n`;
    
    // Final personalized advice
    recommendation += `💡 Smart Booking Tip:\n`;
    recommendation += `Based on your ${departureCity} to ${arrivalCity} route, I recommend window seats on the ${
      (departureCountry === 'UAE' && arrivalCountry === 'USA') ? 'left side (A, B)' :
      (departureCountry === 'USA' && arrivalCountry === 'UAE') ? 'right side (E, F)' :
      'side that interests you most'
    } for the best overall experience combining scenic views and comfort.`;
    
    setAiRecommendation(recommendation);
    setIsGeneratingAI(false);
  };

  useEffect(() => {
    fetchFlightAndSeats();
  }, [flightId, fetchFlightAndSeats]);

  useEffect(() => {
    initializePassengers();
    // Clear selected seats when number of seats changes
    setSelectedSeats([]);
  }, [initializePassengers, numSeatsRequired]);

  const getSeatIcon = (seat) => {
    if (!seat.isAvailable || seat.isBlocked) return '✗';
    if (selectedSeats.includes(seat.seatNumber)) {
      const index = selectedSeats.indexOf(seat.seatNumber);
      return index + 1;
    }
    return seat.seatNumber.slice(-1);
  };

  const handleSeatClick = (seatNumber) => {
    const seat = getSeatDetails(seatNumber);
    
    if (!seat || !seat.isAvailable || seat.isBlocked) {
      toast.error('This seat is not available');
      return;
    }

    const isSelected = selectedSeats.includes(seatNumber);

    if (isSelected) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(s => s !== seatNumber));
    } else {
      // Select seat
      if (selectedSeats.length >= numSeatsRequired) {
        toast.error(`You can only select ${numSeatsRequired} seat${numSeatsRequired > 1 ? 's' : ''}`);
        return;
      }
      setSelectedSeats(prev => [...prev, seatNumber]);
    }
  };

  const getSeatDetails = (seatNumber) => {
    if (!seatMap || !seatMap.seats) return null;
    
    const seat = seatMap.seats.find(s => s.seatNumber === seatNumber);
    if (seat) {
      return {
        ...seat,
        status: seat.isAvailable && !seat.isBlocked ? 'available' : 
                seat.isBlocked ? 'blocked' : 'occupied'
      };
    }
    return null;
  };

  const getSeatClass = (seatNumber) => {
    const isSelected = selectedSeats.includes(seatNumber);
    const seat = getSeatDetails(seatNumber);
    
    if (!seat) return 'seat seat-blocked';
    
    if (isSelected) return 'seat seat-selected';
    
    let baseClass = 'seat';
    
    // Add class-specific styling
    if (seat.class === 'first') {
      baseClass += ' border-yellow-400';
    } else if (seat.class === 'business') {
      baseClass += ' border-blue-400';
    } else {
      baseClass += ' border-gray-300';
    }
    
    if (seat.isAvailable && !seat.isBlocked) {
      return `${baseClass} seat-available`;
    } else if (seat.isBlocked) {
      return `${baseClass} seat-blocked`;
    } else {
      return `${baseClass} seat-occupied`;
    }
  };

  // const calculateTotal = () => {
  //   let total = 0;
  //   selectedSeats.forEach(seatNumber => {
  //     const seat = getSeatDetails(seatNumber);
  //     if (seat) {
  //       total += seat.price || flight?.pricing?.[searchCriteria.class] || 0;
  //     }
  //   });
  //   return total;
  // };

  // const isReadyToProceed = () => {
  //   return selectedSeats.length === requiredPassengers && 
  //          passengers.every(p => p.firstName && p.lastName && p.gender && p.dateOfBirth);
  // };

  const getSeatPrice = (seat) => {
    if (!seat) return 0;
    return seat.price || flight?.pricing[seat.class]?.price || 0;
  };

  const getTotalPrice = () => {
    if (!flight) return 0;
    
    // Base price for all seats
    const basePrice = (flight.pricing[searchCriteria.class || 'economy']?.price || 0) * numSeatsRequired;
    
    // Additional cost for selected seats (if any)
    let seatSelectionCost = 0;
    if (seatMap && selectedSeats.length > 0) {
      seatSelectionCost = selectedSeats.reduce((total, seatNumber) => {
        const seat = seatMap.seats.find(s => s.seatNumber === seatNumber);
        const seatPrice = getSeatPrice(seat);
        const baseSeatPrice = flight.pricing[searchCriteria.class || 'economy']?.price || 0;
        return total + Math.max(0, seatPrice - baseSeatPrice); // Only additional cost
      }, 0);
    }
    
    return basePrice + seatSelectionCost;
  };

  const getTaxesAndFees = () => {
    const subtotal = getTotalPrice();
    return Math.round(subtotal * 0.1) + 25; // 10% tax + $25 service fee
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getTaxesAndFees();
  };

  const handlePassengerChange = (index, field, value) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
  };

  const validatePassengerInfo = () => {
    for (let i = 0; i < numSeatsRequired; i++) {
      const passenger = passengers[i];
      if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth) {
        toast.error(`Please fill in all required information for passenger ${i + 1}`);
        return false;
      }
    }
    
    if (!contactDetails.phone || contactDetails.phone.trim() === '') {
      toast.error('Please provide a phone number');
      return false;
    }
    
    return true;
  };

  const handleBooking = async () => {
    if (selectedSeats.length !== numSeatsRequired) {
      toast.error(`Please select ${numSeatsRequired} seat${numSeatsRequired > 1 ? 's' : ''}`);
      return;
    }

    if (!validatePassengerInfo()) {
      return;
    }

    // Show payment modal first
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setShowPaymentModal(false);
    setIsBooking(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const bookingData = {
        flightId,
        passengers: passengers.slice(0, numSeatsRequired).map((passenger, index) => ({
          ...passenger,
          seatNumber: selectedSeats[index]
        })),
        contactDetails: {
          email: user.email,
          phone: contactDetails.phone || '000-000-0000',
          emergencyContact: {
            name: '',
            phone: '',
            relation: ''
          }
        },
        selectedSeats,
        specialServices: []
      };

      const response = await bookingsAPI.create(bookingData);
      
      if (response.data.success) {
        toast.success('Payment successful! Booking confirmed!');
        navigate('/booking/confirmation', {
          state: {
            booking: response.data.booking,
            paymentStatus: 'success'
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderSeatMap = () => {
    if (!seatMap) return null;

    const rows = {};
    seatMap.seats.forEach(seat => {
      const row = seat.position.row;
      if (!rows[row]) rows[row] = [];
      rows[row].push(seat);
    });

    const sortedRows = Object.keys(rows).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Group rows by class for visual separation
    const classGroups = {};
    sortedRows.forEach(rowNum => {
      const rowSeats = rows[rowNum];
      const seatClass = rowSeats[0]?.class || 'economy';
      if (!classGroups[seatClass]) classGroups[seatClass] = [];
      classGroups[seatClass].push(rowNum);
    });

    return (
      <div className="card overflow-hidden">
        {/* Airplane Structure Container */}
        <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mx-2 sm:mx-4">
          
          {/* Airplane Nose/Cockpit */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="relative mx-auto w-32 sm:w-40 lg:w-48 h-12 sm:h-14 lg:h-16">
              {/* Nose cone */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 bg-gradient-to-b from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-800 rounded-t-full border-2 border-slate-400 dark:border-slate-600"></div>
              
              {/* Cockpit windows */}
              <div className="absolute top-1 sm:top-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                <div className="w-2 sm:w-3 h-3 sm:h-4 bg-blue-200 dark:bg-blue-800 rounded-t-full border border-slate-400 dark:border-slate-600"></div>
                <div className="w-2 sm:w-3 h-3 sm:h-4 bg-blue-200 dark:bg-blue-800 rounded-t-full border border-slate-400 dark:border-slate-600"></div>
              </div>
              
              {/* Cockpit label */}
              <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 bg-secondary-800 dark:bg-secondary-900 text-white py-1 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-semibold">
                <FiNavigation className="inline mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Cockpit
              </div>
            </div>
          </div>

          {/* Aircraft Fuselage with Wings */}
          <div className="relative">
            {/* Main Fuselage */}
            <div className="bg-gradient-to-b from-white to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 shadow-inner p-6">
              
              {/* Cabin Interior */}
              <div className="space-y-8">
                {['first', 'business', 'economy'].map(className => {
                  if (!classGroups[className]) return null;
                  
                  return (
                    <div key={className} className="space-y-4">
                      {/* Class Section Header */}
                      <div className="text-center py-3">
                        <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold shadow-md ${
                          className === 'first' 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' :
                          className === 'business' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' :
                            'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                        }`}>
                          {className.charAt(0).toUpperCase() + className.slice(1)} Class
                        </div>
                      </div>
                      
                      {/* Cabin Section Border */}
                      <div className={`border-2 rounded-xl p-4 ${
                        className === 'first' 
                          ? 'border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20' :
                        className === 'business' 
                          ? 'border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20' :
                          'border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-900/20'
                      }`}>
                        
                        {/* Overhead Compartments */}
                        <div className="flex justify-center mb-4">
                          <div className="flex space-x-8">
                            <div className="w-24 h-3 bg-slate-300 dark:bg-slate-600 rounded-b-lg shadow-md"></div>
                            <div className="w-4"></div>
                            <div className="w-24 h-3 bg-slate-300 dark:bg-slate-600 rounded-b-lg shadow-md"></div>
                          </div>
                        </div>
                        
                        {/* Seats Layout */}
                        <div className="space-y-3">
                          {classGroups[className].map(rowNum => {
                            const rowSeats = rows[rowNum].sort((a, b) => 
                              a.position.column.localeCompare(b.position.column)
                            );

                            return (
                              <div key={rowNum} className="flex items-center justify-center space-x-2">
                                {/* Row Number */}
                                <div className="w-8 h-8 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-full border">
                                  {rowNum}
                                </div>
                                
                                {/* Left Side Window */}
                                <div className="w-4 h-6 bg-blue-200 dark:bg-blue-800 rounded border border-slate-300 dark:border-slate-600 shadow-inner"></div>
                                
                                {/* Seats */}
                                <div className="flex space-x-1">
                                  {rowSeats.map((seat, index) => {
                                    const isAisle = seatMap.layout === '3-3' && index === 2;
                                    
                                    return (
                                      <React.Fragment key={seat.seatNumber}>
                                        <button
                                          onClick={() => handleSeatClick(seat.seatNumber)}
                                          className={`${getSeatClass(seat.seatNumber)} relative group transform transition-all duration-200 hover:scale-110`}
                                          disabled={!seat.isAvailable || seat.isBlocked}
                                          title={`${seat.seatNumber} - ${seat.class} - $${getSeatPrice(seat)}`}
                                        >
                                          {getSeatIcon(seat)}
                                          
                                          {/* Enhanced Tooltip */}
                                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                                            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-xl">
                                              <div className="font-semibold">{seat.seatNumber}</div>
                                              <div className="text-gray-300">{seat.class} • ${getSeatPrice(seat)}</div>
                                              {seat.features && seat.features.length > 0 && (
                                                <div className="text-gray-400 text-xs mt-1">
                                                  {seat.features.join(', ')}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </button>
                                        
                                        {/* Aisle */}
                                        {isAisle && (
                                          <div className="w-6 flex flex-col items-center">
                                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-600"></div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold transform rotate-90 whitespace-nowrap">AISLE</div>
                                          </div>
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                                
                                {/* Right Side Window */}
                                <div className="w-4 h-6 bg-blue-200 dark:bg-blue-800 rounded border border-slate-300 dark:border-slate-600 shadow-inner"></div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Aircraft Tail */}
          <div className="text-center mt-6 sm:mt-8">
            <div className="relative mx-auto w-24 sm:w-28 lg:w-32 h-10 sm:h-11 lg:h-12">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 sm:w-11 lg:w-12 h-10 sm:h-11 lg:h-12 bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-b-full border-2 border-slate-400 dark:border-slate-600"></div>
              <div className="absolute -top-1 sm:-top-2 left-1/2 transform -translate-x-1/2 w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded border border-slate-400 dark:border-slate-600"></div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
          <h4 className="text-base font-medium text-secondary-900 dark:text-white mb-4 text-center">
            Seat Legend
          </h4>
          
          {/* Basic Seat Types */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat seat-available border-secondary-300 dark:border-secondary-600">A</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Available</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat seat-selected">1</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Selected</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat seat-occupied">✗</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Occupied</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat seat-blocked">✗</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Blocked</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat border-warning-400 dark:border-warning-600 bg-white dark:bg-secondary-800">F</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">First Class</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat border-primary-400 dark:border-primary-600 bg-white dark:bg-secondary-800">B</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Business</span>
            </div>
            <div className="flex flex-col items-center space-y-2 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="seat border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800">E</div>
              <span className="text-xs font-medium text-secondary-600 dark:text-secondary-300 text-center">Economy</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-secondary-600 dark:text-secondary-300">Loading seat map...</p>
        </div>
      </div>
    );
  }

  if (!flight || !seatMap) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 dark:text-secondary-300">Flight information not available</p>
        <button onClick={() => navigate('/flights/search')} className="btn-primary mt-4">
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="seat-selection-page max-w-7xl mx-auto px-3 sm:px-4 md:px-5 lg:px-6">
      {/* Flight Header */}
      <div className="flight-header card p-3 sm:p-4 md:p-5 lg:p-5 mb-4 sm:mb-6 md:mb-6 lg:mb-7 mx-1 sm:mx-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-3 lg:space-x-3 mb-4 lg:mb-0">
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2.5 sm:p-3 md:p-2.5 lg:p-2.5 rounded-lg">
              <FiNavigation className="w-6 h-6 sm:w-7 sm:h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-xl lg:text-xl font-bold text-secondary-900 dark:text-white">
                {flight.airline.name} - {flight.flightNumber}
              </h1>
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-3 lg:space-x-3 text-secondary-600 dark:text-secondary-300">
                <div className="flex items-center space-x-1">
                  <FiMapPin className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3 lg:h-3" />
                  <span className="text-sm sm:text-base md:text-sm lg:text-sm">{flight.route.departure.airport.code} → {flight.route.arrival.airport.code}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FiClock className="w-3 h-3 sm:w-4 sm:h-4 md:w-3 md:h-3 lg:w-3 lg:h-3" />
                  <span className="text-sm sm:text-base md:text-sm lg:text-sm">
                    {new Date(flight.route.departure.time).toLocaleDateString()} • 
                    {new Date(flight.route.departure.time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-3 lg:p-3 rounded-lg">
            <div className="text-xl sm:text-2xl md:text-xl lg:text-xl font-bold text-primary-600 dark:text-primary-400">
              Total: {formatPrice(getFinalTotal())}
            </div>
            <div className="text-sm text-secondary-600 dark:text-secondary-300">
              {selectedSeats.length} of {numSeatsRequired} seats selected
            </div>
          </div>
        </div>
      </div>

      {/* Flight Path Map & Sun Position Analysis */}
      {showFlightPath && flight && (
        <div className="mb-4 sm:mb-6 md:mb-6 lg:mb-7 mx-1 sm:mx-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-3 lg:mb-4 px-2 sm:px-0">
            <h2 className="text-base sm:text-lg md:text-lg lg:text-xl font-semibold text-secondary-900 dark:text-white text-center sm:text-left">
              🗺️ Flight Path & Sun Position Analysis
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <button
                onClick={generateAIRecommendation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 
                         hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all 
                         duration-300 hover:scale-105 hover:shadow-lg text-xs sm:text-sm font-medium"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs sm:text-sm">AI Recommendation</span>
              </button>
              <button
                onClick={() => setShowFlightPath(false)}
                className="w-full sm:w-auto text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white py-2 sm:py-0 px-3 sm:px-0 bg-gray-100 sm:bg-transparent dark:bg-gray-700 sm:dark:bg-transparent rounded-lg sm:rounded-none"
              >
                Hide Map
              </button>
            </div>
          </div>
          <div className="px-1 sm:px-0">
            <FlightPathMap 
              flight={flight} 
              onSeatRecommendation={handleSeatRecommendation}
            />
          </div>
        </div>
      )}

      {/* Show Flight Path Toggle */}
      {!showFlightPath && (
        <div className="mb-4 sm:mb-6 md:mb-6 lg:mb-7 text-center px-2 sm:px-0">
          <button
            onClick={() => setShowFlightPath(true)}
            className="btn-secondary w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 text-sm sm:text-base"
          >
            🗺️ Show Flight Path & Sun Analysis
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-1 sm:px-0">
        {/* Seat Map */}
        <div className="lg:col-span-2 seat-map-container">
          <h2 className="text-base sm:text-lg md:text-base lg:text-lg font-semibold mb-3 sm:mb-4 md:mb-3 lg:mb-4 text-secondary-900 dark:text-white px-2 sm:px-0">Select Your Seats</h2>
          {renderSeatMap()}
        </div>

        {/* Passenger Information */}
        <div className="space-y-4 sm:space-y-5 md:space-y-4 lg:space-y-5">
          {/* Number of Seats Selection */}
          <div className="card p-3 sm:p-4 md:p-4 lg:p-4">
            <h3 className="text-base sm:text-lg md:text-base lg:text-base font-semibold mb-4 sm:mb-5 md:mb-4 lg:mb-4 text-secondary-900 dark:text-white flex items-center">
              <FiUser className="mr-2 w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
              Booking Details
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 sm:p-4 md:p-3 lg:p-3 rounded-lg">
              <label className="block text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 sm:mb-3">
                Number of Seats Required
              </label>
              <select
                value={numSeatsRequired}
                onChange={(e) => setNumSeatsRequired(parseInt(e.target.value))}
                className="input-field w-full bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white"
              >
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1} className="bg-white dark:bg-secondary-800">
                    {i + 1} Seat{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                You can book between 1-9 seats per booking. Passenger information will be required for each seat.
              </p>
            </div>
          </div>

          <div className="card p-3 sm:p-4 md:p-4 lg:p-4">
            <h3 className="text-base sm:text-lg md:text-base lg:text-base font-semibold mb-4 sm:mb-5 md:mb-4 lg:mb-4 text-secondary-900 dark:text-white">Passenger Information</h3>
            
            {passengers.slice(0, numSeatsRequired).map((passenger, index) => (
              <div key={index} className="mb-5 sm:mb-6 md:mb-5 lg:mb-6 last:mb-0 bg-gray-50 dark:bg-gray-700/50 rounded-lg sm:rounded-xl md:rounded-lg lg:rounded-lg p-3 sm:p-4 md:p-4 lg:p-4">
                <h4 className="font-medium text-secondary-900 dark:text-white mb-3 sm:mb-4 md:mb-3 lg:mb-3 flex items-center text-sm sm:text-base md:text-sm lg:text-base">
                  <FiUser className="mr-2 w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4 lg:h-4" />
                  Passenger {index + 1}
                  {selectedSeats[index] && (
                    <span className="ml-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 sm:px-3 sm:py-1 md:px-2 md:py-1 lg:px-2 lg:py-1 rounded-full text-xs sm:text-sm md:text-xs lg:text-xs">
                      Seat {selectedSeats[index]}
                    </span>
                  )}
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-white dark:bg-gray-600 p-3 sm:p-4 rounded-lg">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Title
                      </label>
                      <select
                        value={passenger.title}
                        onChange={(e) => handlePassengerChange(index, 'title', e.target.value)}
                        className="input-field text-xs sm:text-sm w-full bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white"
                      >
                        <option value="Mr" className="bg-white dark:bg-secondary-800">Mr</option>
                        <option value="Mrs" className="bg-white dark:bg-secondary-800">Mrs</option>
                        <option value="Ms" className="bg-white dark:bg-secondary-800">Ms</option>
                        <option value="Dr" className="bg-white dark:bg-secondary-800">Dr</option>
                      </select>
                    </div>
                    <div className="bg-white dark:bg-gray-600 p-3 sm:p-4 rounded-lg">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        Gender
                      </label>
                      <select
                        value={passenger.gender}
                        onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        className="input-field text-xs sm:text-sm w-full bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white"
                      >
                        <option value="male" className="bg-white dark:bg-secondary-800">Male</option>
                        <option value="female" className="bg-white dark:bg-secondary-800">Female</option>
                        <option value="other" className="bg-white dark:bg-secondary-800">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                      className="input-field text-xs sm:text-sm bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500"
                      placeholder="Enter first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                      className="input-field text-xs sm:text-sm bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500"
                      placeholder="Enter last name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                      className="input-field text-xs sm:text-sm bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white"
                      max={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
                      Meal Preference
                    </label>
                    <select
                      value={passenger.mealPreference}
                      onChange={(e) => handlePassengerChange(index, 'mealPreference', e.target.value)}
                      className="input-field text-xs sm:text-sm bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white"
                    >
                      <option value="none" className="bg-white dark:bg-secondary-800">No preference</option>
                      <option value="vegetarian" className="bg-white dark:bg-secondary-800">Vegetarian</option>
                      <option value="non-vegetarian" className="bg-white dark:bg-secondary-800">Non-vegetarian</option>
                      <option value="vegan" className="bg-white dark:bg-secondary-800">Vegan</option>
                      <option value="kosher" className="bg-white dark:bg-secondary-800">Kosher</option>
                      <option value="halal" className="bg-white dark:bg-secondary-800">Halal</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6 text-secondary-900 dark:text-white">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field text-sm w-full bg-secondary-50 dark:bg-secondary-800/50"
                />
              </div>
              
              <div className="bg-white dark:bg-gray-600 p-4 rounded-lg">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactDetails.phone}
                  onChange={(e) => setContactDetails(prev => ({ ...prev, phone: e.target.value }))}
                  className="input-field text-sm w-full bg-white dark:bg-secondary-800 border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-white placeholder-secondary-400 dark:placeholder-secondary-500"
                  placeholder="Enter your phone number (e.g., +1 234 567 8900)"
                  required
                />
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-6 text-secondary-900 dark:text-white">Booking Summary</h3>
            
            <div className="space-y-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              <div className="bg-white dark:bg-gray-600 p-4 rounded-lg flex justify-between items-center">
                <span className="text-secondary-600 dark:text-secondary-300 font-medium">Base Price ({numSeatsRequired} × ${flight.pricing[searchCriteria.class || 'economy']?.price || 0})</span>
                <span className="font-semibold text-secondary-900 dark:text-white text-lg">${(flight.pricing[searchCriteria.class || 'economy']?.price || 0) * numSeatsRequired}</span>
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-secondary-600 dark:text-secondary-300 font-medium">Seat Selection Fee</span>
                  <span className="font-semibold text-secondary-900 dark:text-white text-lg">
                    {formatPrice(getTotalPrice() - (flight.pricing[searchCriteria.class || 'economy']?.price || 0) * numSeatsRequired)}
                  </span>
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-600 p-4 rounded-lg flex justify-between items-center">
                <span className="text-secondary-600 dark:text-secondary-300 font-medium">Taxes & Fees</span>
                <span className="font-semibold text-secondary-900 dark:text-white text-lg">${getTaxesAndFees()}</span>
              </div>
              
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 p-5 rounded-lg border-2 border-primary-200 dark:border-primary-700">
                <div className="flex justify-between items-center">
                  <span className="text-primary-700 dark:text-primary-300 font-bold text-lg">Total Amount</span>
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-2xl">
                    {formatPrice(getFinalTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBooking}
              disabled={selectedSeats.length !== numSeatsRequired || isBooking}
              className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Processing Payment...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Proceed to Payment</span>
                  <FiArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary w-full py-3 flex items-center justify-center space-x-2 mb-8 sm:mb-10 md:mb-12 lg:mb-16"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>Back to Flight Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Additional spacing for mobile */}
      <div className="pb-6 sm:pb-8 md:pb-10"></div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Complete Payment
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                  <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {formatPrice(getFinalTotal())}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {numSeatsRequired} seat{numSeatsRequired > 1 ? 's' : ''} • {selectedSeats.join(', ')}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border-2 border-primary-200 rounded-lg bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">CARD</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Secure payment processing</div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Seat Recommendation Modal */}
      {showAIRecommendationModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-content">
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-500 to-teal-600 flex-shrink-0 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">AI Seat Recommendation</h3>
                    <p className="text-sm sm:text-base text-emerald-100">Intelligent flight analysis and seat suggestions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIRecommendationModal(false)}
                  className="text-white hover:text-emerald-200 transition-colors p-1"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 overflow-y-auto flex-1 min-h-0">
              {isGeneratingAI ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-spin border-t-emerald-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Analyzing Your Flight...</h4>
                  <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-md px-4">
                    Our AI is studying your route, timing, landmarks, and preferences to provide the best seat recommendations.
                  </p>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>Processing flight data...</span>
                  </div>
                </div>
              ) : aiRecommendation ? (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-base sm:text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                        Smart Analysis Complete
                      </h4>
                    </div>
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 dark:text-gray-300 text-sm sm:text-base ai-recommendation-text">
                      {aiRecommendation}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border border-blue-200 dark:border-blue-700">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h5 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-100">How to Use This Information</h5>
                    </div>
                    <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                      Use these AI-powered insights to make an informed seat selection. Click on your preferred seats in the seat map above, 
                      considering the scenic views, comfort factors, and travel duration recommendations provided.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Analyze</h4>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">Click "Generate AI Recommendation" to get personalized seat suggestions.</p>
                </div>
              )}
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex-shrink-0 rounded-b-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  💡 Powered by advanced flight route analysis and travel optimization
                </div>
                <div className="flex gap-2 sm:gap-3 justify-center sm:justify-end">
                  {!isGeneratingAI && aiRecommendation && (
                    <button
                      onClick={generateAIRecommendation}
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors font-medium"
                    >
                      Refresh Analysis
                    </button>
                  )}
                  <button
                    onClick={() => setShowAIRecommendationModal(false)}
                    className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;