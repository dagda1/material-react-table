# Beta release

Set the version. Editing `packages/material-react-table/package.json` by hand
does the same thing. `pnpm version` hands off to `npm version`, which writes
the version then fails with `Cannot read properties of null (reading 'edgesOut')`.
Ignore that error; the version is written.

```bash
cd packages/material-react-table
pnpm version 5.0.0-beta.1 --no-git-tag-version
cd ../..
```

Publish under the `beta` dist-tag. This keeps `latest` on 4.1.0.

```bash
pnpm --filter @cutting/material-react-table publish --tag beta --no-git-checks
```

Install the beta in a consumer:

```bash
pnpm add @cutting/material-react-table@beta
```
