import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  tsconfig: "./tsconfig.main.json",
  external: ['astro', '@astrojs/starlight'],
});
