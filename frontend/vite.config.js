import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/faucet/",
  build: {
    minify: false
  },
  plugins: [vue()],
  define: {
      "global": {},
      'process.env': {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util"
    }
  }
})
