
import React, { useState, useEffect } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import TimeSlot from './TimeSlot';
import BookingModal from './BookingModal';
import { cn } from '@/lib/utils';
import {
  getDefaultAddOns,
  getUnavailableTimes,
  generateTimeSlots,
  calculatePrice,
  TimeSlot as TimeSlotType,
  BookingDetails,
  AddOn
} from '@/utils/bookingUtils';

const Calendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<TimeSlotType | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<TimeSlotType | null>(null);
  const [tempSelectionEnd, setTempSelectionEnd] = useState<TimeSlotType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    room: 'Conference Room A',
    startTime: null,
    endTime: null,
    addOns: getDefaultAddOns(),
    totalPrice: 0
  });

  // Generate time slots when selected date changes
  useEffect(() => {
    const unavailableTimes = getUnavailableTimes(selectedDate);
    const slots = generateTimeSlots(selectedDate, unavailableTimes);
    setTimeSlots(slots);
    resetSelection();
  }, [selectedDate]);

  // Update booking details when selection changes
  useEffect(() => {
    if (selectionStart && selectionEnd) {
      const startSlot = selectionStart.startTime < selectionEnd.startTime ? selectionStart : selectionEnd;
      const endSlot = selectionStart.startTime < selectionEnd.startTime ? selectionEnd : selectionStart;
      
      setBookingDetails(prev => ({
        ...prev,
        startTime: startSlot.startTime,
        endTime: endSlot.endTime
      }));
    }
  }, [selectionStart, selectionEnd]);

  // Update total price when booking details change
  useEffect(() => {
    const total = calculatePrice(
      bookingDetails.startTime,
      bookingDetails.endTime,
      bookingDetails.addOns
    );
    
    setBookingDetails(prev => ({
      ...prev,
      totalPrice: total
    }));
  }, [bookingDetails.startTime, bookingDetails.endTime, bookingDetails.addOns]);

  const resetSelection = () => {
    setSelectionStart(null);
    setSelectionEnd(null);
    setTempSelectionEnd(null);
    setIsSelecting(false);
    
    // Reset selected state for all time slots
    setTimeSlots(prev => 
      prev.map(slot => ({
        ...slot,
        isSelected: false
      }))
    );
  };

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };

  const handleSelectStart = (slot: TimeSlotType) => {
    if (!slot.isAvailable) return;
    
    setIsSelecting(true);
    setSelectionStart(slot);
    setTempSelectionEnd(slot);
    
    // Update time slots to show selection
    setTimeSlots(prev => 
      prev.map(s => ({
        ...s,
        isSelected: s.id === slot.id
      }))
    );
  };

  const handleSelectEnd = (slot: TimeSlotType) => {
    if (!isSelecting || !slot.isAvailable) return;
    
    setIsSelecting(false);
    setSelectionEnd(slot);
    setTempSelectionEnd(null);
    
    // Update all selected slots
    const startIndex = timeSlots.findIndex(s => s.id === selectionStart?.id);
    const endIndex = timeSlots.findIndex(s => s.id === slot.id);
    
    if (startIndex !== -1 && endIndex !== -1) {
      const min = Math.min(startIndex, endIndex);
      const max = Math.max(startIndex, endIndex);
      
      setTimeSlots(prev => 
        prev.map((s, i) => ({
          ...s,
          isSelected: i >= min && i <= max && s.isAvailable
        }))
      );
      
      // Open booking modal after selection is complete
      setIsModalOpen(true);
    }
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
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(false);
    resetSelection();
    
    // In a real app, you would save the booking here
    console.log('Booking confirmed:', bookingDetails);
    
    // Reset add-ons selection
    setBookingDetails(prev => ({
      ...prev,
      startTime: null,
      endTime: null,
      addOns: prev.addOns.map(addOn => ({ ...addOn, selected: false }))
    }));
  };

  return (
    <div className="animate-fade-in">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-booking-blue" />
          <h2 className="text-xl font-semibold">Meeting Room Booking</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousDay}
            className="flex items-center"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="px-4 py-2 rounded-md bg-booking-light-blue text-booking-blue font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextDay}
            className="flex items-center"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-secondary p-4 rounded-lg mb-6 text-sm">
        <p className="font-medium">How to book:</p>
        <ol className="list-decimal ml-5 mt-1 space-y-1">
          <li>Select a start time by clicking on an available time slot</li>
          <li>Drag to select the duration of your meeting</li>
          <li>Choose optional add-ons and confirm your booking</li>
        </ol>
      </div>
      
      {/* Time slots */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
        <h3 className="text-base font-medium mb-4">Available Times - {bookingDetails.room}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map((slot) => (
            <TimeSlot
              key={slot.id}
              slot={slot}
              isSelecting={isSelecting}
              isInSelectionRange={isInSelectionRange(slot)}
              onSelectStart={handleSelectStart}
              onSelectEnd={handleSelectEnd}
              onMouseEnter={handleMouseEnter}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-6 pt-4 border-t flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-white border border-gray-300 rounded-sm mr-2"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-booking-light-blue border border-booking-blue rounded-sm mr-2"></div>
            <span className="text-sm">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-booking-gray rounded-sm mr-2"></div>
            <span className="text-sm">Unavailable</span>
          </div>
        </div>
      </div>
      
      {/* Booking modal */}
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
