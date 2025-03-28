
import React, { useState } from 'react';
import TimeSlot, { ClassDetails } from '@/components/TimeSlot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

const colorOptions = [
  'bg-blue-100 dark:bg-blue-900/30',
  'bg-green-100 dark:bg-green-900/30',
  'bg-purple-100 dark:bg-purple-900/30',
  'bg-yellow-100 dark:bg-yellow-900/30',
  'bg-pink-100 dark:bg-pink-900/30',
  'bg-indigo-100 dark:bg-indigo-900/30',
  'bg-orange-100 dark:bg-orange-900/30',
  'bg-teal-100 dark:bg-teal-900/30',
];

interface TimetableProps {
  initialClasses?: ClassDetails[];
  isEditable?: boolean;
}

const Timetable: React.FC<TimetableProps> = ({ initialClasses = [], isEditable = true }) => {
  const [classes, setClasses] = useState<ClassDetails[]>(initialClasses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [newClass, setNewClass] = useState<Omit<ClassDetails, 'id'>>({
    subject: '',
    startTime: '',
    endTime: '',
    professor: '',
    location: '',
    color: colorOptions[0],
  });
  const { toast } = useToast();

  const handleAddClass = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setNewClass({
      subject: '',
      startTime: time,
      endTime: incrementTime(time),
      professor: '',
      location: '',
      color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
    });
    setIsDialogOpen(true);
  };

  const incrementTime = (time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    let newHours = hours + 1;
    if (newHours > 23) newHours = 0;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleRemoveClass = (id: string) => {
    setClasses(classes.filter(cls => cls.id !== id));
    toast({
      title: "Class removed",
      description: "The class has been removed from your timetable.",
    });
  };

  const handleSaveClass = () => {
    if (!newClass.subject) {
      toast({
        title: "Subject required",
        description: "Please enter a subject name.",
        variant: "destructive",
      });
      return;
    }

    const id = Math.random().toString(36).substring(2, 9);
    const classToAdd: ClassDetails = {
      id,
      ...newClass,
    };

    setClasses([...classes, classToAdd]);
    setIsDialogOpen(false);
    toast({
      title: "Class added",
      description: `${newClass.subject} has been added to your timetable.`,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClass({
      ...newClass,
      [name]: value,
    });
  };

  const handleColorChange = (color: string) => {
    setNewClass({
      ...newClass,
      color,
    });
  };

  const getClassForDayAndTime = (day: string, time: string) => {
    return classes.find(
      cls => 
        day === cls.id.split('-')[0] && 
        time === cls.startTime
    );
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="timetable-grid min-w-[800px]">
        {/* Header row with days */}
        <div className="bg-muted/20 font-semibold p-3 text-center">Time</div>
        {days.map(day => (
          <div key={day} className="bg-muted/20 font-semibold p-3 text-center">
            {day}
          </div>
        ))}
        
        {/* Time slots */}
        {times.map(time => (
          <React.Fragment key={time}>
            <div className="bg-muted/20 font-medium p-3 text-center text-sm flex items-center justify-center">
              {time}
            </div>
            {days.map(day => {
              const classForSlot = classes.find(
                cls => 
                  day === selectedDay &&
                  time >= cls.startTime && 
                  time < cls.endTime
              );
              
              return (
                <TimeSlot
                  key={`${day}-${time}`}
                  day={day}
                  time={time}
                  classDetails={classForSlot}
                  onAddClass={handleAddClass}
                  onRemoveClass={handleRemoveClass}
                  isEditable={isEditable}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Class to {selectedDay}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                name="subject"
                value={newClass.subject}
                onChange={handleInputChange}
                placeholder="e.g. Mathematics"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={newClass.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={newClass.endTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="professor">Professor (Optional)</Label>
              <Input
                id="professor"
                name="professor"
                value={newClass.professor}
                onChange={handleInputChange}
                placeholder="e.g. Dr. Smith"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                name="location"
                value={newClass.location}
                onChange={handleInputChange}
                placeholder="e.g. Room 101"
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 rounded-full ${color} border ${
                      newClass.color === color ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleColorChange(color)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClass}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Timetable;
