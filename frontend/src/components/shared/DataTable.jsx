import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { TableSkeleton } from './Skeleton';

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

  return (
    <Card className="overflow-hidden">
      {(searchable || filters.length > 0) ? (
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between">
          {searchable ? (
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search records..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
            </div>
          ) : <div />}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <select key={filter.key} className="h-10 rounded-xl border bg-background px-3 text-sm" value={activeFilters[filter.key] || ''} onChange={(event) => updateFilter(filter.key, event.target.value)}>
                <option value="">{filter.label}</option>
                {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            ))}
          </div>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        {loading ? <TableSkeleton columns={columns.length} /> : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-muted-foreground dark:bg-slate-900/60">
              <tr>{columns.map((column) => <th key={column.key} className="px-5 py-4 font-bold">{column.label}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {visibleRows.map((row) => (
                <tr key={row.id} className="bg-card transition hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  {columns.map((column) => <td key={column.key} className="px-5 py-4">{column.badge ? <Badge variant={row.variant || 'slate'}>{row[column.key]}</Badge> : row[column.key]}</td>)}
                </tr>
              ))}
              {!visibleRows.length ? (
                <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-muted-foreground">No records found</td></tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex flex-col gap-3 border-t p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Showing {visibleRows.length} of {filteredRows.length} records</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>Previous</Button>
          <span>Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(value + 1, totalPages))}>Next</Button>
        </div>
      </div>
    </Card>
  );
}
