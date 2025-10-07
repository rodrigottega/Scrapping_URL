import React, { useState, useRef } from 'react';
import { URLOption, Status } from './types';
import UrlDropdown from './components/UrlDropdown';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import AddUrlModal from './components/AddUrlModal';

const initialUrlOptions: URLOption[] = [
  {
    id: 1,
    url: 'www.rappi.com',
    status: Status.Processed,
    timestamp: 'Hace 2 días',
  },
  {
    id: 2,
    url: 'www.google.com',
    status: Status.Pending,
    timestamp: 'Hace 1 hora',
  },
  {
    id: 3,
    url: 'www.github.com',
    status: Status.Error,
    timestamp: 'Hace 5 días',
  },
];

const App: React.FC = () => {
  const [urlOptions, setUrlOptions] = useState<URLOption[]>(initialUrlOptions);
  const [selectedUrl, setSelectedUrl] = useState<URLOption | null>(initialUrlOptions[0]);

  // State for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<URLOption | null>(null);

  // State for sync
  const [syncingUrlId, setSyncingUrlId] = useState<number | null>(null);
  const syncTimeoutRef = useRef<number | null>(null);


  const handleSelect = (option: URLOption | null) => {
    setSelectedUrl(option);
  };

  const handleDeleteRequest = (option: URLOption) => {
    setUrlToDelete(option);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!urlToDelete) return;

    setUrlOptions(prevOptions => prevOptions.filter(option => option.id !== urlToDelete.id));
    if (selectedUrl?.id === urlToDelete.id) {
      setSelectedUrl(null);
    }
    setIsDeleteModalOpen(false);
    setUrlToDelete(null);
  };

  const handleAddRequest = () => {
    setIsAddModalOpen(true);
  };

  const handleAddNewURL = (newUrl: string) => {
    if (newUrl) {
      const newOption: URLOption = {
        id: Date.now(),
        url: newUrl.trim(),
        status: Status.Pending,
        timestamp: 'Justo ahora',
      };
      setUrlOptions(prevOptions => [...prevOptions, newOption]);
      setSelectedUrl(newOption);
      setIsAddModalOpen(false);
    }
  };

  const handleSyncIndividual = (urlToSync: URLOption) => {
    setSelectedUrl(urlToSync);
    setSyncingUrlId(urlToSync.id);

    if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = window.setTimeout(() => {
        const updatedOptions = urlOptions.map(option => {
            if (option.id === urlToSync.id) {
                return {
                    ...option,
                    status: Status.Processed,
                    timestamp: 'Justo ahora',
                };
            }
            return option;
        });

        setUrlOptions(updatedOptions);

        const updatedSelected = updatedOptions.find(o => o.id === urlToSync.id);
        if (updatedSelected) {
            setSelectedUrl(updatedSelected);
        }

        setSyncingUrlId(null);
        syncTimeoutRef.current = null;
    }, 5000); // Simulate 5-second sync time
  };

  const handleCancelSync = () => {
    if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
    }
    setSyncingUrlId(null);
    syncTimeoutRef.current = null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-gray-50">
      <div className="w-full max-w-sm mx-auto">
        <h1 className="text-2xl font-bold text-gray-700 text-center mb-2">Selector de Dominio</h1>
        <p className="text-gray-500 text-center mb-6">Haz clic en el cuadro para ver y gestionar tus dominios.</p>
        <UrlDropdown
          options={urlOptions}
          selectedOption={selectedUrl}
          onSelect={handleSelect}
          onDelete={handleDeleteRequest}
          onAdd={handleAddRequest}
          onSyncIndividual={handleSyncIndividual}
          onCancelSync={handleCancelSync}
          syncingUrlId={syncingUrlId}
        />
      </div>
      
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        url={urlToDelete?.url || ''}
      />
      
      <AddUrlModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewURL}
      />
    </div>
  );
};

export default App;