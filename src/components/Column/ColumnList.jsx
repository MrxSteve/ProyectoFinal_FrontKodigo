"use client"

import { useState } from "react"
import { ViewColumnsIcon, FunnelIcon } from "@heroicons/react/24/outline"
import { ColumnCard } from "./ColumnCard.jsx"

export const ColumnList = ({
  columns = [],
  loading = false,
  onCreateColumn,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  boardId,
  className = "",
}) => {
  const [sortBy, setSortBy] = useState("posicion")
  const [filterBy, setFilterBy] = useState("all")

  // Sort columns
  const sortedColumns = [...columns].sort((a, b) => {
    switch (sortBy) {
      case "posicion":
        return (a.posicion || 0) - (b.posicion || 0)
      case "titulo":
        return (a.titulo || a.nombre || "").localeCompare(b.titulo || b.nombre || "")
      case "tasks":
        return (b.tasks?.length || 0) - (a.tasks?.length || 0)
      default:
        return 0
    }
  })

  // Filter columns
  const filteredColumns = sortedColumns.filter((column) => {
    if (filterBy === "all") return true
    if (filterBy === "empty") return !column.tasks || column.tasks.length === 0
    if (filterBy === "active") return column.tasks && column.tasks.length > 0
    return true
  })

  const totalTasks = columns.reduce((acc, col) => acc + (col.tasks?.length || 0), 0)
  const totalCompleted = columns.reduce(
    (acc, col) => acc + (col.tasks?.filter((task) => task.avance === 100).length || 0),
    0,
  )

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-100 rounded"></div>
                  <div className="h-10 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <ViewColumnsIcon className="h-6 w-6 mr-2 text-blue-500" />
            Columnas del Tablero
          </h2>
          <p className="text-gray-600 mt-1">
            {columns.length} columnas • {totalTasks} tareas • {totalCompleted} completadas
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <FunnelIcon className="h-4 w-4 text-gray-500 mr-2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="posicion">Por posición</option>
              <option value="titulo">Por título</option>
              <option value="tasks">Por número de tareas</option>
            </select>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Filtrar:</span>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="active">Con tareas</option>
              <option value="empty">Vacías</option>
            </select>
          </div>
        </div>
      </div>

      {/* Columns Grid */}
      {filteredColumns.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <ViewColumnsIcon className="mx-auto h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {columns.length === 0 ? "No hay columnas" : "No hay columnas que coincidan con el filtro"}
          </h3>
          <p className="mt-2 text-gray-500">
            {columns.length === 0
              ? "Comienza creando la primera columna para organizar tus tareas"
              : "Intenta cambiar los filtros para ver más columnas"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredColumns.map((column) => (
            <ColumnCard
              key={column.id}
              column={column}
              onEdit={onEditColumn}
              onDelete={onDeleteColumn}
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {columns.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Columnas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{columns.length}</div>
              <div className="text-sm text-gray-500">Columnas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-500">Tareas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalCompleted}</div>
              <div className="text-sm text-gray-500">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalTasks - totalCompleted}</div>
              <div className="text-sm text-gray-500">Pendientes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
