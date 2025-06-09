<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

// Diese Komponente kann eine "person" als Prop erhalten.
// Wenn eine Person übergeben wird, sind wir im "Bearbeiten"-Modus.
// Wenn nicht, sind wir im "Erstellen"-Modus.
const props = defineProps({
  person: {
    type: Object,
    required: false,
    default: null,
  }
});

// Die Komponente sendet ein 'submit-person'-Event, wenn das Formular abgeschickt wird.
const emit = defineEmits(['submit-person']);

const router = useRouter();

// Refs für die Formularfelder und die Form selbst (für die Validierung)
const firstname = ref('');
const lastname = ref('');
const form = ref(null);

// Einfache Validierungsregel: Das Feld darf nicht leer sein.
const rules = [value => !!value || 'Dieses Feld ist erforderlich.'];

// Dieser "watch" beobachtet die 'person'-Prop.
// Wenn sich die Prop ändert (z.B. wenn die Daten in der DetailView geladen sind),
// werden die Formularfelder automatisch ausgefüllt.
watch(
  () => props.person,
  (newPerson) => {
    if (newPerson) {
      // Bearbeiten-Modus: Felder mit den Daten der Person füllen
      firstname.value = newPerson.firstname;
      lastname.value = newPerson.lastname;
    } else {
      // Erstellen-Modus: Felder leeren
      firstname.value = '';
      lastname.value = '';
    }
  },
  { immediate: true } // 'immediate: true' sorgt dafür, dass dies sofort beim Laden der Komponente ausgeführt wird
);

const submitHandler = async () => {
  // Formular validieren
  const { valid } = await form.value.validate();
  if (!valid) return; // Abbrechen, wenn die Validierung fehlschlägt

  // Das 'submit-person'-Event mit den Formulardaten aussenden.
  // Die Elternkomponente (CreatePersonView oder DetailPersonView) kümmert sich um das Speichern.
  emit('submit-person', {
    firstname: firstname.value,
    lastname: lastname.value,
  });
};

const cancel = () => {
  router.push('/');
}
</script>

<template>
  <v-card class="pa-4" flat>
    <v-card-title class="text-h5 mb-4">
      <!-- Der Titel ändert sich je nachdem, ob wir im Bearbeiten- oder Erstellen-Modus sind -->
      {{ props.person ? 'Person bearbeiten' : 'Neue Person anlegen' }}
    </v-card-title>
    <v-form @submit.prevent="submitHandler" ref="form">
      <v-text-field
        v-model="firstname"
        label="Vorname"
        :rules="rules"
        required
        variant="outlined"
        class="mb-3"
      ></v-text-field>

      <v-text-field
        v-model="lastname"
        label="Nachname"
        :rules="rules"
        required
        variant="outlined"
        class="mb-3"
      ></v-text-field>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" @click="cancel" variant="text">Abbrechen</v-btn>
        <v-btn type="submit" color="primary" variant="elevated">
          <!-- Auch der Button-Text passt sich an -->
          {{ props.person ? 'Speichern' : 'Hinzufügen' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>