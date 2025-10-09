import { useState } from 'react';
import {
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export const ColumnCard = ({ 
  column, 
  onEdit, 
  onDelete, 
  onAddTask,
  className = '' 
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const taskCount = column.tasks?.length || 0;
  const completedTasks = column.tasks?.filter(task => task.avance === 100).length || 0;
  const progressPercentage = taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {/* Header */}
      <div 
        className="p-4 border-b border-gray-100"
        style={{ borderTopColor: column.color || '#94a3b8', borderTopWidth: '4px' }}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {column.titulo || column.nombre}
            </h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span>{taskCount} tareas</span>
              {taskCount > 0 && (
                <span className="ml-2">• {completedTasks} completadas</span>
              )}
            </div>
          </div>
          
          <div className="relative ml-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                {onEdit && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(column);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar columna
                  </button>
                )}
                {onAddTask && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onAddTask(column);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Agregar tarea
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(column);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Eliminar columna
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar */}
        {taskCount > 0 && (
          <div className="mt-3">
            <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
              <span>Progreso</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: column.color || '#94a3b8'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks preview */}
      <div className="p-4">
        {taskCount === 0 ? (
          <div className="text-center py-6">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No hay tareas</p>
            {onAddTask && (
              <button
                onClick={() => onAddTask(column)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Agregar primera tarea
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {column.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="bg-gray-50 rounded p-2 border-l-2" style={{ borderLeftColor: task.prioridad === 'alta' ? '#ef4444' : task.prioridad === 'media' ? '#f59e0b' : '#10b981' }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {task.nombre || task.titulo}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {task.avance}%
                  </span>
                </div>
                {task.descripcion && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    {task.descripcion}
                  </p>
                )}
              </div>
            ))}
            
            {taskCount > 3 && (
              <div className="text-center py-2">
                <span className="text-xs text-gray-500">
                  +{taskCount - 3} tareas más
                </span>
              </div>
            )}
            
            {onAddTask && (
              <button
                onClick={() => onAddTask(column)}
                className="w-full mt-2 p-2 border-2 border-dashed border-gray-200 rounded text-sm text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors flex items-center justify-center"
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Agregar tarea
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Close menu when clicking outside
  useState(() => {
    const handleClickOutside = (event) => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showMenu]);
};