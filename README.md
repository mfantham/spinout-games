# spinout-games

## Spinout app

The playable app lives in `spinout/`.

### Local checks

From `spinout/`:

- `npm ci`
- `npm test`
- `npm run build`

### Deno / Deno Deploy

Per the current Deno docs, Deno auto-discovers `deno.json` from the working directory, and Deno Deploy reads repo-root `deno.json` settings for deploy configuration. This repository now keeps:

- `deno.json` for repo-root Deno Deploy configuration
- `spinout/deno.json` for local app tasks

The repo-root config tells Deno Deploy to treat this as a static site and to:

- run `deno task build`
- publish `spinout/dist`

This avoids relying on Deno Deploy auto-detecting a subdirectory app config.

If you need to enter the settings manually in Deno Deploy, use:

- Runtime: `static`
- Build command: `deno task build`
- Static directory: `spinout/dist`

The app build itself is delegated to `spinout/deno.json`, where `nodeModulesDir` is set to `auto` so Deno can work cleanly with the Vite/npm toolchain.