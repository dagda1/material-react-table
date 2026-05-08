# MUI v9 upgrade plan

Target: bump `@mui/material` v6 → v9. Material UI core skipped v8; MUI X did **not**, so `@mui/x-date-pickers` migrates v7 → v8 → v9 sequentially. Repo is on `v3` branch, MRT version `3.2.1`.

## Strategy

Two PRs. Don't mix.

1. **Toolchain + non-MUI deps.** Bump Node, pnpm, and everything that isn't `@mui/*`. Lands first, on its own, so MUI churn is the only diff in the next PR.
2. **MUI v6 → v9.** Codemods, manual fixes, peer-dep bump, MRT major version bump.

## Current vs target

| | Current | Target | Notes |
|---|---|---|---|
| Node engines | `>=16` | `>=20` (or `>=22` LTS) | Node 16 EOL Sept 2023. Add `.nvmrc`. |
| pnpm | `9.3.0` | `10.x` | Update `packageManager` field in root `package.json`. |
| `@mui/material` | `^6.2.1` | `^9.x` | |
| `@mui/icons-material` | `^6.2.1` | `^9.x` | |
| `@mui/x-date-pickers` | `^7.23.3` | `^9.x` | Traverse v7→v8→v9. |
| `@mui/x-charts` (docs) | `^7.23.2` | `^9.x` | Docs only. |
| TypeScript | `5.7.2` | unchanged | v7 needs ≥4.9, ✓. |
| React | `19.0.0` | unchanged | ✓. v7 only requires `react-is` resolution if React<19. |
| `react-is` | `^19.0.0` | unchanged | ✓. |
| Emotion | `^11.14.0` | unchanged | No MUI v9 requirement to bump. |

## Step 1 — toolchain PR

- [ ] Root `package.json`: `engines.node` → `>=20.0.0`, `packageManager` → `pnpm@10.x.x`.
- [ ] `packages/material-react-table/package.json`: `engines.node` → `>=20`.
- [ ] Add `/.nvmrc` with the chosen Node major.
- [ ] Update GitHub Actions workflows (check `.github/workflows/*` for hardcoded Node/pnpm versions).
- [ ] Bump non-MUI deps as needed (storybook 8 → 9 if released, rollup 2 → 4, vite 6 → next, eslint plugins, turbo, faker, etc.). Keep `@mui/*` pinned.
- [ ] `pnpm install`, `pnpm lib:build`, `pnpm storybook`, `pnpm docs:build`. Bundle size still under 55 KB / 51 KB.
- [ ] Don't touch `package.json.description` ("Material UI V6") yet — that flips with step 2.

## Step 2 — MUI v6 → v9 PR

### Codemods (run in this order)

```bash
# Material core
npx @mui/codemod@latest v7.0.0/preset-safe packages/material-react-table/src
npx @mui/codemod@latest v7.0.0/preset-safe apps/material-react-table-docs
npx @mui/codemod@latest v9.0.0/preset-safe packages/material-react-table/src
npx @mui/codemod@latest v9.0.0/preset-safe apps/material-react-table-docs

# Pickers (must traverse v8)
npx @mui/x-codemod@latest v7.0.0/pickers/preset-safe packages/material-react-table/src
npx @mui/x-codemod@latest v8.0.0/pickers/preset-safe packages/material-react-table/src
npx @mui/x-codemod@latest v9.0.0/pickers/preset-safe packages/material-react-table/src
# repeat the three pickers codemods for apps/material-react-table-docs if it imports them
```

Verify each codemod's docs page exists before running — `preset-safe` is the typical name but per-codemod fallbacks (`v9.0.0/<component>-props`) may be needed.

### Breaking changes that actually hit this repo

Audited 2026-05-08. Items in the official guides that **don't** apply (no action needed): deep imports, `Hidden`, `onBackdropClick`, `disableEscapeKeyDown`, `createMuiTheme`, `experimentalStyled`, `InputLabel size="normal"`, `TablePaginationActions` import path, `@mui/lab`, `Grid`/`Grid2`/`GridLegacy`, Box system shorthand props.

What does apply:

- **`componentsProps` → `slotProps`** — one site: `packages/material-react-table/src/components/menus/MRT_ShowHideColumnsMenuItems.tsx`. Codemod handles it.
- **`PaperProps` type** in `src/types.ts:53` and `src/components/table/MRT_TablePaper.tsx` — type still exists in v9, but verify it isn't deprecated in favour of slot-based typing.
- **`muiTablePaperProps` public API** (`MRT_TablePaperProps` extends `PaperProps`) — confirm `PaperProps` shape unchanged across v6→v9. If it changed, this is a breaking API change for MRT consumers and needs a release note.
- **`TablePagination` Intl.NumberFormat** — `MRT_TablePagination.tsx` rendered numbers will format per-locale by default. Update snapshots / Storybook stories. Library may need an opt-out for users with custom formatting.
- **`ListItemIcon` min-width 56 → 36 px** — visual diff possible in any column-show-hide menu / select-row icons. Spot-check Storybook.
- **`*Outline` → `*Outlined` icon aliases (23 removed)** — grep `@mui/icons-material/.*Outline\b` to confirm none used.
- **Pickers v7→v8 mandatory accessible DOM** — `MRT_FilterTextField.tsx` builds custom date-picker filter via `slots.field` etc. The v8 change is that field-slot components no longer receive `InputProps`/refs directly; use `usePickerContext()`. Read this file carefully before/after codemod.
- **Pickers v8→v9 `PickersDay` → `PickerDay`, theme key `MuiPickersDay` → `MuiPickerDay`** — check `types.ts` for any theme augmentation referencing the old key.
- **Pickers v9 TextField slotProps migration** — `InputProps`/`inputProps`/`InputLabelProps`/`FormHelperTextProps` collapse into `slotProps`. Hits `MRT_FilterTextField.tsx`.
- **MRT public API `muiFilterTextFieldProps` / `muiSelectCheckboxProps` / etc.** — these expose MUI prop types directly to consumers. Anywhere v9 changed the underlying prop shape, MRT's public types change. Inventory before merging.

### Hot-spot files

- `src/types.ts` — 25 MUI imports; theme augmentation, slot type re-exports, public-API prop types.
- `src/components/inputs/MRT_FilterTextField.tsx` — pickers + TextField slotProps collide here.
- `src/components/menus/MRT_ShowHideColumnsMenuItems.tsx` — `componentsProps` site.
- `src/components/table/MRT_TablePaper.tsx` — `PaperProps` extension.
- `src/components/toolbar/MRT_TablePagination.tsx` — Intl number formatting.

### Peer / dev deps after migration

```jsonc
// packages/material-react-table/package.json
"peerDependencies": {
  "@emotion/react": ">=11.14",
  "@emotion/styled": ">=11.14",
  "@mui/icons-material": ">=9",
  "@mui/material": ">=9",
  "@mui/x-date-pickers": ">=9",
  "react": ">=19.0",
  "react-dom": ">=19.0"
}
```

Decide before merge:
- **Drop v6/v7 support entirely, or keep a v6 maintenance branch?** Peer deps `>=9` strand all v6/v7 consumers. The current `v3` branch already moved to React 19 + MUI 6, so dropping is consistent with project history.
- **MRT version bump**: `4.0.0`. Peer-dep tightening + pickers public-type changes are breaking.

## Verification checklist

- [ ] `pnpm lint` — no type errors.
- [ ] `pnpm lib:build` — bundle ≤ 55 KB main / 51 KB ESM.
- [ ] `pnpm storybook:build` — all stories render.
- [ ] `pnpm docs:build && pnpm docs:start` — docs site loads, examples work.
- [ ] Manual smoke: filter row with date picker, column show/hide menu, pagination, row selection, grouping.
- [ ] Update `package.json.description` to "Material UI V9".
- [ ] CHANGELOG entry with peer-dep changes and any public type changes.

## References

- [Material UI v7 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [Material UI v9 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v9/)
- [Date Pickers v6→v7](https://mui.com/x/migration/migration-pickers-v6/)
- [Date Pickers v7→v8](https://mui.com/x/migration/migration-pickers-v7/)
- [Date Pickers v8→v9](https://mui.com/x/migration/migration-pickers-v8/)
