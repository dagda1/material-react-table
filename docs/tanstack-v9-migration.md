# TanStack Table v9 migration checklist

Branch: `v4`. Pins: `@tanstack/react-table` 9.1.2, `@tanstack/match-sorter-utils` 9.1.2,
`@tanstack/table-core` 9.1.2 (added as a direct dependency so MRT can augment its interfaces).

Path chosen: **legacy shim**. MRT stays on `useLegacyTable` and the `Legacy*` types. The
native v9 API (`useTable`, `tableFeatures()`, `table.state`) is a later, separate piece of work.

Status: `src/` and `stories/` both typecheck clean, tests pass, build compiles. One thing
fails.

```bash
cd packages/material-react-table
./node_modules/.bin/tsc --noEmit -p tsconfig.json   # clean
pnpm test                                            # 3 passed
pnpm build                                           # compiles, size-limit fails
```

The migration is committed on `update-tanstack-9-1` in `43d635b50` and `8492692da`.

---

## Open

- [ ] **Bundle size.** `dist/index.js` is 68.17 kB against a 56 kB limit; `dist/index.mjs` is
      64.03 kB against 53 kB. About 12 kB of growth, because the bundle now carries the v9
      feature system and the legacy compatibility layer together. Raising the limit in the
      `size-limit` section of `package.json` is a judgement call, not a mechanical fix.

---

## Breaking changes to MRT's public API

All three were adopted rather than mapped at the boundary, because v4 is already a major and a
translation layer would have to run in both directions.

- Column pinning positions are `'start'` / `'end'`, not `'left'` / `'right'`. This covers
  `column.pin()`, `column.getIsPinned()`, and the `columnPinning` state shape. Both keys are
  required in `columnPinning` state, so `{ start: [...] }` alone no longer typechecks.
- Column sort function options are `sortFn` (column) and `sortFns` (table), not `sortingFn`
  and `sortingFns`.
- Aggregation functions are `{ aggregate(context) }` objects, not
  `(columnId, leafRows, childRows)` callables. `MRT_AggregationFn` is now
  `AggregationFnDef<StockFeatures, TData>`.

`MRT_RowSelectionState` is `Record<string, true>` in v9, so deselecting a row means deleting
its key rather than setting it to `false`. That is TanStack's change, not MRT's, but it
breaks any caller holding selection as `Record<string, boolean>`.

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
- [x] `MRT_AggregationFn` is `AggregationFnDef<StockFeatures, TData>`. The multi-fn array
      path in `column.utils.ts` now builds `{ aggregate: (context) => ... }` and calls
      `aggregationFns[fn]?.aggregate(context)`. The old callable shape compiled only because
      the `AggregationFns` augmentation types its members `any`; it would have thrown at
      runtime.

Stories:

- [x] `@storybook/react` → `@storybook/react-vite` across 54 files
- [x] `columnPinning` initial state uses `start` / `end`, with both keys present
- [x] `rowPinning` initial state includes `bottom`
- [x] `sortingFn: 'fuzzy'` → `sortFn: 'fuzzy'`
- [x] `MRT_AggregationFns.min(...)` → `MRT_AggregationFns.min.aggregate(context)`
- [x] Custom `filterFns` callbacks annotated, since the `FilterFns` augmentation types them
      `any` and their parameters were implicitly `any`
- [x] Row selection state typed `MRT_RowSelectionState`; the toggle deletes the key

Tests:

- [x] `src/fns/filterFns.test.tsx` covers the fuzzy global filter end to end: `rankItem` and
      the `rankings.MATCHES` threshold pick the matching rows, and `compareItems` puts the
      better match first. A fourth case turns ranked results off, so the ordering assertion
      proves ranking ran rather than source order surviving by accident.

Not TanStack, fixed in passing because they blocked the typecheck:

- [x] `faker.internet.color()` → `faker.color.rgb()` (faker 10)
- [x] MUI 9 dropped system props: `<Stack alignItems>` and `<Box padding>` → `sx`
- [x] MUI 9 `InputLabelProps` → `slotProps.inputLabel`

---

## Watch out

`useMRT_TableInstance.ts` has a `@ts-expect-error` directly above the `useLegacyTable` call.
It suppressed the `getPrePaginationRowModel` break, which only surfaced when the tests ran.
Any further v9 rename reaching that call will also fail silently at compile time. The test
suite is the only guard.

`@tanstack/match-sorter-utils` 9.1.2 is covered by `src/fns/filterFns.test.tsx`. Types alone
would not have caught a behaviour change here, so the tests assert which rows survive the
filter and in what order.

---

## Reference

9.0.0 → 9.1.2 is 14 commits with no breaking changes: infinite pagination page sizes
(#6526), built-in fn names in the legacy column helper (#6521), median aggregation skipping
non-numeric values (#6523), sorted parent rows flattening ahead of sub-rows (#6529), and
centralised no-op state guarding in `setStateSlice` (#6532).
