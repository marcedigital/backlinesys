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
  image?: string;
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
  
  // Calculate duration in minutes
  const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  const hours = Math.floor(durationInMinutes / 60);
  const halfHours = Math.floor((durationInMinutes % 60) / 30);
  
  // Base price:
  // ¢10.000 for the first hour
  // ¢5.000 for each additional hour
  // ¢2.500 for each additional half hour
  let basePrice = 10000; // First hour
  
  if (hours > 1) {
    basePrice += (hours - 1) * 5000; // Additional full hours
  }
  
  if (halfHours > 0) {
    basePrice += halfHours * 2500; // Additional half hours
  }
  
  // Add price of selected add-ons (¢2.000 per hour per add-on)
  const addOnPricePerHour = 2000;
  const totalHours = Math.ceil(durationInMinutes / 60); // Round up to nearest hour for add-ons
  
  const addOnPrice = addOns.reduce((total, addOn) => {
    return addOn.selected ? total + (addOnPricePerHour * totalHours) : total;
  }, 0);
  
  return Math.round(basePrice + addOnPrice);
};

// Sample add-ons data
export const getDefaultAddOns = (): AddOn[] => [
  {
    id: "1",
    name: "Alquiler de Platillos",
    description: "Set completo de platillos para batería",
    price: 2000,
    selected: false,
    image: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=format&fit=crop&w=800"
  },
  {
    id: "2",
    name: "Alquiler Pedal Doble de Bombo",
    description: "Pedal doble profesional para bombo",
    price: 2000,
    selected: false,
    image: "https://images.unsplash.com/photo-1631025693569-8e49e4229231?auto=format&fit=crop&w=800"
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
