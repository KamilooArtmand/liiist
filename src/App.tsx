import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { SupportedLanguage, TRANSLATIONS } from './types/language';
import { Country } from './types/country';
import { StateInfo } from './types/hierarchy';
import { BookmarkedPage } from './types';
import { COUNTRIES_DATA } from './data/countriesData';
import { ALL_50_US_STATES } from './data/usStatesData';
import { MinimalHeader } from './components/MinimalHeader';
import { MinimalCapsuleLanding } from './components/MinimalCapsuleLanding';
import { WorldOverviewPage } from './components/WorldOverviewPage';
import { WorldCountryPage } from './components/WorldCountryPage';
import { CountryDetailPage } from './components/CountryDetailPage';
import { StatesDirectoryPage } from './components/StatesDirectoryPage';
import { StateDetailPage } from './components/StateDetailPage';
import { UserMenuPanel, UserMenuSection } from './components/UserMenuPanel';
import { ProfileModal } from './components/ProfileModal';
import { ContentManagerModal } from './components/ContentManagerModal';
import { BookmarkManagerModal } from './components/BookmarkManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { AutonomousKernelModal } from './components/AutonomousKernelModal';
import { AutonomousSupportModal } from './components/AutonomousSupportModal';
import { RecursiveNodeModal } from './components/RecursiveNodeModal';
import { CosmicItem } from './types/cosmos';
import { INITIAL_LISTS } from './data/initialLists';
import { COSMIC_SEEDS } from './data/cosmicSeeds';
import { ListGroup } from './types';
import { BreadcrumbSegment } from './components/CapsuleBreadcrumb';

export const App: React.FC = () => {
  // Multilingual state
  const [currentLang, setCurrentLang] = useLocalStorage<SupportedLanguage>('liiist_lang', 'en');
  const t = TRANSLATIONS[currentLang];

  // Theme state
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('liiist_dark_mode', true);

  // App Navigation View
  const [activeView, setActiveView] = useState<
    'landing' | 'world-overview' | 'country-list' | 'country-detail' | 'states-directory' | 'state-detail'
  >('landing');

  // Currently selected country
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Currently selected state (e.g. California, Texas, New York)
  const [selectedState, setSelectedState] = useState<StateInfo | null>(null);

  // Modal dialog states
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContentManagerOpen, setIsContentManagerOpen] = useState(false);
  const [isBookmarkManagerOpen, setIsBookmarkManagerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKernelModalOpen, setIsKernelModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

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

  if (activeView === 'landing') {
    headerBreadcrumbSegments.push({ label: 'World', onClick: () => setActiveView('world-overview'), hierarchyTone: 'current' });
    headerBreadcrumbSegments.push({ label: 'Country', onClick: () => setActiveView('country-list'), hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'States', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'County', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'City', hierarchyTone: 'subdivision' });
    headerBreadcrumbSegments.push({ label: 'Village', hierarchyTone: 'subdivision' });
    headerBreadcrumbPath = 'liii.st/World/Country/States/County/City/Village';
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
          setActiveView('landing');
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
      />

      {/* Main Viewport Area */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {activeView === 'landing' ? (
          /* THE 3-COLUMN DIRECTORY LANDING: 10 Nations + 10 US States + 10 NY Cities with rich headers */
          <MinimalCapsuleLanding
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
          />
        ) : activeView === 'world-overview' ? (
          /* WORLD HIERARCHY OVERVIEW: liii.st/World */
          <WorldOverviewPage
            onGoHome={() => setActiveView('landing')}
            onOpenCountryList={() => setActiveView('country-list')}
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
        lists={lists}
        onUpdateLists={setLists}
        lang={currentLang}
      />

      {/* Bookmark Manager Modal */}
      <BookmarkManagerModal
        isOpen={isBookmarkManagerOpen}
        onClose={() => setIsBookmarkManagerOpen(false)}
        bookmarkedPages={bookmarkedPages}
        onRemoveBookmark={(id) => setBookmarkedPages((prev) => prev.filter((p) => p.id !== id))}
        onSelectPage={handleSelectBookmarkedPage}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Autonomous System Kernel Modal */}
      <AutonomousKernelModal
        isOpen={isKernelModalOpen}
        onClose={() => setIsKernelModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Autonomous Support & Ticketing Modal */}
      <AutonomousSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        isDarkMode={isDarkMode}
      />

      {/* Infinite Recursive Sub-Directory Modal */}
      {recursiveItem && (
        <RecursiveNodeModal
          isOpen={isRecursiveOpen}
          onClose={() => setIsRecursiveOpen(false)}
          parentItem={recursiveItem}
          parentTitle={recursiveParentTitle}
          onSelectChild={(child) => handleOpenSublist(child.title)}
        />
      )}
    </div>
  );
};

export default App;
