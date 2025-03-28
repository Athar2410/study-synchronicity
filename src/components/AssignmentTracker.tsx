
import React, { useState } from 'react';
import AssignmentCard, { Assignment } from '@/components/AssignmentCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter } from 'lucide-react';

interface AssignmentTrackerProps {
  initialAssignments?: Assignment[];
}

const AssignmentTracker: React.FC<AssignmentTrackerProps> = ({ initialAssignments = [] }) => {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [sort, setSort] = useState<'dueDate' | 'priority' | 'progress'>('dueDate');
  const { toast } = useToast();

  const [newAssignment, setNewAssignment] = useState<Omit<Assignment, 'id'>>({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
    progress: 0,
    course: '',
  });

  const handleAddAssignment = () => {
    setEditingId(null);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      progress: 0,
      course: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditAssignment = (id: string) => {
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
      setEditingId(id);
      setNewAssignment({
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        priority: assignment.priority,
        progress: assignment.progress,
        course: assignment.course,
      });
      setIsDialogOpen(true);
    }
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    toast({
      title: "Assignment deleted",
      description: "The assignment has been removed from your tracker.",
    });
  };

  const handleProgressUpdate = (id: string, progress: number) => {
    setAssignments(
      assignments.map(a =>
        a.id === id ? { ...a, progress } : a
      )
    );
    
    if (progress === 100) {
      toast({
        title: "Assignment completed! 🎉",
        description: "Great job on completing your assignment!",
      });
    }
  };

  const handleSaveAssignment = () => {
    if (!newAssignment.title) {
      toast({
        title: "Title required",
        description: "Please enter an assignment title.",
        variant: "destructive",
      });
      return;
    }

    if (editingId) {
      // Update existing assignment
      setAssignments(
        assignments.map(a =>
          a.id === editingId ? { ...newAssignment, id: editingId } : a
        )
      );
      toast({
        title: "Assignment updated",
        description: "Your assignment has been updated successfully.",
      });
    } else {
      // Add new assignment
      const id = Math.random().toString(36).substring(2, 9);
      setAssignments([...assignments, { ...newAssignment, id }]);
      toast({
        title: "Assignment added",
        description: "Your new assignment has been added to the tracker.",
      });
    }
    
    setIsDialogOpen(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAssignment({
      ...newAssignment,
      [name]: value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    setNewAssignment({
      ...newAssignment,
      dueDate: date,
    });
  };

  const handlePriorityChange = (value: string) => {
    setNewAssignment({
      ...newAssignment,
      priority: value as 'low' | 'medium' | 'high',
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'completed') return assignment.progress === 100;
    if (filter === 'in-progress') return assignment.progress < 100;
    return true;
  });

  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    if (sort === 'dueDate') return a.dueDate.getTime() - b.dueDate.getTime();
    if (sort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (sort === 'progress') return b.progress - a.progress;
    return 0;
  });

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddAssignment}
            className="gap-1"
          >
            <Plus size={16} />
            Add Assignment
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <Select 
              defaultValue={filter} 
              onValueChange={(value) => setFilter(value as any)}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Select 
            defaultValue={sort} 
            onValueChange={(value) => setSort(value as any)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedAssignments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No assignments found. Add your first assignment!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAssignments.map(assignment => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={handleEditAssignment}
              onDelete={handleDeleteAssignment}
              onProgressUpdate={handleProgressUpdate}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Assignment' : 'Add New Assignment'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={newAssignment.title}
                onChange={handleInputChange}
                placeholder="Assignment title"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="course">Course (Optional)</Label>
              <Input
                id="course"
                name="course"
                value={newAssignment.course || ''}
                onChange={handleInputChange}
                placeholder="e.g. CS101"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newAssignment.description}
                onChange={handleInputChange}
                placeholder="Assignment details"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formatDateForInput(newAssignment.dueDate)}
                onChange={handleDateChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Priority</Label>
              <RadioGroup
                value={newAssignment.priority}
                onValueChange={handlePriorityChange}
                className="flex"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-priority-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2 mx-4">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-priority-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-priority-high">High</Label>
                </div>
              </RadioGroup>
            </div>
            
            {editingId && (
              <div className="grid gap-2">
                <Label htmlFor="progress">Progress: {newAssignment.progress}%</Label>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={newAssignment.progress}
                  onChange={(e) => setNewAssignment({
                    ...newAssignment,
                    progress: parseInt(e.target.value)
                  })}
                  className="accent-primary"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAssignment}>
              {editingId ? 'Update' : 'Add'} Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignmentTracker;
