import { useState, useEffect, useCallback } from 'react';
import { boardService } from '../services/boardService.js';

export const useBoards = () => {
  const [state, setState] = useState({
    boards: [],
    loading: false,
    error: null,
    selectedBoard: null,
  });

  // Helper function to update state
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Fetch all boards
  const fetchBoards = useCallback(async () => {
    try {
      updateState({ loading: true, error: null });
      const boards = await boardService.getAllBoards();
      updateState({ boards, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los tableros';
      updateState({ 
        boards: [], 
        loading: false, 
        error: errorMessage 
      });
    }
  }, [updateState]);

  // Fetch specific board by ID
  const fetchBoardById = useCallback(async (id) => {
    try {
      updateState({ loading: true, error: null });
      const board = await boardService.getBoardById(id);
      updateState({ selectedBoard: board, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar el tablero';
      updateState({ 
        selectedBoard: null, 
        loading: false, 
        error: errorMessage 
      });
    }
  }, [updateState]);

  // Create new board
  const createBoard = useCallback(async (boardData) => {
    try {
      updateState({ loading: true, error: null });
      const newBoard = await boardService.createBoard(boardData);
      
      // Add to existing boards list and stop loading
      updateState(prev => ({
        boards: [...prev.boards, newBoard],
        loading: false,
        error: null
      }));
      
      return newBoard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el tablero';
      updateState({ loading: false, error: errorMessage });
      return null;
    }
  }, [updateState]);

  // Update existing board
  const updateBoard = useCallback(async (id, boardData) => {
    try {
      updateState({ loading: true, error: null });
      const updatedBoard = await boardService.updateBoard(id, boardData);
      
      // Update in boards list
      updateState(prev => ({
        boards: prev.boards.map(board => 
          board.id === id ? updatedBoard : board
        ),
        selectedBoard: prev.selectedBoard?.id === id ? updatedBoard : prev.selectedBoard,
        loading: false,
      }));
      
      return updatedBoard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el tablero';
      updateState({ loading: false, error: errorMessage });
      return null;
    }
  }, [updateState]);

  // Delete board
  const deleteBoard = useCallback(async (id) => {
    try {
      updateState({ loading: true, error: null });
      await boardService.deleteBoard(id);
      
      // Remove from boards list
      updateState(prev => ({
        boards: prev.boards.filter(board => board.id !== id),
        selectedBoard: prev.selectedBoard?.id === id ? null : prev.selectedBoard,
        loading: false,
      }));
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el tablero';
      updateState({ loading: false, error: errorMessage });
      return false;
    }
  }, [updateState]);

  // Search boards
  const searchBoards = useCallback(async (query) => {
    try {
      updateState({ loading: true, error: null });
      
      if (query.trim() === '') {
        // If empty query, fetch all boards
        await fetchBoards();
      } else {
        const filteredBoards = await boardService.searchBoards(query);
        updateState({ boards: filteredBoards, loading: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al buscar tableros';
      updateState({ loading: false, error: errorMessage });
    }
  }, [updateState, fetchBoards]);

  const refreshBoard = useCallback(async (id) => {
    try {
        const updatedBoard = await boardService.getBoardById(id); // <--- Esto debe traer las COLUMNAS
        
        updateState(prev => ({
            boards: prev.boards.map(board => 
                board.id === id ? updatedBoard : board
            ),
            selectedBoard: prev.selectedBoard?.id === id ? updatedBoard : prev.selectedBoard,
        }));
    } catch (error) {
        console.error('Error refreshing board:', error);
    }
}, [updateState]);;

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  // Clear selected board
  const clearSelectedBoard = useCallback(() => {
    updateState({ selectedBoard: null });
  }, [updateState]);

  // Fetch single board (returns the board directly)
  const fetchBoard = useCallback(async (id) => {
    try {
      const board = await boardService.getBoardById(id);
      return board;
    } catch (error) {
      throw error;
    }
  }, []);

  // Load boards on mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    // State
    boards: state.boards,
    loading: state.loading,
    error: state.error,
    selectedBoard: state.selectedBoard,
    
    // Actions
    fetchBoards,
    fetchBoardById,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    searchBoards,
    clearError,
    clearSelectedBoard,
    refreshBoard,
  };
};