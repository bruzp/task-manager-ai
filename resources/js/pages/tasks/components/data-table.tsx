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
} from '@tanstack/react-table';
import * as React from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import ReactMarkdown from 'react-markdown';
import { FilterType, MetaType } from '../types/task';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: MetaType;
  filters: FilterType;
  setFilters: (filters: FilterType) => void;
}

export function DataTable<TData, TValue>({ columns, data, meta, filters, setFilters }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

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

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <div className="mt-4 flex items-center justify-center space-x-2 py-4">
        {meta.links.map((link, index) => (
          <Button
            key={index}
            variant={link.active ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (link.url) {
                const page = new URL(link.url).searchParams.get('page');
                const updatedFilters = {
                  ...filters,
                  page: page ? parseInt(page, 10) : 1,
                };

                setFilters(updatedFilters);

                router.get(route('tasks.index'), updatedFilters, {
                  preserveState: true,
                  preserveScroll: true,
                  preserveUrl: true,
                  replace: true,
                });
              }
            }}
            disabled={!link.url}
          >
            <ReactMarkdown>{link.label}</ReactMarkdown>
          </Button>
        ))}
      </div>
    </div>
  );
}
