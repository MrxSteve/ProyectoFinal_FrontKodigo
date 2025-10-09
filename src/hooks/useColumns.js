
import { useState, useEffect } from 'react';

import { columnService } from '../services/columnsService';


export const useColumns = (boardId, initialColumns = []) => {
    const [columns, setColumns] = useState(initialColumns);
    const [error, setError] = useState(null);

   const addColumn = async (columnData) => {
  try {
    const response = await columnService.createColumns(boardId, columnData, columns);
    const newColumn = response.data; 

    setColumns((prevColumns) => [...prevColumns, newColumn]);
    setError(null);
    return newColumn; 
  } catch (err) {
    console.error('Error al crear la columna:', err);
    setError(err.message);
    throw err; 
  }
};


    const removeColumn = async (columnId) => {
        try {
            await columnService.deleteColumn(columnId);
            setColumns((prevColumns) =>
                prevColumns.filter((col) => col.id !== columnId)
            );
            setError(null);
        } catch (err) {
            console.error('Error al eliminar la columna:', err);
            setError(err.message);
            throw err;
        }
    };

    const editColumn = async (columnId, updatedData) => {
        try {
            const response = await columnService.updateColumns(columnId, updatedData);
            const updatedColumn = response.data;
            setColumns(prevColumns => prevColumns.map(col =>
                col.id === columnId ? updatedColumn : col
            ));
            setError(null);
            return updatedColumn;
        } catch (err) {
            console.error('Error al actualizar la columna:', err);
            setError(err.message);
            throw err;
        }
    };

    return { columns, setColumns, error, addColumn, removeColumn, editColumn };
};