import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { FilterType } from './types';

//TODO: use debounce for search input
export default function SearchInput({ filters, setFilters }: { filters: FilterType; setFilters: (filters: FilterType) => void }) {
  return (
    <Input
      placeholder="Search tasks..."
      className="max-w-sm"
      onChange={(e) => {
        const updatedFilters = { ...filters, search: e.target.value };
        setFilters(updatedFilters);

        router.get(route('tasks.index'), updatedFilters, {
          preserveState: true,
          preserveScroll: true,
          preserveUrl: true,
          replace: true,
        });
      }}
    />
  );
}
