"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav className={className} aria-label="Pagination">
      <div className="flex items-center justify-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-[var(--button-radius)] border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-white disabled:opacity-40"
        >
          Previous
        </button>
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`rounded-[var(--button-radius)] border px-3 py-1.5 text-sm transition-colors ${
                p === page
                  ? "border-violet bg-violet/20 text-lavender"
                  : "border-border text-muted hover:border-border-hover hover:text-white"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-[var(--button-radius)] border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:border-border-hover hover:text-white disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  );
}

export function paginateArray<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(items.length / perPage);
  const start = (page - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    totalPages,
    total: items.length,
    page,
  };
}
