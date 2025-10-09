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
      // Filtrar columnas por board_id ya que no hay endpoint específico
      const allColumns = await apiClient.get(this.endpoint);
      return allColumns.filter(column => column.board_id === parseInt(boardId));
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

  async createColumn(columnData) {
    try {
      if (!columnData.titulo || columnData.titulo.trim().length === 0) {
        throw new Error('El título de la columna es requerido');
      }

      return await apiClient.post(this.endpoint, columnData);
    } catch (error) {
      console.error('Error creating column:', error);
      throw error;
    }
  }

  async updateColumn(id, columnData) {
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

export const columnsService = new ColumnService();
export default columnsService;
