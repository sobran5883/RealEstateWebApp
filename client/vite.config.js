import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

<<<<<<< HEAD

export default defineConfig({
  server:{      
    proxy:{     
      '/api':{
        target:'http://localhost:3000',  
=======
// https://vitejs.dev/config/
export default defineConfig({
  server:{              //here we created a server and a proxy, we just say each time the adderss starts and includes /api at localhost 3000 at the beginning
    proxy:{             //here we create proxy so we can request to the correct address each time
      '/api':{
        target:'http://localhost:3000',  //this is not secure that's why we have to target it and say secure:false
        secure:false,
>>>>>>> db56ff28843d2741f0be970355fecec88de1175c
      },
    },
  },
  plugins: [react()],
})
