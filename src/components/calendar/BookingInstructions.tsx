
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';

const BookingInstructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`bg-gradient-to-r from-accent/20 to-primary/20 p-4 rounded-lg mb-6 text-sm border border-primary`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-black">Cómo reservar:</h3>
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className={isOpen ? "" : "bg-primary/20 hover:bg-primary/30"}
          >
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="mt-2">
        <ol className="list-decimal ml-5 space-y-1 text-gray-800">
          <li>Selecciona una sala de ensayo haciendo clic en una pestaña de sala</li>
          <li>Selecciona la primera hora de tu sesión</li>
          <li>Selecciona la última hora de tu sesión</li>
          <li>Puedes seleccionar horarios continuos incluso entre días diferentes</li>
          <li>Elige equipamiento opcional y confirma tu reserva</li>
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default BookingInstructions;
