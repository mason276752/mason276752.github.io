// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // User site: served from the domain root, so no `base`.
  site: 'https://mason276752.github.io',
  markdown: {
    // Light by default; global.css switches to the dark theme in dark mode.
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
});
