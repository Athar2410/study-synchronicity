
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, BookOpen } from 'lucide-react';
import { ClassDetails } from '@/components/TimeSlot';
import { Assignment } from '@/components/AssignmentCard';

interface DailyOverviewProps {
  classes: ClassDetails[];
  assignments: Assignment[];
}

const DailyOverview: React.FC<DailyOverviewProps> = ({ classes, assignments }) => {
  const today = new Date();
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = weekdays[today.getDay()];
  
  // Filter today's classes
  const todayClasses = classes.filter(cls => 
    currentDay === cls.id.split('-')[0]
  ).sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  );

  // Get upcoming assignments (due today or in the next 3 days)
  const upcomingAssignments = assignments
    .filter(assignment => {
      const dueDate = assignment.dueDate;
      const diffTime = Math.abs(dueDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && assignment.progress < 100;
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="border shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Today's Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-base font-medium flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            Today's Classes
          </h3>
          {todayClasses.length > 0 ? (
            <ul className="space-y-2">
              {todayClasses.map(cls => (
                <li 
                  key={cls.id}
                  className={`p-2 rounded-md text-sm ${cls.color || 'bg-primary/10'}`}
                >
                  <div className="font-medium">{cls.subject}</div>
                  <div className="text-xs text-muted-foreground">
                    {cls.startTime} - {cls.endTime} {cls.location ? `• ${cls.location}` : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No classes scheduled for today.</p>
          )}
        </div>

        <div>
          <h3 className="text-base font-medium flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Upcoming Assignments
          </h3>
          {upcomingAssignments.length > 0 ? (
            <ul className="space-y-2">
              {upcomingAssignments.map(assignment => (
                <li key={assignment.id} className="border-l-4 pl-2 py-1" style={{
                  borderColor: 
                    assignment.priority === 'high' ? 'hsl(var(--destructive))' : 
                    assignment.priority === 'medium' ? 'hsl(var(--accent))' : 
                    'hsl(var(--primary))'
                }}>
                  <div className="font-medium text-sm">{assignment.title}</div>
                  <div className="text-xs flex justify-between">
                    <span className="text-muted-foreground">
                      Due: {formatDate(assignment.dueDate)}
                    </span>
                    <span>{assignment.progress}% complete</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming assignments due soon.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyOverview;
