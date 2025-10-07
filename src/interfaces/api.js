// Interfaces principales para la API (convertidas a JSDoc para documentación)

/**
 * @typedef {Object} Board
 * @property {number} id
 * @property {string} nombre
 * @property {string} [descripcion]
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Column[]} [columns]
 */

/**
 * @typedef {Object} Column
 * @property {number} id
 * @property {number} board_id
 * @property {string} titulo
 * @property {string} [color]
 * @property {number} posicion
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Task[]} [tasks]
 */

/**
 * @typedef {Object} Task
 * @property {number} id
 * @property {number} column_id
 * @property {string} nombre
 * @property {string} [descripcion]
 * @property {string} [fecha_asignacion]
 * @property {string} [fecha_limite]
 * @property {string} [asignador]
 * @property {string} [responsable]
 * @property {number} avance
 * @property {'alta'|'media'|'baja'} prioridad
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} CreateBoardDTO
 * @property {string} nombre
 * @property {string} [descripcion]
 */

/**
 * @typedef {Object} UpdateBoardDTO
 * @property {string} [nombre]
 * @property {string} [descripcion]
 */

/**
 * @typedef {Object} CreateColumnDTO
 * @property {number} board_id
 * @property {string} titulo
 * @property {string} [color]
 * @property {number} posicion
 */

/**
 * @typedef {Object} UpdateColumnDTO
 * @property {string} [titulo]
 * @property {string} [color]
 * @property {number} [posicion]
 */

/**
 * @typedef {Object} CreateTaskDTO
 * @property {number} column_id
 * @property {string} nombre
 * @property {string} [descripcion]
 * @property {string} [fecha_asignacion]
 * @property {string} [fecha_limite]
 * @property {string} [asignador]
 * @property {string} [responsable]
 * @property {number} [avance]
 * @property {'alta'|'media'|'baja'} [prioridad]
 */

/**
 * @typedef {Object} UpdateTaskDTO
 * @property {number} [column_id]
 * @property {string} [nombre]
 * @property {string} [descripcion]
 * @property {string} [fecha_asignacion]
 * @property {string} [fecha_limite]
 * @property {string} [asignador]
 * @property {string} [responsable]
 * @property {number} [avance]
 * @property {'alta'|'media'|'baja'} [prioridad]
 */

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {T} data
 * @property {string} [message]
 * @property {number} status
 */

/**
 * @typedef {Object} ApiError
 * @property {string} message
 * @property {Object.<string, string[]>} [errors]
 * @property {number} status
 */

// Export para que JSDoc funcione
export {};