import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import React, { FormEventHandler } from 'react';
import { toast } from 'sonner';

export default function AddUpdateTaskDialog({ priorityOptions, statusOptions }: { priorityOptions?: string[]; statusOptions?: string[] }) {
    const { data, setData, post, reset, processing, errors, recentlySuccessful } = useForm({
        title: '',
        description: '',
        priority: '',
        status: '',
    });

    const [open, setOpen] = React.useState(false);

    const addTask: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('tasks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Task has been created');
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Add Task</Button>
            </DialogTrigger>

            <DialogContent className="lg:max-w-3xl">
                <form onSubmit={addTask} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle>Task</DialogTitle>
                        <DialogDescription>Create/Update a new task by filling out the form below.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" name="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            <InputError message={errors.title} />
                        </div>

                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
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
    );
}
