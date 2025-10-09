import { useState, useEffect } from "react"
import { XMarkIcon, PlusIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline"

export const CreateTaskForm = ({ isOpen, onClose, onSubmit, loading = false, columnId, existingTasks = [] }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    column_id: columnId || "",
    fecha_asignacion: new Date().toISOString().split("T")[0],
    fecha_limite: "",
    asignador: "",
    responsable: "",
    avance: 0,
    prioridad: "media",
    status: "Pendiente",
  })
  const [errors, setErrors] = useState({})

  const prioridadOptions = [
    { value: "baja", label: "Baja", color: "text-green-700" },
    { value: "media", label: "Media", color: "text-yellow-700" },
    { value: "alta", label: "Alta", color: "text-red-700" },
  ]

  const statusOptions = ["Pendiente", "En progreso", "Completado", "Bloqueado"]

  useEffect(() => {
    if (isOpen) {
      // Reset form when opening
      setFormData({
        nombre: "",
        descripcion: "",
        column_id: columnId || "",
        fecha_asignacion: new Date().toISOString().split("T")[0],
        fecha_limite: "",
        asignador: "",
        responsable: "",
        avance: 0,
        prioridad: "media",
        status: "Pendiente",
      })
      setErrors({})
    }
  }, [isOpen, columnId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    const newErrors = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    } else if (formData.nombre.trim().length > 200) {
      newErrors.nombre = "El nombre no puede exceder 200 caracteres"
    }

    if (formData.descripcion && formData.descripcion.length > 1000) {
      newErrors.descripcion = "La descripción no puede exceder 1000 caracteres"
    }

    if (!formData.fecha_asignacion) {
      newErrors.fecha_asignacion = "La fecha de asignación es obligatoria"
    }

    if (!formData.fecha_limite) {
      newErrors.fecha_limite = "La fecha límite es obligatoria"
    } else if (new Date(formData.fecha_limite) < new Date(formData.fecha_asignacion)) {
      newErrors.fecha_limite = "La fecha límite debe ser posterior a la fecha de asignación"
    }

    if (!formData.asignador.trim()) {
      newErrors.asignador = "El asignador es obligatorio"
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = "El responsable es obligatorio"
    }

    if (formData.avance < 0 || formData.avance > 100) {
      newErrors.avance = "El avance debe estar entre 0 y 100"
    }

    if (!columnId) {
      newErrors.column_id = "ID de la columna es requerido"
    }

    // Check for duplicate name
    const nameExists = existingTasks.some(
      (task) => task.nombre?.toLowerCase().trim() === formData.nombre.toLowerCase().trim(),
    )
    if (nameExists) {
      newErrors.nombre = "Ya existe una tarea con este nombre"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit({
        ...formData,
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion?.trim() || null,
        asignador: formData.asignador.trim(),
        responsable: formData.responsable.trim(),
      })
      onClose()
    } catch (error) {
      console.error("Error creating task:", error)
      setErrors({ submit: "Error al crear la tarea. Inténtalo de nuevo." })
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <PlusIcon className="h-6 w-6 mr-2 text-blue-500" />
            Nueva Tarea
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors" disabled={loading}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ej: Implementar login, Diseñar interfaz, etc."
              maxLength={200}
              disabled={loading}
            />
            {errors.nombre && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.nombre}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descripción detallada de la tarea..."
              maxLength={1000}
              disabled={loading}
            />
            <div className="mt-1 text-xs text-gray-500">{formData.descripcion.length}/1000 caracteres</div>
            {errors.descripcion && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.descripcion}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Asignación *</label>
              <input
                type="date"
                value={formData.fecha_asignacion}
                onChange={(e) => handleChange("fecha_asignacion", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fecha_asignacion ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.fecha_asignacion && <div className="mt-1 text-xs text-red-600">{errors.fecha_asignacion}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite *</label>
              <input
                type="date"
                value={formData.fecha_limite}
                onChange={(e) => handleChange("fecha_limite", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.fecha_limite ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.fecha_limite && <div className="mt-1 text-xs text-red-600">{errors.fecha_limite}</div>}
            </div>
          </div>

          {/* People */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignador *</label>
              <input
                type="text"
                value={formData.asignador}
                onChange={(e) => handleChange("asignador", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.asignador ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nombre del asignador"
                disabled={loading}
              />
              {errors.asignador && <div className="mt-1 text-xs text-red-600">{errors.asignador}</div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsable *</label>
              <input
                type="text"
                value={formData.responsable}
                onChange={(e) => handleChange("responsable", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.responsable ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nombre del responsable"
                disabled={loading}
              />
              {errors.responsable && <div className="mt-1 text-xs text-red-600">{errors.responsable}</div>}
            </div>
          </div>

          {/* Priority, Status, and Progress */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => handleChange("prioridad", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {prioridadOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avance (%)</label>
              <input
                type="number"
                value={formData.avance}
                onChange={(e) => handleChange("avance", Number.parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.avance ? "border-red-500" : "border-gray-300"
                }`}
                min={0}
                max={100}
                disabled={loading}
              />
              {errors.avance && <div className="mt-1 text-xs text-red-600">{errors.avance}</div>}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <ExclamationCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              {errors.submit}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {loading ? "Creando..." : "Crear Tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
