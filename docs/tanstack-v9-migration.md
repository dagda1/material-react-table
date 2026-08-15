# TanStack Table v9 migration checklist

Branch: `v4`. Pins: `@tanstack/react-table` 9.1.2, `@tanstack/match-sorter-utils` 9.1.2.

Status: **43 errors in `src/`, 54 in `stories/`.** Nothing built, tested, or committed.

Verify with:

```bash
cd packages/material-react-table
./node_modules/.bin/tsc --noEmit -p tsconfig.json
```

---

## Done

- [x] Row-model factories imported from `@tanstack/react-table/legacy` — `useMRT_TableOptions.ts`
- [x] `useReactTable` → `useLegacyTable` — `useMRT_TableInstance.ts`
- [x] `Row`/`Cell`/`Column`/`ColumnDef`/`Header`/`HeaderGroup`/`Table`/`TableOptions` → `Legacy*` — `types.ts`, `filterFns.ts`, `sortingFns.ts`, `column.utils.ts`
- [x] `sortingFns` export → `sortFns`, `SortingFn` → `SortFn` — `sortingFns.ts`, `types.ts`
- [x] `VisibilityState` → `ColumnVisibilityState` — `types.ts`
- [x] `createRow` → `constructRow` — `tanstack.helpers.ts`
- [x] `FilterFn` / `SortFn` / `AggregationFnDef` given the `StockFeatures` first type arg — `types.ts`
- [x] `MRT_ColumnSizingInfoState` sourced from `TableState_ColumnResizing['columnResizing']` — `types.ts`

The `/legacy` shim covers row models and base entity generics only. Everything below is
feature-level and the shim does not touch it.

---

## 1. Column pinning: `left`/`right` → `start`/`end`

`ColumnPinningState` is now `{ start, end }`. `ColumnPinningPosition` is `'start' | 'end'`.

- [ ] `utils/style.utils.ts:73,75` — `pinned === 'left'` / `=== 'right'` comparisons
- [ ] `utils/style.utils.ts:134,135,140,141` — `'left'`/`'right'` passed as a pinning position
- [ ] `components/head/MRT_TableHeadCellGrabHandle.tsx:75` — updater destructures `{ left, right }`
- [ ] `components/menus/MRT_ShowHideColumnsMenuItems.tsx:96` — updater destructures `{ left, right }`
- [ ] `components/menus/MRT_ColumnActionMenu.tsx:98` — `pin()` arg typed `false | 'left' | 'right'`
- [ ] `components/menus/MRT_ColumnActionMenu.tsx:253,261` — `'left'`/`'right'` comparisons
- [ ] `components/buttons/MRT_ColumnPinningButtons.tsx:31` — `pin()` arg typed `false | 'left' | 'right'`

Decide whether MRT's own public API keeps `'left'`/`'right'` and maps at the boundary, or
adopts `'start'`/`'end'` as a v4 breaking change. This decision blocks all seven items.

### 1a. Removed pinned-column getters

- [ ] `hooks/useMRT_ColumnVirtualizer.ts:46,48` — `getLeftVisibleLeafColumns` /
      `getRightVisibleLeafColumns` no longer exist. Derive from `getVisibleLeafColumns()`
      filtered by pinned state. Lines 46,50,52 also lose their inferred param types as a
      consequence (`TS7006`); they resolve once the getter is replaced.

---

## 2. Column sizing: `columnSizingInfo` slice removed

Replaced by `columnResizing`. `setColumnSizingInfo` and `onColumnSizingInfoChange` are gone.

- [ ] `types.ts:643` — `columnSizingInfo` still listed in the state-key union
- [ ] `hooks/useMRT_TableInstance.ts:115,166,193` — state read, initial state, and derived value
- [ ] `hooks/useMRT_TableInstance.ts:254` — `onColumnSizingInfoChange` → `onColumnSizingChange`
- [ ] `components/head/MRT_TableHeadCellResizeHandle.tsx:25,45,58` — `setColumnSizingInfo` call
- [ ] `components/menus/MRT_ColumnActionMenu.tsx:59,87` — `setColumnSizingInfo` call
- [ ] `components/body/MRT_TableBodyCell.tsx:72` — state read
- [ ] `components/head/MRT_TableHeadCell.tsx:60` — state read
- [ ] `components/table/MRT_Table.tsx:34` — state read

Confirm `columnResizing` carries the same fields MRT reads (`isResizingColumn`, deltas).
Not yet verified.

---

## 3. `sortingFns` table option removed

The option is now `sortFns`. The exported fn map was already renamed; the option was not.

- [ ] `hooks/useMRT_TableOptions.ts:115`
- [ ] `utils/column.utils.ts:50`

---

## 4. `FilterFns` / `AggregationFns` are closed types

Both lost their index signature, so MRT's custom keys (`fuzzy`, `between`, etc.) no longer
index. v9 expects module augmentation or `constructFilterFn` / `constructAggregationFn`.

- [ ] `utils/column.utils.ts:82` — indexing `FilterFns` by `MRT_FilterOption`; `.fuzzy` missing
- [ ] `utils/column.utils.ts:75` — indexing `AggregationFns` by string
- [ ] `hooks/useMRT_TableInstance.ts:258` — indexing `FilterFns` by `MRT_FilterOption`
- [ ] `utils/column.utils.ts:69` — MRT aggregation fns use the v8 positional signature;
      `AggregationFnDef` has no call signature. `MRT_AggregationFn` is mapped wrong.
- [ ] `utils/column.utils.ts:89` — `@ts-expect-error` now unused; remove once 82 is fixed
- [ ] `fns/aggregationFns.ts` — spreads `aggregationFns`; untouched, needs review
- [ ] `fns/filterFns.ts:182` — `MRT_FilterFns` spreads `filterFns` then adds custom keys

Module augmentation of `FilterFns` / `AggregationFns` fixes most of this in one place.

---

## 5. Storybook 10 (independent of TanStack)

54 `TS2307` errors: stories import `type Meta` from `@storybook/react`, which is not a
dependency at any version here. Only `@storybook/react-vite` is installed.

- [ ] Repoint every `from '@storybook/react'` in `stories/**` to `'@storybook/react-vite'`

---

## Unverified

- [ ] `constructRow` call site still passes v8 positional args
      (`table, 'mrt-row-create', originalRow, rowIndex, depth, subRows, parentId`) —
      `utils/tanstack.helpers.ts:51`. Signature not checked against v9.
- [ ] `@tanstack/match-sorter-utils` 9.1.2: `rankItem` / `rankings` / `compareItems` /
      `RankingInfo` surface never checked for breaking changes.
- [ ] `components/buttons/MRT_RowPinButton.tsx` — imports `RowPinningPosition`; still
      exported by v9 core, but semantics not checked.
- [ ] Runtime behaviour. The typecheck is the only signal used so far; no build, no tests.
- [ ] `enablePinning` split into `enableColumnPinning` / `enableRowPinning` — no error yet,
      so MRT may not surface it; confirm.

---

## Reference

- Upgrade 9.0.0 → 9.1.2 added infinite pagination page sizes (#6526) and four fixes,
  including built-in fn names in the legacy column helper (#6521). No breaking changes.
