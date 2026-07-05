import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { TableSkeleton } from './Skeleton';

function renderCell(column, row) {
  if (column.badge) return <Badge variant={row.variant || 'slate'}>{row[column.key]}</Badge>;
  return row[column.key];
}

function MobileRowCard({ row, columns }) {
  const primaryCol = columns.find((column) => column.mobilePrimary)
    || columns.find((column) => ['name', 'title', 'tenant', 'hierarchy'].includes(column.key));
  const statusCol = columns.find((column) => column.badge);
  const photoCol = columns.find((column) => column.key === 'photo');
  const actionCol = columns.find((column) => column.key === 'actions');
  const detailCols = columns.filter((column) => (
    column !== primaryCol
    && column !== actionCol
    && column !== photoCol
    && !column.hideOnMobile
  ));

  return (
    <article className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3 border-b border-dashed pb-3">
        {photoCol && row[photoCol.key] ? (
          <div className="shrink-0">{row[photoCol.key]}</div>
        ) : null}
        <div className="min-w-0 flex-1">
          {primaryCol ? (
            <p className="break-words text-base font-bold leading-snug text-foreground">{renderCell(primaryCol, row)}</p>
          ) : null}
        </div>
        {statusCol ? <div className="shrink-0">{renderCell(statusCol, row)}</div> : null}
      </div>

      {detailCols.length ? (
        <dl className="mt-3 space-y-2.5">
          {detailCols.map((column) => (
            <div key={column.key} className="grid grid-cols-[minmax(0,38%)_minmax(0,1fr)] items-start gap-2 text-sm">
              <dt className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{column.label}</dt>
              <dd className="min-w-0 break-words text-right font-medium">{renderCell(column, row)}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {actionCol && row[actionCol.key] ? (
        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-dashed pt-3 sm:grid-cols-2">
          {row[actionCol.key]}
        </div>
      ) : null}
    </article>
  );
}

export function DataTable({
  columns,
  rows = [],
  loading = false,
  searchable = true,
  pageSize = 8,
  filters = [],
  embedded = false,
  layout = 'auto'
}) {
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
        <div className="relative w-full min-w-0 md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="h-11 w-full pl-9" placeholder="Search records..." value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} />
        </div>
      ) : <div />}
      <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap">
        {filters.map((filter) => (
          <select key={filter.key} className="h-11 w-full min-w-0 rounded-xl border bg-background px-3 text-sm sm:w-auto" value={activeFilters[filter.key] || ''} onChange={(event) => updateFilter(filter.key, event.target.value)}>
            <option value="">{filter.label}</option>
            {filter.options.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        ))}
      </div>
    </div>
  ) : null;

  const pagination = (
    <div className="flex flex-col gap-3 border-t p-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <span className="break-words">Showing {visibleRows.length} of {filteredRows.length} records</span>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:flex sm:justify-end">
        <Button variant="outline" size="sm" className="h-10 w-full sm:min-w-[5.5rem] sm:w-auto" disabled={page <= 1} onClick={() => setPage((value) => Math.max(value - 1, 1))}>Previous</Button>
        <span className="text-center">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" className="h-10 w-full sm:min-w-[5.5rem] sm:w-auto" disabled={page >= totalPages} onClick={() => setPage((value) => Math.min(value + 1, totalPages))}>Next</Button>
      </div>
    </div>
  );

  const useCardLayout = layout === 'cards';

  const cardList = (
    <div className="space-y-3 p-3">
      {visibleRows.map((row) => (
        <MobileRowCard key={row.id} row={row} columns={columns} />
      ))}
      {!visibleRows.length ? (
        <p className="py-10 text-center text-muted-foreground">No records found</p>
      ) : null}
    </div>
  );

  const body = loading ? <TableSkeleton columns={columns.length} /> : useCardLayout ? cardList : (
    <>
      <div className="space-y-3 p-3 lg:hidden">
        {visibleRows.map((row) => (
          <MobileRowCard key={row.id} row={row} columns={columns} />
        ))}
        {!visibleRows.length ? (
          <p className="py-10 text-center text-muted-foreground">No records found</p>
        ) : null}
      </div>

      <div className="hidden min-w-0 max-w-full lg:block">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-muted-foreground dark:bg-slate-900/60">
              <tr>{columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'whitespace-nowrap px-4 py-4 font-bold lg:px-5',
                    column.key === 'actions' && 'sticky right-0 z-10 min-w-[8.5rem] bg-slate-50 dark:bg-slate-900/60'
                  )}
                >
                  {column.label}
                </th>
              ))}</tr>
            </thead>
            <tbody className="divide-y">
              {visibleRows.map((row) => (
                <tr key={row.id} className="bg-card transition hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-4 lg:px-5',
                        column.key === 'actions'
                          ? 'sticky right-0 z-10 min-w-[8.5rem] whitespace-normal bg-card shadow-[-6px_0_12px_-8px_rgba(15,23,42,0.25)]'
                          : 'max-w-xs whitespace-nowrap'
                      )}
                    >
                      {renderCell(column, row)}
                    </td>
                  ))}
                </tr>
              ))}
              {!visibleRows.length ? (
                <tr><td colSpan={columns.length} className="px-5 py-10 text-center text-muted-foreground">No records found</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const content = (
    <>
      {toolbar}
      {body}
      {!loading ? pagination : null}
    </>
  );

  if (embedded) {
    return <div className="min-w-0 max-w-full">{content}</div>;
  }

  return (
    <Card className="min-w-0 max-w-full overflow-hidden p-0 shadow-sm">
      {content}
    </Card>
  );
}
