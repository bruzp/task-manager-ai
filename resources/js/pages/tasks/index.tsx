import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React from 'react';
import { columns, FilterType, LinksType, MetaType, TaskType } from './components/columns';
import { DataTable } from './components/data-table';
import AddUpdateTaskDialog from './components/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

// TODO: transfer somewhere better
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

    const handleEditTask = (task: TaskType) => {
        setToEditTask(task);
        setOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mt-4 flex w-full items-center justify-between">
                    <Input
                        placeholder="Search tasks..."
                        className="max-w-sm"
                        onChange={(e) => {
                            router.get(
                                route('tasks.index'),
                                {
                                    search: e.target.value,
                                    sort: filters.sort,
                                    direction: filters.direction,
                                    perPage: filters.perPage,
                                    page: filters.page,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    preserveUrl: true,
                                    replace: true,
                                },
                            );
                        }}
                    />
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
                    columns={columns(filters, handleEditTask)}
                    data={tasks.data}
                    links={tasks.links}
                    meta={tasks.meta}
                    filters={filters}
                    priorityOptions={priorityOptions}
                    statusOptions={statusOptions}
                />
            </div>
        </AppLayout>
    );
}
