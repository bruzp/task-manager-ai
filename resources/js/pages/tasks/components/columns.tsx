import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { router } from "@inertiajs/react"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

export type TaskType = {
  id: string;
  title: string;
  priority: string;
  status: string;
  created_at: Date;
  updated_at: Date;
};

export type LinksType = {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
};

export type MetaType = {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
};

export type FilterType = {
  search?: string;
  sort?: string;
  direction?: string;
  perPage?: number;
  page?: number;
};

//TODO: Fix sorting arrow icons.
export const columns = (filters: FilterType): ColumnDef<TaskType>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
            console.log(filters);

            router.get(route('tasks.index'), {
              page: 1, // Reset to first page on sort
              sort: 'title',
              direction: column.getIsSorted() === "asc" ? 'asc' : 'desc',
            }, {
              preserveState: true,
              preserveScroll: true,
              preserveUrl: true,
              replace: true,
            });
          }}
        >
          Title
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      )
    },
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");

            router.get(route('tasks.index'), {
              page: 1, // Reset to first page on sort
              sort: 'priority',
              direction: column.getIsSorted() === "asc" ? 'asc' : 'desc',
            }, {
              preserveState: true,
              preserveScroll: true,
              preserveUrl: true,
              replace: true,
            });
          }}
        >
          Priority
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");

            router.get(route('tasks.index'), {
              page: 1, // Reset to first page on sort
              sort: 'status',
              direction: column.getIsSorted() === "asc" ? 'asc' : 'desc',
            }, {
              preserveState: true,
              preserveScroll: true,
              preserveUrl: true,
              replace: true,
            });
          }}
        >
          Status
          <span className="ml-2 h-4 w-4">
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUpDown className="h-4 w-4 opacity-50" />
            )}
          </span>
        </Button>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-right">Created at</div>,
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.getValue("created_at")));

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "updated_at",
    header: () => <div className="text-right">Updated at</div>,
    cell: ({ row }) => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(row.getValue("updated_at")));

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [open, setOpen] = useState(false)

      const handleDelete = () => {
        router.delete(route('tasks.destroy', {
          id: row.original.id
        }), {
          preserveState: true,
          preserveScroll: true,
          preserveUrl: true,
          replace: true,
        });
      }

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
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setTimeout(() => setOpen(true), 10)
                }}
              >
                <div className="w-full text-left cursor-pointer text-red-600">
                  Delete
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )
    },
  },
]