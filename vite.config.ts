import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { Server } from 'socket.io'

const socketio = () => ({
  name: 'socket-io-server',
  configureServer(server) {
    const io = new Server(server.httpServer)
    io.on('connection', (socket) => {
      socket.on('message', (payload) => {
          const { message, name } = payload
          io.emit('message', { message, name, date: new Date() })
      })
      socket.on('file', (payload) => {
        const { name, file, fileArrayBuffer } = payload
        io.emit('file', { name, date: new Date(), file, fileArrayBuffer })
      })
    })
  }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    }),
    socketio(),
  ],
  server: {
    host: true,
  },
})
