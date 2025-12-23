import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ command }) => {
  let base = '/dalgety-show/'
  if (command === 'serve') {
    base = '/' // Dev server path
  }
  base = '/'
  return { 
    base: base,
    plugins: [react()],
    build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        events: resolve(__dirname, 'src/pages/events/index.html'),
        schedule: resolve(__dirname, 'src/pages/schedule/index.html'),
        membership: resolve(__dirname, 'src/pages/membership/index.html'),
        gallery: resolve(__dirname, 'src/pages/gallery/index.html'),
        contact: resolve(__dirname, 'src/pages/contact/index.html'),
        about: resolve(__dirname, 'src/pages/about/index.html'),
      }
    }
  }
  }
})
