<script setup>
import { useItemStore } from '@/stores/tasks.js'; // Sicherstellen, dass der Pfad stimmt
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import TaskForm from '@/components/TaskForm.vue';

// props definieren, um die ID aus der Route zu empfangen
const props = defineProps({
  id: {
    type: [String, Number],
    required: true,
  },
});

const itemStore = useItemStore();
const router = useRouter();
const route = useRoute();

const task = ref(null);
const loading = ref(true);

const fetchTask = async (id) => {
  loading.value = true;
  // getItemById ist bereits eine gute Methode, um den Task zu holen
  const foundTask = await itemStore.getItemById(id);
  if (foundTask) {
    task.value = { ...foundTask }; // Kopie für die Bearbeitung
  } else {
    console.error(`Task mit ID ${id} nicht gefunden.`);
    router.push('/'); 
  }
  loading.value = false;
};

// onMounted und watch können jetzt die Prop 'id' verwenden
onMounted(async () => {
  await fetchTask(props.id);
});

watch(() => props.id, async (newId) => {
  if (newId) {
    await fetchTask(newId);
  }
});

const handleSubmit = async (updatedTaskData) => {
  try {
    const taskToUpdate = { ...task.value, ...updatedTaskData };
    await itemStore.updateItemById(props.id, taskToUpdate);
    router.push('/');
  } catch (error) {
    alert('Fehler beim Aktualisieren des Tasks');
    console.error('Fehler beim Aktualisieren:', error);
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-progress-circular indeterminate color="primary" v-if="loading"></v-progress-circular>
        <TaskForm v-if="!loading && task" :task="task" @submit-task="handleSubmit" />
        <div v-if="!loading && !task">Task nicht gefunden.</div>
      </v-col>
    </v-row>
  </v-container>
</template>