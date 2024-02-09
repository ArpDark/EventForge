import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const port=process.env.PORT||4173;
// https://vitejs.dev/config/
export default defineConfig({
  server:{
    port:4173
  },
  plugins: [react()],
})
