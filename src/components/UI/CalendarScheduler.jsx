import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MapPin,
  Phone,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import Input from "./Input";
import BranchInfoModal from "./BranchInfoModal";
import ContactInfoForm from "./ContactInfoForm";
import { convertTo12Hour, getDayName, getGoogleMapsEmbedUrl, getNext12Days, getPeriod, isMobile, isMobileDevice } from "../../utils/helpers";
import { getBrancheById, getBranchesByCustomerVehicle } from "../../services/branchService";
import { weekDays } from "../../utils/model";

const CalendarScheduler = ({
  searchZip,
  onTimeSlotSelect,
  selectedDate,
  selectedTime,
  selectedLocation,
  onSlotClick,
  onBookAppointment,
  initialPhone = "",
  userZipCode = "",
  branches,
}) => {
  const [dayOffset, setDayOffset] = useState(0); // Start from today (offset 0)
  const MAX_DAYS_AHEAD = 10; // Maximum days to show in the future
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState("");
  const [branchesData, setBranchesData] = useState(branches);
  const [locations, setLocations] = useState([]);

  // Update branchesData when branches prop changes
  useEffect(() => {
    if (branches) {
      setBranchesData(branches);
    }
  }, [branches]);

  useEffect(() => {
    // Always update locations when branchesData changes, even if empty
    if (branchesData && branchesData.length > 0) {
      const locs = branchesData.map(branch => {
        return {
          id: branch.branchId,
          name: branch.branchName,
          location: branch.address1,
          phone: branch.branchPhone,
          type: branch.type,
          timeSlots: branch.timeSlots || {}, // Use original timeSlots from backend
          distance: branch.distanceMiles ? `${branch.distanceMiles.toFixed(1)} mi` : null,
          distanceValue: branch.distanceMiles || 999, // For sorting (999 = no distance data)
        }
      });

      // Sort locations by distance (closest first), keeping "home" type at top
      locs.sort((a, b) => {
        // "We Come to You" (home type) always first
        if (a.type === 'home' && b.type !== 'home') return -1;
        if (b.type === 'home' && a.type !== 'home') return 1;
        // Then sort by distance
        return a.distanceValue - b.distanceValue;
      });

      setLocations(locs);
    } else {
      // Clear locations if no branches
      setLocations([]);
    }

    if (isMobileDevice()) {
      const btn = document.getElementById("mobile-toggle");
      if (btn) btn.click();
    }
  }, [branchesData]);

  const handleZipSearch = async (e) => {
    e?.preventDefault(); // Prevenir recarga de página
    setZipCodeError(""); // Clear previous errors

    if (!zipCode || zipCode.length !== 5) {
      setZipCodeError("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (searchZip) {
      const result = await searchZip(zipCode, setZipCodeError);
      if (result?.success) {
        localStorage.setItem("zipCode", zipCode);
      }
    }
  };



  // Generate dates for the next 7 days starting from dayOffset (for desktop view)
  // Only includes business days (Monday-Friday) for branch appointments
  const getDates = (offset = 0) => {
    const dates = [];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let daysAdded = 0;
    let currentOffset = offset;

    // For "We Come to You" (home), show all days including weekends
    // For branch appointments, only show business days (Monday-Friday)
    const showWeekendsForHome = branchType === "home";

    while (daysAdded < 7 && currentOffset < offset + 14) { // Safety limit
      const date = new Date();
      date.setDate(date.getDate() + currentOffset);
      const dayIndex = date.getDay();

      // Include the date if:
      // 1. It's a home appointment (show all days)
      // 2. It's a branch appointment and it's a weekday (Monday=1 to Friday=5)
      const isWeekday = dayIndex >= 1 && dayIndex <= 5;
      const shouldInclude = showWeekendsForHome || isWeekday;

      if (shouldInclude) {
        // Format: day/month/year (DD/MM/YYYY)
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        dates.push({
          day: days[dayIndex],
          date: `${day}/${month}/${year}`,
          fullDate: `${year}-${month}-${day}`,
          dayIndex: dayIndex,
        });
        daysAdded++;
      }
      currentOffset++;
    }
    return dates;
  };

  // Generate all dates up to MAX_DAYS_AHEAD for mobile view
  // This allows mobile users to see and select from all 10 days in the dropdown
  // Only includes business days (Monday-Friday) for branch appointments
  const getAllDatesForMobile = () => {
    const dates = [];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let daysAdded = 0;
    let currentOffset = 0;

    // For "We Come to You" (home), show all days including weekends
    // For branch appointments, only show business days (Monday-Friday)
    const showWeekendsForHome = branchType === "home";

    while (daysAdded < MAX_DAYS_AHEAD && currentOffset < 30) { // Safety limit of 30 days
      const date = new Date();
      date.setDate(date.getDate() + currentOffset);
      const dayIndex = date.getDay();

      // Include the date if:
      // 1. It's a home appointment (show all days)
      // 2. It's a branch appointment and it's a weekday (Monday=1 to Friday=5)
      const isWeekday = dayIndex >= 1 && dayIndex <= 5;
      const shouldInclude = showWeekendsForHome || isWeekday;

      if (shouldInclude) {
        // Format: day/month/year (DD/MM/YYYY)
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        dates.push({
          day: days[dayIndex],
          date: `${day}/${month}/${year}`,
          fullDate: `${year}-${month}-${day}`,
          dayIndex: dayIndex,
        });
        daysAdded++;
      }
      currentOffset++;
    }
    return dates;
  };

  // Move these after branchType is declared

  // Check if we can go forward (not beyond MAX_DAYS_AHEAD)
  // We show 7 days at a time, so max offset is MAX_DAYS_AHEAD - 7
  const canGoForward = dayOffset + 7 < MAX_DAYS_AHEAD;
  // Check if we can go back (not before today)
  const canGoBack = dayOffset > 0;

  const handleViewMoreDates = () => {
    if (canGoForward) {
      // Advance by 7 days, but don't exceed MAX_DAYS_AHEAD - 7
      const newOffset = Math.min(dayOffset + 7, MAX_DAYS_AHEAD - 7);
      setDayOffset(newOffset);
    }
  };

  const handleViewEarlierDates = () => {
    if (canGoBack) {
      // Go back by 7 days, but don't go before today
      const newOffset = Math.max(dayOffset - 7, 0);
      setDayOffset(newOffset);
    }
  };


  const timeSlots = ["Morning", "Afternoon", "Evening"];

  // Function to extract only digits from phone number
  const getDigitsOnly = (phone) => {
    return phone.replace(/\D/g, "");
  };

  // Function to format phone number as (XXX) XXX XXXX
  const formatPhoneNumber = useCallback((phone) => {
    const digits = getDigitsOnly(phone);
    // Limit to 10 digits
    const limitedDigits = digits.slice(0, 10);

    if (limitedDigits.length === 0) return "";
    if (limitedDigits.length <= 3) return `(${limitedDigits}`;
    if (limitedDigits.length <= 6) {
      return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3)}`;
    }
    return `(${limitedDigits.slice(0, 3)}) ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
  });

  // Generate real time slots for branches (e.g., "4:00 PM")
  const generateBranchTimeSlots = () => {
    const slots = [];
    // Generate slots from 9:00 AM to 5:00 PM, every hour
    for (let hour = 9; hour <= 17; hour++) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      slots.push(`${displayHour}:00 ${period}`);
    }
    return slots;
  };

  const branchTimeSlots = generateBranchTimeSlots();

  const isSlotAvailable = (locationId, dateString, timeSlot) => {
    // Convert locationId to number for comparison (select values are strings)
    const numericLocationId = typeof locationId === 'string' ? parseInt(locationId, 10) : locationId;
    const location = locations.find((loc) => loc.id === numericLocationId);

    if (!location || !location.timeSlots) {
      return false;
    }

    // Convert date string to the format used by backend (YYYY-MM-DDTHH:mm:ss)
    const backendDateKey = `${dateString}T00:00:00`;
    const daySlots = location.timeSlots[backendDateKey];

    if (!daySlots || !Array.isArray(daySlots)) {
      return false;
    }

    // For mobile appointments (home type), check timeOfDay
    if (location.type === 'home') {
      return daySlots.some(slot => slot.timeOfDay === timeSlot);
    }

    // For physical appointments, map timeSlot to actual time periods
    // Morning: 9:00-11:59, Afternoon: 12:00-17:59, Evening: 18:00+
    const timeSlotMapping = {
      'Morning': (slot) => {
        const hour = parseInt(slot.timeSlot24Hour?.split(':')[0] || '0');
        return hour >= 9 && hour < 12;
      },
      'Afternoon': (slot) => {
        const hour = parseInt(slot.timeSlot24Hour?.split(':')[0] || '0');
        return hour >= 12 && hour < 18;
      },
      'Evening': (slot) => {
        const hour = parseInt(slot.timeSlot24Hour?.split(':')[0] || '0');
        return hour >= 18;
      }
    };

    const mapper = timeSlotMapping[timeSlot];
    if (!mapper) return false;

    return daySlots.some(mapper);
  };

  const handleSlotClick = (locationId, date, timeSlot) => {
    if (!isSlotAvailable(locationId, date.fullDate, timeSlot)) return;

    const location = locations.find((loc) => loc.id === locationId);

    const slotData = {
      locationId,
      location: location?.name || "",
      date: date.fullDate,
      dateFormatted: `${date.day} ${date.date}`,
      time: timeSlot,
      phone: location?.phone || "",
      type: location?.type || "branch", // Add branch type (branch or home)
    };

    // If custom callback exists, use it (for opening modal)

    if (onSlotClick) {
      onSlotClick(slotData);
    } else if (onTimeSlotSelect) {
      // Original callback for compatibility
      onTimeSlotSelect(slotData);
    }
  };

  const [selectedLocationMobile, setSelectedLocationMobile] = useState(
    selectedLocation?.locationId || "",
  );
  const [selectedDateMobile, setSelectedDateMobile] = useState(
    selectedDate || "",
  );
  const [selectedTimeMobile, setSelectedTimeMobile] = useState(
    selectedTime || "",
  );
  const [branchType, setBranchType] = useState("branch");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [telephone, setTelephone] = useState("");
  const [receiveSMS, setReceiveSMS] = useState(false);
  const [smsError, setSmsError] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [stateZip, setStateZip] = useState(userZipCode || "NJ, 07008");
  const smsCheckboxRef = useRef(null);
  const smsCheckboxContainerRef = useRef(null);
  const smsCheckboxBranchRef = useRef(null);
  const smsCheckboxBranchContainerRef = useRef(null);
  const [selectedBranchForInfo, setSelectedBranchForInfo] = useState(null);
  const [showMoreLocationsModal, setShowMoreLocationsModal] = useState(false);
  const [moreLocationsZip, setMoreLocationsZip] = useState("");
  const [moreLocationsError, setMoreLocationsError] = useState("");

  // Generate dates after branchType is available
  const dates = useMemo(() => getDates(dayOffset), [getDates, dayOffset]);
  const allDatesForMobile = useMemo(() => getAllDatesForMobile(), [getAllDatesForMobile]);

  // Sync states when props change
  useEffect(() => {
    if (selectedLocation?.locationId) {
      const locationIdStr = String(selectedLocation.locationId);
      setSelectedLocationMobile(locationIdStr);
      // Set branch type based on selected location
      const numericId = parseInt(selectedLocation.locationId, 10);
      const location = locations.find(
        (loc) => loc.id === numericId,
      );
      if (location) {
        setBranchType(location.type);
      }
    }
    if (selectedDate) {
      setSelectedDateMobile(selectedDate);
    }
    if (selectedTime) {
      setSelectedTimeMobile(selectedTime);
    }
  }, [selectedLocation?.locationId, selectedDate, selectedTime, locations]);

  // Auto-select home location when branchType is "home" and locations are available
  useEffect(() => {
    if (branchType === 'home' && locations.length > 0 && !selectedLocationMobile) {
      const homeLocation = locations.find((loc) => loc.type === 'home');
      if (homeLocation) {
        setSelectedLocationMobile(String(homeLocation.id));
      }
    }
  }, [branchType, locations, selectedLocationMobile]);

  // Sync telephone from initialPhone prop
  useEffect(() => {
    if (initialPhone) {
      // If phone is already formatted, use it as is
      if (initialPhone.includes("(")) {
        setTelephone(initialPhone);
      } else {
        // Otherwise, format it
        const formatted = formatPhoneNumber(initialPhone);
        setTelephone(formatted);
      }
    }
  }, [formatPhoneNumber, initialPhone]);

  // Get available time slots for selected date
  const getAvailableTimesForDate = (locationId, dateFullDate) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location || !dateFullDate) return [];

    const selectedDateObj = dates.find((d) => d.fullDate === dateFullDate);
    if (!selectedDateObj) return [];

    return timeSlots.filter((timeSlot) =>
      isSlotAvailable(locationId, selectedDateObj.dayIndex, timeSlot),
    );
  };

  // Handle mobile changes
  const handleBranchTypeChange = (e) => {
    const newType = e.target.value;
    setBranchType(newType);

    // Convert selectedLocationMobile to number for comparison
    const currentLocationId = selectedLocationMobile ? parseInt(selectedLocationMobile, 10) : null;

    // Clear selections if current location doesn't match new type
    if (currentLocationId) {
      const currentLocation = locations.find(
        (loc) => loc.id === currentLocationId,
      );
      if (currentLocation && currentLocation.type !== newType) {
        // If switching to home, auto-select home location if available
        if (newType === "home") {
          const homeLocation = locations.find((loc) => loc.type === "home");
          if (homeLocation) {
            setSelectedLocationMobile(String(homeLocation.id));
          } else {
            setSelectedLocationMobile("");
          }
        } else {
          setSelectedLocationMobile("");
        }
        setSelectedDateMobile("");
        setSelectedTimeMobile("");
      }
    } else {
      // If no location selected, auto-select based on type
      if (newType === "home") {
        const homeLocation = locations.find((loc) => loc.type === "home");
        if (homeLocation) {
          setSelectedLocationMobile(String(homeLocation.id));
        }
      }
      setSelectedDateMobile("");
      setSelectedTimeMobile("");
    }
  };

  const handleMobileLocationChange = (e) => {
    const locationId = e.target.value;

    // Check if "More Locations..." was selected
    if (locationId === "0") {
      setShowMoreLocationsModal(true);
      return;
    }

    setSelectedLocationMobile(locationId);
    setSelectedDateMobile("");
    setSelectedTimeMobile("");
  };

  const handleMoreLocationsSearch = async (e) => {
    e?.preventDefault();
    setMoreLocationsError("");

    if (!moreLocationsZip || moreLocationsZip.length !== 5) {
      setMoreLocationsError("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (searchZip) {
      const result = await searchZip(moreLocationsZip, setMoreLocationsError);
      if (result?.success) {
        setShowMoreLocationsModal(false);
        setMoreLocationsZip("");
        setMoreLocationsError("");
      }
    }
  };

  const handleCloseMoreLocationsModal = () => {
    setShowMoreLocationsModal(false);
    setMoreLocationsZip("");
    setMoreLocationsError("");
    // Reset the select to empty value
    setSelectedLocationMobile("");
  };

  const loadDataBranch = (location) => {
    getBrancheById(location.id).then(response => {
      const res = response.branchLocation;

      const obj = {};
      for (let i = 0; i < res.operationHours.length; i++) {
        const hour = res.operationHours[i];
        if (hour.type === "open") {
          obj[hour.dayOfWeek] = obj[hour.dayOfWeek] ? `${obj[hour.dayOfWeek]}, ${hour.openTime} - ${hour.closeTime}` : `${hour.openTime} - ${hour.closeTime}`;
        } else {
          obj[hour.dayOfWeek] = "Closed";
        }
      }

      // Helper to generate slug
      const toSlug = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '';

      const stateName = res.state || 'NJ'; // Fallback if missing, but should be there
      const stateSlug = toSlug(stateName);
      const citySlug = toSlug(res.city);
      const branchSlug = toSlug(res.branchName);

      const data = {
        name: res.branchName,
        state: res.state || res.city, // Use state if available
        address: res.address1,
        suite: "",
        city: res.city,
        zipCode: res.zipCode, // Added zipCode
        phone: res.branchPhone,
        phoneRaw: res.branchPhone ? res.branchPhone.replace(/\D/g, "") : "",
        email: !res.branchEmail || res.branchEmail.includes('test.branchmanager')
          ? `${citySlug}.${stateSlug}@webuyanycarusa.com`
          : res.branchEmail,
        mapUrl: res.mapURL,
        // Construct dynamic web page URL - attempting to match pattern /sell-car/new-jersey-nj/union
        // Since we don't have full state name usually from short code (NJ), might need a map or simplified URL
        // Using a generic safer URL or attempting construction if possible. 
        // For now, pointing to the general branch locator or using constructed slug if likely valid.
        webPage: `https://www.webuyanycarusa.com/sell-car/${stateSlug}/${citySlug}`,
        image: res.branchImageUrl,
        hours: obj,
        description: `We Buy Any Car ${res.branchName} branch information.`,
        areasServed: `${res.branchName} and surrounding areas`,
        mapEmbedUrl: getGoogleMapsEmbedUrl(res.latitude, res.longitude)
      };

      setSelectedBranchForInfo(data)


    });

    // setSelectedBranchForInfo(location)

    // const location = locations.find((loc) => loc.id === locationId);
    // if (location) {
    //   setBranchType(location.type);
    // }
  };

  // Filter locations based on branch type
  const filteredLocations = locations.filter(
    (loc) => loc.type === branchType,
  );

  const handleMobileDateChange = (e) => {
    const dateFullDate = e.target.value;
    setSelectedDateMobile(dateFullDate);
    setSelectedTimeMobile("");
  };

  const handleMobileTimeChange = (e) => {
    const timeSlot = e.target.value;
    setSelectedTimeMobile(timeSlot);

    // In mobile, we don't open the modal for either branch or home appointments
    // The contact form is shown inline for both cases
    // Desktop will handle clicks through the calendar view
    // Removed handleSlotClick call to prevent modal from opening in mobile
  };

  return (
    <div
      className="space-y-0 md:space-y-6 w-full"
      style={{ maxWidth: "100%", boxSizing: "border-box" }}
    >
      <div className="text-center mb-8 hidden md:block">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          When Would You Like to Sell Your Car?
        </h3>
        <p className="text-lg text-gray-600">
          Book a Home Visit or Bring Your Car to Us!
        </p>
      </div>

      {/* Mobile View - Selects (Hidden on desktop) */}
      <div className="space-y-4 w-full md:hidden" style={{ marginTop: 0 }}>
        {/* Step Header */}
        <div id="choose-where-to-sell-header" className="step-header">
          <span className="form-text countable" data-defaulttext="Choose Where to Sell">
            1. Choose Where to Sell
          </span>
        </div>

        {/* Branch Type Toggle */}
        <div id="mobile-branch-toggle" data-default-type="branch" className="mb-4">
          <label
            className={`toggle-button ${branchType === "branch" ? "is-active" : ""}`}
          >
            <input
              type="radio"
              name="branchType"
              value="branch"
              id="physical-toggle"
              className="toggle-radio"
              checked={branchType === "branch"}
              onChange={handleBranchTypeChange}
              hidden
              data-gtm-form-interact-field-id="2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5"
            >
              <path d="M500 176h-59.9l-16.6-41.6C406.4 91.6 365.6 64 319.5 64h-127c-46.1 0-86.9 27.6-104 70.4L71.9 176H12C4.2 176-1.5 183.3 .4 190.9l6 24C7.7 220.3 12.5 224 18 224h20.1C24.7 235.7 16 252.8 16 272v48c0 16.1 6.2 30.7 16 41.9V416c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-32h256v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32v-54.1c9.8-11.3 16-25.8 16-41.9v-48c0-19.2-8.7-36.3-22.1-48H494c5.5 0 10.3-3.8 11.6-9.1l6-24c1.9-7.6-3.8-14.9-11.7-14.9zm-352.1-17.8c7.3-18.2 24.9-30.2 44.6-30.2h127c19.6 0 37.3 12 44.6 30.2L384 208H128l19.9-49.8zM96 319.8c-19.2 0-32-12.8-32-31.9S76.8 256 96 256s48 28.7 48 47.9-28.8 16-48 16zm320 0c-19.2 0-48 3.2-48-16S396.8 256 416 256s32 12.8 32 31.9-12.8 31.9-32 31.9z"></path>
            </svg>
            <span>You Come to Us</span>
          </label>

          <label
            className={`toggle-button ${branchType === "home" ? "is-active" : ""}`}
          >
            <input
              type="radio"
              name="branchType"
              value="home"
              id="mobile-toggle"
              className="toggle-radio"
              checked={branchType === "home"}
              onChange={handleBranchTypeChange}
              hidden
              data-gtm-form-interact-field-id="1"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              className="w-5 h-5"
            >
              <path d="M280.4 148.3L96 300.1V464a16 16 0 0 0 16 16l112.1-.3a16 16 0 0 0 15.9-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.6a16 16 0 0 0 16 16.1L464 480a16 16 0 0 0 16-16V300L295.7 148.3a12.2 12.2 0 0 0 -15.3 0zM571.6 251.5L488 182.6V44.1a12 12 0 0 0 -12-12h-56a12 12 0 0 0 -12 12v72.6L318.5 43a48 48 0 0 0 -61 0L4.3 251.5a12 12 0 0 0 -1.6 16.9l25.5 31A12 12 0 0 0 45.2 301l235.2-193.7a12.2 12.2 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0 -1.7-16.9z"></path>
            </svg>
            <span>We Come to You</span>
          </label>
        </div>

        {/* Branch Type: Branch - Show new selects */}
        {branchType === "branch" ? (
          <>
            {/* Branch Select */}
            <div className="select-container" style={{ display: "block" }}>
              <select
                autoComplete="off"
                className="countable w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                data-defaulttext="Select Branch (126 Locations)"
                data-val="true"
                data-val-number="The field SelectedBranchId must be a number."
                data-val-required="The SelectedBranchId field is required."
                id="SelectedBranchId"
                name="SelectedBranchId"
                style={{ display: "inline-block", maxWidth: "100%", boxSizing: "border-box" }}
                value={selectedLocationMobile}
                onChange={handleMobileLocationChange}
              >
                <option value="">2. Select Branch (126 Locations)</option>
                {filteredLocations
                  .filter((loc) => loc.type === "branch")
                  .map((location, index) => (
                    <option
                      key={location.id + "-" + index}
                      value={location.id}
                      data-booking-requires-otp="true"
                    >
                      {location.name}
                      {location.distance && ` - ${location.distance}`}
                    </option>
                  ))}
                <option value="0" data-booking-requires-otp="undefined">
                  More Locations...
                </option>
              </select>
            </div>

            {/* Date Select */}
            <div className="select-container">
              <select
                className="countable w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                data-datapath="/secure/availabledateslotsbybranch?delaydays=0"
                data-defaulttext="Select Date"
                data-val="true"
                data-val-date="The field AvailableDate must be a date."
                data-val-required="The AvailableDate field is required."
                id="AvailableDate"
                name="AvailableDate"
                disabled={!selectedLocationMobile}
                value={selectedDateMobile}
                onChange={handleMobileDateChange}
                style={{ maxWidth: "100%", boxSizing: "border-box" }}
              >
                <option value="">3. Select Date</option>
                {selectedLocationMobile &&
                  allDatesForMobile
                    .filter((date) => {
                      // Only show dates that have at least one available time slot
                      return timeSlots.some((timeSlot) =>
                        isSlotAvailable(selectedLocationMobile, date.fullDate, timeSlot)
                      );
                    })
                    .map((date, index) => (
                      <option key={date.fullDate + "-" + index} value={date.fullDate}>
                        {date.day} {date.date}
                      </option>
                    ))}
              </select>
            </div>

            {/* Time Select */}
            <select
              className="countable w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              data-datapath="/secure/availablesitetimeslotsbydate"
              data-defaulttext="Select Time"
              data-val="true"
              data-val-required="Please select a time."
              disabled={!selectedDateMobile || !selectedLocationMobile}
              id="AvailableTime"
              name="AvailableTime"
              value={selectedTimeMobile}
              onChange={handleMobileTimeChange}
              style={{ maxWidth: "100%", boxSizing: "border-box" }}
            >
              <option value="">4. Select Time</option>
              {selectedLocationMobile &&
                selectedDateMobile &&
                (() => {
                  // Get actual time slots from the location data
                  const numericLocationId = typeof selectedLocationMobile === 'string'
                    ? parseInt(selectedLocationMobile, 10)
                    : selectedLocationMobile;
                  const location = locations.find((loc) => loc.id === numericLocationId);

                  if (!location || !location.timeSlots) return [];

                  // Get time slots for the selected date
                  const backendDateKey = `${selectedDateMobile}T00:00:00`;
                  const daySlots = location.timeSlots[backendDateKey];

                  if (!daySlots || !Array.isArray(daySlots)) return [];

                  // Return actual time slots sorted by time
                  return daySlots
                    .slice() // Create a copy to avoid mutating original
                    .sort((a, b) => {
                      const timeA = a.timeSlot24Hour || '';
                      const timeB = b.timeSlot24Hour || '';
                      return timeA.localeCompare(timeB);
                    })
                    .map((slot, index) => {
                      // Format the display time
                      const displayTime = slot.timeSlot24Hour || slot.timeOfDay || 'Unknown';
                      // Use timeSlotId as value for accurate booking
                      const slotValue = `${slot.timeSlotId}:${slot.timeSlot24Hour || slot.timeOfDay}`;
                      return (
                        <option key={slot.timeSlotId + "-" + index} value={slotValue}>
                          {displayTime}
                        </option>
                      );
                    });
                })()}
            </select>

            {/* Step 5: Confirm Contact Info - Always visible */}
            <div id="confirm-contact-info-header" className="step-header mt-6">
              <span className="form-text countable" data-defaulttext="Confirm Contact Info">
                5. Confirm Contact Info
              </span>
            </div>

            <ContactInfoForm
              ref={{ smsCheckboxRef: smsCheckboxBranchRef, smsCheckboxContainerRef: smsCheckboxBranchContainerRef }}
              firstName={firstName}
              lastName={lastName}
              telephone={telephone}
              receiveSMS={receiveSMS}
              smsError={smsError}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onTelephoneChange={(value) => setTelephone(formatPhoneNumber(value))}
              onReceiveSMSChange={(checked, error) => {
                setReceiveSMS(checked);
                setSmsError(error);
              }}
              onSubmit={() => {
                if (onBookAppointment) {
                  const location = locations.find((loc) => loc.id === selectedLocationMobile);
                  onBookAppointment({
                    locationId: selectedLocationMobile,
                    location: location?.name || "",
                    phone: location?.phone || "",
                    date: selectedDateMobile,
                    time: selectedTimeMobile || "",
                    firstName,
                    lastName,
                    telephone,
                    receiveSMS,
                  });
                }
              }}
              disabled={!firstName || !lastName || !telephone || !selectedTimeMobile}
              submitButtonText="BOOK APPOINTMENT"
              checkboxId="appointment-modal-receive-sms-checkbox"
            />
          </>
        ) : (
          <>
            {/* Branch Type: Home - Show only Date and Time selects */}
            {/* Date Select */}
            <div className="select-container">
              <select
                className="countable w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                data-defaulttext="Select Date"
                data-val="true"
                data-val-date="The field AvailableDate must be a date."
                data-val-required="The AvailableDate field is required."
                id="AvailableDate"
                name="AvailableDate"
                value={selectedDateMobile}
                onChange={handleMobileDateChange}
                style={{ maxWidth: "100%", boxSizing: "border-box" }}
              >
                <option value="">Select Date</option>
                {selectedLocationMobile &&
                  allDatesForMobile
                    .filter((date) => {
                      // Only show dates that have at least one available time slot
                      return timeSlots.some((timeSlot) =>
                        isSlotAvailable(selectedLocationMobile, date.fullDate, timeSlot)
                      );
                    })
                    .map((date, index) => (
                      <option key={date.fullDate + "-" + index} value={date.fullDate}>
                        {date.day} {date.date}
                      </option>
                    ))}
              </select>
            </div>

            {/* Time Select - Now visible on mobile for home appointments */}
            <div className="select-container">
              <select
                className="countable w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 font-semibold appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                data-defaulttext="Select Time"
                data-val="true"
                data-val-required="Please select a time."
                disabled={!selectedDateMobile}
                id="AvailableTime"
                name="AvailableTime"
                value={selectedTimeMobile}
                onChange={handleMobileTimeChange}
                style={{ maxWidth: "100%", boxSizing: "border-box" }}
              >
                <option value="">3. Select Time</option>
                {selectedLocationMobile &&
                  selectedDateMobile &&
                  (() => {
                    // Find the selected date object to get dayIndex
                    const selectedDateObj = allDatesForMobile.find(
                      (date) => date.fullDate === selectedDateMobile
                    );
                    if (!selectedDateObj) return [];

                    // Filter time slots to only show available ones
                    return timeSlots
                      .filter((timeSlot) =>
                        isSlotAvailable(selectedLocationMobile, selectedDateObj.fullDate, timeSlot)
                      )
                      .map((timeSlot, index) => (
                        <option key={timeSlot + "-" + index} value={timeSlot}>
                          {timeSlot}
                        </option>
                      ));
                  })()}
              </select>
            </div>

            {/* Step 4: Confirm Contact Info - Always visible for Home (no branch selection) */}
            <div id="confirm-contact-info-header" className="step-header mt-6">
              <span className="form-text countable" data-defaulttext="Confirm Contact Info">
                4. Confirm Contact Info
              </span>
            </div>

            <ContactInfoForm
              ref={{ smsCheckboxRef, smsCheckboxContainerRef }}
              firstName={firstName}
              lastName={lastName}
              telephone={telephone}
              receiveSMS={receiveSMS}
              smsError={smsError}
              onFirstNameChange={setFirstName}
              onLastNameChange={setLastName}
              onTelephoneChange={(value) => setTelephone(formatPhoneNumber(value))}
              onReceiveSMSChange={(checked, error) => {
                setReceiveSMS(checked);
                setSmsError(error);
              }}
              onSubmit={() => {
                if (onBookAppointment) {
                  const location = locations.find((loc) => loc.id === selectedLocationMobile);
                  onBookAppointment({
                    locationId: selectedLocationMobile,
                    location: location?.name || "",
                    phone: location?.phone || "",
                    date: selectedDateMobile,
                    time: selectedTimeMobile,
                    firstName,
                    lastName,
                    telephone,
                    receiveSMS,
                    address1,
                    address2,
                    city,
                    stateZip,
                  });
                }
              }}
              disabled={!firstName || !lastName || !telephone || !selectedTimeMobile || !address1 || !city}
              submitButtonText="BOOK APPOINTMENT"
              showAddressFields={true}
              address1={address1}
              address2={address2}
              city={city}
              stateZip={stateZip}
              onAddress1Change={setAddress1}
              onAddress2Change={setAddress2}
              onCityChange={setCity}
              checkboxId="appointment-modal-receive-sms-checkbox-home"
            />
          </>
        )}
      </div>

      {/* Desktop View - Calendar */}
      <div className="hidden md:block overflow-x-auto">
        <div className="min-w-full" style={{ minWidth: "900px" }}>
          {/* Header Row */}
          <AnimatePresence mode="sync">
            <motion.div
              key={dayOffset}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="grid gap-2 mb-4 rounded-2xl p-4"
              style={{
                gridTemplateColumns: "200px repeat(7, 1fr)",
                background: "linear-gradient(135deg, #20B24D 0%, #1a9a3e 100%)",
                boxShadow: "0 8px 24px 0 rgba(8, 162, 70, 0.3)",
              }}
            >
              <div className="font-bold text-white text-lg flex items-center">
                Branches
              </div>
              {dates.map((date, idx) => (
                <motion.div
                  key={`${dayOffset}-${idx}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02, duration: 0.2, ease: 'easeOut' }}
                  className="text-center"
                >
                  <div className="text-white font-bold text-sm md:text-base">
                    {date.day}
                  </div>
                  <div className="text-white/90 text-xs md:text-sm">
                    {date.date}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Location Rows */}
          <AnimatePresence mode="sync">
            {locations.map((location, locIdx) => (
              <motion.div
                key={`${location.id}-${dayOffset}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{
                  delay: locIdx * 0.1,
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="mb-4"
              >
                <div
                  className="grid gap-2 rounded-xl p-4 transition-all duration-300"
                  style={{
                    gridTemplateColumns: "200px repeat(7, 1fr)",
                    background:
                      selectedLocation?.locationId === location.id
                        ? "rgba(8, 162, 70, 0.1)"
                        : "rgba(255, 255, 255, 0.8)",
                    border:
                      selectedLocation?.locationId === location.id
                        ? "2px solid rgba(8, 162, 70, 0.5)"
                        : "1px solid rgba(0, 0, 0, 0.1)",
                    boxShadow:
                      selectedLocation?.locationId === location.id
                        ? "0 8px 24px 0 rgba(8, 162, 70, 0.2)"
                        : "0 2px 8px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {/* Location Info */}
                  <div className="pr-4">
                    <div className="flex items-start gap-2 mb-2">
                      {location.type === "home" ? (
                        <Home className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <MapPin className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-gray-900 text-sm md:text-base">
                          {location.type === "home" ? 'We Come to You' : location.name}
                        </div>
                        {location.distance && location.type !== "home" && (
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {location.distance} away
                          </div>
                        )}
                        <a
                          href={`tel:${location.phone}`}
                          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-1"
                        >
                          <Phone className="w-3 h-3" />
                          {location.phone}
                        </a>
                        {location.type === "branch" && (
                          <button
                            onClick={() => loadDataBranch(location)}
                            className="text-xs text-gray-500 hover:text-gray-700 mt-1 underline"
                          >
                            Click for branch info
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots for each day */}
                  {dates.map((date, dateIdx) => (
                    <motion.div
                      key={`${dayOffset}-${dateIdx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: locIdx * 0.1 + dateIdx * 0.05,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="space-y-1.5"
                    >
                      {timeSlots.map((timeSlot) => {
                        const available = isSlotAvailable(
                          location.id,
                          date.fullDate,
                          timeSlot,
                        );
                        const isSelected =
                          selectedLocation?.locationId === location.id &&
                          selectedLocation?.date === date.fullDate &&
                          selectedLocation?.time === timeSlot;

                        return (
                          <motion.button
                            key={timeSlot}
                            onClick={() =>
                              available &&
                              handleSlotClick(location.id, date, timeSlot)
                            }
                            disabled={!available}
                            whileHover={available ? { scale: 1.05 } : {}}
                            whileTap={available ? { scale: 0.95 } : {}}
                            className={`w-full py-2 px-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${isSelected
                              ? "bg-primary-600 text-white shadow-lg scale-105"
                              : available
                                ? "bg-gray-100 text-primary-700 hover:bg-primary-50 hover:scale-105"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                              }`}
                          >
                            {timeSlot}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer - Desktop Only */}
      <div className="hidden md:block">
        <div
          className="flex flex-nowrap items-center justify-between gap-2 lg:gap-4 rounded-2xl p-3 lg:p-4 mt-6"
          style={{
            background: "linear-gradient(135deg, #20B24D 0%, #1a9a3e 100%)",
            boxShadow: "0 8px 24px 0 rgba(8, 162, 70, 0.3)",
          }}
        >
          {/* View Earlier Dates Button */}
          <motion.button
            onClick={handleViewEarlierDates}
            disabled={!canGoBack}
            whileHover={canGoBack ? { scale: 1.05, x: -5 } : {}}
            whileTap={canGoBack ? { scale: 0.95 } : {}}
            className={`flex-shrink-0 flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-semibold text-xs lg:text-base transition-all duration-200 ${canGoBack
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            View Earlier Dates
          </motion.button>

          {/* Center Section - Search by ZIP */}
          <form
            onSubmit={handleZipSearch}
            className="flex flex-row items-center justify-center gap-2 lg:gap-3 w-auto flex-1"
          >
            <span className="text-white font-medium text-xs lg:text-lg whitespace-nowrap text-left hidden sm:block">
              Looking for a different branch?
            </span>
            <div className="flex flex-col flex-1 w-auto gap-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter ZIP Code"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value.replace(/\D/g, ""));
                    setZipCodeError(""); // Clear error when user types
                  }}
                  className={`flex-1 px-2 lg:px-4 py-1.5 lg:py-2.5 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all min-w-[80px] text-xs lg:text-base ${zipCodeError
                    ? 'border-2 border-red-500 focus:ring-red-500'
                    : 'border border-white/30 focus:ring-white/50'
                    }`}
                  style={{
                    background: "rgba(255, 255, 255, 0.95)",
                  }}
                />
                <button
                  type="submit"
                  className="px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all flex items-center justify-center gap-1 lg:gap-2 whitespace-nowrap text-xs lg:text-base"
                >
                  Search by ZIP
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {zipCodeError && (
                <span className="text-red-500 text-sm font-medium  px-3 py-1 rounded">
                  {zipCodeError}
                </span>
              )}
            </div>
          </form>

          {/* View More Dates Button */}
          <motion.button
            onClick={handleViewMoreDates}
            disabled={!canGoForward}
            whileHover={canGoForward ? { scale: 1.05, x: 5 } : {}}
            whileTap={canGoForward ? { scale: 0.95 } : {}}
            className={`flex-shrink-0 relative flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1.5 lg:py-2 rounded-lg font-semibold text-xs lg:text-base transition-all duration-200 ${canGoForward
              ? "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
              }`}
            style={{
              outline: canGoForward
                ? "3px solid rgba(239, 68, 68, 0.5)"
                : "none",
              outlineOffset: canGoForward ? "2px" : "0",
            }}
          >
            View More Dates
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* More Locations Modal */}
      <AnimatePresence>
        {showMoreLocationsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseMoreLocationsModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Find More Locations
                </h3>
                <p className="text-gray-600">
                  Enter your ZIP code to find branches near you
                </p>
              </div>

              <form onSubmit={handleMoreLocationsSearch} className="space-y-4">
                <div>
                  <Input
                    label="ZIP Code"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter 5-digit ZIP code"
                    maxLength={5}
                    value={moreLocationsZip}
                    onChange={(e) => {
                      setMoreLocationsZip(e.target.value.replace(/\D/g, ""));
                      setMoreLocationsError("");
                    }}
                    error={moreLocationsError}
                    className="text-center text-lg font-semibold"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseMoreLocationsModal}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!moreLocationsZip || moreLocationsZip.length !== 5}
                    className="flex-1 px-4 py-3 rounded-xl bg-primary-600 text-white font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    Search
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Info Modal */}
      <BranchInfoModal
        isOpen={!!selectedBranchForInfo}
        onClose={() => setSelectedBranchForInfo(null)}
        branch={selectedBranchForInfo}
      />
    </div>
  );
};

export default CalendarScheduler;
