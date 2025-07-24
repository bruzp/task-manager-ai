import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import debounce from 'lodash/debounce';
import React from 'react';
import { FilterType } from '../types/task';

export default function SearchInput({ filters, setFilters }: { filters: FilterType; setFilters: (filters: FilterType) => void }) {
  const filtersRef = React.useRef(filters);
  filtersRef.current = filters;

  const debouncedSearch = React.useMemo(
    () =>
      debounce((value: string) => {
        const updatedFilters = { ...filtersRef.current, search: value };
        setFilters(updatedFilters);
        router.get(route('tasks.index'), updatedFilters, {
          preserveState: true,
          preserveScroll: true,
          preserveUrl: true,
          replace: true,
        });
      }, 400),
    [setFilters],
  );

  return <Input placeholder="Search tasks..." className="max-w-sm" onChange={(e) => debouncedSearch(e.target.value)} />;
}
