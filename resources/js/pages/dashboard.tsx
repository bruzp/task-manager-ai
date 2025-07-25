import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';
import { PartialTaskType } from './tasks/types/task';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

function PriorityBadge({ level }: { level: PartialTaskType['priority'] }) {
  const colorMap = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-700',
  };

  return <Badge className={`${colorMap[level as keyof typeof colorMap] ?? ''} capitalize`}>{level}</Badge>;
}

function TaskList({ items }: { items: PartialTaskType[] }) {
  return (
    <ul className="space-y-2 text-sm">
      {items.length > 0 ? (
        items.map((task) => (
          <Link
            key={task.id}
            href={route('tasks.show', { id: task.id })}
            className="block rounded-md border bg-muted p-3 text-sm text-foreground shadow-sm hover:bg-accent"
          >
            <div className="font-medium">{task.title}</div>
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <PriorityBadge level={task.priority} />
              <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : '—'}</span>
            </div>
          </Link>
        ))
      ) : (
        <li className="text-muted-foreground italic">No tasks</li>
      )}
    </ul>
  );
}

type DashboardProps = {
  pendingTasks: PartialTaskType[];
  inProgressTasks: PartialTaskType[];
  completedTasks: PartialTaskType[];
};

export default function Dashboard({ pendingTasks, inProgressTasks, completedTasks }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList items={pendingTasks} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList items={inProgressTasks} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TaskList items={completedTasks} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
