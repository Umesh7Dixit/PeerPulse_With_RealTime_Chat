import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,  //client ka port  ab 3000 pe chalega aese lekhne se
    proxy:{       //it can give CORS error
      "/api":{
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,      //because it is http not https
      }
    } 
  }
})
