import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { TableSkeleton } from './Skeleton';

function renderCell(column, row) {
  if (column.badge) return <Badge variant={row.variant || 'slate'}>{row[column.key]}</Badge>;
  return row[column.key];
}

export function DataTable({ columns, rows = [], loading = false, searchable = true, pageSize = 8, filters = [] }) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const searchValue = search.toLowerCase().trim();
    return rows.filter((row) => {
      const matchesSearch = !searchValue || Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(searchValue));
      const matchesFilters = Object.entries(activeFilters).every(([key, value]) => !value || String(row[key] ?? '') === value);
      return matchesSearch && matchesFilters;
    });
  }, [activeFilters, rows, search]);

  const totalPages = Math.max(Math.ceil(filteredRows.length / pageSize), 1);
  const visibleRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function updateFilter(key, value) {
    setActiveFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }

  const toolbar = (searchable || filters.length > 0) ? (
    <div className="flex flex-col gap-3 border-b p-3 sm:p-4 md:flex-row md:items-center md:justify-between">
      {searchable ? (
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="h-11 pl-9" placeholder="Search records..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        </div>
      ) : <div />}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <select key={filter.key} className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm sm:flex-none" value={activeFilters[filter.key] || ''} onChange={(event) => updateFilter(filter.key, event.target.value)}>
            <option value="">{filter.label}</option>
            {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ))}
      </div>
    </div>
  ) : null;

  const pagination = (
    <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <span>Showing {visibleRows.length} of {filteredRows.length} records</span>
      <div className="flex items-center justify-between gap-2 sm:justify-end">
        <Button variant="outline" size="sm" className="h-10 min-w-[5.5rem]" disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>Previous</Button>
        <span className="px-1">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" className="h-10 min-w-[5.5rem]" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(value + 1, totalPages))}>Next</Button>
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden">
      {toolbar}
      {loading ? <TableSkeleton columns={columns.length} /> : (
        <>
          <div className="space-y-3 p-3 md:hidden">
            {visibleRows.map((row) => (
              <div key={row.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-start justify-between gap-3 border-b border-dashed py-2.5 last:border-0 last:pb-0 first:pt-0">
                    <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-muted-foreground">{column.label}</span>
                    <div className="min-w-0 text-right text-sm font-medium">{renderCell(column, row)}</div>
                  </div>
                ))}
              </div>
            ))}
            {!visibleRows.length ? (
              <p className="py-10 text-center text-muted-foreground">No records found</p>
            ) : null}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-muted-foreground dark:bg-slate-900/60">
                <tr>{columns.map((column) => <th key={column.key} className="whitespace-nowrap px-4 py-4 font-bold lg:px-5">{column.label}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {visibleRows.map((row) => (
                  <tr key={row.id} className="bg-card transition hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    {columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-4 lg:px-5">{renderCell(column, row)}</td>)}
                  </tr>
                ))}
                {!visibleRows.length ? (
                  <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-muted-foreground">No records found</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
      {pagination}
    </Card>
  );
}
