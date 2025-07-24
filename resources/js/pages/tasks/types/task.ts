export type TaskType = {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  due_date?: Date | null;
  remarks?: string | null;
  created_at: Date;
  updated_at: Date;
};

export type PartialTaskType = Pick<TaskType, 'id' | 'title' | 'priority' | 'status' | 'due_date'>;

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
