import axios from 'axios';
import toast from 'react-hot-toast';
import { config } from '../config/index.js';

class ApiClient {
  constructor(baseURL = config.API_BASE_URL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      baseURL,
      timeout: config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        
        // Loading toast para operaciones largas
        if (config.method !== 'get') {
          toast.loading('Procesando...', { id: 'api-loading' });
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        // Dismiss loading toast
        toast.dismiss('api-loading');
        
        // Success toast for non-GET requests
        if (response.config.method !== 'get') {
          const messages = {
            post: 'Creado exitosamente',
            put: 'Actualizado exitosamente',
            patch: 'Actualizado exitosamente',
            delete: 'Eliminado exitosamente',
          };
          
          const method = response.config.method;
          if (messages[method]) {
            toast.success(messages[method]);
          }
        }
        
        return response;
      },
      (error) => {
        // Dismiss loading toast
        toast.dismiss('api-loading');
        
        // Handle different error types
        this.handleError(error);
        
        return Promise.reject(error);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          toast.error(data.message || 'Solicitud inválida');
          break;
        case 401:
          toast.error('No autorizado');
          // Redirect to login if needed
          break;
        case 403:
          toast.error('Acceso prohibido');
          break;
        case 404:
          toast.error('Recurso no encontrado');
          break;
        case 422:
          // Validation errors
          if (data.errors) {
            Object.values(data.errors).flat().forEach((error) => {
              toast.error(error);
            });
          } else {
            toast.error(data.message || 'Error de validación');
          }
          break;
        case 500:
          toast.error('Error interno del servidor');
          break;
        default:
          toast.error(data.message || 'Error desconocido');
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('No se pudo conectar con el servidor');
    } else {
      // Something else happened
      toast.error('Error de red');
    }
  }

  // Generic request methods
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data = null, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data = null, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url, data = null, config = {}) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Update base URL if needed
  setBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
    this.client.defaults.baseURL = newBaseURL;
  }

  // Get current base URL
  getBaseURL() {
    return this.baseURL;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;