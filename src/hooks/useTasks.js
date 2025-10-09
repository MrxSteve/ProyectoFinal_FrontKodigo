import { useState, useEffect, useCallback } from "react"
import { tasksService } from "../services/tasksService"

export const useTasks = (columnId = null) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let data
      if (columnId) {
        data = await tasksService.getTasksByColumn(columnId)
      } else {
        data = await tasksService.getAllTasks()
      }
      setTasks(data)
    } catch (err) {
      setError(err.message || "Error al cargar las tareas")
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }, [columnId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (taskData) => {
    setLoading(true)
    setError(null)
    try {
      const newTask = await tasksService.createTask(taskData)
      setTasks((prev) => [...prev, newTask])
      return newTask
    } catch (err) {
      setError(err.message || "Error al crear la tarea")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id, taskData) => {
    console.log("[v0] useTasks.updateTask called with:", { id, taskData })
    setLoading(true)
    setError(null)
    try {
      console.log("[v0] Calling tasksService.updateTask...")
      const updatedTask = await tasksService.updateTask(id, taskData)
      console.log("[v0] tasksService.updateTask result:", updatedTask)
      setTasks((prev) => prev.map((task) => (task.id === id ? updatedTask : task)))
      return updatedTask
    } catch (err) {
      console.error("[v0] Error in useTasks.updateTask:", err)
      setError(err.message || "Error al actualizar la tarea")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    setLoading(true)
    setError(null)
    try {
      await tasksService.deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (err) {
      setError(err.message || "Error al eliminar la tarea")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getTaskById = (id) => {
    return tasks.find((task) => task.id === id)
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
  }
}

export default useTasks
