
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Assignment } from '@/components/AssignmentCard';
import { CalendarClock } from 'lucide-react';

interface UpcomingAssignmentsProps {
  assignments: Assignment[];
}

const UpcomingAssignments: React.FC<UpcomingAssignmentsProps> = ({ assignments }) => {
  const today = new Date();
  const inOneWeek = new Date(today);
  inOneWeek.setDate(today.getDate() + 7);
  
  // Filter for assignments due in the next 7 days and not completed
  const filteredAssignments = assignments
    .filter(assignment => 
      assignment.dueDate <= inOneWeek && 
      assignment.dueDate >= today &&
      assignment.progress < 100
    )
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-priority-high';
      case 'medium': return 'bg-priority-medium';
      case 'low': return 'bg-priority-low';
      default: return 'bg-primary';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          This Week's Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredAssignments.length > 0 ? (
          <div className="space-y-2">
            {filteredAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="flex items-center p-2 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div 
                  className={`w-2 h-10 rounded-full mr-3 ${getPriorityColor(assignment.priority)}`}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{assignment.title}</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{assignment.course}</span>
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                  </div>
                </div>
                <div className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-muted text-xs font-medium">
                  {assignment.progress}%
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No upcoming deadlines this week!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAssignments;
