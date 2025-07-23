import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { FormEventHandler, useEffect } from 'react';
import { toast } from 'sonner';
import { TaskType } from './types';

type AddUpdateTaskDialogProps = {
  task?: TaskType | null;
  setToEditTask: (task: TaskType | null) => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  priorityOptions?: string[];
  statusOptions?: string[];
};

export default function AddUpdateTaskDialog({ task, setToEditTask, isOpen, setOpen, priorityOptions, statusOptions }: AddUpdateTaskDialogProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const { data, setData, post, put, reset, processing, errors } = useForm({
    title: '',
    description: '',
    priority: '',
    status: '',
    due_date: null as Date | null,
    remarks: '',
  });

  useEffect(() => {
    if (task) {
      setData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? new Date(task.due_date) : null,
        remarks: task.remarks || '',
      });
    } else {
      reset();
    }
  }, [task, setData, reset]);

  const addTask: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('tasks.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success('Task has been created');
      },
    });
  };

  const updateTask: FormEventHandler = (e) => {
    e.preventDefault();

    if (!task) return;

    put(route('tasks.update', { id: task.id }), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success('Task has been updated');
      },
    });
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          setToEditTask(null);
          setOpen(true);
        }}
      >
        Add Task
      </Button>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCalendarOpen(false);
          }
          setOpen(open);
        }}
      >
        <DialogContent className="lg:max-w-3xl">
          <form onSubmit={task ? updateTask : addTask} className="space-y-6">
            <DialogHeader>
              <DialogTitle>{task ? 'Edit' : 'Add'} Task</DialogTitle>
              <DialogDescription>{task ? 'Edit task details.' : 'Create a new task by filling out the form below.'}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                <InputError message={errors.title} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={data.description} onChange={(e) => setData('description', e.target.value)} />
                <InputError message={errors.description} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" value={data.priority} onValueChange={(value) => setData('priority', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.priority} />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={data.status} onValueChange={(value) => setData('status', value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.status} />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date-picker" className="px-1">
                    Date
                  </Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen} modal={isOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" id="date-picker" className="w-32 justify-between font-normal">
                        {data.due_date ? data.due_date.toLocaleDateString() : 'Select date'}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={data.due_date ?? undefined}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setData('due_date', date ?? null);
                          setIsCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <InputError message={errors.due_date} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time-picker" className="px-1">
                    Time
                  </Label>
                  <Input
                    type="time"
                    id="time-picker"
                    step="1"
                    defaultValue={data.due_date ? data.due_date.toTimeString().slice(0, 5) : ''}
                    onChange={(e) => {
                      if (data.due_date) {
                        const [hours, minutes] = e.target.value.split(':');
                        const updatedDate = new Date(data.due_date);
                        updatedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                        setData('due_date', updatedDate);

                        console.log('Updated due date:', updatedDate);
                      }
                    }}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea
                  id="remarks"
                  name="remarks"
                  value={data.remarks || ''}
                  onChange={(e) => setData('remarks', e.target.value)}
                  placeholder="Optional remarks about the task"
                />
                <InputError message={errors.remarks} />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
