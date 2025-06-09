<script setup>
import { usePersonStore } from '@/stores/persons.js';
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import PersonForm from '@/components/PersonForm.vue';

const personStore = usePersonStore();
const router = useRouter();
const route = useRoute();

const personId = route.params.id; // ID aus der URL holen
const person = ref(null);
const loading = ref(true);

onMounted(async () => {
  // Lade die spezifische Person vom Server
  const foundPerson = await personStore.getPersonById(personId);
  if (foundPerson) {
    person.value = foundPerson;
  } else {
    // Wenn Person nicht gefunden wurde, zurück zur Startseite
    console.error(`Person mit ID ${personId} nicht gefunden.`);
    router.push('/');
  }
  loading.value = false;
});

const handleSubmit = async (updatedPersonData) => {
  try {
    await personStore.updatePersonById(personId, updatedPersonData);
    router.push('/'); // Nach dem Speichern zurück zur Startseite
  } catch (error) {
    alert('Fehler beim Aktualisieren der Person');
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
        <!-- Übergebe die Person-Daten als Prop an die Form -->
        <PersonForm v-if="!loading && person" :person="person" @submit-person="handleSubmit" />
        <div v-if="!loading && !person">Person nicht gefunden.</div>
      </v-col>
    </v-row>
  </v-container>
</template>