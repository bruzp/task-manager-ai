import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { columns, FilterType, LinksType, MetaType, TaskType } from './components/columns';
import { DataTable } from './components/data-table';

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
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <DataTable
                    columns={columns(filters)}
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
