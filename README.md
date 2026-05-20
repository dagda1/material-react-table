# @cutting/material-react-table

A maintenance fork of [`material-react-table`](https://github.com/KevinVandy/material-react-table) by [Kevin Vandy](https://github.com/KevinVandy), updated for Material UI v9.

<a href="https://npmjs.com/package/@cutting/material-react-table" target="_blank">
  <img alt="" src="https://badgen.net/npm/v/@cutting/material-react-table?color=blue" />
</a>
<a href="https://github.com/dagda1/material-react-table/blob/main/LICENSE" target="_blank">
  <img alt="" src="https://badgen.net/github/license/dagda1/material-react-table?color=blue" />
</a>
<a href="https://github.com/sponsors/kevinvandy" target="_blank" rel="noopener">
  <img alt="" src="https://img.shields.io/badge/sponsor%20Kevin-violet" />
</a>

## About this fork

Kevin Vandy built a remarkable library: a fully-featured, deeply-typed Material UI data table on top of TanStack Table, more or less single-handed, with documentation that set the bar for the React table ecosystem. This fork exists solely because the upstream project appears unmaintained and Material UI v9 broke compatibility. All credit for the design, architecture, and the overwhelming majority of the code belongs to Kevin.

If you are using this fork, please [sponsor Kevin's original work](https://github.com/sponsors/kevinvandy). That is the appropriate way to thank the person whose effort you are actually relying on.

## Documentation

The library's API, examples, and guides are unchanged from upstream. Use the original documentation site:

**https://www.material-react-table.com**

Everything in the upstream docs applies to this fork, with two exceptions noted below.

## What's different from upstream

- **Package name:** `@cutting/material-react-table` (scoped), not `material-react-table`.
- **Peer dependency floors raised:**
  - `@mui/material >=9`
  - `@mui/icons-material >=9`
  - `@mui/x-date-pickers >=9`
- **TextField slot props:** the `muiFilterTextFieldProps`, `muiEditTextFieldProps`, `muiSearchTextFieldProps`, and similar public APIs now expose the v9 `slotProps` shape (`input`, `htmlInput`, `select`, etc.) instead of the removed `InputProps` / `inputProps` / `SelectProps` props.
- **Menu slot props:** `muiMenuProps` (and equivalents) use `slotProps.list` instead of the removed `MenuListProps`.

If your consuming app is on Material UI v9 already, those are the only call sites that should need adjustment.

## Installation

```bash
npm install @cutting/material-react-table
```

Peer dependencies:

```bash
npm install @mui/material @mui/icons-material @mui/x-date-pickers @emotion/react @emotion/styled
```

Requires React 19 or later.

## Usage

API is identical to upstream. Only the import path changes:

```tsx
import {
  MaterialReactTable,
  useMaterialReactTable,
} from '@cutting/material-react-table';
```

See the [upstream usage guide](https://www.material-react-table.com/docs/getting-started/usage) for the full example.

## Caveats

- The upstream documentation site is **not mirrored** here. Use material-react-table.com.
- The upstream example sandboxes and Next.js docs app are not included in this fork.
- Storybook is the only live example surface in this repository. To run it locally: `pnpm storybook`.
- Bug reports and feature requests for this fork go to [github.com/dagda1/material-react-table/issues](https://github.com/dagda1/material-react-table/issues), **not** Kevin's repo.
- This fork does not add features. Its scope is keeping the library working on current Material UI.

## License

MIT.

Original work © [Kevin Vandy](https://github.com/KevinVandy). Fork maintenance © Paul Cowan.
