
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number;
  course?: string;
}

interface AssignmentCardProps {
  assignment: Assignment;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onProgressUpdate?: (id: string, progress: number) => void;
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onEdit,
  onDelete,
  onProgressUpdate,
}) => {
  const { id, title, description, dueDate, priority, progress, course } = assignment;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onProgressUpdate) {
      onProgressUpdate(id, parseInt(e.target.value));
    }
  };

  const priorityColors = {
    low: 'bg-priority-low text-white',
    medium: 'bg-priority-medium text-white',
    high: 'bg-priority-high text-white',
  };

  const dueIn = formatDistanceToNow(dueDate, { addSuffix: true });
  const isOverdue = new Date() > dueDate;

  return (
    <Card className="assignment-card overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-base">{title}</h3>
            {course && <span className="text-xs text-muted-foreground">{course}</span>}
          </div>
          <Badge className={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar transition-all"
              style={{ 
                width: `${progress}%`, 
                backgroundColor: 
                  progress === 100 
                    ? 'hsl(var(--primary))' 
                    : isOverdue 
                      ? 'hsl(var(--destructive))' 
                      : 'hsl(var(--accent))'
              }}
            />
          </div>
          {onProgressUpdate && (
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleProgressChange}
              className="w-full mt-2 accent-primary"
            />
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col items-start gap-2">
        <div className="text-xs flex gap-1 items-center">
          <span className={`font-medium ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
            Due: {dueIn}
          </span>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 w-full justify-end mt-1">
            {onEdit && (
              <Button variant="ghost" size="icon" onClick={() => onEdit(id)}>
                <Edit size={16} />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;
