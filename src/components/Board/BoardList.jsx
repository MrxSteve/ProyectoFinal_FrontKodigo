import { useState } from "react"
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon, ViewColumnsIcon, Squares2X2Icon } from "@heroicons/react/24/outline"
import { BoardCard } from "./BoardCard.jsx"

export const BoardList = ({
  boards,
  loading = false,
  onCreateBoard,
  onViewBoard,
  onEditBoard,
  onDeleteBoard,
  onSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState("grid")
  const [sortField, setSortField] = useState("updated_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showFilters, setShowFilters] = useState(false)

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  // Sort boards
  const sortedBoards = [...boards].sort((a, b) => {
    let aValue
    let bValue

    switch (sortField) {
      case "nombre":
        aValue = a.nombre.toLowerCase()
        bValue = b.nombre.toLowerCase()
        break
      case "created_at":
        aValue = new Date(a.created_at).getTime()
        bValue = new Date(b.created_at).getTime()
        break
      case "updated_at":
        aValue = new Date(a.updated_at).getTime()
        bValue = new Date(b.updated_at).getTime()
        break
      default:
        return 0
    }

    if (sortOrder === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableros Kanban</h1>
          <p className="text-gray-600 mt-1">Gestiona tus proyectos y organiza tu trabajo de manera eficiente</p>
        </div>

        {onCreateBoard && (
          <button
            onClick={onCreateBoard}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Tablero
          </button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar tableros..."
          />
        </div>

        {/* View controls */}
        <div className="flex items-center space-x-2">
          {/* View mode toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              title="Vista en cuadrícula"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              title="Vista en lista"
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500 hover:text-gray-700"
              }`}
            title="Filtros"
          >
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Ordenar por:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { field: "updated_at", label: "Última actualización" },
              { field: "created_at", label: "Fecha de creación" },
              { field: "nombre", label: "Nombre" },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${sortField === field ? "bg-blue-100 text-blue-700" : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {label}
                {sortField === field && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{boards.length}</div>
            <div className="text-sm text-gray-500">Total de Tableros</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {boards.reduce((acc, board) => acc + (board.columns?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Columnas Activas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {boards.reduce(
                (acc, board) =>
                  acc + (board.columns?.reduce((colAcc, col) => colAcc + (col.tasks?.length || 0), 0) || 0),
                0,
              )}
            </div>
            <div className="text-sm text-gray-500">Tareas Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {boards.reduce(
                (acc, board) =>
                  acc +
                  (board.columns?.reduce(
                    (colAcc, col) => colAcc + (col.tasks?.filter((task) => task.avance === 100).length || 0),
                    0,
                  ) || 0),
                0,
              )}
            </div>
            <div className="text-sm text-gray-500">Completadas</div>
          </div>
        </div>
      </div>

      {/* Boards grid/list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedBoards.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {searchQuery ? "No se encontraron tableros" : "No hay tableros"}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer tablero Kanban"}
          </p>
          {!searchQuery && onCreateBoard && (
            <button
              onClick={onCreateBoard}
              className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Crear Primer Tablero
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          {sortedBoards.map((board) => (
            <BoardCard
              key={board.id}
              board={board}
              onView={onViewBoard}
              onEdit={onEditBoard}
              onDelete={onDeleteBoard}
              className={viewMode === "list" ? "max-w-none" : ""}
            />
          ))}
        </div>
      )}
    </div>
  )
}
