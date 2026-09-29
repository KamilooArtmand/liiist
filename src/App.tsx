import React, { useState, useEffect } from 'react';
import { ListGroup, ListItem, ViewMode } from './types';
import { INITIAL_LISTS } from './data/initialLists';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Sidebar } from './components/Sidebar';
import { ListView } from './components/ListView';
import { CreateListModal } from './components/CreateListModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { ExportModal } from './components/ExportModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Menu, Plus, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  const [lists, setLists] = useLocalStorage<ListGroup[]>('liiist_data_v1', INITIAL_LISTS);
  const [selectedListId, setSelectedListId] = useState<string>(() => {
    return lists[0]?.id || '';
  });
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('liiist_dark_mode', false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingListMeta, setEditingListMeta] = useState<ListGroup | null>(null);

  const [activeItemForDetail, setActiveItemForDetail] = useState<ListItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [exportingList, setExportingList] = useState<ListGroup | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Apply dark mode class to root HTML
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Global hotkey ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Ensure selected list exists
  const currentList = lists.find(l => l.id === selectedListId) || lists[0] || null;

  // Handlers for List management
  const handleCreateList = (
    newListData: Omit<ListGroup, 'id' | 'items' | 'createdAt' | 'updatedAt'>
  ) => {
    const newList: ListGroup = {
      ...newListData,
      id: `list-${Date.now()}`,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setLists([newList, ...lists]);
    setSelectedListId(newList.id);
  };

  const handleUpdateList = (updated: ListGroup) => {
    setLists(lists.map(l => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteList = (listId: string) => {
    const filtered = lists.filter(l => l.id !== listId);
    setLists(filtered);
    if (selectedListId === listId) {
      setSelectedListId(filtered[0]?.id || '');
    }
  };

  // Item detail updates
  const handleSaveItemDetail = (updatedItem: ListItem) => {
    if (!currentList) return;
    const updatedItems = currentList.items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    handleUpdateList({
      ...currentList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleDeleteItem = (itemId: string) => {
    if (!currentList) return;
    const updatedItems = currentList.items.filter(item => item.id !== itemId);
    handleUpdateList({
      ...currentList,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  // Reset to default sample lists
  const handleResetToDemo = () => {
    if (confirm('Reset to initial starter lists? Your existing custom lists will be replaced.')) {
      setLists(INITIAL_LISTS);
      setSelectedListId(INITIAL_LISTS[0].id);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpenMobile && (
        <div
          onClick={() => setIsSidebarOpenMobile(false)}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Desktop & Mobile Slide-over) */}
      <div
        className={`fixed md:static inset-y-0 left-0 z-40 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          lists={lists}
          selectedListId={currentList?.id || ''}
          onSelectList={id => {
            setSelectedListId(id);
            setIsSidebarOpenMobile(false);
          }}
          onOpenCreateModal={() => {
            setEditingListMeta(null);
            setIsCreateModalOpen(true);
            setIsSidebarOpenMobile(false);
          }}
          onOpenSearch={() => {
            setIsSearchOpen(true);
            setIsSidebarOpenMobile(false);
          }}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-stone-50 dark:bg-stone-900">
        {/* Mobile Top App Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSidebarOpenMobile(true)}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-base tracking-tight text-stone-900 dark:text-stone-100">
              {currentList?.title || 'Liiist'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingListMeta(null);
              setIsCreateModalOpen(true);
            }}
            className="p-1.5 rounded-xl bg-amber-500 text-white"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        {currentList ? (
          <ListView
            list={currentList}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onUpdateList={handleUpdateList}
            onDeleteList={handleDeleteList}
            onEditListMeta={list => {
              setEditingListMeta(list);
              setIsCreateModalOpen(true);
            }}
            onExportList={list => setExportingList(list)}
            onSelectItem={item => {
              setActiveItemForDetail(item);
              setIsDetailModalOpen(true);
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-4xl mb-3">📝</span>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              No Lists Found
            </h2>
            <p className="text-sm text-stone-500 max-w-sm mb-6">
              Create a fresh to-do list, ranked review, or shopping itinerary to get started.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Create New List
              </button>
              <button
                type="button"
                onClick={handleResetToDemo}
                className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Load Starter Templates
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Create / Edit List Modal */}
      <CreateListModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingListMeta(null);
        }}
        onCreate={handleCreateList}
        initialData={editingListMeta}
        onUpdate={handleUpdateList}
      />

      {/* Item Detail / Edit Modal */}
      {currentList && (
        <ItemDetailModal
          item={activeItemForDetail}
          listType={currentList.type}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setActiveItemForDetail(null);
          }}
          onSave={handleSaveItemDetail}
          onDelete={handleDeleteItem}
        />
      )}

      {/* Export & Share Modal */}
      <ExportModal
        list={exportingList}
        isOpen={!!exportingList}
        onClose={() => setExportingList(null)}
      />

      {/* Global Omnibar Search */}
      <GlobalSearchModal
        lists={lists}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectList={listId => {
          setSelectedListId(listId);
          setIsSearchOpen(false);
        }}
        onSelectItem={(listId, item) => {
          setSelectedListId(listId);
          setActiveItemForDetail(item);
          setIsDetailModalOpen(true);
          setIsSearchOpen(false);
        }}
      />
    </div>
  );
};

export default App;
