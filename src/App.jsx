import { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import GetInvolved from './pages/GetInvolved';
import FindPet from './pages/FindPet';
import ReleasePet from './pages/ReleasePet';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ManageAccountModal from './components/ManageAccountModal';
import ManageApplicationsModal from './components/ManageApplicationsModal';
import MyFavoritesModal from './components/MyFavoritesModal';
import PETS_DATABASE from './data/petsData';
import './App.css';

function parseHash() {
  const hash = window.location.hash || '';
  let page = 'home';
  let itemId = null;
  let targetSection = null;
  let petType = 'dog';
  let petId = null;

  if (hash === '#about-us' || hash.startsWith('#about-us') || hash === '#contact-us') {
    page = 'about';
    if (hash === '#contact-us' || hash.includes('contact-us')) {
      targetSection = 'contact-us';
    }
  } else if (hash.startsWith('#get-involved')) {
    page = 'get-involved';
    const match = hash.match(/[?&]item=([^&]+)/);
    if (match) {
      itemId = decodeURIComponent(match[1]);
    }
  } else if (hash.startsWith('#pet/') || hash.startsWith('#pet?') || hash.startsWith('#pet-') || hash === '#pet') {
    page = 'find-pet';
    let extracted = null;
    const slashMatch = hash.match(/^#pet\/([^?&#]+)/);
    const queryMatch = hash.match(/[?&](?:id|pet)=([^&]+)/);
    const dashMatch = hash.match(/^#pet-([^?&#]+)/);
    if (slashMatch) {
      extracted = decodeURIComponent(slashMatch[1]);
    } else if (queryMatch) {
      extracted = decodeURIComponent(queryMatch[1]);
    } else if (dashMatch) {
      extracted = decodeURIComponent(dashMatch[1]);
    }
    petId = extracted;
    if (petId) {
      const found = PETS_DATABASE.find(
        (p) =>
          p.id.toLowerCase() === petId.toLowerCase() ||
          p.name.toLowerCase() === petId.toLowerCase()
      );
      if (found) {
        petType = found.type;
      }
    }
  } else if (hash.startsWith('#find-a-pet') || hash.startsWith('#dogs') || hash.startsWith('#cats') || hash.startsWith('#pets')) {
    page = 'find-pet';
    if (hash.startsWith('#cats')) {
      petType = 'cat';
    } else {
      petType = 'dog';
    }
    const subMatch =
      hash.match(/[?&](?:id|pet)=([^&]+)/) ||
      hash.match(/^#(?:dogs|cats|pets|find-a-pet)\/([^?&#]+)/);
    if (subMatch) {
      petId = decodeURIComponent(subMatch[1]);
      const found = PETS_DATABASE.find(
        (p) =>
          p.id.toLowerCase() === petId.toLowerCase() ||
          p.name.toLowerCase() === petId.toLowerCase()
      );
      if (found) {
        petType = found.type;
      }
    }
  } else if (hash === '#release' || hash.startsWith('#release')) {
    page = 'release-pet';
  } else if (hash === '' || hash === '#' || hash === '#home') {
    page = 'home';
  }

  return { page, itemId, targetSection, petType, petId };
}

function App() {
  const [route, setRoute] = useState(() => parseHash());

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('pet_heaven_logged_in') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showManageAccountModal, setShowManageAccountModal] = useState(false);
  const [showManageApplicationsModal, setShowManageApplicationsModal] = useState(false);
  const [showMyFavoritesModal, setShowMyFavoritesModal] = useState(false);

  const [favorites, setFavorites] = useState(() => {
    try {
      if (localStorage.getItem('pet_heaven_favorites_seeded_v1')) {
        localStorage.removeItem('pet_heaven_favorites_seeded_v1');
        localStorage.removeItem('pet_heaven_favorites');
        return {};
      }
      const stored = localStorage.getItem('pet_heaven_favorites');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const activeFavorites = isLoggedIn ? favorites : {};

  const toggleFavorite = (e, petId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!isLoggedIn) {
      showToast('Please log in to save pets to your favorites.', 'info');
      setShowLoginModal(true);
      return;
    }
    setFavorites((prev) => {
      const next = { ...prev, [petId]: !prev[petId] };
      try {
        localStorage.setItem('pet_heaven_favorites', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to persist favorites', err);
      }
      return next;
    });
  };
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('pet_heaven_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [toast, setToast] = useState({ show: false, text: '', type: 'success' });
  const toastTimeoutRef = useRef(null);

  const showToast = (text, type = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ show: true, text, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3200);
  };

  const handleLogin = (userInfo) => {
    if (userInfo) {
      setUser(userInfo);
      try {
        localStorage.setItem('pet_heaven_current_user', JSON.stringify(userInfo));
      } catch (err) {
        console.warn('Failed to persist user info', err);
      }
    }
    setIsLoggedIn(true);
    localStorage.setItem('pet_heaven_logged_in', 'true');
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('pet_heaven_logged_in');
    showToast('You have been signed out.', 'info');
  };

  const handleUpdateUser = (updatedInfo) => {
    setUser((prev) => {
      const nextUser = {
        ...prev,
        ...updatedInfo,
        name: updatedInfo.name || `${updatedInfo.firstName || ''} ${updatedInfo.lastName || ''}`.trim() || prev.name,
      };
      try {
        localStorage.setItem('pet_heaven_current_user', JSON.stringify(nextUser));

        const users = JSON.parse(localStorage.getItem('pet_heaven_users') || '[]');
        const updatedUsers = users.map((u) => {
          if (
            (prev?.email && u.email && u.email.toLowerCase() === prev.email.toLowerCase()) ||
            (prev?.id && u.id === prev.id)
          ) {
            return { ...u, ...nextUser };
          }
          return u;
        });
        localStorage.setItem('pet_heaven_users', JSON.stringify(updatedUsers));

        const prevEmail = (prev?.email || '').trim().toLowerCase();
        const prevName = (prev?.name || '').trim().toLowerCase();
        const syncRecordContact = (storageKey, nameField, emailField) => {
          const raw = localStorage.getItem(storageKey);
          if (!raw) return;
          const records = JSON.parse(raw);
          if (!Array.isArray(records)) return;
          let changed = false;
          const nextRecords = records.map((rec) => {
            const recEmail = (rec?.[emailField] || '').trim().toLowerCase();
            const recName = (rec?.[nameField] || '').trim().toLowerCase();
            const matchesEmail = Boolean(prevEmail && recEmail === prevEmail);
            const matchesName = Boolean(prevName && recName === prevName);
            if (matchesEmail || matchesName) {
              changed = true;
              return {
                ...rec,
                [nameField]: nextUser.name || rec[nameField],
                [emailField]: nextUser.email || rec[emailField],
              };
            }
            return rec;
          });
          if (changed) {
            localStorage.setItem(storageKey, JSON.stringify(nextRecords));
          }
        };

        syncRecordContact('pet_heaven_user_applications', 'applicantName', 'applicantEmail');
        syncRecordContact('pet_heaven_user_release_applications', 'ownerName', 'ownerEmail');
      } catch (e) {
        console.warn('Failed to sync updated user to storage', e);
      }
      return nextUser;
    });
  };

  const handleDeleteAccount = () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('pet_heaven_current_user') || '{}');
      const users = JSON.parse(localStorage.getItem('pet_heaven_users') || '[]');
      const filtered = users.filter(
        (u) =>
          u.email?.toLowerCase() !== (currentUser?.email || '').toLowerCase() &&
          (!currentUser?.id || u.id !== currentUser.id)
      );
      localStorage.setItem('pet_heaven_users', JSON.stringify(filtered));
      localStorage.removeItem('pet_heaven_current_user');
    } catch (e) {
      console.warn('Failed to remove user during deletion', e);
    }

    setIsLoggedIn(false);
    localStorage.removeItem('pet_heaven_logged_in');
    setShowManageAccountModal(false);
    showToast('Your account and profile data have been permanently deleted.', 'info');
  };

  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('pet_heaven_theme') || 'system';
  });

  const [systemTheme, setSystemTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const effectiveTheme = themeMode === 'system' ? systemTheme : themeMode;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    document.body.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  const handleThemeModeChange = (mode) => {
    setThemeMode(mode);
    localStorage.setItem('pet_heaven_theme', mode);
  };

  useEffect(() => {
    function scrollToTarget(sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'auto', block: 'start' });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
        }
      }, 0);
    }

    function handleHashChange() {
      const nextRoute = parseHash();
      setRoute((currentRoute) => {
        const isInternalSubRoute =
          currentRoute.page === nextRoute.page &&
          (nextRoute.page === 'get-involved' || nextRoute.page === 'find-pet');

        if (nextRoute.targetSection) {
          scrollToTarget(nextRoute.targetSection);
        } else if (!isInternalSubRoute) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        return nextRoute;
      });
    }

    const initialRoute = parseHash();
    if (initialRoute.targetSection) {
      scrollToTarget(initialRoute.targetSection);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="app-container" data-theme={effectiveTheme}>

      <Navbar
        currentPage={route.page}
        themeMode={themeMode}
        onThemeModeChange={handleThemeModeChange}
        systemTheme={systemTheme}
        effectiveTheme={effectiveTheme}
        isLoggedIn={isLoggedIn}
        onOpenLoginModal={() => setShowLoginModal(true)}
        onOpenManageAccountModal={() => setShowManageAccountModal(true)}
        onOpenManageApplicationsModal={() => setShowManageApplicationsModal(true)}
        onOpenMyFavoritesModal={() => setShowMyFavoritesModal(true)}
        onLogout={handleLogout}
        onShowToast={showToast}
        user={user}
      />

      <main className="page-transition-wrapper" key={route.page}>
        {route.page === 'about' && <About />}
        {route.page === 'get-involved' && <GetInvolved initialItemId={route.itemId} />}
        {route.page === 'find-pet' && (
          <FindPet
            initialPetType={route.petType}
            initialPetId={route.petId}
            isLoggedIn={isLoggedIn}
            onOpenLoginModal={() => setShowLoginModal(true)}
            onShowToast={showToast}
            user={user}
            favorites={activeFavorites}
            toggleFavorite={toggleFavorite}
          />
        )}
        {route.page === 'release-pet' && (
          <ReleasePet
            isLoggedIn={isLoggedIn}
            user={user}
            onOpenLoginModal={() => setShowLoginModal(true)}
            onShowToast={showToast}
          />
        )}
        {route.page === 'home' && <Home />}
      </main>

      <Footer />

      <div
        className={`auth-top-toast toast-${toast.type || 'success'}${toast.show ? ' show' : ''}`}
        role="status"
        aria-live="polite"
        aria-hidden={!toast.show}
      >
        <span className="auth-top-toast-icon" aria-hidden="true">
          {toast.type === 'warning' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="12" y1="7" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : toast.type === 'info' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <line x1="12" y1="11" x2="12" y2="17" />
              <line x1="12" y1="7" x2="12.01" y2="7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </span>
        <span className="auth-top-toast-text">{toast.text}</span>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onShowToast={showToast}
      />

      <ManageAccountModal
        isOpen={showManageAccountModal}
        onClose={() => setShowManageAccountModal(false)}
        user={user}
        onUpdateUser={handleUpdateUser}
        onDeleteAccount={handleDeleteAccount}
        onShowToast={showToast}
      />

      <ManageApplicationsModal
        isOpen={showManageApplicationsModal}
        onClose={() => setShowManageApplicationsModal(false)}
        user={user}
        onNavigate={(page) => {
          setShowManageApplicationsModal(false);
          window.location.hash = page === 'home' ? '' : `#${page}`;
        }}
        onShowToast={showToast}
      />

      <MyFavoritesModal
        isOpen={showMyFavoritesModal}
        onClose={() => setShowMyFavoritesModal(false)}
        favorites={activeFavorites}
        toggleFavorite={toggleFavorite}
        onViewPet={(pet) => {
          setShowMyFavoritesModal(false);
          window.location.hash = `#pet/${pet.id}`;
        }}
        onBrowsePets={() => {
          setShowMyFavoritesModal(false);
          window.location.hash = '#find-a-pet';
        }}
        onShowToast={showToast}
      />
    </div>
  );
}

export default App;
