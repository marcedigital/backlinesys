
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { AddOn } from '@/utils/bookingUtils';

interface AddOnItemProps {
  addOn: AddOn;
  onToggle: (id: string) => void;
}

const AddOnItem: React.FC<AddOnItemProps> = ({ addOn, onToggle }) => {
  return (
    <div 
      className={cn(
        'flex items-start p-4 border rounded-xl transition-all duration-200 mb-3',
        addOn.selected 
          ? 'border-booking-blue bg-booking-light-blue shadow-sm' 
          : 'border-border hover:border-booking-blue/50 hover:shadow-sm'
      )}
      onClick={() => onToggle(addOn.id)}
    >
      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="text-base font-medium">{addOn.name}</h3>
          <div 
            className={cn(
              'ml-2 w-5 h-5 rounded-full flex items-center justify-center transition-all',
              addOn.selected ? 'bg-booking-blue text-white' : 'border border-gray-300'
            )}
          >
            {addOn.selected && <Check className="w-3 h-3" />}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{addOn.description}</p>
      </div>
      <div className="font-medium text-base ml-4">
        ${addOn.price.toFixed(2)}
      </div>
    </div>
  );
};

export default AddOnItem;
