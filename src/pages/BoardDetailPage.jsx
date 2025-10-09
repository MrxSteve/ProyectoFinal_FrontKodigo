import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

import { useBoards } from '../hooks/useBoards.js';
import { useColumns } from '../hooks/useColumns.js';
import { 
  ColumnList, 
  CreateColumnForm, 
  EditColumnForm 
} from '../components/Column/index.js';

export const BoardDetailPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { fetchBoard } = useBoards();
  const {
    columns,
    loading: columnsLoading,
    error: columnsError,
    fetchColumnsByBoard,
    addColumn,
    editColumn,
    removeColumn,
    clearError: clearColumnsError
  } = useColumns();

  // Local state
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Load board data
  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) {
        navigate('/boards');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch board details
        const boardData = await fetchBoard(parseInt(boardId));
        setBoard(boardData);

        // Fetch columns for this board
        await fetchColumnsByBoard(parseInt(boardId));
      } catch (err) {
        console.error('Error loading board:', err);
        setError('Error al cargar el tablero');
        toast.error('Error al cargar el tablero');
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, [boardId, fetchBoard, fetchColumnsByBoard, navigate]);

  // Handle create column
  const handleCreateColumn = () => {
    setSelectedColumn(null);
    setShowCreateColumn(true);
  };

  const handleCreateSubmit = async (columnData) => {
    setActionLoading(true);
    try {
      await addColumn(columnData);
      setShowCreateColumn(false);
      toast.success('Columna creada exitosamente');
    } catch (error) {
      console.error('Error creating column:', error);
      toast.error('Error al crear la columna');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit column
  const handleEditColumn = (column) => {
    setSelectedColumn(column);
    setShowEditColumn(true);
  };

  const handleEditSubmit = async (columnId, columnData) => {
    setActionLoading(true);
    try {
      await editColumn(columnId, columnData);
      setShowEditColumn(false);
      setSelectedColumn(null);
      toast.success('Columna actualizada exitosamente');
    } catch (error) {
      console.error('Error updating column:', error);
      toast.error('Error al actualizar la columna');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete column
  const handleDeleteColumn = async (columnId) => {
    setActionLoading(true);
    try {
      await removeColumn(columnId);
      setShowEditColumn(false);
      setSelectedColumn(null);
      toast.success('Columna eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting column:', error);
      toast.error('Error al eliminar la columna');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle add task (placeholder for now)
  const handleAddTask = (columnId) => {
    toast.info('Funcionalidad de tareas próximamente');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tablero...</p>
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el tablero</h2>
          <p className="text-gray-600 mb-4">{error || 'Tablero no encontrado'}</p>
          <button
            onClick={() => navigate('/boards')}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Volver a Tableros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/boards')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-1" />
              Volver a Tableros
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Configuración del tablero"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar tablero"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar tablero"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{board.nombre}</h1>
            {board.descripcion && (
              <p className="text-blue-100 text-lg">{board.descripcion}</p>
            )}
          </div>
        </div>

        {/* Board Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-gray-900">{columns.length}</div>
            <div className="text-sm text-gray-500">Columnas</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-blue-600">
              {columns.reduce((acc, col) => acc + (col.tasks?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-500">Tareas Totales</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-green-600">
              {columns.reduce((acc, col) => 
                acc + (col.tasks?.filter(task => task.avance === 100).length || 0), 0
              )}
            </div>
            <div className="text-sm text-gray-500">Completadas</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-200">
            <div className="text-3xl font-bold text-orange-600">
              {columns.reduce((acc, col) => 
                acc + (col.tasks?.filter(task => task.avance < 100).length || 0), 0
              )}
            </div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
        </div>

        {/* Columns Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ColumnList
            columns={columns}
            loading={columnsLoading}
            onCreateColumn={handleCreateColumn}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
            onAddTask={handleAddTask}
            boardId={parseInt(boardId)}
          />
        </div>

        {/* Create Column Modal */}
        {showCreateColumn && (
          <CreateColumnForm
            isOpen={showCreateColumn}
            onClose={() => setShowCreateColumn(false)}
            onSubmit={handleCreateSubmit}
            loading={actionLoading}
            boardId={parseInt(boardId)}
            existingColumns={columns}
          />
        )}

        {/* Edit Column Modal */}
        {showEditColumn && selectedColumn && (
          <EditColumnForm
            isOpen={showEditColumn}
            onClose={() => {
              setShowEditColumn(false);
              setSelectedColumn(null);
            }}
            onSubmit={handleEditSubmit}
            onDelete={handleDeleteColumn}
            loading={actionLoading}
            column={selectedColumn}
            existingColumns={columns}
          />
        )}
      </div>
    </div>
  );
};