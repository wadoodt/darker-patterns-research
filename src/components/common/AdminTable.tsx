import { AdminTableProps } from '@/types/table';
import { AdminTableView } from './AdminTableView';

const AdminTable = <T, S extends string>({
  columns,
  data,
  onSort,
  currentSortKey,
  currentSortDirection,
}: AdminTableProps<T, S>) => {
  const handleSort = (key: S) => {
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
