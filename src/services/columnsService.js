import { apiClient } from './apiClient.js';

export class ColumnService {
  constructor() {
    this.endpoint = '/columns';
  }

  async getAllColumns() {
    try {
      return await apiClient.get(this.endpoint);
    } catch (error) {
      console.error('Error fetching columns: ', error);
      throw error;
    }
  }

  async getColumnsByBoard(boardId) {
    try {
      return await apiClient.get(`/boards/${boardId}/columns`);
    } catch (error) {
      console.error(`Error fetching columns for board ${boardId}: `, error);
      throw error;
    }
  }

  async getColumnById(id) {
    try {
      return await apiClient.get(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error fetching column ${id}:`, error);
      throw error;
    }
  }

  async createColumns(boardId, columnsData, currentColumns = []){
    try {
      if (!columnsData.titulo || columnsData.titulo.trim().length === 0) {
        throw new Error('El título de la columna es requerido');
      }

      const nextPosition = currentColumns.length + 1;
      const defaultColor = '#94a3b8'; 

     
      const dataToSend = {
        titulo: columnsData.titulo,
        board_id: boardId, 
        color: columnsData.color || defaultColor, 
        posicion: columnsData.posicion || nextPosition, 
      };

      return await apiClient.post(this.endpoint, dataToSend);
    } catch (error) {
      console.error(`Error creating columns for board ${boardId}: `, error);
      throw error;
    }
  }

  async updateColumns(id, columnData) {
    try {
      if (columnData.titulo && columnData.titulo.trim().length === 0) {
        throw new Error('El titulo no puede estar vacío');
      }
      return await apiClient.put(`${this.endpoint}/${id}`, columnData);
    } catch (error) {
      console.error(`Error updating column ${id}: `, error);
      throw error;
    }
  }

  async deleteColumn(id) {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting column ${id}:`, error);
      throw error;
    }
  }
}

export const columnService = new ColumnService();
export default columnService;
