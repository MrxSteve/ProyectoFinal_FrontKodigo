import { ExclamationTriangleIcon, TrashIcon } from '@heroicons/react/24/outline';

export const DeleteConfirmation = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  itemName,
  loading = false,
  className = '',
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`
            relative w-full max-w-md transform overflow-hidden 
            rounded-lg bg-white shadow-xl transition-all
            ${className}
          `}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              {/* Icon */}
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              
              {/* Content */}
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                  {itemName && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center">
                        <TrashIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">{itemName}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`
                w-full inline-flex justify-center rounded-md border border-transparent 
                shadow-sm px-4 py-2 text-base font-medium text-white 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 
                sm:ml-3 sm:w-auto sm:text-sm transition-colors
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-600 hover:bg-red-700'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Eliminando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <TrashIcon className="h-4 w-4" />
                  <span>Eliminar</span>
                </div>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className={`
                mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 
                shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 
                hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors
                ${loading ? 'cursor-not-allowed opacity-50' : ''}
              `}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};