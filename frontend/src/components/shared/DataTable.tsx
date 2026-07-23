import { cn } from '../../lib/utils';
import { Table, type Column } from '../ui/Table';

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  emptyMessage,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('olo-card p-0 overflow-hidden', className)}>
      <Table
        columns={columns}
        data={data}
        onRowClick={onRowClick}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}

export { DataTable };
export type { Column };
