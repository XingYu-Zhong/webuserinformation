import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // 指定开发服务器端口号
    host: '127.0.0.1', // 指定主机地址（可以使用 '0.0.0.0' 来允许外部访问）
    open: true, // 启动时自动打开浏览器
    strictPort: true, // 如果端口被占用，则直接退出而不是尝试下一个可用端口
  },
})
