import { useState, useEffect, useRef } from 'react';
import dogIcon from '../assets/dog.svg';
import catIcon from '../assets/cat.svg';
import './Navbar.css';

function EclipseIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a7 7 0 1 0 10 10" />
    </svg>
  );
}

function SunIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
    </svg>
  );
}

function LogInIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </svg>
  );
}

function UserNavIcon({ className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function Navbar({
  currentPage = 'home',
  themeMode = 'system',
  onThemeModeChange,
  effectiveTheme = 'light',
  isLoggedIn = false,
  onOpenLoginModal,
  onOpenManageAccountModal,
  onOpenManageApplicationsModal,
  onOpenMyFavoritesModal,
  onLogout,
  user = { name: 'Alex Tan', email: 'alex.tan@example.sg' },
}) {

  const [isFindPetOpen, setIsFindPetOpen] = useState(false);

  const [isThemeOpen, setIsThemeOpen] = useState(false);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const themeDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFindPetOpen(false);
      }
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">

        <ul className="nav-group nav-group-left">

          <li className="nav-item dropdown-item" ref={dropdownRef}>
            <button
              type="button"
              className={`nav-button ${isFindPetOpen || currentPage === 'find-pet' ? 'active' : ''}`}
              onClick={() => setIsFindPetOpen(!isFindPetOpen)}
              aria-expanded={isFindPetOpen}
            >
              <span>FIND A PET</span>

              <svg
                className={`arrow-icon ${isFindPetOpen ? 'rotate' : ''}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {isFindPetOpen && (
              <div className="dropdown-menu">
                <a
                  href="#dogs"
                  className="dropdown-link"
                  onClick={() => setIsFindPetOpen(false)}
                >
                  <img src={dogIcon} alt="Dog icon" className="dropdown-svg-icon" />
                  <span className="dropdown-label">Find a Dog</span>
                </a>
                <a
                  href="#cats"
                  className="dropdown-link"
                  onClick={() => setIsFindPetOpen(false)}
                >
                  <img src={catIcon} alt="Cat icon" className="dropdown-svg-icon" />
                  <span className="dropdown-label">Find a Cat</span>
                </a>
              </div>
            )}
          </li>

          <li className="nav-item">
            <a
              href="#release"
              className={`nav-link ${currentPage === 'release-pet' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              RELEASE A PET
            </a>
          </li>
        </ul>

        <div className={`navbar-logo-center ${currentPage === 'home' ? 'is-home' : ''}`}>
          <a href="#" className="logo-center-link" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="logo-text">Pet Heaven</span>

            <div className="logo-protrusion-tab" aria-hidden="true">

              <div className="protrusion-backdrop"></div>

              <svg
                className="protrusion-svg"
                viewBox="0 0 240 36"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>

                  <clipPath id="protrusionClip" clipRule="evenodd">
                    <path d="M 0 0 L 240 0 C 218 0, 200 5.5, 185 13.5 C 170 21.5, 148 33.5, 120 33.5 C 92 33.5, 70 21.5, 55 13.5 C 40 5.5, 22 0, 0 0 Z M 120 8 A 8 8 0 1 0 120 24 A 8 8 0 1 0 120 8 Z" />
                  </clipPath>

                  <linearGradient id="protrusionGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8E1EA2" stopOpacity="0" />
                    <stop offset="14%" stopColor="#D552A3" stopOpacity="0.3" />
                    <stop offset="30%" stopColor="#D552A3" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#8E1EA2" stopOpacity="1" />
                    <stop offset="70%" stopColor="#D552A3" stopOpacity="0.95" />
                    <stop offset="86%" stopColor="#D552A3" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8E1EA2" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="holeGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D552A3" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#8E1EA2" stopOpacity="1" />
                    <stop offset="100%" stopColor="#542177" stopOpacity="0.9" />
                  </linearGradient>

                  <linearGradient id="protrusionGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C062DF" stopOpacity="0" />
                    <stop offset="14%" stopColor="#C062DF" stopOpacity="0.3" />
                    <stop offset="30%" stopColor="#C062DF" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#98E8DE" stopOpacity="1" />
                    <stop offset="70%" stopColor="#C062DF" stopOpacity="0.95" />
                    <stop offset="86%" stopColor="#C062DF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C062DF" stopOpacity="0" />
                  </linearGradient>

                  <linearGradient id="holeGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C062DF" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#98E8DE" stopOpacity="1" />
                    <stop offset="100%" stopColor="#C062DF" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                <path
                  className="protrusion-stroke"
                  d="M 0 0 C 22 0, 40 6, 55 14 C 70 22, 92 34, 120 34 C 148 34, 170 22, 185 14 C 200 6, 218 0, 240 0"
                  fill="none"
                />

                <circle
                  className="protrusion-hole-stroke"
                  cx="120"
                  cy="16"
                  r="8"
                  fill="none"
                />
              </svg>
            </div>
          </a>
        </div>

        <ul className="nav-group nav-group-right">

          <li className="nav-item">
            <a
              href="#get-involved"
              className={`nav-link ${currentPage === 'get-involved' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GET INVOLVED
            </a>
          </li>

          <li className="nav-item">
            <a
              href="#about-us"
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ABOUT US
            </a>
          </li>
        </ul>
      </nav>

      <div className="navbar-actions-far-right">

        <div className="theme-dropdown-container" ref={themeDropdownRef}>
          <button
            type="button"
            className={`theme-toggle-btn ${isThemeOpen ? 'active' : ''}`}
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            aria-label="Toggle theme mode"
            aria-expanded={isThemeOpen}
            title={`Theme: ${themeMode} (Active: ${effectiveTheme})`}
          >
            {themeMode === 'system' && <EclipseIcon className="theme-nav-icon" />}
            {themeMode === 'light' && <SunIcon className="theme-nav-icon" />}
            {themeMode === 'dark' && <MoonIcon className="theme-nav-icon" />}
          </button>

          {isThemeOpen && (
            <div className="dropdown-menu theme-dropdown-menu">

              <button
                type="button"
                className={`dropdown-link theme-dropdown-option ${themeMode === 'system' ? 'active' : ''}`}
                onClick={() => {
                  if (onThemeModeChange) onThemeModeChange('system');
                  setIsThemeOpen(false);
                }}
              >
                <EclipseIcon className="theme-svg-icon" />
                <span className="dropdown-label theme-dropdown-label">System</span>
                {themeMode === 'system' && (
                  <svg
                    className="theme-check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className={`dropdown-link theme-dropdown-option ${themeMode === 'light' ? 'active' : ''}`}
                onClick={() => {
                  if (onThemeModeChange) onThemeModeChange('light');
                  setIsThemeOpen(false);
                }}
              >
                <SunIcon className="theme-svg-icon" />
                <span className="dropdown-label theme-dropdown-label">Light</span>
                {themeMode === 'light' && (
                  <svg
                    className="theme-check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                className={`dropdown-link theme-dropdown-option ${themeMode === 'dark' ? 'active' : ''}`}
                onClick={() => {
                  if (onThemeModeChange) onThemeModeChange('dark');
                  setIsThemeOpen(false);
                }}
              >
                <MoonIcon className="theme-svg-icon" />
                <span className="dropdown-label theme-dropdown-label">Dark</span>
                {themeMode === 'dark' && (
                  <svg
                    className="theme-check-icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div className="navbar-user-dropdown-container" ref={userDropdownRef}>
            <button
              type="button"
              className={`user-auth-btn ${isUserMenuOpen ? 'is-open' : ''}`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              title={`Logged in as ${user?.name || 'Alex Tan'} (${user?.email || 'alex.tan@example.sg'}). Click to manage.`}
              aria-label="User Account Menu"
              aria-expanded={isUserMenuOpen}
              aria-haspopup="true"
            >
              <UserNavIcon className="user-btn-icon" />
            </button>

            {isUserMenuOpen && (
              <div className="dropdown-menu auth-user-dropdown" role="menu">
                <div className="auth-dropdown-user-info">
                  <span className="dropdown-user-name">{user?.name || 'Alex Tan'}</span>
                  <span className="dropdown-user-email">{user?.email || 'alex.tan@example.sg'}</span>
                </div>
                <div className="auth-dropdown-divider"></div>
                <button
                  type="button"
                  className="auth-dropdown-item-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenManageAccountModal) {
                      onOpenManageAccountModal();
                    }
                  }}
                >
                  <svg
                    className="auth-dropdown-item-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Manage Account</span>
                </button>
                <button
                  type="button"
                  className="auth-dropdown-item-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenManageApplicationsModal) {
                      onOpenManageApplicationsModal();
                    }
                  }}
                >
                  <svg
                    className="auth-dropdown-item-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="M12 11h4" />
                    <path d="M12 16h4" />
                    <path d="M8 11h.01" />
                    <path d="M8 16h.01" />
                  </svg>
                  <span>Manage Applications</span>
                </button>
                <button
                  type="button"
                  className="auth-dropdown-item-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onOpenMyFavoritesModal) {
                      onOpenMyFavoritesModal();
                    }
                  }}
                >
                  <svg
                    className="auth-dropdown-item-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span>My Favorites</span>
                </button>
                <div className="auth-dropdown-divider"></div>
                <button
                  type="button"
                  className="auth-dropdown-logout-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  <svg
                    className="auth-dropdown-item-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="login-circle-btn"
            aria-label="Log In"
            title="Log In"
            onClick={onOpenLoginModal}
          >
            <LogInIcon className="login-nav-icon" />
          </button>
        )}

        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`hamburger-bar ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      <div className={`navbar-mobile-drawer ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <ul className="mobile-nav-links">
          <li className="mobile-nav-item">
            <a href="#dogs" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={dogIcon} alt="Dog icon" className="dropdown-svg-icon" />
              <span>FIND A DOG</span>
            </a>
          </li>
          <li className="mobile-nav-item">
            <a href="#cats" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <img src={catIcon} alt="Cat icon" className="dropdown-svg-icon" />
              <span>FIND A CAT</span>
            </a>
          </li>
          <li className="mobile-nav-item">
            <a
              href="#release"
              className={`mobile-nav-link ${currentPage === 'release-pet' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>RELEASE A PET</span>
            </a>
          </li>
          <li className="mobile-nav-item">
            <a
              href="#get-involved"
              className={`mobile-nav-link ${currentPage === 'get-involved' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>GET INVOLVED</span>
            </a>
          </li>
          <li className="mobile-nav-item">
            <a
              href="#about-us"
              className={`mobile-nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>ABOUT US</span>
            </a>
          </li>
          <li className="mobile-nav-item mobile-login-item">
            {isLoggedIn ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <button
                  type="button"
                  className="login-btn full-width"
                  style={{ background: 'linear-gradient(135deg, #542177 0%, #8E1EA2 100%)', color: '#ffffff' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenManageAccountModal) onOpenManageAccountModal();
                  }}
                >
                  MANAGE ACCOUNT
                </button>
                <button
                  type="button"
                  className="login-btn full-width"
                  style={{ background: 'rgba(84, 33, 119, 0.08)', color: '#542177', border: '1px solid rgba(84, 33, 119, 0.2)' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenManageApplicationsModal) onOpenManageApplicationsModal();
                  }}
                >
                  MANAGE APPLICATIONS
                </button>
                <button
                  type="button"
                  className="login-btn full-width"
                  style={{ background: 'rgba(255, 64, 129, 0.08)', color: '#ff4081', border: '1px solid rgba(255, 64, 129, 0.25)' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onOpenMyFavoritesModal) onOpenMyFavoritesModal();
                  }}
                >
                  MY FAVORITES
                </button>
                <button
                  type="button"
                  className="login-btn full-width is-logged-in-mobile"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (onLogout) onLogout();
                  }}
                >
                  SIGN OUT ({user?.name || 'Alex Tan'})
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="login-btn full-width"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenLoginModal) onOpenLoginModal();
                }}
              >
                LOG IN
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Navbar;
