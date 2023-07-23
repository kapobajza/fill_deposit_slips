import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'popup/popup.ts'),
      name: 'popup',
    },
    outDir: path.resolve(__dirname, 'popup/dist'),
  },
  mode: 'development',
});
