import { createApp } from 'vue'
import App from './App.vue'
import { IonicVue } from '@ionic/vue'
import { createAuthentication } from './iam/authentication'

// Tailwind css
import '@/style.css'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import { Router } from 'vue-router'
import { fetchConfig } from './config/fetch'
import createRouter from './router'

const config = await fetchConfig()
const router: Router = createRouter()

const app = createApp(App)

// nunununununununununununununununununununununununununununununununununununununu
//   order matters!
//   1. The authentication must come after the router has been added to the App.
// nunununununununununununununununununununununununununununununununununununununu
app.use(config)
app.use(router)

app.use(IonicVue)

//
const authenticationContext = await createAuthentication(config.AUTHENTICATION_CLIENT_OPTIONS, router)
app.use(authenticationContext)

router.isReady().then(() => {
  app.mount('#app')
})
