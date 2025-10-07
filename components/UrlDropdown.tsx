import React, { useState, useRef, useEffect } from 'react';
import { URLOption, Status } from '../types';

// --- Helper Components & Icons (defined within the same file for simplicity) ---

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChevronUpDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
);

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.134H8.09a2.09 2.09 0 00-2.09 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const SyncIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 9H4m4-4L4 9l4 4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 15h16m-4-4l4 4-4 4" />
    </svg>
);

const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    [Status.Processed]: 'bg-green-100 text-green-800',
    [Status.Pending]: 'bg-yellow-100 text-yellow-800',
    [Status.Error]: 'bg-red-100 text-red-800',
  };

  const statusIcons = {
    [Status.Processed]: <CheckIcon className="w-4 h-4 text-green-600" />,
    [Status.Pending]: <ClockIcon className="w-4 h-4 text-yellow-600" />,
    [Status.Error]: <ExclamationCircleIcon className="w-4 h-4 text-red-600" />,
  }

  return (
    <div className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {statusIcons[status]}
      <span>{status}</span>
    </div>
  );
};


// --- Main Dropdown Component ---

interface UrlDropdownProps {
  options: URLOption[];
  selectedOption: URLOption | null;
  onSelect: (option: URLOption | null) => void;
  onDelete: (option: URLOption) => void;
  onAdd: () => void;
  onSyncIndividual: (option: URLOption) => void;
  onCancelSync: () => void;
  syncingUrlId: number | null;
}

const UrlDropdown: React.FC<UrlDropdownProps> = ({ options, selectedOption, onSelect, onDelete, onAdd, onSyncIndividual, onCancelSync, syncingUrlId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(''); // Clear search on open
    }
  }, [isOpen]);

  const handleSelectOption = (option: URLOption) => {
    onSelect(option);
    setIsOpen(false);
  };
  
  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setIsOpen(false);
  }
  
  const handleDeleteOption = (e: React.MouseEvent, option: URLOption) => {
      e.stopPropagation();
      onDelete(option);
      setIsOpen(false);
  }

  const handleAddOption = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd();
    setIsOpen(false);
  }

  const handleSyncIndividualClick = (e: React.MouseEvent, option: URLOption) => {
    e.stopPropagation();
    onSyncIndividual(option);
    setIsOpen(false);
  };

  const filteredOptions = options.filter(option =>
    option.url.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isSyncing = syncingUrlId !== null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isSyncing && setIsOpen(!isOpen)}
        className={`w-full bg-white border border-gray-300 rounded-lg shadow-sm p-3 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${isSyncing ? 'opacity-75 cursor-not-allowed' : ''}`}
      >
        <div className="flex justify-between items-center">
            {isSyncing && selectedOption?.id === syncingUrlId ? (
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col flex-grow mr-4 overflow-hidden">
                        <span className="text-base text-gray-900 font-medium truncate">{selectedOption.url}</span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div className="bg-blue-600 h-1.5 rounded-full animate-progress"></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-1">Sincronizando...</span>
                    </div>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancelSync();
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0 cursor-pointer"
                        aria-label="Cancelar sincronización"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <>
                    {selectedOption ? (
                        <div className="flex flex-col">
                        <span className="text-base text-gray-900 font-medium">{selectedOption.url}</span>
                        <div className="flex items-center space-x-2 mt-1.5">
                            <StatusBadge status={selectedOption.status} />
                            <span className="text-sm text-gray-500">{selectedOption.timestamp}</span>
                        </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-base text-gray-500 font-medium">Ninguna URL seleccionada</span>
                        </div>
                    )}
                    <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </>
            )}
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 rounded-md">
            <div className="p-2 border-b border-gray-200">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Buscar URL..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </div>
            <ul className="max-h-60 overflow-auto py-1">
                <li>
                    <button
                        onClick={handleClearSelection}
                        className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-colors ${!selectedOption ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-5">
                                {!selectedOption && (
                                <CheckIcon className="w-5 h-5 text-indigo-600" />
                                )}
                            </div>
                            <span className={`italic ${!selectedOption ? 'text-indigo-900' : 'text-gray-500'}`}>Ninguna URL seleccionada</span>
                        </div>
                    </button>
                </li>
                <li className="border-t border-gray-100 my-1"></li>
                {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                        <li key={option.id}>
                            <button
                                onClick={() => handleSelectOption(option)}
                                className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center group transition-colors ${selectedOption?.id === option.id ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
                            >
                                <div className="flex items-center space-x-3 truncate">
                                    <div className="w-5 flex-shrink-0">
                                        {selectedOption?.id === option.id && (
                                            <CheckIcon className="w-5 h-5 text-indigo-600" />
                                        )}
                                    </div>
                                    <div className="flex flex-col truncate">
                                        <span className={`font-medium truncate ${selectedOption?.id === option.id ? 'text-indigo-900' : 'text-gray-900'}`}>{option.url}</span>
                                        <span className={`text-xs ${selectedOption?.id === option.id ? 'text-indigo-700' : 'text-gray-500'}`}>{option.status} - {option.timestamp}</span>
                                    </div>
                                </div>
                                <div className="flex items-center flex-shrink-0 ml-4" style={{minWidth: '60px'}}>
                                    {syncingUrlId === option.id ? (
                                        <div className="w-full flex flex-col items-center justify-center">
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                                <div className="bg-blue-600 h-1.5 rounded-full animate-progress"></div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">Sincronizando...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleSyncIndividualClick(e, option)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors peer"
                                                    aria-label={`Sincronizar ${option.url}`}
                                                >
                                                    <SyncIcon className="w-5 h-5" />
                                                </button>
                                                <div
                                                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none"
                                                    role="tooltip"
                                                >
                                                    Sincronizar
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleDeleteOption(e, option)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors peer"
                                                    aria-label={`Eliminar ${option.url}`}
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                                <div
                                                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 peer-hover:opacity-100 transition-opacity pointer-events-none"
                                                    role="tooltip"
                                                >
                                                    Borrar
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </li>
                    ))
                ) : (
                    <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
                        No se encontraron resultados.
                    </li>
                )}
            </ul>
            <div className="border-t border-gray-200">
                <button
                    onClick={handleAddOption}
                    className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Añadir otra URL</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UrlDropdown;