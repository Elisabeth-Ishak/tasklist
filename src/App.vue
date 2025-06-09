<script setup>
import TheNavbar from '@/components/TheNavbar.vue' 
import { useTheme } from 'vuetify'
import { useRoute } from 'vue-router'

const theme = useTheme()
const route = useRoute()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <v-app>
    <TheNavbar @toggle-theme="toggleTheme" />
    <v-main>
      <v-container fluid> 
        <RouterView :key="route.path" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  padding-top: 64px;
}
</style>