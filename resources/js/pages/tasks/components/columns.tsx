import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

import { toast } from 'sonner';
import { FilterType, TaskType } from '../types/task';
import ColumnActions from './column-actions';

const handleSort = (column: Column<TaskType>, filters: FilterType, setFilters: (filters: FilterType) => void) => {
  column.toggleSorting(column.getIsSorted() === 'asc');

  const updatedFilters = {
    ...filters,
    page: 1,
    sort: column.id,
    direction: column.getIsSorted() === 'asc' ? 'desc' : 'asc',
  };

  setFilters(updatedFilters);

  router.get(route('tasks.index'), updatedFilters, {
    preserveState: true,
    preserveScroll: true,
    preserveUrl: true,
    replace: true,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to sort tasks');
      console.error('Failed to sort tasks:', error);
    },
  });
};

export const columns = (filters: FilterType, setFilters: (filters: FilterType) => void, onEdit: (task: TaskType) => void): ColumnDef<TaskType>[] => [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column, filters, setFilters)}>
          Title
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column, filters, setFilters)}>
          Priority
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column, filters, setFilters)}>
          Status
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column, filters, setFilters)}>
          Due Date
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      );
    },
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(new Date(row.getValue('due_date')));

      return <span>{formatted}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <ColumnActions row={row} filters={filters} onEdit={onEdit} />,
  },
];
