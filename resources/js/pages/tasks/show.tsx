import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Calendar, ClipboardList, Clock, FileText, Flag, Info, MessageSquareText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TaskType } from './types/task';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Tasks', href: route('tasks.index') },
  { title: 'Task Details', href: '#' },
];

export default function Show({ task }: { task: TaskType }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Task: ${task.title}`} />

      <div className="mx-auto w-full max-w-4xl space-y-6 rounded-xl p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ClipboardList className="h-5 w-5" />
              {task.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <DetailRow icon={<FileText className="h-4 w-4" />} label="Description">
              {task.description ? <ReactMarkdown>{task.description}</ReactMarkdown> : <EmptyText />}
            </DetailRow>

            <DetailRow icon={<Flag className="h-4 w-4" />} label="Priority">
              <PriorityBadge level={task.priority} />
            </DetailRow>

            <DetailRow icon={<Info className="h-4 w-4" />} label="Status">
              <StatusBadge status={task.status} />
            </DetailRow>

            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Due Date">
              {task.due_date ? new Date(task.due_date).toLocaleString() : <EmptyText />}
            </DetailRow>

            <DetailRow icon={<MessageSquareText className="h-4 w-4" />} label="Remarks">
              {task.remarks || <EmptyText />}
            </DetailRow>

            <DetailRow icon={<Clock className="h-4 w-4" />} label="Created At">
              {new Date(task.created_at).toLocaleString()}
            </DetailRow>

            <DetailRow icon={<Clock className="h-4 w-4" />} label="Updated At">
              {new Date(task.updated_at).toLocaleString()}
            </DetailRow>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-md bg-muted/30 p-3">
      <div className="mt-1 text-muted-foreground">{icon}</div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
        <span className="text-base text-foreground">{children}</span>
      </div>
    </div>
  );
}

function PriorityBadge({ level }: { level: string }) {
  const map = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-700',
  };
  return <Badge className={`${map[level as keyof typeof map] ?? ''} capitalize`}>{level}</Badge>;
}

function StatusBadge({ status }: { status: string }) {
  const map = {
    pending: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-700',
  };
  const label = status.replace('_', ' ');
  return <Badge className={`${map[status as keyof typeof map] ?? ''} capitalize`}>{label}</Badge>;
}

function EmptyText() {
  return <span className="text-muted-foreground italic">Not provided</span>;
}
