
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export interface ClassDetails {
  id: string;
  subject: string;
  startTime: string;
  endTime: string;
  professor?: string;
  location?: string;
  color?: string;
}

interface TimeSlotProps {
  day: string;
  time: string;
  classDetails?: ClassDetails;
  onAddClass?: (day: string, time: string) => void;
  onRemoveClass?: (id: string) => void;
  isEditable?: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({
  day,
  time,
  classDetails,
  onAddClass,
  onRemoveClass,
  isEditable = true,
}) => {
  const handleClick = () => {
    if (!classDetails && onAddClass && isEditable) {
      onAddClass(day, time);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (classDetails && onRemoveClass && isEditable) {
      onRemoveClass(classDetails.id);
    }
  };

  const bgColor = classDetails?.color || 'bg-primary/20';

  return (
    <div
      className={cn(
        'time-slot relative border rounded-md p-2 h-full min-h-16 transition-all cursor-pointer',
        classDetails
          ? `${bgColor} hover:shadow-md`
          : 'bg-card hover:bg-muted/50'
      )}
      onClick={handleClick}
    >
      {classDetails ? (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm">{classDetails.subject}</h4>
            {isEditable && (
              <button 
                onClick={handleRemove}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {classDetails.startTime} - {classDetails.endTime}
          </div>
          {classDetails.location && (
            <div className="text-xs text-muted-foreground mt-auto">
              {classDetails.location}
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
          {isEditable ? 'Add Class' : ''}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
