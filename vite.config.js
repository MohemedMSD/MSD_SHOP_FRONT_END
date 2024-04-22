import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip', // يمكنك اختيار 'gzip' أو 'brotliCompress'
      ext: '.gz', // لاحقة الملفات المضغوطة، يمكنك استخدام '.br' لـ Brotli
      threshold: 10240, // الحد الأدنى لحجم الملف قبل الضغط (بالبايت)
      // يمكنك تحديد إعدادات إضافية هنا
    }),
  ],
  build: {
    minify: 'terser', // Use terser for minification
    terserOptions: {
        // Optional Terser options for further customization
        compress: {
            drop_console: true, // Drop console statements
        },
    },
  },
})
