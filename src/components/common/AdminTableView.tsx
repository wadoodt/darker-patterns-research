import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminTableViewProps, Column } from '@/types/table';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AdminTableView<T, S extends string>({
  columns,
  data,
  onSortColumn,
  currentSortKey,
  currentSortDirection,
}: AdminTableViewProps<T, S>) {
  const renderSortIcons = (column: Column<T>) => {
    if (!column.sortable) return null;

    return (
      <div className="ml-1 flex flex-col">
        <ChevronUp
          size={12}
          className={`${
            currentSortKey === column.key && currentSortDirection === 'asc'
              ? 'text-brand-purple-400'
              : 'text-dark-text-tertiary'
          }`}
        />
        <ChevronDown
          size={12}
          className={`${
            currentSortKey === column.key && currentSortDirection === 'desc'
              ? 'text-brand-purple-400'
              : 'text-dark-text-tertiary'
          }`}
        />
      </div>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={`${column.sortable ? 'cursor-pointer' : ''}`}
              onClick={() => column.sortable && onSortColumn(column.key as S)}
            >
              <div className="flex items-center">
                {column.icon && <column.icon size={16} className="mr-1" />}
                {column.header}
                {renderSortIcons(column)}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length > 0 ? (
          data.map((item, index) => (
            <TableRow key={index} className="link-dark">
              {columns.map((column) => (
                <TableCell key={column.key}>{column.renderCell(item)}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center">
              No data available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
