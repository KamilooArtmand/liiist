import React, { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/hooks-useLocalStorage';
import { Info } from 'lucide-react';
import { SupportedLanguage, TRANSLATIONS } from './types/types-language';
import { Country } from './types/types-country';
import { StateInfo } from './types/types-hierarchy';
import { BookmarkedPage } from './types/types-bookmark';
import { COUNTRIES_DATA } from './data/data-countriesData';
import { ALL_50_US_STATES } from './data/data-usStatesData';
import { MinimalHeader } from './components/components-MinimalHeader';
import { MinimalCapsuleLanding } from './components/components-MinimalCapsuleLanding';
import { ListView } from './components/components-ListView';
import { ExploreFeedPage } from './components/components-ExploreFeedPage';
import { WorldOverviewPage } from './components/components-WorldOverviewPage';
import { WorldCountryPage } from './components/components-WorldCountryPage';
import { CountryDetailPage } from './components/components-CountryDetailPage';
import { StatesDirectoryPage } from './components/components-StatesDirectoryPage';
import { StateDetailPage } from './components/components-StateDetailPage';
import { LanguagesDirectoryPage } from './components/components-LanguagesDirectoryPage';
import { LanguageDetailPage } from './components/components-LanguageDetailPage';
import { MoviesDirectoryPage } from './components/components-MoviesDirectoryPage';
import { MovieDetailPage } from './components/components-MovieDetailPage';
import { ListItem } from './types/types-index';
import { WorldLanguage } from './types/types-worldLanguage';
import { UserMenuPanel, UserMenuSection } from './components/components-UserMenuPanel';
import { ProfileModal } from './components/components-ProfileModal';
import { ContentManagerModal } from './components/components-ContentManagerModal';
import { BookmarkManagerModal } from './components/components-BookmarkManagerModal';
import { SettingsModal } from './components/components-SettingsModal';
import { AutonomousKernelModal } from './components/components-AutonomousKernelModal';
import { AutonomousSupportModal } from './components/components-AutonomousSupportModal';
import { RecursiveNodeModal } from './components/components-RecursiveNodeModal';
import { CosmicItem } from './types/types-cosmos';
import { INITIAL_LISTS } from './data/data-initialLists';
import { MOVIES_100_LIST, MOVIES_LIST_ID } from './data/data-moviesListData';
import { COSMIC_SEEDS } from './data/data-cosmicSeeds';
import { ListGroup } from './types/types-index';
import { BreadcrumbSegment } from './components/components-CapsuleBreadcrumb';
import { CommandBar } from './components/components-CommandBar';
import { InstallWidget } from './components/components-InstallWidget';
import { BentoGrid } from './components/components-BentoGrid';
import { AuthUI } from './components/components-AuthUI';
import { CreateListModal } from './components/components-CreateListModal';
import { ManifestoPage } from './components/components-ManifestoPage';
export const App: React.FC = () => {
  // Multilingual state
  const [currentLang, setCurrentLang] = useLocalStorage<SupportedLanguage>('liiist_lang', 'en');
  const t = TRANSLATIONS[currentLang];

  // Theme state
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('liiist_dark_mode', true);

  // App Navigation View
  const [activeView, setActiveView] = useState<
    'landing' | 'explore-feed' | 'list-detail' | 'world-overview' | 'country-list' | 'movies-directory' | 'movie-detail' | 'country-detail' | 'states-directory' | 'state-detail' | 'languages-directory' | 'language-detail' | 'bento' | 'manifesto'
  >('landing');

  // Auth Modal State
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // CommandBar Search Palette State
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Currently selected country
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

    // Currently selected state (e.g. California, Texas, New York)
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);

  // Currently selected language
  const [selectedLanguage, setSelectedLanguage] = useState<WorldLanguage | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<ListItem | null>(null);

  const handleSelectLanguage = (lang: WorldLanguage) => {
    setSelectedLanguage(lang);
    setActiveView('language-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal dialog states
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);
  const [isBookmarkManagerOpen, setIsBookmarkManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKernelModalOpen, setIsKernelModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);

  // Infinite recursive modal node
  const [isRecursiveOpen, setIsRecursiveOpen] = useState(false);
  const [recursiveItem, setRecursiveItem] = useState<CosmicItem | null>(null);
  const [recursiveParentTitle, setRecursiveParentTitle] = useState('Catalog');

  // Universal Bookmarking state
  const [bookmarkedPages, setBookmarkedPages] = useLocalStorage<BookmarkedPage[]>('liiist_bookmarked_pages', [
    {
      id: 'page-country-US',
      title: 'United States',
      handle: '@unitedstates',
      canonicalPath: 'liii.st/World/Country/United States',
      type: 'country',
      subtitle: 'Washington, D.C. • North America',
      createdAt: '2026-09-29T10:00:00.000Z'
    },
    {
      id: 'page-state-NY',
      title: 'New York',
      handle: '@newyork',
      canonicalPath: 'liii.st/World/Country/United States/New York',
      type: 'state',
      subtitle: 'Albany • 62 Counties • 24 Cities',
      createdAt: '2026-09-29T11:00:00.000Z'
    },
    {
      id: 'page-states-directory',
      title: 'States of the United States',
      handle: '@us-states',
      canonicalPath: 'liii.st/World/Country/United States/States',
      type: 'list',
      subtitle: '50 Sovereign Federated States',
      createdAt: '2026-09-29T11:30:00.000Z'
    }
  ]);

    // Dynamic Lists for Content Manager
  const [lists, setLists] = useLocalStorage<ListGroup[]>('liiist_user_lists', INITIAL_LISTS);
  // Force injection of the 100 Movies list into the active session
  const activeLists = lists.some(l => l.id === MOVIES_LIST_ID) 
    ? lists 
    : [MOVIES_100_LIST, ...lists];


  // Selected List for ListView
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [listViewMode, setListViewMode] = useState<'list' | 'board' | 'focus' | 'timeline'>('list');

  const userCatalogLists = lists.filter(l => l.origin === 'user' && l.id !== MOVIES_LIST_ID);

  const openUserList = (id: string) => {
    setSelectedListId(id);
    setListViewMode('list');
    setActiveView('list-detail');
  };

  const handleCreateList = (draft: Omit<ListGroup, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = `list-user-${Date.now()}`;
    const created: ListGroup = {
      ...draft,
      id,
      origin: 'user',
      createdAt: now,
      updatedAt: now,
      items: draft.items || []
    };
    setLists(prev => [created, ...prev]);
    setSelectedListId(id);
    setActiveView('landing');
  };


      // Toggle bookmark handler
  const handleToggleBookmark = (item: Omit<BookmarkedPage, 'createdAt'>) => {
    setBookmarkedPages((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [
          {
            ...item,
            createdAt: new Date().toISOString()
          },
          ...prev
        ];
      }
    });
  };

  // Check if a node ID is currently bookmarked
  const isNodeBookmarked = (id: string) => {
    return bookmarkedPages.some((p) => p.id === id);
  };

  // Handle selecting a country from any column or card
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setActiveView('country-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selecting a state
  const handleSelectState = (state: StateInfo) => {
    setSelectedState(state);
    if (!selectedCountry) {
      const usa = COUNTRIES_DATA.find((c) => c.code === 'US');
      if (usa) setSelectedCountry(usa);
    }
    setActiveView('state-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle navigating to a bookmarked page from the modal
  const handleSelectBookmarkedPage = (page: BookmarkedPage) => {
    if (page.type === 'country') {
      const c = COUNTRIES_DATA.find((item) => item.code === page.id.replace('page-country-', ''));
      if (c) {
        handleSelectCountry(c);
        return;
      }
    } else if (page.type === 'state') {
      const s = ALL_50_US_STATES.find((item) => item.code === page.id.replace('page-state-', ''));
      if (s) {
        handleSelectState(s);
        return;
      }
    } else if (page.id === 'page-states-directory') {
      setActiveView('states-directory');
      return;
    }
    setActiveView('country-list');
  };

  // Handle User Menu navigation
  const handleUserMenuNavigation = (section: UserMenuSection) => {
    if (section === 'profile') setIsProfileOpen(true);
    if (section === 'contentManager') setIsContentManagerOpen(true);
    if (section === 'bookmarks') setIsBookmarkManagerOpen(true);
    if (section === 'settings') setIsSettingsOpen(true);
  };

  const handleLogout = () => {
    if (confirm('Log out from liiist?')) {
      setActiveView('landing');
      setSelectedCountry(null);
      setSelectedState(null);
      setIsUserMenuOpen(false);
    }
  };

  const handleOpenSublist = (title: string) => {
    setRecursiveItem({
      id: `sub-${Date.now()}`,
      title,
      subtitle: 'Cataloged sub-directory node',
      tags: ['Country', 'Sub-Directory']
    });
    setRecursiveParentTitle(selectedCountry?.name || 'World');
    setIsRecursiveOpen(true);
  };

  // Build the Header Route Capsule Breadcrumbs placed right between Logo and Search Icon
  const headerBreadcrumbSegments: BreadcrumbSegment[] = [
    {
      label: 'liii.st',
      onClick: () => {
        setActiveView('landing');
        setSelectedCountry(null);
        setSelectedState(null);
      },
      hierarchyTone: 'ancestor'
    }
  ];
  let headerBreadcrumbPath = 'liii.st';

        if (activeView === 'list-detail') {
    headerBreadcrumbSegments.push({ label: 'Lists', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: activeLists.find(l => l.id === selectedListId)?.title || 'List', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/Lists/Detail';
  } else if (activeView === 'explore-feed') {
    headerBreadcrumbSegments.push({ label: 'Explore', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/Explore';
  } else if (activeView === 'landing') {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'States', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = 'liii.st/World/Country/States/County/City/Village';
    } else if (activeView === 'movies-directory') {
    headerBreadcrumbSegments.push({ label: 'World', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Culture', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'People', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Cinema', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Movies', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/World/People/Culture/Cinema/Movie';
  } else if (activeView === 'movie-detail' && selectedMovie) {
    headerBreadcrumbSegments.push({ label: 'Cinema', hierarchyTone: 'ancestor', onClick: () => setActiveView('movies-directory') });
    headerBreadcrumbSegments.push({ label: selectedMovie.title, isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/World/People/Culture/Cinema/Movie/' + selectedMovie.title.replace(/\s+/g, '');
  } else if (activeView === 'languages-directory') {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Culture', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Language', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/World/Culture/Language';
  } else if (activeView === 'language-detail' && selectedLanguage) {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Culture', hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Language', onClick: () => setActiveView('languages-directory'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: selectedLanguage.name, isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbPath = 'liii.st/World/Culture/Language/' + selectedLanguage.name;
  } else if (activeView === 'world-overview') {
    headerBreadcrumbSegments.push({ label: 'World', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'States', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = 'liii.st/World/Country/States/County/City/Village';
  } else if (activeView === 'country-list') {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Country', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'States', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = 'liii.st/World/Country/States/County/City/Village';
  } else if (activeView === 'states-directory') {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({
      label: selectedCountry?.name || 'United States',
      onClick: () => selectedCountry && handleSelectCountry(selectedCountry),
      hierarchyTone: 'ancestor'
    });
    headerBreadcrumbSegments.push({ label: 'States', isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Town', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = `liii.st/World/Country/${encodeURIComponent(selectedCountry?.name || 'United States')}/States/County/City/Village`;
  } else if (activeView === 'state-detail' && selectedState) {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({
      label: selectedCountry?.name || 'United States',
      onClick: () => selectedCountry && handleSelectCountry(selectedCountry),
      hierarchyTone: 'ancestor'
    });
    headerBreadcrumbSegments.push({
      label: 'States',
      onClick: () => setActiveView('states-directory'),
      hierarchyTone: 'ancestor'
    });
    headerBreadcrumbSegments.push({ label: selectedState.name, isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Town', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = `liii.st/World/Country/${encodeURIComponent(selectedCountry?.name || 'United States')}/${encodeURIComponent(selectedState.name)}/County/City/Village`;
  } else if (selectedCountry) {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'ancestor' });
    headerBreadcrumbSegments.push({ label: selectedCountry.name, isCurrent: true, hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({
      label: 'States',
      onClick: () => setActiveView('states-directory'),
      hierarchyTone: 'subdivision'
    });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Town', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = `liii.st/World/Country/${encodeURIComponent(selectedCountry.name)}/States/County/City/Village`;
  }

  const isCurrentHeaderBookmarked =
    activeView === 'country-detail' && selectedCountry
      ? isNodeBookmarked(`page-country-${selectedCountry.code}`)
      : activeView === 'state-detail' && selectedState
      ? isNodeBookmarked(`page-state-${selectedState.code}`)
      : activeView === 'states-directory'
      ? isNodeBookmarked('page-states-directory')
      : false;

  const handleHeaderToggleBookmark = () => {
    if (activeView === 'country-detail' && selectedCountry) {
      handleToggleBookmark({
        id: `page-country-${selectedCountry.code}`,
        title: selectedCountry.name,
        handle: `@${selectedCountry.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        canonicalPath: `liii.st/World/Country/${encodeURIComponent(selectedCountry.name)}`,
        type: 'country',
        subtitle: `${selectedCountry.capital} • ${selectedCountry.continent}`
      });
    } else if (activeView === 'state-detail' && selectedState) {
      handleToggleBookmark({
        id: `page-state-${selectedState.code}`,
        title: selectedState.name,
        handle: `@${selectedState.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        canonicalPath: `liii.st/World/Country/United States/${encodeURIComponent(selectedState.name)}`,
        type: 'state',
        subtitle: `${selectedState.capital} • ${selectedState.cities.length} Cities`
      });
    } else if (activeView === 'states-directory') {
      handleToggleBookmark({
        id: 'page-states-directory',
        title: 'States of the United States',
        handle: '@us-states',
        canonicalPath: 'liii.st/World/Country/United States/States',
        type: 'list',
        subtitle: '50 Sovereign Federated States'
      });
    }
  };

  const handleHeaderGoBack = () => {
    if (activeView === 'state-detail') {
      setActiveView('states-directory');
    } else if (activeView === 'states-directory') {
      setActiveView('country-detail');
    } else if (activeView === 'country-detail') {
      setActiveView('country-list');
    } else if (activeView === 'country-list') {
      setActiveView('world-overview');
    } else {
      setActiveView('landing');
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen overflow-x-hidden bg-neutral-50 dark:bg-black font-sans text-neutral-900 dark:text-neutral-100 transition-colors">


      {/* Strict Minimal Top Header with Capsule Route Breadcrumb placed right between Logo and Search Icon */}
      <MinimalHeader
        onOpenUserMenu={() => setIsUserMenuOpen(true)}
        onGoHome={() => {
          if (activeView === 'landing') setActiveView('explore-feed');
          else setActiveView('landing');
          setSelectedCountry(null);
          setSelectedState(null);
        }}
        onSelectCountry={handleSelectCountry}
        onOpenCountryDetail={handleSelectCountry}
        onOpenWorldCountries={() => setActiveView('country-list')}
        onOpenWorldOverview={() => setActiveView('world-overview')}
        onOpenCenterColumn={() => {
          setActiveView('landing');
        }}
        onOpenStatesDirectory={() => {
          const usa = COUNTRIES_DATA.find((c) => c.code === 'US');
          if (usa) setSelectedCountry(usa);
          setActiveView('states-directory');
        }}
        breadcrumbSegments={headerBreadcrumbSegments}
        breadcrumbPath={headerBreadcrumbPath}
        isBookmarked={isCurrentHeaderBookmarked}
        onToggleBookmark={handleHeaderToggleBookmark}
        onGoBack={activeView !== 'landing' ? handleHeaderGoBack : undefined}
        onCreateList={() => setIsCreateListOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Viewport Area */}
                  <main className="flex-1 flex flex-col items-center justify-start w-full">
        {activeView === 'explore-feed' ? (
          <ExploreFeedPage onOpenMoviesTimeline={() => {
            const movieL = activeLists.find(l => l.id === 'list-movies-100');
            if (movieL) {
              setSelectedListId(movieL.id);
              setListViewMode('timeline');
              setActiveView('list-detail');
            }
          }} />
                ) : activeView === 'list-detail' && selectedListId ? (
          <ListView
            list={activeLists.find(l => l.id === selectedListId) || activeLists[0]}
            viewMode={listViewMode}
            onChangeViewMode={setListViewMode}
            onUpdateList={(updatedList) => {
              setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));
            }}
            onEditListMeta={() => {}}
            onExportList={() => {}}
            onSelectItem={() => {}}
            onDeleteList={(id) => {
              setLists(prev => prev.filter(l => l.id !== id));
              setActiveView('landing');
            }}
          />
                ) : activeView === 'movies-directory' ? (
          <MoviesDirectoryPage 
            onBack={() => setActiveView('landing')}
            onSelectMovie={(movie) => {
              setSelectedMovie(movie);
              setActiveView('movie-detail');
            }}
          />
        ) : activeView === 'movie-detail' && selectedMovie ? (
          <MovieDetailPage 
            movie={selectedMovie}
            onBack={() => setActiveView('movies-directory')}
          />
        ) : activeView === 'manifesto' ? (
          <ManifestoPage />
        ) : activeView === 'bento' ? (
          <div className="w-full max-w-7xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-white">
                  {currentLang === 'fa' ? 'چیدمان بنتو (Bento Grid)' : 'Bento Taxonomy Grid'}
                </h1>
                <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mt-1">
                  Container Query Fluid Architecture (Framer Motion 120Hz)
                </p>
              </div>
              <button 
                onClick={() => setActiveView('landing')} 
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer"
              >
                {currentLang === 'fa' ? 'بازگشت به صفحه اصلی' : 'Back to Landing'}
              </button>
            </div>
            <BentoGrid 
              entityName={selectedCountry?.name || 'Cosmos Directory'} 
              entityType={selectedCountry ? 'Sovereign Nation' : 'Universal Taxonomy'} 
            />
          </div>
        ) : activeView === 'landing' ? (
          /* THE 3-COLUMN DIRECTORY LANDING: 10 Nations + 10 US States + 10 NY Cities with rich headers */
          <MinimalCapsuleLanding
            onOpenCultureLanguages={() => setActiveView('languages-directory')}
            onSelectLanguage={handleSelectLanguage}
            onOpenMoviesDirectory={() => setActiveView('movies-directory')}
            onOpenWorldCountries={() => setActiveView('country-list')}
            onOpenWorldOverview={() => setActiveView('world-overview')}
            onSelectCountry={handleSelectCountry}
            onOpenCountryDetail={handleSelectCountry}
            onOpenStatesDirectory={() => {
              const usa = COUNTRIES_DATA.find((c) => c.code === 'US');
              if (usa) setSelectedCountry(usa);
              setActiveView('states-directory');
            }}
            onSelectState={handleSelectState}
            onSelectCity={(cityName) => {
              // Direct jump to NY State with city filter
              const ny = ALL_50_US_STATES.find(s => s.code === 'NY');
              if (ny) {
                handleSelectState(ny);
              }
            }}
            userLists={userCatalogLists}
            onCreateList={() => setIsCreateListOpen(true)}
            onOpenUserList={openUserList}
          />
                ) : activeView === 'languages-directory' ? (
          <LanguagesDirectoryPage
            onBackToLanding={() => setActiveView('landing')}
            onSelectLanguage={handleSelectLanguage}
          />
        ) : activeView === 'language-detail' && selectedLanguage ? (
          <LanguageDetailPage language={selectedLanguage} />
        ) : activeView === 'world-overview' ? (
          /* WORLD HIERARCHY OVERVIEW: liii.st/World */
          <WorldOverviewPage
            onGoHome={() => setActiveView('landing')}
            onOpenCountryList={() => setActiveView('country-list')}
            onOpenCultureLanguages={() => setActiveView('languages-directory')}
          />
        ) : activeView === 'country-list' ? (
          /* DEDICATED SOVEREIGN COUNTRIES PAGE: liii.st/World/Country */
          <WorldCountryPage
            onSelectCountry={handleSelectCountry}
            onGoHome={() => setActiveView('landing')}
            onOpenWorldOverview={() => setActiveView('world-overview')}
          />
        ) : activeView === 'states-directory' ? (
          /* STATES DIRECTORY PAGE: liii.st/World/Country/[CountryName]/States */
          <StatesDirectoryPage
            countryName={selectedCountry?.name || 'United States'}
            onSelectState={handleSelectState}
            onBackToCountry={() => setActiveView('country-detail')}
            onBackToWorldOverview={() => setActiveView('world-overview')}
            onGoHome={() => setActiveView('landing')}
            isBookmarked={isNodeBookmarked('page-states-directory')}
            onToggleBookmark={() =>
              handleToggleBookmark({
                id: 'page-states-directory',
                title: 'States of the United States',
                handle: '@us-states',
                canonicalPath: 'liii.st/World/Country/United States/States',
                type: 'list',
                subtitle: '50 Sovereign Federated States'
              })
            }
          />
        ) : activeView === 'state-detail' && selectedState ? (
          /* INDIVIDUAL STATE DEDICATED PAGE: liii.st/World/Country/[CountryName]/[StateName] */
          <StateDetailPage
            state={selectedState}
            countryName={selectedCountry?.name || 'United States'}
            onBackToCountry={() => setActiveView('states-directory')}
            onBackToWorldOverview={() => setActiveView('world-overview')}
            onGoHome={() => setActiveView('landing')}
            isBookmarked={isNodeBookmarked(`page-state-${selectedState.code}`)}
            onToggleBookmark={() =>
              handleToggleBookmark({
                id: `page-state-${selectedState.code}`,
                title: selectedState.name,
                handle: `@${selectedState.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
                canonicalPath: `liii.st/World/Country/United States/${encodeURIComponent(selectedState.name)}`,
                type: 'state',
                subtitle: `${selectedState.capital} • ${selectedState.cities.length} Cities`
              })
            }
          />
        ) : selectedCountry ? (
          /* INDIVIDUAL COUNTRY DEDICATED BENTO PAGE: liii.st/World/Country/[Name] */
          <CountryDetailPage
            country={selectedCountry}
            onBackToCountryList={() => setActiveView('country-list')}
            onBackToWorldOverview={() => setActiveView('world-overview')}
            onSelectNeighborCountry={handleSelectCountry}
            onOpenStatesDirectory={() => {
              if (selectedCountry.code !== 'US') {
                const usa = COUNTRIES_DATA.find((c) => c.code === 'US');
                if (usa) setSelectedCountry(usa);
              }
              setActiveView('states-directory');
            }}
            isBookmarked={isNodeBookmarked(`page-country-${selectedCountry.code}`)}
            onToggleBookmark={() =>
              handleToggleBookmark({
                id: `page-country-${selectedCountry.code}`,
                title: selectedCountry.name,
                handle: `@${selectedCountry.name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
                canonicalPath: `liii.st/World/Country/${encodeURIComponent(selectedCountry.name)}`,
                type: 'country',
                subtitle: `${selectedCountry.capital} • ${selectedCountry.continent}`
              })
            }
          />
        ) : (
          <div className="py-20 text-center text-sm font-mono text-neutral-400">
            Node not found.{' '}
            <button
              type="button"
              onClick={() => setActiveView('country-list')}
              className="underline text-black dark:text-white"
            >
              Return to Sovereign Countries list
            </button>
          </div>
        )}
      </main>

      {/* Slide-over User Menu Card / Panel */}
      <UserMenuPanel
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onNavigateSection={handleUserMenuNavigation}
        onOpenKernel={() => setIsKernelModalOpen(true)}
        onOpenSupport={() => setIsSupportModalOpen(true)}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenBento={() => setActiveView('bento')}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        lang={currentLang}
        totalListsCount={COUNTRIES_DATA.length + ALL_50_US_STATES.length}
        totalItemsCount={COUNTRIES_DATA.length + ALL_50_US_STATES.length}
      />

      {/* Content Manager Modal */}
      <ContentManagerModal
        isOpen={isContentManagerOpen}
        onClose={() => setIsContentManagerOpen(false)}
        lists={activeLists}
        onSelectList={(id) => { setSelectedListId(id); setListViewMode('list'); setActiveView('list-detail'); setIsContentManagerOpen(false); }}
        onDeleteList={(id) => setLists(prev => prev.filter(l => l.id !== id))}
        onCreateNewList={() => {
          setIsContentManagerOpen(false);
          setIsCreateListOpen(true);
        }}
        onExportList={() => {}}
        lang={currentLang}
      />

      {/* Bookmark Manager Modal */}
            <BookmarkManagerModal
        isOpen={isBookmarkManagerOpen}
        onClose={() => setIsBookmarkManagerOpen(false)}
        lang={currentLang}
        personalLists={activeLists}
        cosmicLists={COSMIC_SEEDS}
        bookmarkedPages={bookmarkedPages}
        onSelectPersonalList={(id) => {
          setSelectedListId(id);
          setActiveView('list-detail');
          setIsBookmarkManagerOpen(false);
        }}
        onSelectCosmicList={(_id) => {
          setIsBookmarkManagerOpen(false);
        }}
        onSelectBookmarkedPage={(page) => {
          handleSelectBookmarkedPage(page);
          setIsBookmarkManagerOpen(false);
        }}
        onRemoveBookmark={(id) => setBookmarkedPages((prev) => prev.filter((p) => p.id !== id))}

      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={currentLang}
        onSelectLang={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <CreateListModal
        isOpen={isCreateListOpen}
        onClose={() => setIsCreateListOpen(false)}
        onCreate={handleCreateList}
      />

      {/* Autonomous System Kernel Modal */}
      <AutonomousKernelModal
        isOpen={isKernelModalOpen}
        onClose={() => setIsKernelModalOpen(false)}
        lang={currentLang}
      />

      {/* Autonomous Support & Ticketing Modal */}
      <AutonomousSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        lang={currentLang}
      />

      {/* Infinite Recursive Sub-Directory Modal */}
      {recursiveItem && (
        <RecursiveNodeModal
          isOpen={isRecursiveOpen}
          onClose={() => setIsRecursiveOpen(false)}
          item={recursiveItem}
          parentListTitle={recursiveParentTitle}
          lang={currentLang}
        />
      )}

      {/* Global ⌘K Command Palette (Framer Motion Fluid Dynamics) */}
      <CommandBar isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />

      {/* Smart OS-Aware PWA Install Widget */}
      <InstallWidget />

      {/* Auth Modal (SSO Google/Facebook & Dev Admin Login) */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm">
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
              aria-label="Close"
            >
              ✕
            </button>
            <AuthUI
              strings={{
                title: currentLang === 'fa' ? 'ورود به حساب کاربری' : 'Authenticate',
                google: currentLang === 'fa' ? 'ورود با حساب گوگل' : 'Continue with Google',
                facebook: currentLang === 'fa' ? 'ورود با حساب فیسبوک' : 'Continue with Facebook',
                devLogin: currentLang === 'fa' ? 'DEV: ورود سریع به عنوان ادمین' : 'DEV: Login as Admin'
              }}
              onGoogleLogin={async () => { alert('Initiating Google SSO...'); setIsAuthOpen(false); }}
              onFacebookLogin={async () => { alert('Initiating Facebook SSO...'); setIsAuthOpen(false); }}
              onDevAdminLogin={async () => { alert('Authenticated as QA Admin (admin/admin)!'); setIsAuthOpen(false); }}
            />
          </div>
        </div>
      )}

      {/* Floating Info Button for Manifesto */}
      {activeView !== 'manifesto' && (
        <button
          onClick={() => setActiveView('manifesto')}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:scale-105 transition-all"
          aria-label="Manifesto"
        >
          <Info size={24} strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};

export default App;
