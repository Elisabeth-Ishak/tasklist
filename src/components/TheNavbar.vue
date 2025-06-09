<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-theme']);

const drawer = ref(false) // Für mobile Navigation
</script>

<template>
  <v-app-bar app color="indigo" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none"></v-app-bar-nav-icon>
    <v-app-bar-title>Taskliste</v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Buttons für die Desktop-Ansicht -->
    <div class="d-none d-lg-flex">
      <v-btn to="/" text>
        <v-icon start>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn to="/create" text>
        <v-icon start>mdi-plus-box</v-icon>
        Add Task
      </v-btn>

      <!-- HIER IST DER NEUE BUTTON FÜR "PERSON HINZUFÜGEN" -->
      <v-btn to="/create-person" text>
        <v-icon start>mdi-account-plus</v-icon>
        Add Person
      </v-btn>
    </div>

    <v-btn icon @click="emit('toggle-theme')">
      <v-icon>mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>

  <!-- Navigation Drawer für kleinere Bildschirme (Mobile) -->
  <v-navigation-drawer v-model="drawer" app temporary>
    <v-list nav dense>
      <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
      <v-list-item prepend-icon="mdi-plus-box" title="Add Task" to="/create"></v-list-item>
      
      <!-- HIER IST DER NEUE EINTRAG FÜR DIE MOBILE NAVIGATION -->
      <v-list-item prepend-icon="mdi-account-plus" title="Add Person" to="/create-person"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-btn {
  margin: 0 4px;
}
</style>