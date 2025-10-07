import { useState } from 'react';
import toast from 'react-hot-toast';
import { useBoards } from '../hooks/useBoards.js';
import { BoardCard } from '../components/Board/BoardCard.jsx';
import { BoardDetails } from '../components/Board/BoardDetails.jsx';
import { CreateBoardForm } from '../components/Board/CreateBoardForm.jsx';
import { UpdateBoardForm } from '../components/Board/UpdateBoardForm.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { DeleteConfirmation } from '../components/common/DeleteConfirmation.jsx';
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export const BoardsPage = () => {
  const {
    boards,
    loading,
    error,
    selectedBoard: detailedBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    searchBoards,
    fetchBoardById,
    clearError,
  } = useBoards();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle create board
  const handleCreateBoard = () => {
    setSelectedBoard(null);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (data) => {
    setActionLoading(true);
    try {
      const newBoard = await createBoard(data);
      if (newBoard) {
        setShowCreateModal(false);
        toast.success('Tablero creado exitosamente');
      }
    } catch (error) {
      console.error('Error creating board:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle edit board
  const handleEditBoard = (board) => {
    setSelectedBoard(board);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data) => {
    if (!selectedBoard) return;
    
    setActionLoading(true);
    try {
      const updatedBoard = await updateBoard(selectedBoard.id, data);
      if (updatedBoard) {
        setShowEditModal(false);
        setSelectedBoard(null);
        toast.success('Tablero actualizado exitosamente');
      }
    } catch (error) {
      console.error('Error updating board:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete board
  const handleDeleteBoard = (board) => {
    setSelectedBoard(board);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBoard) return;
    
    setActionLoading(true);
    try {
      const success = await deleteBoard(selectedBoard.id);
      if (success) {
        setShowDeleteModal(false);
        setSelectedBoard(null);
        toast.success('Tablero eliminado exitosamente');
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle view board details
  const handleViewBoard = async (board) => {
    setSelectedBoard(board);
    setShowDetailsModal(true);
    setDetailsLoading(true);
    
    try {
      await fetchBoardById(board.id);
    } catch (error) {
      console.error('Error fetching board details:', error);
      toast.error('Error al cargar los detalles del tablero');
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle search
  const handleSearch = async (query) => {
    try {
      setSearchQuery(query);
      await searchBoards(query);
    } catch (error) {
      console.error('Error searching boards:', error);
    }
  };

  // Close modals
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedBoard(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBoard(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedBoard(null);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedBoard(null);
  };

  // Handle edit from details modal
  const handleEditFromDetails = (board) => {
    setSelectedBoard(board);
    setShowDetailsModal(false);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableros Kanban</h1>
            <p className="text-gray-600 mt-1">
              Gestiona tus proyectos y organiza tu trabajo de manera eficiente
            </p>
          </div>
          
          <button
            onClick={handleCreateBoard}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Tablero
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-8">
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

        {/* Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{boards.length}</div>
              <div className="text-sm text-gray-500">Total de Tableros</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {boards.reduce((acc, board) => acc + (board.columns?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">Columnas Activas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {boards.reduce((acc, board) => 
                  acc + (board.columns?.reduce((colAcc, col) => 
                    colAcc + (col.tasks?.length || 0), 0) || 0), 0
                )}
              </div>
              <div className="text-sm text-gray-500">Tareas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {boards.reduce((acc, board) => 
                  acc + (board.columns?.reduce((colAcc, col) => 
                    colAcc + (col.tasks?.filter(task => task.avance === 100).length || 0), 0) || 0), 0
                )}
              </div>
              <div className="text-sm text-gray-500">Completadas</div>
            </div>
          </div>
        </div>

        {/* Boards grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No se encontraron tableros' : 'No hay tableros'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando tu primer tablero Kanban'
              }
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreateBoard}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Primer Tablero
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onView={handleViewBoard}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
              />
            ))}
          </div>
        )}

        {/* Create Board Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          size="lg"
        >
          <CreateBoardForm
            onSubmit={handleCreateSubmit}
            onCancel={closeCreateModal}
            loading={actionLoading}
          />
        </Modal>

        {/* Edit Board Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={closeEditModal}
          size="lg"
        >
          {selectedBoard && (
            <UpdateBoardForm
              board={selectedBoard}
              onSubmit={handleEditSubmit}
              onCancel={closeEditModal}
              loading={actionLoading}
            />
          )}
        </Modal>

        {/* Delete Board Confirmation */}
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onCancel={closeDeleteModal}
          title="Eliminar Tablero"
          message="¿Estás seguro de que deseas eliminar este tablero? Esta acción no se puede deshacer y se eliminarán todas las columnas y tareas asociadas."
          itemName={selectedBoard?.nombre}
          loading={actionLoading}
        />

        {/* Board Details Modal */}
        <BoardDetails
          board={detailedBoard || selectedBoard}
          isOpen={showDetailsModal}
          onClose={closeDetailsModal}
          onEditBoard={handleEditFromDetails}
          onDeleteBoard={handleDeleteBoard}
          loading={detailsLoading}
        />
      </div>
    </div>
  );
};