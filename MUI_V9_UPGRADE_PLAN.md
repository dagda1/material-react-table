# MUI v9 fork plan

This is a **maintenance fork** of [`material-react-table`](https://github.com/KevinVandy/material-react-table) by Kevin Vandy. The upstream project appears unmaintained and Material UI v9 broke compatibility. The goal of this fork is to keep the library working — nothing else. All design, architecture, and the overwhelming majority of the code remain his.

Target: bump `@mui/material` v6 → v9 in the library package only. Repo is on `v3` branch, MRT version `3.2.1` → will publish as `4.0.0` under a new scoped npm name.

## Scope decisions

**In scope:**
- `packages/material-react-table` — library code, types, Storybook stories.
- Republishing under a new scoped npm name.
- README rewritten as a tribute + redirect to upstream docs.

**Out of scope (demolished):**
- `apps/material-react-table-docs` — full Next.js docs site. Deleted. Users go to the original `material-react-table.com` for prose docs.
- `upgrade-examples.sh` and any example sandboxes inside the docs app — deleted with the docs.
- `@mui/x-charts` migration — only used by the docs app.
- Mirroring or maintaining prose documentation. Storybook is the only live example surface.
- Toolchain bumps (Node, pnpm, TypeScript) — already landed in recent commits (`c6d97a4f5`, etc.).

**Deferred:**
- Date-picker filter migration (`MRT_FilterTextField.tsx`) — costliest single file. If end consumers don't need the date-picker filter, this can be stubbed out and revisited; otherwise it's blocking.

## Current vs target

| | Current | Target | Notes |
|---|---|---|---|
| `@mui/material` | `^6.2.1` | `^9.x` | |
| `@mui/icons-material` | `^6.2.1` | `^9.x` | |
| `@mui/x-date-pickers` | `^7.23.3` | `^9.x` | Codemods traverse v7→v8→v9. |
| Node engines | `>=24` | unchanged | Already done. |
| pnpm | `10.x` | unchanged | Already done. |
| TypeScript | `6.0.3` | unchanged | Already done. |
| React | `19.0.0` | unchanged | ✓. |
| Emotion | `^11.14.0` | unchanged | No MUI v9 requirement to bump. |
| Storybook | `^8.4.7` | unchanged unless it breaks | Storybook 8 renders MUI 9 fine; don't bump unless forced. |

## Step 1 — demolition

- [ ] `rm -rf apps/material-react-table-docs`
- [ ] `rm -f upgrade-examples.sh`
- [ ] If `apps/` is now empty, `rm -rf apps/`
- [ ] Remove `apps/*` entry from `pnpm-workspace.yaml`
- [ ] Remove docs-related tasks from `turbo.json` (anything referencing `docs:*`)
- [ ] Remove `docs:*` scripts from root `package.json`
- [ ] `pnpm install` to refresh the lockfile

## Step 2 — bump non-MUI deps

Single commit, library `devDependencies` only. Get the toolchain current before MUI touches anything so MUI is the only suspect when things break later.

- [ ] `rollup` `^2.79.1` → `^4.x`
- [ ] `vite` `^6.0.5` → latest
- [ ] `@vitejs/plugin-react` → latest matching vite
- [ ] `storybook` + all `@storybook/*` `^8.4.7` → `^9.x` via `npx storybook@latest upgrade` (runs the official Storybook codemods for config, story format, and addon migrations — don't hand-edit). Bump `storybook-dark-mode` and `eslint-plugin-storybook` separately to matching versions.
- [ ] `@faker-js/faker` `^9.3.0` → `^10.x`
- [ ] `eslint`, `@typescript-eslint/*`, `eslint-plugin-perfectionist`, `eslint-plugin-mui-path-imports` → latest
- [ ] `@types/node`, `@types/react`, `@types/react-dom` → latest matching node/react majors
- [ ] `@rollup/plugin-typescript`, `rollup-plugin-*`, `tslib`, `size-limit`, `@size-limit/preset-small-lib` → latest
- [ ] Leave `@mui/*`, `@emotion/*`, `react`, `react-dom`, `react-is`, `typescript` alone — those are pinned by separate concerns.
- [ ] `pnpm install`, `pnpm --filter material-react-table lib:build`, `pnpm --filter material-react-table storybook:build`. Everything must still pass on MUI 6 before moving to Step 3.

## Step 3 — library migration

### Codemods (run in order, library only)

```bash
# Material core
npx @mui/codemod@latest v7.0.0/preset-safe packages/material-react-table/src
npx @mui/codemod@latest v9.0.0/preset-safe packages/material-react-table/src

# Pickers (must traverse v8)
npx @mui/x-codemod@latest v7.0.0/pickers/preset-safe packages/material-react-table/src
npx @mui/x-codemod@latest v8.0.0/pickers/preset-safe packages/material-react-table/src
npx @mui/x-codemod@latest v9.0.0/pickers/preset-safe packages/material-react-table/src
```

Verify each codemod's docs page exists before running — `preset-safe` is the typical name but per-codemod fallbacks (`v9.0.0/<component>-props`) may be needed.

### Breaking changes that apply

Audited 2026-05-08. Items in the official guides that **don't** apply (no action needed): deep imports, `Hidden`, `onBackdropClick`, `disableEscapeKeyDown`, `createMuiTheme`, `experimentalStyled`, `InputLabel size="normal"`, `TablePaginationActions` import path, `@mui/lab`, `Grid`/`Grid2`/`GridLegacy`, Box system shorthand props.

What does apply:

- **`componentsProps` → `slotProps`** — one site: `MRT_ShowHideColumnsMenuItems.tsx`. Codemod handles it.
- **`PaperProps` type** in `types.ts:53` and `MRT_TablePaper.tsx` — type still exists in v9, verify it isn't deprecated in favour of slot-based typing.
- **`muiTablePaperProps` public API** (`MRT_TablePaperProps` extends `PaperProps`) — confirm `PaperProps` shape unchanged across v6→v9. If changed, this is a breaking API change for fork consumers; note in README.
- **`TablePagination` Intl.NumberFormat** — rendered numbers format per-locale by default in v9. Update Storybook stories.
- **`ListItemIcon` min-width 56 → 36 px** — visual diff possible in column-show-hide menu / select-row icons. Spot-check Storybook.
- **`*Outline` → `*Outlined` icon aliases (23 removed)** — grep `@mui/icons-material/.*Outline\b` to confirm none used.
- **Pickers v7→v8 mandatory accessible DOM** — `MRT_FilterTextField.tsx` builds custom date-picker filter via `slots.field` etc. The v8 change is that field-slot components no longer receive `InputProps`/refs directly; use `usePickerContext()`. Read this file carefully before/after codemod.
- **Pickers v8→v9 `PickersDay` → `PickerDay`, theme key `MuiPickersDay` → `MuiPickerDay`** — check `types.ts` for theme augmentation referencing the old key.
- **Pickers v9 TextField slotProps migration** — `InputProps`/`inputProps`/`InputLabelProps`/`FormHelperTextProps` collapse into `slotProps`. Hits `MRT_FilterTextField.tsx`.
- **MRT public API `muiFilterTextFieldProps` / `muiSelectCheckboxProps` / etc.** — these expose MUI prop types directly to consumers. Anywhere v9 changed the underlying prop shape, the fork's public types change. Inventory before publishing.

### Hot-spot files

- `src/types.ts` — 25 MUI imports; theme augmentation, slot type re-exports, public-API prop types.
- `src/components/inputs/MRT_FilterTextField.tsx` — pickers + TextField slotProps collide here. Costliest single file.
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

MRT version bump: `4.0.0`. Peer-dep tightening + pickers public-type changes are breaking.

## Step 4 — publishing prep

`packages/material-react-table/package.json` field changes:

- [ ] `name` → new scoped name (e.g. `@<yourscope>/material-react-table`). **Do not reuse the unscoped `material-react-table` name on npm** — it belongs to Kevin's package.
- [ ] `description` → "Material UI V9 maintenance fork of material-react-table — a fully featured Material UI implementation of TanStack React Table V8."
- [ ] `author` → fork maintainer.
- [ ] `contributors` → `[{ "name": "Kevin Vandy", "url": "https://github.com/KevinVandy" }]`.
- [ ] `homepage` → remove or point at Storybook static deploy URL once available. **Do not leave it pointing at `material-react-table.com`** — that's Kevin's site.
- [ ] `repository.url` → fork URL.
- [ ] `bugs.url` → fork URL.
- [ ] `funding` → **remove** the field. The fork shouldn't solicit sponsorship under Kevin's name; the sponsor link belongs in the README as gratitude, not in npm metadata.

## Step 5 — README rewrite

Lead with a tribute, not a credits footer. Required content:

- **Banner (top of file):** "Maintenance fork of [`material-react-table`](https://github.com/KevinVandy/material-react-table) by [Kevin Vandy](https://github.com/KevinVandy). Kevin built a remarkable library — a fully-featured, deeply-typed Material UI data table on top of TanStack Table, more or less single-handed, with documentation that set the bar for the React table ecosystem. This fork exists only because the project appears unmaintained and MUI v9 broke compatibility. All credit for the design, architecture, and the overwhelming majority of the code belongs to him. If you're using this fork, please [sponsor his work](https://github.com/sponsors/kevinvandy)."
- **For documentation:** redirect to `material-react-table.com`. No prose mirrored here.
- **Why this fork exists:** one short paragraph. MUI v9, no new features.
- **Install:** snippet under the new scoped name.
- **What's different from upstream:** bullet list — package name, peer-dep floors raised to MUI 9 / pickers 9, anything public-type the migration forced.
- **Caveats:** docs site not mirrored, examples sandboxes removed, Storybook is the only live example surface, fork issues go to fork repo not upstream.
- **License:** MIT, original © Kevin Vandy.

Under 200 lines total. This is a redirect with install instructions, not a docs site.

## Verification checklist

- [ ] `pnpm --filter material-react-table lint` — no type errors.
- [ ] `pnpm --filter material-react-table lib:build` — succeeds. Bundle size ≤ 55 KB main / 51 KB ESM (nice-to-have, don't gate).
- [ ] `pnpm --filter material-react-table storybook:build` — all stories render.
- [ ] Manual smoke (in Storybook): column show/hide menu, pagination, row selection, grouping. Date-picker filter only if not stubbed.
- [ ] `npm publish --dry-run` from `packages/material-react-table` — verify `name`, `version`, `files`, peer deps look right before the real publish.

## References

- [Material UI v7 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v7/)
- [Material UI v9 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v9/)
- [Date Pickers v6→v7](https://mui.com/x/migration/migration-pickers-v6/)
- [Date Pickers v7→v8](https://mui.com/x/migration/migration-pickers-v7/)
- [Date Pickers v8→v9](https://mui.com/x/migration/migration-pickers-v8/)
