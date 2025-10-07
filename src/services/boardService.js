import { apiClient } from './apiClient.js';

export class BoardService {
  constructor() {
    this.endpoint = '/boards';
  }

  /**
   * Obtiene todos los tableros con sus columnas y tareas
   * @returns {Promise<Board[]>}
   */
  async getAllBoards() {
    try {
      return await apiClient.get(this.endpoint);
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
  }

  /**
   * Obtiene un tablero específico por ID
   * @param {number} id
   * @returns {Promise<Board>}
   */
  async getBoardById(id) {
    try {
      return await apiClient.get(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error fetching board ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo tablero
   * @param {CreateBoardDTO} boardData
   * @returns {Promise<Board>}
   */
  async createBoard(boardData) {
    try {
      // Validación básica
      if (!boardData.nombre || boardData.nombre.trim().length === 0) {
        throw new Error('El nombre del tablero es requerido');
      }

      return await apiClient.post(this.endpoint, boardData);
    } catch (error) {
      console.error('Error creating board:', error);
      throw error;
    }
  }

  /**
   * Actualiza un tablero existente
   * @param {number} id
   * @param {UpdateBoardDTO} boardData
   * @returns {Promise<Board>}
   */
  async updateBoard(id, boardData) {
    try {
      // Validación: al menos un campo debe estar presente
      if (!boardData.nombre && !boardData.descripcion) {
        throw new Error('Al menos un campo debe ser proporcionado para la actualización');
      }

      // Si se proporciona nombre, validar que no esté vacío
      if (boardData.nombre && boardData.nombre.trim().length === 0) {
        throw new Error('El nombre del tablero no puede estar vacío');
      }

      return await apiClient.put(`${this.endpoint}/${id}`, boardData);
    } catch (error) {
      console.error(`Error updating board ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un tablero
   * @param {number} id
   * @returns {Promise<void>}
   */
  async deleteBoard(id) {
    try {
      await apiClient.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error deleting board ${id}:`, error);
      throw error;
    }
  }

  /**
   * Busca tableros por nombre
   * @param {string} query
   * @returns {Promise<Board[]>}
   */
  async searchBoards(query) {
    try {
      const boards = await this.getAllBoards();
      return boards.filter(board => 
        board.nombre.toLowerCase().includes(query.toLowerCase()) ||
        (board.descripcion && board.descripcion.toLowerCase().includes(query.toLowerCase()))
      );
    } catch (error) {
      console.error('Error searching boards:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas básicas de un tablero
   * @param {number} id
   * @returns {Promise<Object>}
   */
  async getBoardStats(id) {
    try {
      const board = await this.getBoardById(id);
      
      const totalColumns = board.columns?.length || 0;
      const totalTasks = board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0;
      const completedTasks = board.columns?.reduce(
        (acc, col) => acc + (col.tasks?.filter(task => task.avance === 100).length || 0), 
        0
      ) || 0;
      const pendingTasks = totalTasks - completedTasks;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalColumns,
        totalTasks,
        completedTasks,
        pendingTasks,
        completionPercentage,
      };
    } catch (error) {
      console.error(`Error getting board stats for ${id}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const boardService = new BoardService();
export default boardService;