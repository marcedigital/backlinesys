
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookingDetails, formatTime, calculatePrice } from '@/utils/bookingUtils';
import AddOnItem from './AddOnItem';
import { cn } from '@/lib/utils';
import { CalendarClock, Clock, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  bookingDetails: BookingDetails;
  onClose: () => void;
  onToggleAddOn: (id: string) => void;
  onConfirm: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  bookingDetails,
  onClose,
  onToggleAddOn,
  onConfirm,
}) => {
  const { startTime, endTime, addOns, totalPrice } = bookingDetails;

  // Recalculate price whenever selection changes
  useEffect(() => {
    calculatePrice(startTime, endTime, addOns);
  }, [startTime, endTime, addOns]);

  const handleConfirm = () => {
    toast.success('Booking confirmed!', {
      description: `Your meeting room has been booked successfully.`,
    });
    onConfirm();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] glass-morphism animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center">
            <CalendarClock className="w-5 h-5 mr-2 text-booking-blue" />
            Complete your booking
          </DialogTitle>
        </DialogHeader>

        {startTime && endTime && (
          <div className="mb-4">
            <div className="bg-booking-light-blue rounded-lg p-4 mb-4">
              <div className="text-sm text-muted-foreground mb-1">Selected time:</div>
              <div className="font-medium">{formatDate(startTime)}</div>
              <div className="flex items-center mt-2 text-booking-blue">
                <Clock className="w-4 h-4 mr-1" />
                <span>{formatTime(startTime)} - {formatTime(endTime)}</span>
              </div>
            </div>

            <h3 className="text-base font-medium mb-3">Select add-ons (optional)</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {addOns.map((addOn) => (
                <AddOnItem
                  key={addOn.id}
                  addOn={addOn}
                  onToggle={onToggleAddOn}
                />
              ))}
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total price:</span>
                <span className="text-xl font-semibold">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex sm:justify-between mt-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex items-center"
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="bg-booking-blue hover:bg-booking-blue/90 text-white flex items-center"
          >
            <Check className="w-4 h-4 mr-1" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
