import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  PencilIcon,
  ExclamationCircleIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';

export const EditColumnForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onDelete,
  loading = false,
  column = null,
  existingColumns = []
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    posicion: 0,
    color: '#3B82F6',
    limite_wip: 0
  });
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const colorOptions = [
    { value: '#3B82F6', label: 'Azul', bg: 'bg-blue-500' },
    { value: '#10B981', label: 'Verde', bg: 'bg-green-500' },
    { value: '#F59E0B', label: 'Amarillo', bg: 'bg-yellow-500' },
    { value: '#EF4444', label: 'Rojo', bg: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Púrpura', bg: 'bg-purple-500' },
    { value: '#F97316', label: 'Naranja', bg: 'bg-orange-500' },
    { value: '#06B6D4', label: 'Cian', bg: 'bg-cyan-500' },
    { value: '#84CC16', label: 'Lima', bg: 'bg-lime-500' },
  ];

  useEffect(() => {
    if (isOpen && column) {
      setFormData({
        titulo: column.titulo || column.nombre || '',
        descripcion: column.descripcion || '',
        posicion: column.posicion || 0,
        color: column.color || '#3B82F6',
        limite_wip: column.limite_wip || 0
      });
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, column]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (formData.titulo.trim().length < 2) {
      newErrors.titulo = 'El título debe tener al menos 2 caracteres';
    } else if (formData.titulo.trim().length > 100) {
      newErrors.titulo = 'El título no puede exceder 100 caracteres';
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    if (formData.posicion < 0) {
      newErrors.posicion = 'La posición debe ser mayor o igual a 0';
    }

    if (formData.limite_wip < 0) {
      newErrors.limite_wip = 'El límite WIP debe ser mayor o igual a 0';
    }

    // Check for duplicate title (excluding current column)
    const titleExists = existingColumns.some(col => 
      col.id !== column?.id && 
      (col.titulo?.toLowerCase().trim() === formData.titulo.toLowerCase().trim() ||
       col.nombre?.toLowerCase().trim() === formData.titulo.toLowerCase().trim())
    );
    if (titleExists) {
      newErrors.titulo = 'Ya existe una columna con este título';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(column.id, {
        ...formData,
        titulo: formData.titulo.trim(),
        descripcion: formData.descripcion?.trim() || null
      });
      onClose();
    } catch (error) {
      console.error('Error updating column:', error);
      setErrors({ submit: 'Error al actualizar la columna. Inténtalo de nuevo.' });
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(column.id);
      onClose();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting column:', error);
      setErrors({ submit: 'Error al eliminar la columna. Inténtalo de nuevo.' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  if (!isOpen || !column) return null;

  const hasData = column.tasks && column.tasks.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <PencilIcon className="h-6 w-6 mr-2 text-blue-500" />
            Editar Columna
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
            disabled={loading}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {showDeleteConfirm ? (
          /* Delete Confirmation */
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Eliminar Columna</h3>
                <p className="text-gray-500">¿Estás seguro que deseas eliminar esta columna?</p>
              </div>
            </div>
            
            {hasData && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-sm text-yellow-700">
                    Esta columna contiene {column.tasks.length} tarea(s). Se perderán al eliminarla.
                  </span>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-md mb-4">
              <p className="text-sm text-gray-600">
                <strong>Columna:</strong> {column.titulo || column.nombre}
              </p>
              {hasData && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Tareas:</strong> {column.tasks.length}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleChange('titulo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: En Progreso, Completado, etc."
                maxLength={100}
                disabled={loading}
              />
              {errors.titulo && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.titulo}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                  errors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Descripción opcional de la columna..."
                maxLength={500}
                disabled={loading}
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.descripcion.length}/500 caracteres
              </div>
              {errors.descripcion && (
                <div className="mt-1 flex items-center text-sm text-red-600">
                  <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                  {errors.descripcion}
                </div>
              )}
            </div>

            {/* Position and WIP Limit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posición
                </label>
                <input
                  type="number"
                  value={formData.posicion}
                  onChange={(e) => handleChange('posicion', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.posicion ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={0}
                  disabled={loading}
                />
                {errors.posicion && (
                  <div className="mt-1 text-xs text-red-600">{errors.posicion}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Límite WIP
                </label>
                <input
                  type="number"
                  value={formData.limite_wip}
                  onChange={(e) => handleChange('limite_wip', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.limite_wip ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={0}
                  placeholder="0 = sin límite"
                  disabled={loading}
                />
                {errors.limite_wip && (
                  <div className="mt-1 text-xs text-red-600">{errors.limite_wip}</div>
                )}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleChange('color', color.value)}
                    className={`flex items-center justify-center p-3 rounded-md border-2 transition-all ${
                      formData.color === color.value
                        ? 'border-gray-800 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={loading}
                  >
                    <div className={`w-6 h-6 rounded-full ${color.bg}`}></div>
                  </button>
                ))}
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
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors flex items-center"
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Eliminar
              </button>
              
              <div className="flex space-x-3">
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
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};