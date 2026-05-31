# spinout-games

## Spinout Puzzle

A puzzle game built with [Deno Fresh](https://fresh.deno.dev/) and [Preact](https://preactjs.com/).

### Getting started

Make sure you have [Deno](https://deno.com/) installed.

```sh
# Start the development server
deno task dev

# Run tests
deno test -A

# Build for production
deno task build

# Start the production server
deno task start
```

### Deploying to Deno Deploy

1. Push your changes to GitHub.
2. [Create a Deno Deploy project](https://console.deno.com/new).
3. Select your GitHub repository.
4. Set the build command to `deno task build` and the entrypoint to `_fresh/server.js`.
5. The project will be deployed automatically.

### Project structure

```
├── main.ts              # Fresh app entry point
├── vite.config.ts       # Vite configuration with Fresh plugin
├── deno.json            # Deno/Fresh configuration
├── routes/
│   ├── _app.tsx         # HTML shell (layout)
│   └── index.tsx        # Home page
├── islands/
│   └── SpinoutGame.tsx  # Interactive game island (client-side)
├── components/
│   ├── Controls.tsx     # Game controls (Hint, Undo, Reset)
│   ├── Dial.tsx         # Individual dial component
│   ├── DialBar.tsx      # Dial bar with all 7 dials
│   └── Leaderboard.tsx  # Local leaderboard
├── lib/
│   ├── grayCode.ts      # Game logic (movement rules, hints)
│   └── useSpinout.ts    # Game state hook
└── assets/
    └── styles.css       # Application styles
```