import { apiClient } from "./apiClient.js"

export class TaskService {
    constructor() {
        this.endpoint = "/tasks"
    }

    async getAllTasks() {
        try {
            return await apiClient.get(this.endpoint)
        } catch (error) {
            console.error("Error fetching tasks: ", error)
            throw error
        }
    }

    async getTasksByColumn(columnId) {
        try {
            // Filtrar tareas por column_id ya que no hay endpoint específico
            const allTasks = await apiClient.get(this.endpoint)
            return allTasks.filter((task) => task.column_id === Number.parseInt(columnId))
        } catch (error) {
            console.error(`Error fetching tasks for column ${columnId}: `, error)
            throw error
        }
    }

    async getTaskById(id) {
        try {
            return await apiClient.get(`${this.endpoint}/${id}`)
        } catch (error) {
            console.error(`Error fetching task ${id}:`, error)
            throw error
        }
    }

    async createTask(taskData) {
        try {
            if (!taskData.nombre || taskData.nombre.trim().length === 0) {
                throw new Error("El nombre de la tarea es requerido")
            }

            if (!taskData.column_id) {
                throw new Error("El ID de la columna es requerido")
            }

            return await apiClient.post(this.endpoint, taskData)
        } catch (error) {
            console.error("Error creating task:", error)
            throw error
        }
    }

    async updateTask(id, taskData) {
        try {
            if (taskData.nombre && taskData.nombre.trim().length === 0) {
                throw new Error("El nombre no puede estar vacío")
            }
            return await apiClient.put(`${this.endpoint}/${id}`, taskData)
        } catch (error) {
            console.error(`Error updating task ${id}: `, error)
            throw error
        }
    }

    async deleteTask(id) {
        try {
            await apiClient.delete(`${this.endpoint}/${id}`)
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error)
            throw error
        }
    }
}

export const tasksService = new TaskService()
export default tasksService
