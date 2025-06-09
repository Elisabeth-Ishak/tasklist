<script setup>
import { ref, watch, onMounted, computed } from 'vue'; 
import { useRouter } from 'vue-router';
import { usePersonStore } from '@/stores/persons.js';

const props = defineProps(['task']); 
const emit = defineEmits(['submit-task']);

const router = useRouter();
const personStore = usePersonStore();

const title = ref('');
const dueDate = ref('');
const personId = ref(null);
const form = ref(null);

const titleRules = [
  value => !!value || 'Titel ist erforderlich.',
  value => (value && value.length <= 100) || 'Titel darf maximal 100 Zeichen lang sein.',
];
const dueDateRules = [
  value => !!value || 'Enddatum ist erforderlich.',
];

const personOptions = computed(() => {
  return personStore.persons.map(person => ({
    title: `${person.firstname} ${person.lastname}`,
    value: person.id,
  }));
});

onMounted(() => {
  if (personStore.persons.length === 0) {
    personStore.getPersons();
  }
});

watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      title.value = newTask.title || '';
      personId.value = newTask.personId || null;
      if (newTask.dueDate) {
        const date = new Date(newTask.dueDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        dueDate.value = `${year}-${month}-${day}`;
      } else {
        dueDate.value = '';
      }
    } else {
      title.value = '';
      dueDate.value = '';
      personId.value = null;
    }
  },
  { immediate: true },
);

const submitHandler = async () => {
  if (form.value) {
    const { valid } = await form.value.validate();
    if (!valid) {
      return;
    }
  }

  emit('submit-task', {
    title: title.value,
    dueDate: dueDate.value,
    isDone: props.task ? props.task.isDone : false,
    personId: personId.value,
  });

  if (!props.task && form.value) {
    form.value.reset();
    form.value.resetValidation(); // Auch Validierung zurücksetzen
    title.value = ''; 
    dueDate.value = '';
    personId.value = null;
  }
};

const cancel = () => {
  router.push('/');
}
</script>

<template>
  <v-card class="pa-4" flat>
    <v-card-title class="text-h5 mb-4">
      {{ props.task ? 'Task bearbeiten' : 'Neuen Task erstellen' }}
    </v-card-title>
    <v-form @submit.prevent="submitHandler" ref="form">
      <v-text-field
        v-model="title"
        label="Titel"
        :rules="titleRules"
        required
        variant="outlined"
        class="mb-3"
      ></v-text-field>

      <v-autocomplete
        v-model="personId"
        :items="personOptions"
        label="Zuständige Person"
        :rules="[v => !!v || 'Eine Person muss ausgewählt werden.']"
        required
        variant="outlined"
        class="mb-3"
        item-title="title"
        item-value="value"
        no-data-text="Keine Personen gefunden. Erstelle zuerst eine."
      ></v-autocomplete>

      <v-text-field
        v-model="dueDate"
        label="Enddatum"
        type="date"
        :rules="dueDateRules"
        required
        variant="outlined"
        class="mb-3"
      ></v-text-field>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="cancel" variant="text">Abbrechen</v-btn>
        <v-btn type="submit" color="primary" variant="elevated">
          {{ props.task ? 'Speichern' : 'Hinzufügen' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>