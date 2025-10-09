import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  CheckCircleIcon as CheckCircleSolid,
} from '@heroicons/react/24/solid';
import { useColumns } from '../../hooks/useColumns';

export const BoardDetails = ({
  board,
  isOpen,
  onClose,
  onEditBoard,
  onDeleteBoard,
  loading = false,
  onDataChange //Modificacion Isma
}) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  const { columns, addColumn, removeColumn, editColumn } = useColumns(board?.id, board?.columns);

  //Modficacion Isma
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newColumnData, setNewColumnData] = useState({
    titulo: "",
    color: "#94a3b8",
    posicion: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  // Reset tab when board changes
  useEffect(() => {
    setSelectedTab('overview');
  }, [board?.id]);

  if (!isOpen || !board) return null;

  // Calculate statistics
  const totalTasks = board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0;
  const completedTasks = board.columns?.reduce((acc, col) =>
    acc + (col.tasks?.filter(task => task.avance === 100).length || 0), 0) || 0;
  const inProgressTasks = board.columns?.reduce((acc, col) =>
    acc + (col.tasks?.filter(task => task.avance > 0 && task.avance < 100).length || 0), 0) || 0;
  const pendingTasks = totalTasks - completedTasks - inProgressTasks;

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;



  // Priority distribution
  const priorityStats = board.columns?.reduce((acc, col) => {
    col.tasks?.forEach(task => {
      const priority = task.prioridad || 'media';
      acc[priority] = (acc[priority] || 0) + 1;
    });
    return acc;
  }, { alta: 0, media: 0, baja: 0 }) || { alta: 0, media: 0, baja: 0 };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (avance) => {
    if (avance === 100) return 'text-green-600 bg-green-100';
    if (avance > 0) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (avance) => {
    if (avance === 100) return 'Completada';
    if (avance > 0) return 'En Progreso';
    return 'Pendiente';
  };

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: InformationCircleIcon },
    { id: 'tasks', label: 'Tareas', icon: CheckCircleIcon },
    { id: 'activity', label: 'Actividad', icon: ClockIcon },
  ];

  //Modificacion Isma
  const handleCreateColumn = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      board_id: board.id, // <-- necesario por el endpoint
      titulo: (newColumnData.titulo || "Nueva Columna").trim(),
      color: newColumnData.color,
      posicion:
        newColumnData.posicion !== ""
          ? parseInt(newColumnData.posicion, 10)
          : (columns?.length ?? 0) + 1, // o el default de tu backend
    };

    await addColumn(payload);

    setNewColumnData({ titulo: "", color: "#94a3b8", posicion: "" });
    closeModal();
    onDataChange?.();
  } catch (error) {
    alert(`Error: ${error.response?.data?.error || error.message}`);
  }
};


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold truncate">{board.nombre}</h2>
              {board.descripcion && (
                <p className="text-blue-100 mt-1 line-clamp-2">{board.descripcion}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {onEditBoard && (
                <button
                  onClick={() => onEditBoard(board)}
                  className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                  title="Editar tablero"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                title="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
              {selectedTab === 'overview' && (
                <div className="p-6 space-y-6">
                  {/* Progress Overview */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso General</h3>
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Completado</span>
                        <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{totalTasks}</div>
                        <div className="text-sm text-gray-500">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        <div className="text-sm text-gray-500">Completadas</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
                        <div className="text-sm text-gray-500">En Progreso</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{pendingTasks}</div>
                        <div className="text-sm text-gray-500">Pendientes</div>
                      </div>
                    </div>
                  </div>
                  {/*Parte de isma */}
                  {/* Columns Overview */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Columnas</h3>

                      <button
                        onClick={openModal}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Añadir Columna
                      </button>
                    </div>

                    <div className="grid gap-4">
                      {columns?.filter(Boolean).map((column) => (
                        <div key={column.id || Math.random()} className="bg-white border rounded-lg p-4">
                          <div className="mb-2">
                            <h4 className="font-medium text-gray-900">{column?.titulo || 'Sin título'}</h4>
                          </div>
                          <span className="text-sm text-gray-500">
                            {column.tasks?.length || 0} tareas
                          </span>
                        </div>

                      ))}
                    </div>
                      {/**Parte de isma */}
                    {/* Modal para nueva columna */}
                    {isModalOpen && (
                      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                          <h3 className="text-lg font-semibold mb-4">Nueva Columna</h3>

                          <form onSubmit={handleCreateColumn} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                              <input
                                type="text"
                                value={newColumnData.titulo}
                                onChange={(e) =>
                                  setNewColumnData({ ...newColumnData, titulo: e.target.value })
                                }
                                required
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                                placeholder="Ej: Pendientes"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                              <input
                                type="color"
                                value={newColumnData.color}
                                onChange={(e) =>
                                  setNewColumnData({ ...newColumnData, color: e.target.value })
                                }
                                className="w-12 h-8 border rounded"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                              <input
                                type="number"
                                value={newColumnData.posicion}
                                onChange={(e) =>
                                  setNewColumnData({ ...newColumnData, posicion: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
                                placeholder="Opcional"
                              />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                              <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                              >
                                Cancelar
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                              >
                                Guardar
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>


                  {/* Priority Distribution */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Prioridad</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{priorityStats.alta}</div>
                        <div className="text-sm text-red-700">Alta Prioridad</div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{priorityStats.media}</div>
                        <div className="text-sm text-yellow-700">Media Prioridad</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{priorityStats.baja}</div>
                        <div className="text-sm text-green-700">Baja Prioridad</div>
                      </div>
                    </div>
                  </div>

                  {/* Board Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Tablero</h3>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Creado:</span>
                          <span className="ml-2 text-gray-900">
                            {format(new Date(board.created_at), 'dd MMM yyyy', { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Actualizado:</span>
                          <span className="ml-2 text-gray-900">
                            {format(new Date(board.updated_at), 'dd MMM yyyy', { locale: es })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">Columnas:</span>
                          <span className="ml-2 text-gray-900">{board.columns?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'tasks' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Todas las Tareas ({totalTasks})
                    </h3>
                  </div>

                  {board.columns?.map((column) => (
                    <div key={column.id} className="mb-8">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                        {column.nombre} ({column.tasks?.length || 0})
                      </h4>

                      {column.tasks?.length > 0 ? (
                        <div className="space-y-3">
                          {column.tasks.map((task) => (
                            <div key={task.id} className="bg-white border rounded-lg p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900 mb-2">{task.titulo}</h5>
                                  {task.descripcion && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                      {task.descripcion}
                                    </p>
                                  )}
                                  <div className="flex items-center space-x-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.prioridad)
                                      }`}>
                                      {task.prioridad || 'Media'}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.avance)
                                      }`}>
                                      {getStatusText(task.avance)} ({task.avance}%)
                                    </span>
                                    {task.fecha_vencimiento && (
                                      <span className="text-xs text-gray-500 flex items-center">
                                        <CalendarIcon className="h-3 w-3 mr-1" />
                                        {format(new Date(task.fecha_vencimiento), 'dd MMM', { locale: es })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {task.avance === 100 && (
                                  <CheckCircleSolid className="h-5 w-5 text-green-500 mt-1" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No hay tareas en esta columna</p>
                      )}
                    </div>
                  )) || (
                      <p className="text-gray-500 text-center py-8">No hay tareas disponibles</p>
                    )}
                </div>
              )}

              {selectedTab === 'activity' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Actividad Reciente</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          Tablero actualizado el{' '}
                          <span className="font-medium">
                            {format(new Date(board.updated_at), 'dd MMM yyyy HH:mm', { locale: es })}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          Tablero creado el{' '}
                          <span className="font-medium">
                            {format(new Date(board.created_at), 'dd MMM yyyy HH:mm', { locale: es })}
                          </span>
                        </p>
                      </div>
                    </div>
                    {totalTasks === 0 && (
                      <div className="text-center py-8">
                        <InformationCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No hay actividad reciente disponible</p>
                        <p className="text-gray-400 text-sm mt-1">
                          Las actividades aparecerán aquí cuando se realicen cambios
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};