<script setup>
import PersonForm from '@/components/PersonForm.vue';
import { usePersonStore } from '@/stores/persons.js';
import { useRouter } from 'vue-router';

const personStore = usePersonStore();
const router = useRouter();

const addPersonHandler = async (personData) => {
  try {
    await personStore.addPerson(personData);
    router.push('/'); // Zurück zur Startseite nach dem Erstellen
  } catch (error) {
    alert('Fehler beim Erstellen der Person');
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <PersonForm @submit-person="addPersonHandler" />
      </v-col>
    </v-row>
  </v-container>
</template>