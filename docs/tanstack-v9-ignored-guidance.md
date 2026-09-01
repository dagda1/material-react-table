# TanStack v9 guidance that was skipped

Each item below was in TanStack's own migration notes or in the skills shipped
inside `node_modules/@tanstack/table-core/skills/`, was not acted on during the
migration, and later showed up as a bug found by hand in Storybook.

---

## 1. Row, cell and column methods live on a shared prototype

> "Destructuring, bare callbacks, spread, `Object.keys` and `JSON.stringify` no
> longer preserve them."

`MRT_ToggleRowActionMenuButton.tsx` called `setEditingRow({ ...row })`. In v8 the
row methods were own properties so the spread carried them; in v9 the spread
produces a plain object with the data and none of the methods.

**Symptom:** clicking Edit threw `row.getAllCells is not a function` from
`MRT_EditRowModal.tsx`.

**Fix:** pass the row itself — `setEditingRow(row)`.

**Covered by:** `src/components/modals/MRT_EditRowModal.test.tsx`

**Still to check:** no `{ ...row }`, `{ ...cell }`, `{ ...column }` or
`{ ...header }` remain in `src/`, but the same rule applies to any future code
that copies one of these objects.

---

## 2. A declaration-merged feature needs runtime installation

From `@tanstack/table-core/skills/custom-features/SKILL.md`:

> "Match every declaration-merged API with runtime installation. Types alone do
> nothing."
> "Preserve incoming state in `getInitialState`; put user state after defaults."

`mrtFeature` was declared as `const mrtFeature: TableFeature = {}` while
`TableState_FeatureMap` in `types.ts` merged 21 MRT state slices into
`TableState`. With no `getInitialState`, v9 created no store atoms for them and
`table.getState()` returned `undefined` for every one.

**Symptom:** 14 slices dead — `density`, `showColumnFilters`, `showGlobalFilter`,
`isFullScreen`, `showAlertBanner`, `showToolbarDropZone`, `columnFilterFns`,
`creatingRow`, `editingCell`, `editingRow`, `draggingColumn`, `draggingRow`,
`hoveredColumn`, `hoveredRow`. Nothing threw; each read `undefined` and fell
through to the wrong branch, so the density toggle, full-screen toggle, filter
toggle, editing and column dragging all silently did nothing.

**Fix:** `mrtFeature.getInitialState` in `src/fns/tableFeatures.ts` seeds every
MRT slice and spreads incoming `state` last.

**Covered by:** `MRT_ToggleDensePaddingButton.test.tsx`,
`MRT_ToggleFullScreenButton.test.tsx`, `MRT_ToggleFiltersButton.test.tsx`,
`MRT_EditCellTextField.test.tsx`, `MRT_TableHeadCellGrabHandle.test.tsx`

---

## 3. `row_toggleExpanded` gained a `getCanExpand` guard

v9 added `if (targetExpanded && !row_getCanExpand(row)) return;`, and
`row_getCanExpand` is `getRowCanExpand?.(row) ?? (enableExpanding && !!row.subRows.length)`.
Detail-panel rows have no `subRows`, so v9 refuses to expand them. v8 had no
guard.

**Symptom:** detail panels never open.

**Partial fix:** `useMRT_TableOptions.ts` supplies
`getRowCanExpand: () => true` when `renderDetailPanel` is set. `getCanExpand()`
is now `true`, but the toggle still does not flip `expanded` — cause not yet
isolated.

**Covered by:** `src/components/body/MRT_TableDetailPanel.test.tsx` (failing)

---

## 4. `getIsSomeRowsSelected` changed meaning — checked, no bug

In v9 it is `getSelectedRowIds().length > 0` — true when *any* row is selected,
including when all are. v8 meant "some but not all".

`MRT_SelectCheckbox.tsx:128` uses it for the header checkbox's indeterminate
state, but only in the `!isChecked` branch, so the "all selected" case never
reaches it. Behaviour is correct.

**Covered by:** `src/components/inputs/MRT_SelectCheckbox.test.tsx` (passing)

---

## 5. `table.getState()` was removed

v9 replaced it with the `table.state` property. MRT restores it in
`useMRT_TableInstance.ts` as `getState: () => reactTable.state`, and all 54 call
sites still use `getState()`.

This is a deliberate deviation to keep MRT's public API, not an oversight — but
it means MRT is carrying a shim for an API v9 deleted, and the two will drift.

---

## Related finding, not from the guide

`useTable` returns `useMemo(() => ({ ...table, options: tableOptions, state }))`.
That replaces the merged options with the raw ones passed in, so `table.options`
as MRT sees it has none of the defaults each feature contributes through
`getDefaultTableOptions` — `onExpandedChange`, `onSortingChange`,
`onColumnFiltersChange` and `paginateExpandedRows` are all absent.

Statics reached through `row.*` / `column.*` use the internal table instance and
still see the defaults, which is why sorting works. Anything reading
`table.options` directly for a feature default does not.
