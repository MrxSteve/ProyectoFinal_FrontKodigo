"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { useBoards } from "../hooks/useBoards.js"
import { BoardList } from "../components/Board/BoardList.jsx"
import { BoardDetails } from "../components/Board/BoardDetails.jsx"
import { CreateBoardForm } from "../components/Board/CreateBoardForm.jsx"
import { UpdateBoardForm } from "../components/Board/UpdateBoardForm.jsx"
import { Modal } from "../components/common/Modal.jsx"
import { DeleteConfirmation } from "../components/common/DeleteConfirmation.jsx"

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
  } = useBoards()

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)

  // Handle create board
  const handleCreateBoard = () => {
    setSelectedBoard(null)
    setShowCreateModal(true)
  }

  const handleCreateSubmit = async (data) => {
    setActionLoading(true)
    try {
      const newBoard = await createBoard(data)
      if (newBoard) {
        setShowCreateModal(false)
        setSelectedBoard(null)
        toast.success("Tablero creado exitosamente")
      } else {
        toast.error("Error al crear el tablero")
      }
    } catch (error) {
      console.error("Error creating board:", error)
      toast.error("Error al crear el tablero")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle edit board
  const handleEditBoard = (board) => {
    setSelectedBoard(board)
    setShowEditModal(true)
  }

  const handleEditSubmit = async (data) => {
    if (!selectedBoard) return

    setActionLoading(true)
    try {
      const updatedBoard = await updateBoard(selectedBoard.id, data)
      if (updatedBoard) {
        setShowEditModal(false)
        setSelectedBoard(null)
        toast.success("Tablero actualizado exitosamente")
        if (showDetailsModal && detailedBoard) {
          await fetchBoardById(detailedBoard.id)
        }
      } else {
        toast.error("Error al actualizar el tablero")
      }
    } catch (error) {
      console.error("Error updating board:", error)
      toast.error("Error al actualizar el tablero")
    } finally {
      setActionLoading(false)
    }
  }

  // Handle delete board
  const handleDeleteBoard = (board) => {
    setSelectedBoard(board)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedBoard) return

    setActionLoading(true)
    try {
      const success = await deleteBoard(selectedBoard.id)
      if (success) {
        setShowDeleteModal(false)
        setSelectedBoard(null)
        if (showDetailsModal) {
          setShowDetailsModal(false)
        }
        toast.success("Tablero eliminado exitosamente")
      }
    } catch (error) {
      console.error("Error deleting board:", error)
    } finally {
      setActionLoading(false)
    }
  }

  // Handle view board details
  const handleViewBoard = async (board) => {
    setSelectedBoard(board)
    setShowDetailsModal(true)
    setDetailsLoading(true)

    try {
      await fetchBoardById(board.id)
    } catch (error) {
      console.error("Error fetching board details:", error)
      toast.error("Error al cargar los detalles del tablero")
    } finally {
      setDetailsLoading(false)
    }
  }

  // Handle search
  const handleSearch = async (query) => {
    try {
      await searchBoards(query)
    } catch (error) {
      console.error("Error searching boards:", error)
    }
  }

  // Close modals
  const closeCreateModal = () => {
    setShowCreateModal(false)
    setSelectedBoard(null)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setSelectedBoard(null)
  }

  const closeDeleteModal = () => {
    setShowDeleteModal(false)
    setSelectedBoard(null)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedBoard(null)
  }

  // Handle edit from details modal
  const handleEditFromDetails = (board) => {
    setSelectedBoard(board)
    setShowDetailsModal(false)
    setShowEditModal(true)
  }

  const handleDataChange = async () => {
    if (detailedBoard) {
      await fetchBoardById(detailedBoard.id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BoardList
          boards={boards}
          loading={loading}
          onCreateBoard={handleCreateBoard}
          onViewBoard={handleViewBoard}
          onEditBoard={handleEditBoard}
          onDeleteBoard={handleDeleteBoard}
          onSearch={handleSearch}
        />

        {/* Create Board Modal */}
        <Modal isOpen={showCreateModal} onClose={closeCreateModal} size="lg">
          <CreateBoardForm onSubmit={handleCreateSubmit} onCancel={closeCreateModal} loading={actionLoading} />
        </Modal>

        {/* Edit Board Modal */}
        <Modal isOpen={showEditModal} onClose={closeEditModal} size="lg">
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
          onDataChange={handleDataChange}
        />
      </div>
    </div>
  )
}
