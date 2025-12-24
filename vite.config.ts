import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({  }) => {
  let base = '/dalgety-show/'
  // if (command === 'serve') {
  //   base = '/' // Dev server path
  // }

  return { 
    base: base,
    plugins: [react()],
    build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, './home/index.html'),
        events: resolve(__dirname, './events/index.html'),
        schedule: resolve(__dirname, './schedule/index.html'),
        membership: resolve(__dirname, './membership/index.html'),
        gallery: resolve(__dirname, './gallery/index.html'),
        contact: resolve(__dirname, './contact/index.html'),
        about: resolve(__dirname, './about/index.html'),
      },
      output:{

      }
    }
  }
  }
})
