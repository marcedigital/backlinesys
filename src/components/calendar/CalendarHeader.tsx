
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Music } from 'lucide-react';

interface CalendarHeaderProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedDate,
  onPreviousDay,
  onNextDay,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <Music className="mr-2 h-5 w-5 text-booking-purple" />
        <h2 className="text-xl font-semibold">Music Rehearsal Room Booking</h2>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousDay}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="px-4 py-2 rounded-md bg-booking-purple text-white font-medium">
          {format(selectedDate, 'MMMM d, yyyy')}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onNextDay}
          className="flex items-center"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
