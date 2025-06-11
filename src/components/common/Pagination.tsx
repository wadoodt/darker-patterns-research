import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Basic rendering with Previous/Next buttons
  // You might want to add page number buttons for more complex pagination
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {`Showing ${Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to ${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} entries`}
      </div>
      <div className="space-x-2">
        <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          Next <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
