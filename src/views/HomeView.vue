<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useItemStore } from '@/stores/tasks'
import { usePersonStore } from '@/stores/persons'
import { storeToRefs } from 'pinia'

const itemStore = useItemStore()
const personStore = usePersonStore();
const router = useRouter()
const loading = ref(false)
const search = ref('')

const { tasks } = storeToRefs(itemStore)

const headers = [
  { title: 'Titel', key: 'title', sortable: true },
  { title: 'Zuständige Person', key: 'personName', sortable: true },
  { title: 'Fällig am', key: 'dueDate', sortable: true },
  { title: 'Status', key: 'isDone', sortable: true },
  { title: 'Aktionen', key: 'actions', sortable: false, align: 'end' },
];

// KORRIGIERTE COMPUTED PROPERTY
const tasksWithPersonData = computed(() => {
  return tasks.value.map(task => {
    if (!task.personId) {
      return { ...task, personName: 'Nicht zugewiesen' };
    }
    const person = personStore.persons.find(p => p.id === parseInt(task.personId, 10));
    return {
      ...task,
      personName: person ? `${person.firstname} ${person.lastname}` : 'Nicht zugewiesen',
    }
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) {
    return 'Ungültiges Datum';
  }
  return d.toLocaleDateString('de-DE')
}

const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      itemStore.getItems(),
      personStore.getPersons()
    ]);
  } catch (error) {
    console.error("Fehler beim Laden der Daten:", error);
  } finally {
    loading.value = false
  }
}

const toggleDone = async (task) => {
  try {
    await itemStore.changeDoneState(task.id)
  } catch (error) {
    alert('Fehler beim Ändern des Status')
  }
}

const deleteTask = async (id) => {
  if (!confirm('Task wirklich löschen?')) return
  try {
    await itemStore.deleteItemById(id)
  } catch (error) {
    alert('Fehler beim Löschen des Tasks')
  }
}

const editTask = (id) => {
  router.push({ name: 'detail', params: { id } })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <!-- Der Template-Teil bleibt unverändert, da die Logik im Script liegt. -->
  <v-card>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-format-list-checks"></v-icon>  
      Meine Tasks
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        density="compact"
        label="Suchen"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
      ></v-text-field>
    </v-card-title>

    <v-divider></v-divider>

    <v-data-table
      :headers="headers"
      :items="tasksWithPersonData"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
      item-value="id" 
      hover
      :loading="loading"
    >
      <template v-slot:item.dueDate="{ item }">
        {{ formatDate(item.dueDate) }}
      </template>

      <template v-slot:item.isDone="{ item }">
        <v-checkbox-btn
          :model-value="item.isDone"
          :color="item.isDone ? 'success' : 'grey'"
          @update:modelValue="toggleDone(item)"
          :ripple="false"
          density="compact"
        ></v-checkbox-btn>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-tooltip location="top" text="Bearbeiten">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="grey-darken-1"
                icon="mdi-pencil"
                size="small"
                @click="editTask(item.id)"
              ></v-icon>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Löschen">
             <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="red-darken-1"
                icon="mdi-delete"
                size="small"
                @click="deleteTask(item.id)"
              ></v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:bottom>
        <div class="text-center pt-2">
          <v-pagination
            v-if="tasks.length > 10"
            :length="Math.ceil(tasks.length / 10)"
            total-visible="5"
          ></v-pagination>
        </div>
      </template>
      
      <template v-slot:no-data>
        <div v-if="tasks.length === 0" class="pa-4 text-center">
          <v-icon size="x-large" class="mb-2">mdi-emoticon-sad-outline</v-icon>
          <div class="text-h6">Keine Tasks vorhanden.</div>
          <v-btn
            color="primary"
            class="mt-4"
            prepend-icon="mdi-plus"
            to="/create"
            >
            Ersten Task erstellen
            </v-btn>
        </div>
        <div v-else class="pa-4 text-center">
          <div class="text-h6">Ihre Suche ergab keine Treffer.</div>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<style scoped>
.v-card-title {
  font-weight: bold;
}
.v-icon:hover {
  cursor: pointer;
}
</style>