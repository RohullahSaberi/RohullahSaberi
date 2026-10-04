# Profile illustrations

The files in `assets/` are generated, standalone SVG images. Their CSS is
embedded because external stylesheets cannot be relied on in README images.

Edit these sources, then run `node tools/build-svg.mjs` from the repository root:

- `scenes/*.svg`: desktop composition and named components shared with mobile.
- `mobile.mjs`: compact compositions, using the same components.
- `styles.css`: common styling, animation, and reduced-motion behavior.
- `themes.json`: light and dark palettes.

Run `node tools/build-svg.mjs --check` to verify that checked-in assets match
the sources. The generator requires Node.js 18 or newer and no packages.

The README selects the compact assets at viewport widths of 600px or less.
Keep the mobile sources ahead of the desktop sources in each `<picture>`.
Review both themes, narrow and wide viewports, and reduced motion after edits.

Connected components remain stationary. Base wires are continuous and their
endpoints touch component edges; the animated packets use those same paths.
Motion is retained for data packets, chart bars, scanners, and decorative details.
