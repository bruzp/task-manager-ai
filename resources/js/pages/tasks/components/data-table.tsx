import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FilterType, LinksType, MetaType } from "./columns"
import { router } from '@inertiajs/react'
import AddUpdateTaskDialog from "./dialog"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  links: LinksType,
  meta: MetaType,
  filters: FilterType,
  priorityOptions?: string[],
  statusOptions?: string[],
}

export function DataTable<TData, TValue>({
  columns,
  data,
  links,
  meta,
  filters,
  priorityOptions,
  statusOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  //TODO: use debounce for search input
  return (
    <div>
      <div className="flex items-center justify-between w-full py-4 mb-4">
        <Input
          placeholder="Search tasks..."
          className="max-w-sm"
          onChange={(e) => {
            router.get(route('tasks.index'), {
              search:  e.target.value,
              sort: filters.sort,
              direction: filters.direction,
              perPage: filters.perPage,
              page: filters.page,
            }, {
              preserveState: true,
              preserveScroll: true,
              preserveUrl: true,
              replace: true, // Use replace to avoid adding to history
            }
            )
          }}
        />
        <AddUpdateTaskDialog priorityOptions={priorityOptions} statusOptions={statusOptions} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-center space-x-2 py-4 mt-4">
        {
          meta.links.map((link, index) => (
            <Button
              key={index}
              variant={link.active ? "default" : "outline"}
              size="sm"
              onClick={() => {
                // console.log(link);
                // console.log(meta);
                // console.log(filters);
                if (link.url) {
                  router.get(link.url, {
                    sort: filters.sort,
                    direction: filters.direction,
                    perPage: filters.perPage,
                    search: filters.search,
                  }, {
                    preserveState: true,
                    preserveScroll: true,
                    preserveUrl: true,
                    replace: true, // Use replace to avoid adding to history
                  });
                }
              }}
              disabled={!link.url}
            >
              <span dangerouslySetInnerHTML={{ __html: link.label }} />
            </Button>
          ))
        }
      </div>
    </div>
  )
}