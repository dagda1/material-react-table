# TanStack Table v9 migration checklist

Branch: `v4`. Pins: `@tanstack/react-table` 9.1.2, `@tanstack/match-sorter-utils` 9.1.2,
`@tanstack/table-core` 9.1.2 (added as a direct dependency so MRT can augment its interfaces).

Path chosen: **legacy shim**. MRT stays on `useLegacyTable` and the `Legacy*` types. The
native v9 API (`useTable`, `tableFeatures()`, `table.state`) is a later, separate piece of work.

Status: typecheck clean, tests pass, build compiles. One thing fails.

```bash
cd packages/material-react-table
./node_modules/.bin/tsc --noEmit -p tsconfig.json   # clean
pnpm test                                            # 3 passed
pnpm build                                           # compiles, size-limit fails
```

---

## Open

- [ ] **Bundle size.** `dist/index.js` is 68.17 kB against a 56 kB limit; `dist/index.mjs` is
      64.03 kB against 53 kB. About 12 kB of growth, because the bundle now carries the v9
      feature system and the legacy compatibility layer together. Raising the limit in the
      `size-limit` section of `package.json` is a judgement call, not a mechanical fix.

- [ ] **Storybook 10.** 54 `TS2307` errors in `stories/**`: they import `type Meta` from
      `@storybook/react`, which is not a dependency at any version here. Only
      `@storybook/react-vite` is installed. Independent of TanStack.

---

## Breaking changes to MRT's public API

Both were adopted rather than mapped at the boundary, because v4 is already a major and a
translation layer would have to run in both directions.

- Column pinning positions are `'start'` / `'end'`, not `'left'` / `'right'`. This covers
  `column.pin()`, `column.getIsPinned()`, and the `columnPinning` state shape.
- Column sort function options are `sortFn` (column) and `sortFns` (table), not `sortingFn`
  and `sortingFns`.

---

## Done

Row models and base types:

- [x] Row-model factories imported from `@tanstack/react-table/legacy`
- [x] `useReactTable` → `useLegacyTable`
- [x] `Row` / `Cell` / `Column` / `ColumnDef` / `Header` / `HeaderGroup` / `Table` /
      `TableOptions` → `Legacy*`
- [x] `createRow` → `constructRow`
- [x] `getPrePaginationRowModel` → `getPrePaginatedRowModel`

Renames:

- [x] `sortingFns` export → `sortFns`, `SortingFn` → `SortFn`
- [x] `sortingFn` / `sortingFns` options → `sortFn` / `sortFns`
- [x] `VisibilityState` → `ColumnVisibilityState`
- [x] Column pinning `left` / `right` → `start` / `end` across `style.utils.ts`,
      `MRT_TableHeadCellGrabHandle.tsx`, `MRT_ShowHideColumnsMenuItems.tsx`,
      `MRT_ColumnActionMenu.tsx`, `MRT_ColumnPinningButtons.tsx`
- [x] `getLeftVisibleLeafColumns` / `getRightVisibleLeafColumns` removed; derived in
      `useMRT_ColumnVirtualizer.ts` from `getVisibleLeafColumns()` filtered by pinned state
- [x] `columnSizingInfo` state slice → `columnResizing`, `setColumnSizingInfo` →
      `setColumnResizing`, `onColumnSizingInfoChange` → `onColumnResizingChange`

Types:

- [x] `FilterFn` / `SortFn` given the `StockFeatures` first type argument
- [x] `MRT_ColumnSizingInfoState` sourced from `TableState_ColumnResizing['columnResizing']`
- [x] `FilterFns` / `SortFns` / `AggregationFns` lost their index signatures in v9. Restored
      by module augmentation of `@tanstack/table-core` in `types.ts`, so users can still
      register fns by name. This is why `table-core` is now a direct dependency.
- [x] `MRT_AggregationFn` no longer aliases `AggregationFnDef`, which is a def wrapper in v9
      rather than a callable. It keeps the v8 callable shape because MRT invokes these
      itself in `prepareColumns`.

---

## Watch out

`useMRT_TableInstance.ts` has a `@ts-expect-error` directly above the `useLegacyTable` call.
It suppressed the `getPrePaginationRowModel` break, which only surfaced when the tests ran.
Any further v9 rename reaching that call will also fail silently at compile time. The test
suite is the only guard.

Not checked: `@tanstack/match-sorter-utils` 9.1.2 for changes to `rankItem`, `rankings`,
`compareItems` or `RankingInfo`. Nothing errored, but nothing verified it either.

---

## Reference

9.0.0 → 9.1.2 is 14 commits with no breaking changes: infinite pagination page sizes
(#6526), built-in fn names in the legacy column helper (#6521), median aggregation skipping
non-numeric values (#6523), sorted parent rows flattening ahead of sub-rows (#6529), and
centralised no-op state guarding in `setStateSlice` (#6532).
