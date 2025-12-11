// Test para verificar que isSlotAvailable funciona con los datos del backend
console.log("=== Test de isSlotAvailable con datos del backend ===");

// Simular datos del backend como los que mostraste
const mockLocations = [
  {
    id: 405, // Mobile (home)
    name: "NNJ1 Mobile Purchase Branch Unit II",
    type: "home",
    timeSlots: {
      "2025-12-11T00:00:00": [
        {"timeSlotId": 5, "timeOfDay": "Morning"},
        {"timeSlotId": 11, "timeOfDay": "Afternoon"},
        {"timeSlotId": 22, "timeOfDay": "Evening"}
      ],
      "2025-12-12T00:00:00": [
        {"timeSlotId": 3, "timeOfDay": "Morning"},
        {"timeSlotId": 11, "timeOfDay": "Afternoon"}
      ]
    }
  },
  {
    id: 156, // Union Branch (physical)
    name: "Union",
    type: "branch",
    timeSlots: {
      "2025-12-11T00:00:00": [
        {"timeSlotId": 7, "timeSlot24Hour": "11:00"},
        {"timeSlotId": 9, "timeSlot24Hour": "12:00"},
        {"timeSlotId": 11, "timeSlot24Hour": "13:00"},
        {"timeSlotId": 15, "timeSlot24Hour": "15:00"},
        {"timeSlotId": 17, "timeSlot24Hour": "16:00"},
        {"timeSlotId": 19, "timeSlot24Hour": "17:00"},
        {"timeSlotId": 21, "timeSlot24Hour": "18:00"},
        {"timeSlotId": 23, "timeSlot24Hour": "19:00"}
      ],
      "2025-12-12T00:00:00": [
        {"timeSlotId": 5, "timeSlot24Hour": "10:00"},
        {"timeSlotId": 7, "timeSlot24Hour": "11:00"},
        {"timeSlotId": 9, "timeSlot24Hour": "12:00"},
        {"timeSlotId": 13, "timeSlot24Hour": "14:00"}
      ]
    }
  }
];

// Función isSlotAvailable actualizada
const isSlotAvailable = (locationId, dateString, timeSlot) => {
  const location = mockLocations.find((loc) => loc.id === locationId);
  if (!location || !location.timeSlots) return false;
  
  // Convert date string to the format used by backend (YYYY-MM-DDTHH:mm:ss)
  const backendDateKey = `${dateString}T00:00:00`;
  const daySlots = location.timeSlots[backendDateKey];
  
  if (!daySlots || !Array.isArray(daySlots)) return false;
  
  // For mobile appointments, check timeOfDay
  if (location.type === 'home') {
    return daySlots.some(slot => slot.timeOfDay === timeSlot);
  }
  
  // For physical appointments, we need to map timeSlot to actual time periods
  // Morning: 9:00-11:59, Afternoon: 12:00-17:59, Evening: 18:00+
  const timeSlotMapping = {
    'Morning': (slot) => {
      const hour = parseInt(slot.timeSlot24Hour.split(':')[0]);
      return hour >= 9 && hour < 12;
    },
    'Afternoon': (slot) => {
      const hour = parseInt(slot.timeSlot24Hour.split(':')[0]);
      return hour >= 12 && hour < 18;
    },
    'Evening': (slot) => {
      const hour = parseInt(slot.timeSlot24Hour.split(':')[0]);
      return hour >= 18;
    }
  };
  
  const mapper = timeSlotMapping[timeSlot];
  if (!mapper) return false;
  
  return daySlots.some(mapper);
};

// Test cases
console.log("=== MOBILE APPOINTMENTS (Home) ===");
console.log("2025-12-11 Morning:", isSlotAvailable(405, "2025-12-11", "Morning")); // Should be true
console.log("2025-12-11 Afternoon:", isSlotAvailable(405, "2025-12-11", "Afternoon")); // Should be true
console.log("2025-12-11 Evening:", isSlotAvailable(405, "2025-12-11", "Evening")); // Should be true
console.log("2025-12-12 Morning:", isSlotAvailable(405, "2025-12-12", "Morning")); // Should be true
console.log("2025-12-12 Afternoon:", isSlotAvailable(405, "2025-12-12", "Afternoon")); // Should be true
console.log("2025-12-12 Evening:", isSlotAvailable(405, "2025-12-12", "Evening")); // Should be false

console.log("\n=== PHYSICAL APPOINTMENTS (Union Branch) ===");
console.log("2025-12-11 Morning:", isSlotAvailable(156, "2025-12-11", "Morning")); // Should be true (11:00)
console.log("2025-12-11 Afternoon:", isSlotAvailable(156, "2025-12-11", "Afternoon")); // Should be true (12:00, 13:00, 15:00, 16:00, 17:00)
console.log("2025-12-11 Evening:", isSlotAvailable(156, "2025-12-11", "Evening")); // Should be true (18:00, 19:00)
console.log("2025-12-12 Morning:", isSlotAvailable(156, "2025-12-12", "Morning")); // Should be true (10:00, 11:00)
console.log("2025-12-12 Afternoon:", isSlotAvailable(156, "2025-12-12", "Afternoon")); // Should be true (12:00, 14:00)
console.log("2025-12-12 Evening:", isSlotAvailable(156, "2025-12-12", "Evening")); // Should be false

console.log("\n=== FECHAS SIN DATOS ===");
console.log("2025-12-13 Morning:", isSlotAvailable(156, "2025-12-13", "Morning")); // Should be false (no data)
console.log("Invalid location:", isSlotAvailable(999, "2025-12-11", "Morning")); // Should be false