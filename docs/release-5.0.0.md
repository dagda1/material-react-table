# Release 5.0.0

From `update-tanstack-9-1` with a clean tree, push it to a new `v5` branch:

```bash
git push origin HEAD:v5
```

On GitHub, open the repo **Settings → General → Default branch**. Switch it
to `v5` and confirm.

Update the local default branch and check out `v5`:

```bash
git fetch origin
git remote set-head origin -a
git checkout v5
```

Publish from `v5` with the git checks on. With no dist-tag flag, the version
goes to `latest`. `publishBranch: v5` in `pnpm-workspace.yaml` (and
`publish-branch=v5` in `.npmrc` for older pnpm) makes pnpm prompt on any
other branch, and the publish fails if you decline. `prepublishOnly` builds
and tests first.

```bash
pnpm --filter @cutting/material-react-table publish
```

Verify that `latest` is `5.0.0`:

```bash
npm view @cutting/material-react-table dist-tags
```

The output shows `latest: '5.0.0'`.

Install in a consumer:

```bash
pnpm add @cutting/material-react-table
```
