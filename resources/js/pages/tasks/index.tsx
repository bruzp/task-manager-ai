import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React from 'react';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import AddUpdateTaskDialog from './components/dialog';
import SearchInput from './components/search';
import { FilterType, LinksType, MetaType, TaskType } from './components/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export type TasksProps = {
    tasks: {
        data: TaskType[];
        links: LinksType;
        meta: MetaType;
    };
    filters: FilterType;
    priorityOptions?: string[];
    statusOptions?: string[];
};

export default function Tasks({ tasks, filters, priorityOptions, statusOptions }: TasksProps) {
    const [open, setOpen] = React.useState(false);
    const [toEditTask, setToEditTask] = React.useState<TaskType | null>(null);
    const [filtersState, setFiltersState] = React.useState<FilterType>(filters);

    const handleEditTask = (task: TaskType) => {
        setToEditTask(task);
        setOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mt-4 flex w-full items-center justify-between">
                    <SearchInput filters={filtersState} setFilters={setFiltersState} />
                    <AddUpdateTaskDialog
                        task={toEditTask}
                        setToEditTask={setToEditTask}
                        isOpen={open}
                        setOpen={setOpen}
                        priorityOptions={priorityOptions}
                        statusOptions={statusOptions}
                    />
                </div>

                <DataTable
                    columns={columns(filtersState, setFiltersState, handleEditTask)}
                    data={tasks.data}
                    meta={tasks.meta}
                    filters={filtersState}
                />
            </div>
        </AppLayout>
    );
}
