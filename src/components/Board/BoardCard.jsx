import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { 
  FolderIcon, 
  EyeIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const BoardCard = ({
  board,
  onView,
  onEdit,
  onDelete,
  loading = false,
  className = '',
}) => {
  const navigate = useNavigate();
  // Calculate board statistics
  const totalColumns = board.columns?.length || 0;
  const totalTasks = board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0;
  const completedTasks = board.columns?.reduce(
    (acc, col) => acc + (col.tasks?.filter(task => task.avance === 100).length || 0), 
    0
  ) || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Format dates
  const createdDate = format(new Date(board.created_at), 'dd MMM yyyy', { locale: es });
  const updatedDate = format(new Date(board.updated_at), 'dd MMM yyyy', { locale: es });

  return (
    <div 
      className={`
        group relative bg-white rounded-xl shadow-sm border border-gray-200 
        hover:shadow-lg hover:border-gray-300 transition-all duration-300
        ${loading ? 'opacity-50 pointer-events-none' : ''}
        ${className}
      `}
    >
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <FolderIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {board.nombre}
              </h3>
              {board.descripcion && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {board.descripcion}
                </p>
              )}
            </div>
          </div>
          
          {/* Actions dropdown */}
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex space-x-1">
              {onView && (
                <button
                  onClick={() => onView(board)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver tablero"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(board)}
                  className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar tablero"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(board)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar tablero"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalColumns}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Columnas</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Tareas</div>
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1" />
                Progreso
              </span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{completedTasks} completadas</span>
              <span>{totalTasks - completedTasks} pendientes</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Creado: {createdDate}
            </span>
          </div>
          {createdDate !== updatedDate && (
            <span className="flex items-center">
              <CalendarIcon className="h-3 w-3 mr-1" />
              Actualizado: {updatedDate}
            </span>
          )}
        </div>
        
        {/* Open Board Button */}
        <button
          onClick={() => navigate(`/boards/${board.id}`)}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
          disabled={loading}
        >
          <span>Abrir Tablero</span>
          <ArrowRightIcon className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};