<script setup>
import { ref } from 'vue'

const emit = defineEmits(['toggle-theme']);

const drawer = ref(false) // Für mobile Navigation
</script>

<template>
  <v-app-bar app color="indigo" dark>
    <v-app-bar-nav-icon @click="drawer = !drawer" class="d-lg-none">
    </v-app-bar-nav-icon>
    <v-app-bar-title>Taskliste</v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Buttons für die Desktop-Ansicht -->
    <div class="d-none d-lg-flex">
      <v-btn to="/" text>
        <v-icon start>mdi-home</v-icon>
        Home
      </v-btn>
       <!-- NEUEN BUTTON FÜR PERSONEN-ÜBERSICHT HINZUFÜGEN -->
  <v-btn to="/persons" text>
    <v-icon start>mdi-account-group</v-icon>
    Personen
  </v-btn>
  <v-btn to="/create" text>
    <v-icon start>mdi-plus-box</v-icon>
    Add Task
  </v-btn>
  <v-btn to="/create-person" text>
    <v-icon start>mdi-account-plus</v-icon>
    Add Person
  </v-btn>
</div>
<!-- AUCH FÜR MOBILE ANPASSEN -->
<v-navigation-drawer v-model="drawer" app temporary>
  <v-list nav dense>
    <v-list-item prepend-icon="mdi-home" title="Home" to="/"></v-list-item>
    <!-- NEUEN EINTRAG HINZUFÜGEN -->
    <v-list-item prepend-icon="mdi-account-group" title="Personen" to="/persons"></v-list-item>
    <v-list-item prepend-icon="mdi-plus-box" title="Add Task" to="/create"></v-list-item>
    <v-list-item prepend-icon="mdi-account-plus" title="Add Person" to="/create-person"></v-list-item>
  </v-list>
</v-navigation-drawer>
  </v-app-bar>
<!-- ... -->
</template>

<style scoped>
.v-btn {
  margin: 0 4px;
}
</style>