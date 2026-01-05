import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

let app;

onAuthStateChanged(auth, () => {
    if (!app) {
        const app = createApp(App)

        app.use(router)

        app.mount('#app')
    }
})
