import { SortableEntryKeys } from '@/types/entries';
import { AdminTableProps } from '@/types/table';
import { AdminTableView } from './AdminTableView';

const AdminTable = <T, K extends keyof T>({
  columns,
  data,
  onSort,
  currentSortKey,
  currentSortDirection,
}: AdminTableProps<T, K>) => {
  const handleSort = (key: SortableEntryKeys) => {
    onSort(key);
  };

  return (
    <AdminTableView
      columns={columns}
      data={data}
      onSortColumn={handleSort}
      currentSortKey={currentSortKey}
      currentSortDirection={currentSortDirection}
    />
  );
};

export default AdminTable;
