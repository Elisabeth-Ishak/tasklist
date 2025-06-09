import { defineStore } from 'pinia'
import axios from 'axios'

const apiUrl = 'http://localhost:3000/api/tasks/'

export const useItemStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
  }),
  actions: {
    async getItems() {
      try {
        const response = await axios.get(apiUrl)
        this.tasks = response.data.map((task) => ({
          id: task.id,
          title: task.title || '',
          isDone: task.isDone ?? false,
          dueDate: task.dueDate ?? null,
        }))
      } catch (error) {
        console.error('Fehler beim Laden der Tasks:', error)
      }
    },
    async getItemById(id) {
      try {
        const response = await axios.get(`${apiUrl}${id}`)
        return {
          id: response.data.id,
          title: response.data.title || '',
          isDone: response.data.isDone ?? false,
          dueDate: response.data.dueDate ?? null,
        }
      } catch (error) {
        console.error(`Fehler beim Laden des Tasks ${id}:`, error)
        return null
      }
    },
    async addItem(task) {
      try {
        const taskPayload = {
          title: task.title || '',
          dueDate: task.dueDate || null,
          isDone: task.isDone ?? false,
        }
        const response = await axios.post(apiUrl, taskPayload)
        const addedTask = {
          id: response.data.id,
          title: response.data.title || '',
          isDone: response.data.isDone ?? false,
          dueDate: response.data.dueDate ?? null,
        }
        this.tasks.push(addedTask)
      } catch (error) {
        console.error('Fehler beim Erstellen des Tasks:', error)
        throw error
      }
    },
    async updateItemById(id, updatedItem) {
      try {
        const { id: taskId, ...itemWithoutId } = updatedItem
        const payload = {
          title: itemWithoutId.title || '',
          isDone: itemWithoutId.isDone ?? false,
          dueDate: itemWithoutId.dueDate ?? null,
        }
        const response = await axios.put(`${apiUrl}${id}`, payload)
        const taskIndex = this.tasks.findIndex((task) => task.id === parseInt(id))
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = {
            id: response.data.id,
            title: response.data.title || '',
            isDone: response.data.isDone ?? false,
            dueDate: response.data.dueDate ?? null,
          }
        } else {
          await this.getItems()
        }
      } catch (error) {
        console.error('Fehler beim Aktualisieren des Tasks:', error)
        throw error
      }
    },
    async changeDoneState(id) {
      const taskIndex = this.tasks.findIndex((task) => task.id === parseInt(id))
      if (taskIndex === -1) {
        console.error(`Task mit ID ${id} für Statusänderung nicht im Store gefunden.`)
        const taskFromServer = await this.getItemById(id)
        if (taskFromServer) {
          const updatedTask = { ...taskFromServer, isDone: !taskFromServer.isDone }
          await this.updateItemById(id, updatedTask)
        }
        return
      }

      const taskToUpdate = { ...this.tasks[taskIndex] }
      taskToUpdate.isDone = !taskToUpdate.isDone
      await this.updateItemById(id, taskToUpdate)
    },
    async deleteItemById(id) {
      try {
        await axios.delete(`${apiUrl}${id}`)
        this.tasks = this.tasks.filter((task) => task.id !== parseInt(id))
      } catch (error) {
        console.error('Task wurde nicht gelöscht:', error)
        throw error
      }
    },
  },
})