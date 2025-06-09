// main.js
import './assets/main.css' // Behalte deine Basis-CSS, aber entferne Bootstrap-spezifische Dinge daraus

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' // Stelle sicher, dass dies importiert wird

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light', // Kann 'light' oder 'dark' sein
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2', // Beispiel-Primärfarbe
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#2196F3',
          secondary: '#424242', // Anpassbare Farben für den Dark Mode
        }
      }
    }
  }
})

app.use(createPinia())
app.use(router)
app.use(vuetify) // Vuetify Plugin verwenden

app.mount('#app')