import React, { useId, useMemo } from "react";
import { cn } from "@/lib/utils";

interface RadioPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  className?: string;
  name?: string;
  disabled?: boolean;
}

const clampPage = (page: number, totalPages: number): number => {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.trunc(page)), Math.max(1, Math.trunc(totalPages)));
};

const RadioPagination: React.FC<RadioPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  className,
  name,
  disabled = false,
}) => {
  const generatedId = useId();
  const groupName = name ?? `pagination-${generatedId}`;
  const safeTotalPages = Math.max(1, Math.trunc(totalPages));
  const safeCurrentPage = clampPage(currentPage, safeTotalPages);
  const safeVisibleCount = Math.max(1, Math.trunc(maxVisiblePages));

  const pageOptions = useMemo(() => {
    if (safeTotalPages <= safeVisibleCount) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    const half = Math.floor(safeVisibleCount / 2);
    let start = Math.max(1, safeCurrentPage - half);
    const end = Math.min(safeTotalPages, start + safeVisibleCount - 1);
    start = Math.max(1, end - safeVisibleCount + 1);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [safeCurrentPage, safeTotalPages, safeVisibleCount]);

  if (safeTotalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("join", className)}>
      {pageOptions.map((page) => (
        <button
          key={page}
          type="button"
          className={cn(
            "join-item btn btn-square",
            page === safeCurrentPage ? "btn-primary text-primary-content border-primary" : "btn-outline"
          )}
          aria-label={`Page ${page}`}
          data-pagination-group={groupName}
          disabled={disabled}
          onClick={() => {
            if (page !== safeCurrentPage) {
              onPageChange(page);
            }
          }}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default RadioPagination;
