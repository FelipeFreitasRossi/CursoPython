import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    minify: false,          // desativa o LightningCSS (causa do erro)
    transformer: 'postcss'  // usa o PostCSS padrão
  }
})