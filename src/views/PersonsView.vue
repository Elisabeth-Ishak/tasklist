<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePersonStore } from '@/stores/persons'
import { storeToRefs } from 'pinia'

const personStore = usePersonStore()
const router = useRouter()
const loading = ref(false)
const search = ref('')

const { persons } = storeToRefs(personStore)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Vorname', key: 'firstname' },
  { title: 'Nachname', key: 'lastname' },
  { title: 'Aktionen', key: 'actions', sortable: false, align: 'end' },
]

onMounted(async () => {
  loading.value = true
  await personStore.getPersons()
  loading.value = false
})

const editPerson = (id) => {
  router.push({ name: 'detail-person', params: { id } })
}

const deletePerson = async (id) => {
  if (
    confirm('Person wirklich löschen? Dadurch werden auch alle zugewiesenen Tasks beeinflusst!')
  ) {
    try {
      await personStore.deletePersonById(id)
    } catch (error) {
      alert('Fehler beim Löschen der Person.')
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-title class="d-flex align-center pe-2">
      <v-icon icon="mdi-account-group"></v-icon>
      Personenverwaltung
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
      :items="persons"
      :items-per-page="10"
      :search="search"
      class="elevation-1"
      item-value="id"
      hover
      :loading="loading"
    >
      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-tooltip location="top" text="Bearbeiten">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                color="grey-darken-1"
                icon="mdi-pencil"
                size="small"
                @click="editPerson(item.id)"
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
                @click="deletePerson(item.id)"
              ></v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:no-data>
        <div class="pa-4 text-center">
          <v-icon size="x-large" class="mb-2">mdi-account-off-outline</v-icon>
          <div class="text-h6">Keine Personen gefunden.</div>
          <v-btn color="primary" class="mt-4" prepend-icon="mdi-account-plus" to="/create-person">
            Erste Person erstellen
          </v-btn>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>
