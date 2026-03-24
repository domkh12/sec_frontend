import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server:{
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy vendors into separate cached chunks
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          'redux': ['@reduxjs/toolkit', 'react-redux', 'redux'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'mui-pickers': ['@mui/x-date-pickers'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          'particles': ['@tsparticles/react', '@tsparticles/slim'],
          'websocket': ['@stomp/stompjs', 'sockjs-client'],
          'forms': ['formik', 'yup'],
        }
      }
    }
  },
  esbuild: {
    // drop: ['console', 'debugger']
  },
})
