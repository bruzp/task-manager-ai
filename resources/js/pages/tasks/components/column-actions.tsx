import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link, router } from '@inertiajs/react';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { FilterType, TaskType } from '../types/task';

export default function ColumnActions({ row, filters, onEdit }: { row: Row<TaskType>; filters: FilterType; onEdit: (task: TaskType) => void }) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    router.delete(
      route('tasks.destroy', {
        id: row.original.id,
      }),
      {
        data: filters,
        preserveScroll: true,
        preserveUrl: true,
        replace: true,
        onSuccess: () => {
          toast.success('Task deleted');
        },
      },
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={route('tasks.show', { id: row.original.id })}>View</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onEdit(row.original)}>Edit</DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setTimeout(() => setOpen(true), 10);
            }}
          >
            <div className="w-full cursor-pointer text-left text-red-600">Delete</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
