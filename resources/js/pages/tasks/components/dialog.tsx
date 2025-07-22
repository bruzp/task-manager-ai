import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
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
      <Dialog open={isOpen} onOpenChange={setOpen}>
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

              {/* TODO: Fix bug on due date, saved date is not the same as when I input it
                  Then change the datetime picker */}
              <div className="grid gap-3">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  type="datetime-local"
                  id="due_date"
                  name="due_date"
                  value={data.due_date ? new Date(data.due_date).toISOString().slice(0, 16) : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData('due_date', val ? new Date(val) : null);
                  }}
                  placeholder="Optional due date"
                  className="w-[180px]"
                />
                <InputError message={errors.due_date} />
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
