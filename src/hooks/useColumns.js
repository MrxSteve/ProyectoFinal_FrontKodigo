
import { useState, useCallback } from 'react';
import { columnsService } from '../services/columnsService.js';

export const useColumns = () => {
  const [state, setState] = useState({
    columns: [],
    loading: false,
    error: null,
  });

  // Helper function to update state
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Fetch columns for a specific board
  const fetchColumnsByBoard = useCallback(async (boardId) => {
    try {
      updateState({ loading: true, error: null });
      const columns = await columnsService.getColumnsByBoard(boardId);
      updateState({ columns, loading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar las columnas';
      updateState({ 
        columns: [], 
        loading: false, 
        error: errorMessage 
      });
      throw error;
    }
  }, [updateState]);

  // Create new column
  const addColumn = useCallback(async (columnData) => {
    try {
      updateState({ loading: true, error: null });
      const newColumn = await columnsService.createColumn(columnData);
      updateState(prev => ({ 
        columns: [...prev.columns, newColumn], 
        loading: false 
      }));
      return newColumn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la columna';
      updateState({ loading: false, error: errorMessage });
      throw error;
    }
  }, [updateState]);

  // Update existing column
  const editColumn = useCallback(async (columnId, columnData) => {
    try {
      updateState({ loading: true, error: null });
      const updatedColumn = await columnsService.updateColumn(columnId, columnData);
      updateState(prev => ({
        columns: prev.columns.map(col => 
          col.id === columnId ? updatedColumn : col
        ),
        loading: false
      }));
      return updatedColumn;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar la columna';
      updateState({ loading: false, error: errorMessage });
      throw error;
    }
  }, [updateState]);

  // Delete column
  const removeColumn = useCallback(async (columnId) => {
    try {
      updateState({ loading: true, error: null });
      await columnsService.deleteColumn(columnId);
      updateState(prev => ({
        columns: prev.columns.filter(col => col.id !== columnId),
        loading: false
      }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la columna';
      updateState({ loading: false, error: errorMessage });
      throw error;
    }
  }, [updateState]);

  // Clear error
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  return {
    // State
    columns: state.columns,
    loading: state.loading,
    error: state.error,
    
    // Actions
    fetchColumnsByBoard,
    addColumn,
    editColumn,
    removeColumn,
    clearError,
  };
};