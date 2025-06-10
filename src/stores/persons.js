import { defineStore } from 'pinia';
import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/persons/';

export const usePersonStore = defineStore('persons', {
  state: () => ({
    persons: [],
  }),

  actions: {
    async getPersons() {
      try {
        const response = await axios.get(apiUrl);
        this.persons = response.data;
      } catch (error) {
        console.error('Fehler beim Laden der Personen:', error);
      }
    },
    async addPerson(person) {
      try {
        const response = await axios.post(apiUrl, person);
        this.persons.push(response.data);
      } catch (error) {
        console.error('Fehler beim Erstellen der Person:', error);
        throw error;
      }
    },
    async getPersonById(personId) {
      try {
        const response = await axios.get(apiUrl + personId);
        return response.data;
      } catch (error) {
        console.log('Person mit der ID: ', personId, ' konnte nicht geladen werden!');
      }
    },
    // NEUE METHODE
    async updatePersonById(id, updatedPerson) {
      try {
        const response = await axios.put(apiUrl + id, updatedPerson);
        const index = this.persons.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
          this.persons[index] = response.data;
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren der Person:', error);
        throw error;
      }
    },
    // NEUE METHODE
    async deletePersonById(id) {
      try {
        await axios.delete(apiUrl + id);
        this.persons = this.persons.filter(p => p.id !== parseInt(id));
      } catch (error) {
        console.error('Fehler beim Löschen der Person:', error);
        throw error;
      }
    },
  },
});