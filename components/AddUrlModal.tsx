
import React, { useState, useEffect } from 'react';

interface AddUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string) => void;
}

const AddUrlModal: React.FC<AddUrlModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [url, setUrl] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setUrl(''); // Reset on open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAdd(url.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
            <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Añadir nueva URL
            </h3>
            <div className="mt-4">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Dirección URL
                </label>
                <div className="mt-1">
                <input
                    type="text"
                    name="url"
                    id="url"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    autoFocus
                />
                </div>
            </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
                Añadir URL
            </button>
            <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={onClose}
            >
                Cancelar
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddUrlModal;
