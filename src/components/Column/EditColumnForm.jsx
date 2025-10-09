// EditColumnForm.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export const EditColumnForm = ({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  loading = false,
  column = null,
  existingColumns = [],
}) => {
  const [formData, setFormData] = useState({
    titulo: '',
    posicion: 0,
    color: '#94a3b8',
  });
  const [errors, setErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && column) {
      setFormData({
        titulo: column.titulo || column.nombre || '',
        posicion: Number.isFinite(column.posicion) ? column.posicion : 0,
        color: column.color || '#94a3b8',
      });
      setErrors({});
      setShowDeleteConfirm(false);
    }
  }, [isOpen, column]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const newErrors = {};
    const titulo = (formData.titulo || '').trim();

    if (!titulo) newErrors.titulo = 'El título es obligatorio';
    else if (titulo.length < 2) newErrors.titulo = 'Mínimo 2 caracteres';
    else if (titulo.length > 100) newErrors.titulo = 'Máximo 100 caracteres';

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = 'Máximo 500 caracteres';
    }
    if (formData.posicion < 0) newErrors.posicion = 'Debe ser ≥ 0';


    const dup = existingColumns.some(
      (c) =>
        c.id !== column?.id &&
        (c.titulo?.toLowerCase().trim() === titulo.toLowerCase() ||
          c.nombre?.toLowerCase().trim() === titulo.toLowerCase())
    );
    if (dup) newErrors.titulo = 'Ya existe una columna con este título';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(column.id, {
        ...formData,
        titulo,

        posicion: Number(formData.posicion) || 0,
        color: formData.color, // viene en formato #RRGGBB desde <input type="color">
      });
      onClose();
    } catch (err) {
      console.error('Error updating column:', err);
      setErrors({ submit: 'Error al actualizar la columna. Inténtalo de nuevo.' });
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(column.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (err) {
      console.error('Error deleting column:', err);
      setErrors({ submit: 'Error al eliminar la columna. Inténtalo de nuevo.' });
    }
  };

  if (!isOpen || !column) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button arriba a la derecha */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          disabled={loading}
          aria-label="Cerrar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>


        <h3 className="text-lg font-semibold mb-4">Editar Columna</h3>


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => handleChange('titulo', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 ${
                errors.titulo ? 'border-red-500' : ''
              }`}
              placeholder="Ej: En Progreso"
              disabled={loading}
              maxLength={100}
              required
            />
            {errors.titulo && (
              <div className="mt-1 flex items-center text-sm text-red-600">
                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                {errors.titulo}
              </div>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="w-12 h-8 border rounded"
                disabled={loading}
              />
              <span className="text-sm text-gray-600">{formData.color}</span>
            </div>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
            <input
              type="number"
              value={formData.posicion}
              onChange={(e) => handleChange('posicion', parseInt(e.target.value || '0', 10))}
              className={`w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200 ${
                errors.posicion ? 'border-red-500' : ''
              }`}
              placeholder="Opcional"
              min={0}
              disabled={loading}
            />
            {errors.posicion && (
              <div className="mt-1 text-xs text-red-600">{errors.posicion}</div>
            )}
          </div>

          {/* Error general */}
          {errors.submit && (
            <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <ExclamationCircleIcon className="h-4 w-4 mr-2 flex-shrink-0" />
              {errors.submit}
            </div>
          )}


          <div className="flex justify-between mt-4">

            {onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                disabled={loading}
              >
                <span className="inline-flex items-center">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Eliminar
                </span>
              </button>
            )}

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-2">Eliminar Columna</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de que deseas eliminar la columna{' '}
              <span className="font-medium">{column.titulo || column.nombre}</span>?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
