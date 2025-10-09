import { useForm, Controller } from "react-hook-form"
import { XMarkIcon } from "@heroicons/react/24/outline"

export const UpdateBoardForm = ({ board, onSubmit, onCancel, loading = false, className = "" }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      nombre: board.nombre,
      descripcion: board.descripcion || "",
    },
    mode: "onChange",
  })

  const watchedValues = watch()

  const handleFormSubmit = async (data) => {
    try {
      const formData = {}

      if (data.nombre && data.nombre !== board.nombre) {
        formData.nombre = data.nombre
      }

      if (data.descripcion !== board.descripcion) {
        formData.descripcion = data.descripcion || undefined
      }

      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  const handleCancel = () => {
    reset()
    onCancel()
  }

  // Simple validation
  const isNombreValid = watchedValues.nombre && watchedValues.nombre.trim().length >= 3

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Editar Tablero</h2>
        <button
          onClick={handleCancel}
          className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
        {/* Nombre field */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Tablero *
          </label>
          <Controller
            name="nombre"
            control={control}
            rules={{
              required: "El nombre es requerido",
              minLength: { value: 3, message: "Mínimo 3 caracteres" },
              maxLength: { value: 100, message: "Máximo 100 caracteres" },
            }}
            render={({ field }) => (
              <input
                {...field}
                id="nombre"
                type="text"
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors
                  ${errors.nombre ? "border-red-300 focus:ring-red-500" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="Ej: Proyecto Frontend, Desarrollo Web, etc."
                disabled={loading}
              />
            )}
          />
          {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
        </div>

        {/* Descripción field */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (Opcional)
          </label>
          <Controller
            name="descripcion"
            control={control}
            rules={{
              maxLength: { value: 500, message: "Máximo 500 caracteres" },
            }}
            render={({ field }) => (
              <textarea
                {...field}
                id="descripcion"
                rows={4}
                className={`
                  w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-colors resize-none
                  ${errors.descripcion ? "border-red-300 focus:ring-red-500" : "border-gray-300 hover:border-gray-400"}
                `}
                placeholder="Describe el propósito y objetivos de este tablero..."
                disabled={loading}
              />
            )}
          />
          {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !isNombreValid || !isDirty}
            className={`
              px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${loading || !isNombreValid || !isDirty
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Actualizando...</span>
              </div>
            ) : (
              <span>Actualizar Tablero</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
