// views/CreateView.vue
<script setup>
import TaskForm from '@/components/TaskForm.vue';
import { useItemStore } from '@/stores/tasks.js';
import { useRouter } from 'vue-router';

const itemStore = useItemStore();
const router = useRouter();

const addTaskHandler = async (taskData) => {
  try {
    await itemStore.addItem(taskData);
    router.push('/');
  } catch (error) {
    alert('Fehler beim Erstellen des Tasks');
    console.error('Fehler beim Erstellen:', error);
  }
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <TaskForm @submit-task="addTaskHandler" />
      </v-col>
    </v-row>
  </v-container>
</template>