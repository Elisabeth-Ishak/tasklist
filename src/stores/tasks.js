import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/tasks/';

// Hilfsfunktion, um die Task-Daten zu normalisieren
const normalizeTask = (task) => {
  if (!task) return null;
  return {
    id: task.id,
    title: task.title || '',
    isDone: task.isDone ?? false,
    dueDate: task.dueDate ?? null,
    personId: task.personId ?? null, // WICHTIG: personId hinzufügen!
  };
};

export const useItemStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    async getItems() {
      try {
        const response = await axios.get(apiUrl);
        // Die Normalisierungsfunktion verwenden
        this.tasks = response.data.map(normalizeTask);
      } catch (error) {
        console.error('Fehler beim Laden der Tasks:', error);
      }
    },

    async getItemById(id) {
      try {
        const response = await axios.get(`${apiUrl}${id}`);
        return normalizeTask(response.data);
      } catch (error) {
        console.error(`Fehler beim Laden des Tasks ${id}:`, error);
        return null;
      }
    },

    async addItem(task) {
      try {
        // Beim Hinzufügen auch die personId mitsenden
        const response = await axios.post(apiUrl, task);
        this.tasks.push(normalizeTask(response.data));
      } catch (error) {
        console.error('Fehler beim Erstellen des Tasks:', error);
        throw error;
      }
    },

    async updateItemById(id, updatedItem) {
      try {
        // HIER IST DIE KORREKTUR:
        // Wir erstellen mit Destructuring ein neues Objekt 'payload',
        // das alle Eigenschaften von 'updatedItem' außer der 'id' enthält.
        // Die Variable 'taskId' (die wir hier nicht weiter brauchen) fängt die id auf.
        const { id: taskId, ...payload } = updatedItem;
    
        // Jetzt senden wir den bereinigten 'payload' an den Server.
        const response = await axios.put(`${apiUrl}${id}`, payload);
        
        const taskIndex = this.tasks.findIndex((task) => task.id === parseInt(id));
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = normalizeTask(response.data);
        } else {
          await this.getItems(); 
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error); // Diese Zeile hat dir den Fehler gezeigt
        throw error;
      }
    },
    

    async changeDoneState(id) {
      // Vereinfachte Logik
      const task = this.tasks.find((t) => t.id === parseInt(id));
      if (!task) {
        console.error(`Task mit ID ${id} nicht gefunden.`);
        return;
      }
      const updatedTask = { ...task, isDone: !task.isDone };
      await this.updateItemById(id, updatedTask);
    },

    async deleteItemById(id) {
      try {
        await axios.delete(`${apiUrl}${id}`);
        this.tasks = this.tasks.filter((task) => task.id !== parseInt(id));
      } catch (error) {
        console.error('Task wurde nicht gelöscht:', error);
        throw error;
      }
    },
  },
});