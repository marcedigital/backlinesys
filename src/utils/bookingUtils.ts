
export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  isSelected: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

export interface BookingDetails {
  room: string;
  startTime: Date | null;
  endTime: Date | null;
  addOns: AddOn[];
  totalPrice: number;
}

// Generate time slots for a specific day
export const generateTimeSlots = (date: Date, unavailableTimes: Array<[Date, Date]> = []): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8; // 8 AM
  const endHour = 20; // 8 PM
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const startTime = new Date(date);
      startTime.setHours(hour, minutes, 0, 0);
      
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      // Check if this slot overlaps with any unavailable time
      const isAvailable = !unavailableTimes.some(([unavailStart, unavailEnd]) => {
        return startTime < unavailEnd && endTime > unavailStart;
      });
      
      slots.push({
        id: `${startTime.toISOString()}`,
        startTime,
        endTime,
        isAvailable,
        isSelected: false,
      });
    }
  }
  
  return slots;
};

// Format time for display (e.g., "9:00 AM")
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

// Calculate total booking duration in minutes
export const calculateDuration = (startTime: Date, endTime: Date): number => {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
};

// Calculate total price based on duration and add-ons
export const calculatePrice = (startTime: Date | null, endTime: Date | null, addOns: AddOn[]): number => {
  if (!startTime || !endTime) return 0;
  
  // Base rate: $50 per hour
  const hourlyRate = 50;
  const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const basePrice = hourlyRate * durationInHours;
  
  // Add price of selected add-ons
  const addOnPrice = addOns.reduce((total, addOn) => {
    return addOn.selected ? total + addOn.price : total;
  }, 0);
  
  return Math.round((basePrice + addOnPrice) * 100) / 100;
};

// Sample add-ons data
export const getDefaultAddOns = (): AddOn[] => [
  {
    id: "1",
    name: "Premium Sound System",
    description: "High-quality audio equipment for presentations and music",
    price: 25,
    selected: false
  },
  {
    id: "2",
    name: "Video Conferencing",
    description: "Professional video conferencing equipment with large displays",
    price: 35,
    selected: false
  },
  {
    id: "3",
    name: "Catering Service",
    description: "Coffee, tea, and light snacks for your meeting",
    price: 40,
    selected: false
  },
  {
    id: "4",
    name: "Whiteboard & Markers",
    description: "Digital whiteboard with save functionality",
    price: 15,
    selected: false
  },
  {
    id: "5",
    name: "Room Decoration",
    description: "Professional decoration for special events",
    price: 50,
    selected: false
  }
];

// Sample unavailable time slots
export const getUnavailableTimes = (date: Date): Array<[Date, Date]> => {
  const unavailable: Array<[Date, Date]> = [];
  
  // Example: 10:00 AM - 11:30 AM is unavailable
  const unavailStart1 = new Date(date);
  unavailStart1.setHours(10, 0, 0, 0);
  const unavailEnd1 = new Date(date);
  unavailEnd1.setHours(11, 30, 0, 0);
  unavailable.push([unavailStart1, unavailEnd1]);
  
  // Example: 2:00 PM - 3:00 PM is unavailable
  const unavailStart2 = new Date(date);
  unavailStart2.setHours(14, 0, 0, 0);
  const unavailEnd2 = new Date(date);
  unavailEnd2.setHours(15, 0, 0, 0);
  unavailable.push([unavailStart2, unavailEnd2]);
  
  // Example: 4:30 PM - 5:30 PM is unavailable
  const unavailStart3 = new Date(date);
  unavailStart3.setHours(16, 30, 0, 0);
  const unavailEnd3 = new Date(date);
  unavailEnd3.setHours(17, 30, 0, 0);
  unavailable.push([unavailStart3, unavailEnd3]);
  
  return unavailable;
};
