
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyOverview from '@/components/DailyOverview';
import UpcomingAssignments from '@/components/UpcomingAssignments';
import Timetable from '@/components/Timetable';
import { ClassDetails } from '@/components/TimeSlot';
import AssignmentTracker from '@/components/AssignmentTracker';
import { Assignment } from '@/components/AssignmentCard';
import { addDays, subDays } from 'date-fns';

// Demo data
const generateDemoClasses = (): ClassDetails[] => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const subjects = ['Mathematics', 'Computer Science', 'Physics', 'English Literature', 'History', 'Biology', 'Chemistry'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
  const locations = ['Room 101', 'Room 215', 'Lab 3', 'Lecture Hall A', 'Library'];
  const colors = [
    'bg-blue-100 dark:bg-blue-900/30',
    'bg-green-100 dark:bg-green-900/30',
    'bg-purple-100 dark:bg-purple-900/30',
    'bg-yellow-100 dark:bg-yellow-900/30',
    'bg-pink-100 dark:bg-pink-900/30',
    'bg-indigo-100 dark:bg-indigo-900/30',
  ];
  
  const classes: ClassDetails[] = [];
  
  // Generate classes for each day
  daysOfWeek.forEach(day => {
    // Add 2-3 classes per day
    const numClasses = 2 + Math.floor(Math.random() * 2);
    const dayTimes = [...times].sort(() => 0.5 - Math.random()).slice(0, numClasses);
    
    dayTimes.forEach(time => {
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const hourEnd = parseInt(time.split(':')[0]) + 1;
      const endTime = `${hourEnd.toString().padStart(2, '0')}:00`;
      
      classes.push({
        id: `${day}-${time}`,
        subject,
        startTime: time,
        endTime,
        location,
        color,
        professor: `Dr. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}. ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      });
    });
  });
  
  return classes;
};

const generateDemoAssignments = (): Assignment[] => {
  const titles = [
    'Research Paper', 
    'Problem Set', 
    'Lab Report', 
    'Case Study', 
    'Essay', 
    'Project Proposal',
    'Final Project',
    'Quiz Preparation',
    'Group Presentation'
  ];
  
  const descriptions = [
    'Complete a 5-page research paper on a topic of your choice',
    'Solve problems 1-15 from Chapter 4',
    'Write up the results from this week\'s lab experiment',
    'Analyze the provided case study and write a 3-page report',
    'Write a 1000-word essay on the assigned topic',
    'Submit a proposal for your final project including timeline and resources needed',
    'Complete and submit your final project with documentation',
    'Prepare for the upcoming quiz covering chapters 3-5',
    'Prepare a 15-minute presentation with your group'
  ];
  
  const courses = ['CS101', 'MATH201', 'PHYS150', 'ENG102', 'HIST100', 'BIO210', 'CHEM120'];
  const priorities = ['low', 'medium', 'high'];
  
  const today = new Date();
  const assignments: Assignment[] = [];
  
  for (let i = 0; i < 8; i++) {
    const dueDate = addDays(today, Math.floor(Math.random() * 14) - 3); // Random due date between 3 days ago and 10 days from now
    const title = titles[Math.floor(Math.random() * titles.length)];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)] as 'low' | 'medium' | 'high';
    const progress = Math.round(Math.random() * 100); // Random progress between 0-100%
    
    assignments.push({
      id: `assignment-${i}`,
      title,
      description,
      dueDate,
      priority,
      progress,
      course
    });
  }
  
  return assignments;
};

const Dashboard: React.FC = () => {
  const [classes] = useState<ClassDetails[]>(generateDemoClasses());
  const [assignments] = useState<Assignment[]>(generateDemoAssignments());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <DailyOverview classes={classes} assignments={assignments} />
        </div>
        <div>
          <UpcomingAssignments assignments={assignments} />
        </div>
      </div>
      
      <Tabs defaultValue="timetable" className="w-full">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="timetable">Timetable</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="timetable" className="mt-6">
          <Timetable initialClasses={classes} />
        </TabsContent>
        <TabsContent value="assignments" className="mt-6">
          <AssignmentTracker initialAssignments={assignments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
