import { apiClient } from './apiClient.js';

export class ColumnService {
  constructor() {
    this.endpoint = '/columns'; 
  }

  normalize(data) {
    const posRaw = data.posicion ?? data.position ?? '';
    return {
      board_id: Number(data.board_id ?? data.boardId),
      titulo: String(data.titulo ?? '').trim(),
      color: String(data.color ?? '#94a3b8'),
      ...(posRaw !== '' ? { posicion: parseInt(posRaw, 10) } : {}), 
    };
  }

  async getAllColumns() {
    return await apiClient.get(this.endpoint); 
  }

  async getColumnsByBoard(boardId) {
    const all = await apiClient.get(this.endpoint);
    return all.filter(c => c.board_id === Number(boardId));
  }

  async getColumnById(id) {
    return await apiClient.get(`${this.endpoint}/${id}`);
  }

  async createColumn(columnData) {
    const payload = this.normalize(columnData);
    if (!payload.titulo) throw new Error('El título de la columna es requerido');
    if (!payload.board_id) throw new Error('El board_id es requerido');


    const res = await apiClient.post(this.endpoint, payload); 
    return res;
  }

  async updateColumn(id, columnData) {
    if (columnData.titulo && columnData.titulo.trim().length === 0) {
      throw new Error('El titulo no puede estar vacío');
    }
    return await apiClient.patch(`${this.endpoint}/${id}`, columnData);
  }

  async deleteColumn(id) {
    return await apiClient.delete(`${this.endpoint}/${id}`);
  }
}

export const columnsService = new ColumnService();
export default columnsService;
