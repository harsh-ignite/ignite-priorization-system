import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { useCardStore } from './stores/cardStore'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.mount('#app')

// Initialize card store and fetch data
try {
  const cardStore = useCardStore()
  await cardStore.fetchCards()
} catch (err) {
  console.error('Failed to initialize application:', err)
}
