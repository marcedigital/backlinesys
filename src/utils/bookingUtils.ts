
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

export interface Room {
  id: string;
  name: string;
}

// Available rooms
export const rooms: Room[] = [
  { id: "room1", name: "Sala 1" },
  { id: "room2", name: "Sala 2" },
];

// Generate time slots for a specific day and room
export const generateTimeSlots = (date: Date, roomId: string, unavailableTimes: Array<[Date, Date]> = []): TimeSlot[] => {
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
        id: `${roomId}-${startTime.toISOString()}`,
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
    name: "Professional Microphones",
    description: "Selection of high-quality vocal and instrument microphones",
    price: 25,
    selected: false
  },
  {
    id: "2",
    name: "Amplifiers & Speakers",
    description: "Professional sound system with mixing capabilities",
    price: 35,
    selected: false
  },
  {
    id: "3",
    name: "Drum Kit",
    description: "Complete acoustic drum kit with cymbals",
    price: 40,
    selected: false
  },
  {
    id: "4",
    name: "Recording Service",
    description: "Basic multi-track recording of your session",
    price: 50,
    selected: false
  },
  {
    id: "5",
    name: "Keyboard/Synthesizer",
    description: "Professional keyboard with various sound options",
    price: 30,
    selected: false
  }
];

// Sample unavailable time slots for each room
export const getUnavailableTimes = (date: Date, roomId: string): Array<[Date, Date]> => {
  const unavailable: Array<[Date, Date]> = [];
  
  if (roomId === "room1") {
    // Sala 1 unavailable times
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
  } else if (roomId === "room2") {
    // Sala 2 unavailable times
    // Example: 9:00 AM - 10:30 AM is unavailable
    const unavailStart1 = new Date(date);
    unavailStart1.setHours(9, 0, 0, 0);
    const unavailEnd1 = new Date(date);
    unavailEnd1.setHours(10, 30, 0, 0);
    unavailable.push([unavailStart1, unavailEnd1]);
    
    // Example: 4:30 PM - 5:30 PM is unavailable
    const unavailStart2 = new Date(date);
    unavailStart2.setHours(16, 30, 0, 0);
    const unavailEnd2 = new Date(date);
    unavailEnd2.setHours(17, 30, 0, 0);
    unavailable.push([unavailStart2, unavailEnd2]);
  }
  
  return unavailable;
};
