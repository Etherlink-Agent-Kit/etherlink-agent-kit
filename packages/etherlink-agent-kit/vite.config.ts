import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EtherlinkKit',
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    rollupOptions: {
      external: ['viem', 'viem/accounts', 'viem/chains'],
    },
  },
  plugins: [dts({ insertTypesEntry: true })],
}); 