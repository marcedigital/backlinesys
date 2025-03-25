
import React, { useState, useEffect } from 'react';
import { addDays, subDays } from 'date-fns';
import {
  getDefaultAddOns,
  getUnavailableTimes,
  generateTimeSlots,
  calculatePrice,
  areSlotsContinuous,
  TimeSlot as TimeSlotType,
  BookingDetails,
  rooms
} from '@/utils/bookingUtils';
import BookingModal from './BookingModal';
import CalendarHeader from './calendar/CalendarHeader';
import BookingInstructions from './calendar/BookingInstructions';
import RoomSelector from './calendar/RoomSelector';
import RoomTimeslots from './calendar/RoomTimeslots';
import SelectionHint from './calendar/SelectionHint';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].id);
  const [timeSlots, setTimeSlots] = useState<{ [roomId: string]: TimeSlotType[] }>({});
  const [nextDayTimeSlots, setNextDayTimeSlots] = useState<{ [roomId: string]: TimeSlotType[] }>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<TimeSlotType | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<TimeSlotType | null>(null);
  const [tempSelectionEnd, setTempSelectionEnd] = useState<TimeSlotType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    room: rooms[0].name,
    startTime: null,
    endTime: null,
    addOns: getDefaultAddOns(),
    totalPrice: 0
  });

  const roomImages = {
    room1: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&h=800",
    room2: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=800"
  };

  // Cargar slots para el día actual y siguiente
  useEffect(() => {
    const currentDateSlots: { [roomId: string]: TimeSlotType[] } = {};
    const nextDateSlots: { [roomId: string]: TimeSlotType[] } = {};
    const nextDay = addDays(selectedDate, 1);
    
    rooms.forEach(room => {
      const unavailableTimes = getUnavailableTimes(selectedDate, room.id);
      const unavailableTimesNextDay = getUnavailableTimes(nextDay, room.id);
      
      currentDateSlots[room.id] = generateTimeSlots(selectedDate, room.id, unavailableTimes);
      nextDateSlots[room.id] = generateTimeSlots(nextDay, room.id, unavailableTimesNextDay, true); // Only 6 hours for next day
    });
    
    setTimeSlots(currentDateSlots);
    setNextDayTimeSlots(nextDateSlots);
    resetSelection();
  }, [selectedDate]);

  // Update booking details when selection changes
  useEffect(() => {
    if (selectionStart && selectionEnd) {
      const startSlot = selectionStart.startTime < selectionEnd.startTime ? selectionStart : selectionEnd;
      const endSlot = selectionStart.startTime < selectionEnd.startTime ? selectionEnd : selectionStart;
      
      const roomName = rooms.find(room => room.id === selectedRoom)?.name || '';
      
      setBookingDetails(prev => ({
        ...prev,
        room: roomName,
        startTime: startSlot.startTime,
        endTime: endSlot.endTime
      }));
    }
  }, [selectionStart, selectionEnd, selectedRoom]);

  // Calculate price when booking details change
  useEffect(() => {
    if (bookingDetails.startTime && bookingDetails.endTime) {
      const total = calculatePrice(
        bookingDetails.startTime,
        bookingDetails.endTime,
        bookingDetails.addOns
      );
      
      setBookingDetails(prev => ({
        ...prev,
        totalPrice: total
      }));
    }
  }, [bookingDetails.startTime, bookingDetails.endTime, bookingDetails.addOns]);

  const resetSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setTempSelectionEnd(null);
    setIsSelecting(false);
    
    // Reset current day slots
    if (timeSlots[selectedRoom]) {
      setTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map(slot => ({
          ...slot,
          isSelected: false
        }))
      }));
    }
    
    // Reset next day slots
    if (nextDayTimeSlots[selectedRoom]) {
      setNextDayTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map(slot => ({
          ...slot,
          isSelected: false
        }))
      }));
    }
  };

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleRoomChange = (roomId: string) => {
    resetSelection();
    setSelectedRoom(roomId);
    
    const roomName = rooms.find(room => room.id === roomId)?.name || '';
    setBookingDetails(prev => ({
      ...prev,
      room: roomName
    }));
  };

  const handleSelectStart = (slot: TimeSlotType) => {
    if (!slot.isAvailable) return;
    
    setIsSelecting(true);
    setSelectionStart(slot);
    setTempSelectionEnd(slot);
    
    // Marcar como seleccionado en el día actual o en el día siguiente
    const isCurrentDaySlot = timeSlots[selectedRoom]?.some(s => s.id === slot.id);
    
    if (isCurrentDaySlot) {
      setTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map(s => ({
          ...s,
          isSelected: s.id === slot.id
        }))
      }));
    } else {
      setNextDayTimeSlots(prev => ({
        ...prev,
        [selectedRoom]: prev[selectedRoom].map(s => ({
          ...s,
          isSelected: s.id === slot.id
        }))
      }));
    }
  };

  const handleSelectEnd = (slot: TimeSlotType) => {
    if (!isSelecting || !slot.isAvailable || !selectionStart) return;
    
    // Determinar si los slots están en el mismo día o en días diferentes
    const isStartInCurrentDay = timeSlots[selectedRoom]?.some(s => s.id === selectionStart.id);
    const isEndInCurrentDay = timeSlots[selectedRoom]?.some(s => s.id === slot.id);
    
    // Si ambos están en el mismo día, verificar continuidad
    if (isStartInCurrentDay && isEndInCurrentDay) {
      const currentDaySlots = timeSlots[selectedRoom] || [];
      if (!areSlotsContinuous(currentDaySlots, selectionStart, slot)) {
        toast.error("Solo puedes seleccionar horas continuas sin espacios ocupados entre ellas");
        resetSelection();
        return;
      }
      
      // Marcar selección en el día actual
      const startIndex = currentDaySlots.findIndex(s => s.id === selectionStart.id);
      const endIndex = currentDaySlots.findIndex(s => s.id === slot.id);
      
      if (startIndex !== -1 && endIndex !== -1) {
        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);
        
        setTimeSlots(prev => ({
          ...prev,
          [selectedRoom]: prev[selectedRoom].map((s, i) => ({
            ...s,
            isSelected: i >= min && i <= max && s.isAvailable
          }))
        }));
      }
    } 
    // Si selección cruza días, verificar continuidad especial
    else if ((isStartInCurrentDay && !isEndInCurrentDay) || (!isStartInCurrentDay && isEndInCurrentDay)) {
      const currentDaySlots = timeSlots[selectedRoom] || [];
      const nextDaySlots = nextDayTimeSlots[selectedRoom] || [];
      
      // Verificar si la selección cruza la medianoche de manera válida
      if (isStartInCurrentDay) {
        // Selección desde día actual hasta día siguiente
        const startIndex = currentDaySlots.findIndex(s => s.id === selectionStart.id);
        const endIndex = nextDaySlots.findIndex(s => s.id === slot.id);
        
        if (startIndex !== -1 && endIndex !== -1) {
          // Verificar que todos los slots desde startIndex hasta el final del día actual estén disponibles
          const isValidInCurrentDay = currentDaySlots.slice(startIndex).every(s => s.isAvailable);
          // Verificar que todos los slots desde el inicio del día siguiente hasta endIndex estén disponibles
          const isValidInNextDay = nextDaySlots.slice(0, endIndex + 1).every(s => s.isAvailable);
          
          if (!isValidInCurrentDay || !isValidInNextDay) {
            toast.error("Solo puedes seleccionar horas continuas sin espacios ocupados entre ellas");
            resetSelection();
            return;
          }
          
          // Marcar slots seleccionados en ambos días
          setTimeSlots(prev => ({
            ...prev,
            [selectedRoom]: prev[selectedRoom].map((s, i) => ({
              ...s,
              isSelected: i >= startIndex && s.isAvailable
            }))
          }));
          
          setNextDayTimeSlots(prev => ({
            ...prev,
            [selectedRoom]: prev[selectedRoom].map((s, i) => ({
              ...s,
              isSelected: i <= endIndex && s.isAvailable
            }))
          }));
        }
      } else {
        // Selección desde día siguiente hasta día actual
        const startIndex = nextDaySlots.findIndex(s => s.id === selectionStart.id);
        const endIndex = currentDaySlots.findIndex(s => s.id === slot.id);
        
        if (startIndex !== -1 && endIndex !== -1) {
          // Verificar continuidad (no implementado en este caso por complejidad)
          toast.error("La selección de días en orden inverso no está soportada");
          resetSelection();
          return;
        }
      }
    }
    // Si ambos están en el día siguiente, verificar continuidad
    else if (!isStartInCurrentDay && !isEndInCurrentDay) {
      const nextDaySlots = nextDayTimeSlots[selectedRoom] || [];
      if (!areSlotsContinuous(nextDaySlots, selectionStart, slot)) {
        toast.error("Solo puedes seleccionar horas continuas sin espacios ocupados entre ellas");
        resetSelection();
        return;
      }
      
      // Marcar selección en el día siguiente
      const startIndex = nextDaySlots.findIndex(s => s.id === selectionStart.id);
      const endIndex = nextDaySlots.findIndex(s => s.id === slot.id);
      
      if (startIndex !== -1 && endIndex !== -1) {
        const min = Math.min(startIndex, endIndex);
        const max = Math.max(startIndex, endIndex);
        
        setNextDayTimeSlots(prev => ({
          ...prev,
          [selectedRoom]: prev[selectedRoom].map((s, i) => ({
            ...s,
            isSelected: i >= min && i <= max && s.isAvailable
          }))
        }));
      }
    }
    
    setIsSelecting(false);
    setSelectionEnd(slot);
    setTempSelectionEnd(null);
    setIsModalOpen(true);
  };

  const handleMouseEnter = (slot: TimeSlotType) => {
    if (isSelecting) {
      setTempSelectionEnd(slot);
    }
  };

  const isInSelectionRange = (slot: TimeSlotType) => {
    if (!isSelecting || !selectionStart || !tempSelectionEnd) return false;
    
    const startTime = selectionStart.startTime;
    const endTime = tempSelectionEnd.startTime;
    
    if (startTime <= endTime) {
      return slot.startTime >= startTime && slot.startTime <= endTime;
    } else {
      return slot.startTime >= endTime && slot.startTime <= startTime;
    }
  };

  const handleToggleAddOn = (id: string) => {
    setBookingDetails(prev => ({
      ...prev,
      addOns: prev.addOns.map(addOn => 
        addOn.id === id ? { ...addOn, selected: !addOn.selected } : addOn
      )
    }));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetSelection();
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    
    // After confirming add-ons, navigate to login page
    navigate('/login');
    
    console.log('Booking confirmed:', bookingDetails);
    
    setBookingDetails(prev => ({
      ...prev,
      startTime: null,
      endTime: null,
      addOns: prev.addOns.map(addOn => ({ ...addOn, selected: false }))
    }));
  };

  return (
    <div className="animate-fade-in">
      <CalendarHeader 
        selectedDate={selectedDate}
        onPreviousDay={handlePreviousDay}
        onNextDay={handleNextDay}
      />
      
      <BookingInstructions />
      
      <RoomSelector 
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomChange={handleRoomChange}
        roomImages={roomImages}
      />
      
      <SelectionHint isSelecting={isSelecting} />
      
      <RoomTimeslots
        rooms={rooms}
        selectedRoom={selectedRoom}
        timeSlots={timeSlots}
        isSelecting={isSelecting}
        onRoomChange={handleRoomChange}
        onSelectStart={handleSelectStart}
        onSelectEnd={handleSelectEnd}
        onMouseEnter={handleMouseEnter}
        isInSelectionRange={isInSelectionRange}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Horas disponibles - Siguiente día</h3>
        <RoomTimeslots
          rooms={rooms}
          selectedRoom={selectedRoom}
          timeSlots={nextDayTimeSlots}
          isSelecting={isSelecting}
          onRoomChange={handleRoomChange}
          onSelectStart={handleSelectStart}
          onSelectEnd={handleSelectEnd}
          onMouseEnter={handleMouseEnter}
          isInSelectionRange={isInSelectionRange}
        />
      </div>
      
      <BookingModal
        isOpen={isModalOpen}
        bookingDetails={bookingDetails}
        onClose={handleCloseModal}
        onToggleAddOn={handleToggleAddOn}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
};

export default Calendar;
