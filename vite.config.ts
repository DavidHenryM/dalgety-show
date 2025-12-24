import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({  }) => {
  let base = '/dalgety-show/'
    // let base = '/' // Dev server path

  return { 
    base: base,
    plugins: [react()],
   
  }
})
