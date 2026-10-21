# 5.0.0

Upgrades TanStack Table 8.21.3 → 9.3.1, @mui/material 9.2 → 9.5 and
@mui/x-date-pickers 9.10 → 9.16. Peer ranges are unchanged: @mui/material >=9,
@mui/x-date-pickers >=9.2, react >=19. The dependency bumps break nothing. The
API changes below, caused by TanStack Table 9, are breaking.

## `table.getState()` removed

Use `table.state`.

```diff
- const { sorting } = table.getState();
+ const { sorting } = table.state;
```

## Column pinning uses `start`/`end`

`left`/`right` are gone. `columnPinning` state needs both keys.

```diff
- initialState={{ columnPinning: { left: ['name'] } }}
+ initialState={{ columnPinning: { end: [], start: ['name'] } }}
```

## Sorting fns renamed

`sortingFn` → `sortFn` on column defs. `sortingFns` → `sortFns` in table options.

```diff
- { accessorKey: 'age', sortingFn: 'datetime' }
+ { accessorKey: 'age', sortFn: 'datetime' }
```

## Custom aggregation fns are objects

An aggregation fn is `{ aggregate(context) }`, not a function.

```diff
- aggregationFn: (columnId, leafRows) => leafRows.length
+ aggregationFn: { aggregate: ({ leafRows }) => leafRows.length }
```

## `MRT_RowSelectionState` is `Record<string, true>`

Deselecting a row deletes its key. Do not check for `false` values.

```diff
- const selected = Object.entries(rowSelection).filter(([, v]) => v);
+ const selected = Object.keys(rowSelection);
```

## `MRT_ColumnDef` is a union

`accessorKey`, `accessorFn` and `columns` no longer coexist on one type.
Narrow with `in` before reading them.

```diff
- if (columnDef.accessorKey) { ... }
+ if ('accessorKey' in columnDef) { ... }
```

## Removed row and column members

- `row.getRow()` — you already have the row
- `column.header` / `column.footer` — use `column.columnDef.header` /
  `column.columnDef.footer`

## `data` and `columns` are `readonly`

Pass `readonly` arrays; do not mutate them.

## `table.getColumn()` returns `Column | undefined`

Handle the `undefined` case.

```diff
- table.getColumn('name').toggleVisibility();
+ table.getColumn('name')?.toggleVisibility();
```

## ESM only

The CJS build is gone. `require('@cutting/material-react-table')` no longer
works; use `import`.
