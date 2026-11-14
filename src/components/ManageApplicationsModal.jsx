import { useState, useEffect } from 'react';
import { getPetImageUrl } from '../data/petsData';
import './ManageApplicationsModal.css';

const buildPetPlaceholderSvg = (iconMarkup) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" rx="10" fill="#ede6f5"/>${iconMarkup}</svg>`
  )}`;

const PET_PLACEHOLDERS = {
  dog: buildPetPlaceholderSvg(
    '<g transform="translate(15 15) scale(1.25)" fill="none" stroke="#8e1ea2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/></g>'
  ),
  cat: buildPetPlaceholderSvg(
    '<g transform="translate(15 15) scale(1.25)" fill="none" stroke="#8e1ea2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/></g>'
  ),
  other: buildPetPlaceholderSvg(
    '<g transform="translate(15 15) scale(1.25)" fill="#8e1ea2"><path d="M7.57065 15.3763C9.15635 12.148 9.9492 10.5339 11.0904 10.1493C11.681 9.95024 12.319 9.95024 12.9096 10.1493C14.0508 10.5339 14.8437 12.148 16.4294 15.3763L17.3081 17.1653C17.7177 17.9992 17.9225 18.4162 17.971 18.7003C18.1722 19.879 17.3002 20.9654 16.1254 20.9996C15.8422 21.0079 15.4 20.8867 14.5156 20.6443C14.0101 20.5058 13.7574 20.4365 13.5047 20.3854C12.5113 20.1843 11.4887 20.1843 10.4953 20.3854C10.2426 20.4365 9.98987 20.5058 9.48445 20.6443C8.6 20.8867 8.15777 21.0079 7.87458 20.9996C6.6998 20.9654 5.82776 19.879 6.02896 18.7003C6.07746 18.4162 6.28227 17.9992 6.69189 17.1653L7.57065 15.3763Z"/><path d="M6.14477 5.52746C6.55659 7.15822 7.72105 8.24406 8.74566 7.95275C9.77027 7.66144 10.267 6.1033 9.85523 4.47254C9.44341 2.84178 8.27895 1.75594 7.25434 2.04725C6.22973 2.33856 5.73296 3.8967 6.14477 5.52746Z"/><path d="M17.8552 5.52746C17.4434 7.15822 16.279 8.24406 15.2543 7.95275C14.2297 7.66144 13.733 6.1033 14.1448 4.47254C14.5566 2.84178 15.721 1.75594 16.7457 2.04725C17.7703 2.33856 18.267 3.8967 17.8552 5.52746Z"/><path d="M2.20166 12.2971C2.65166 13.5021 3.70968 14.2341 4.5648 13.9319C5.41993 13.6298 5.74834 12.4079 5.29834 11.2029C4.84834 9.99785 3.79032 9.26592 2.9352 9.56808C2.08007 9.87024 1.75166 11.0921 2.20166 12.2971Z"/><path d="M21.7983 12.2971C21.3483 13.5021 20.2903 14.2341 19.4352 13.9319C18.5801 13.6298 18.2517 12.4079 18.7017 11.2029C19.1517 9.99785 20.2097 9.26592 21.0648 9.56808C21.9199 9.87024 22.2483 11.0921 21.7983 12.2971Z"/></g>'
  ),
};

const getPetPlaceholder = (petType = '') => {
  const normalized = String(petType).trim().toLowerCase();
  if (normalized === 'dog') return PET_PLACEHOLDERS.dog;
  if (normalized === 'cat') return PET_PLACEHOLDERS.cat;
  return PET_PLACEHOLDERS.other;
};

const ADOPT_STORAGE_KEY = 'pet_heaven_user_applications';
const RELEASE_STORAGE_KEY = 'pet_heaven_user_release_applications';
const LEGACY_ADOPT_SEEDED_KEY = 'pet_heaven_adopt_apps_seeded';
const LEGACY_RELEASE_SEEDED_KEY = 'pet_heaven_release_apps_seeded';

const LEGACY_ADOPT_SEED_CODES = new Set([
  'APP-2026-7142',
  'APP-2026-3829',
  'APP-2026-4912',
  'APP-2026-1508',
  'APP-2026-6271',
]);

const LEGACY_RELEASE_SEED_CODES = new Set([
  'REL-2026-8842',
  'REL-2026-6194',
  'REL-2026-4277',
  'REL-2026-2915',
  'REL-2026-1403',
]);

const loadStoredList = (storageKey, legacySeedKey, legacySeedCodes, userEmail, emailField) => {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = raw ? JSON.parse(raw) : [];
    let list = Array.isArray(parsed) ? parsed : [];

    if (localStorage.getItem(legacySeedKey)) {
      list = list.filter((item) => !legacySeedCodes.has(item?.referenceCode));
      localStorage.setItem(storageKey, JSON.stringify(list));
      localStorage.removeItem(legacySeedKey);
    }

    if (userEmail) {
      return list.filter(
        (item) => (item?.[emailField] || '').trim().toLowerCase() === userEmail
      );
    }
    return list;
  } catch (e) {
    console.warn('Failed to parse applications from storage', e);
    return [];
  }
};

export default function ManageApplicationsModal(props) {
  if (!props.isOpen) return null;
  return <ManageApplicationsModalContent {...props} />;
}

function ManageApplicationsModalContent({
  onClose,
  user,
  onNavigate,
  onShowToast = () => {},
}) {
  const userEmail = (user?.email || '').trim().toLowerCase();
  const [activeTab, setActiveTab] = useState('adopt');
  const [adoptApps, setAdoptApps] = useState(() =>
    loadStoredList(
      ADOPT_STORAGE_KEY,
      LEGACY_ADOPT_SEEDED_KEY,
      LEGACY_ADOPT_SEED_CODES,
      userEmail,
      'applicantEmail'
    )
  );
  const [releaseApps, setReleaseApps] = useState(() =>
    loadStoredList(
      RELEASE_STORAGE_KEY,
      LEGACY_RELEASE_SEEDED_KEY,
      LEGACY_RELEASE_SEED_CODES,
      userEmail,
      'ownerEmail'
    )
  );
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (confirmDeleteTarget) {
          setConfirmDeleteTarget(null);
        } else if (selectedApp) {
          setSelectedApp(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedApp, confirmDeleteTarget, onClose]);

  const resolveImage = (img, petType) => {
    if (!img) return getPetPlaceholder(petType);
    if (img.startsWith('data:') || img.startsWith('blob:') || img.startsWith('http')) return img;
    if (img.startsWith('/src/assets/pets/')) return getPetImageUrl(img);
    return img;
  };

  const handleDeleteRecord = (refCode) => {
    const removeFromStorage = (storageKey) => {
      try {
        const raw = localStorage.getItem(storageKey);
        const list = raw ? JSON.parse(raw) : [];
        if (Array.isArray(list)) {
          localStorage.setItem(
            storageKey,
            JSON.stringify(list.filter((a) => a.referenceCode !== refCode))
          );
        }
      } catch (err) {
        console.warn('Failed to update applications storage', err);
      }
    };

    if (activeTab === 'adopt') {
      setAdoptApps((prev) => prev.filter((a) => a.referenceCode !== refCode));
      removeFromStorage(ADOPT_STORAGE_KEY);
    } else {
      setReleaseApps((prev) => prev.filter((a) => a.referenceCode !== refCode));
      removeFromStorage(RELEASE_STORAGE_KEY);
    }
    if (selectedApp && selectedApp.referenceCode === refCode) {
      setSelectedApp(null);
    }
    onShowToast(`Application #${refCode} has been withdrawn.`, 'info');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedApp(null);
    setConfirmDeleteTarget(null);
  };

  const currentList = activeTab === 'adopt' ? adoptApps : releaseApps;

  return (
    <div className="manage-applications-backdrop" onClick={onClose}>
      <div
        className="manage-applications-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manage-apps-title"
      >

        <div className="manage-applications-header">
          <h2 id="manage-apps-title" className="manage-applications-title">
            Manage Applications
          </h2>
          <button
            type="button"
            className="manage-applications-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="manage-applications-body">

          <aside className="manage-applications-sidebar">
            <nav className="apps-nav-list">
              <button
                type="button"
                className={`apps-nav-btn ${activeTab === 'adopt' ? 'active' : ''}`}
                onClick={() => handleTabChange('adopt')}
              >
                <div className="apps-nav-btn-left">

                  <svg
                    className="apps-nav-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  </svg>
                  <span className="apps-nav-label">Adopt</span>
                </div>
                <span className="apps-nav-count">{adoptApps.length}</span>
              </button>

              <button
                type="button"
                className={`apps-nav-btn ${activeTab === 'release' ? 'active' : ''}`}
                onClick={() => handleTabChange('release')}
              >
                <div className="apps-nav-btn-left">

                  <svg
                    className="apps-nav-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9" />
                  </svg>
                  <span className="apps-nav-label">Release</span>
                </div>
                <span className="apps-nav-count">{releaseApps.length}</span>
              </button>
            </nav>
          </aside>

          <section className="manage-applications-content">
            {selectedApp ? (

              <div className="app-detail-view">
                <div className="app-detail-top-nav">
                  <button
                    type="button"
                    className="app-back-link-btn"
                    onClick={() => setSelectedApp(null)}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span>Back to {activeTab === 'adopt' ? 'Adoption' : 'Release'} Applications</span>
                  </button>
                </div>

                <div className="app-detail-card">

                  <div className="app-detail-hero-row">
                    <img
                      src={resolveImage(selectedApp.petImage, selectedApp.petType)}
                      alt={selectedApp.petName}
                      className="app-detail-pet-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getPetPlaceholder(selectedApp.petType);
                      }}
                    />
                    <div className="app-detail-hero-info">
                      <div className="app-detail-hero-title-wrap">
                        <h3 className="app-detail-pet-name">{selectedApp.petName}</h3>
                        <span className="app-ref-badge">#{selectedApp.referenceCode}</span>
                      </div>
                      <p className="app-detail-pet-sub">
                        {selectedApp.petBreed || selectedApp.breed || 'Pet Rescue'}
                        {selectedApp.petAge ? ` • ${selectedApp.petAge}` : ''}
                        {selectedApp.petGender ? ` • ${selectedApp.petGender}` : ''}
                      </p>
                      <p className="app-detail-pet-shelter">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{selectedApp.petShelter || selectedApp.assignedShelter || 'Certified Singapore Rescue Shelter'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="app-info-grid">
                    <div className="app-info-item">
                      <span className="app-info-label">Submission Date</span>
                      <span className="app-info-val">{selectedApp.submissionDate}</span>
                    </div>
                    <div className="app-info-item">
                      <span className="app-info-label">Applicant / Caregiver</span>
                      <span className="app-info-val">{selectedApp.applicantName || selectedApp.ownerName || user?.name || 'Applicant'}</span>
                    </div>
                    <div className="app-info-item">
                      <span className="app-info-label">Contact Email</span>
                      <span className="app-info-val">{selectedApp.applicantEmail || selectedApp.ownerEmail || user?.email || '-'}</span>
                    </div>
                    <div className="app-info-item">
                      <span className="app-info-label">Contact Phone</span>
                      <span className="app-info-val">{selectedApp.applicantPhone || selectedApp.ownerPhone || '+65 9123 4567'}</span>
                    </div>
                    <div className="app-info-item">
                      <span className="app-info-label">{activeTab === 'adopt' ? 'Housing Environment' : 'Vaccination Status'}</span>
                      <span className="app-info-val">{selectedApp.housingType || selectedApp.vaccinationStatus || 'Approved Residential'}</span>
                    </div>
                    {selectedApp.shelterContact && (
                      <div className="app-info-item">
                        <span className="app-info-label">Shelter Contact</span>
                        <span className="app-info-val">{selectedApp.shelterContact}</span>
                      </div>
                    )}
                    {selectedApp.rehomeReason && (
                      <div className="app-info-item full-width">
                        <span className="app-info-label">Reason for Rehoming</span>
                        <span className="app-info-val">{selectedApp.rehomeReason}</span>
                      </div>
                    )}
                    {(selectedApp.notes || selectedApp.petStory) && (
                      <div className="app-info-item full-width">
                        <span className="app-info-label">Application Notes / Description</span>
                        <span className="app-info-val">{selectedApp.notes || selectedApp.petStory}</span>
                      </div>
                    )}
                  </div>

                  <div className="app-detail-actions">
                    <button
                      type="button"
                      className="app-danger-outline-btn"
                      onClick={() => setConfirmDeleteTarget(selectedApp)}
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              </div>
            ) : (

              <div className="app-list-view">
                <div className="app-list-header">
                  <div>
                    <h3 className="app-list-heading">
                      {activeTab === 'adopt' ? 'Adoption Applications' : 'Release & Rehoming Requests'}
                    </h3>
                    <p className="app-list-subtitle">
                      {activeTab === 'adopt'
                        ? 'Review your submitted adoption applications and contact records.'
                        : 'Review ongoing rehoming intake applications and submitted profiles.'}
                    </p>
                  </div>
                </div>

                {currentList.length === 0 ? (

                  <div className="app-empty-state">
                    <div className="app-empty-icon-wrap">
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        <path d="M12 11h4" />
                        <path d="M12 16h4" />
                        <path d="M8 11h.01" />
                        <path d="M8 16h.01" />
                      </svg>
                    </div>
                    <h4 className="app-empty-title">
                      {activeTab === 'adopt' ? 'No Adoption Applications' : 'No Release Requests'}
                    </h4>
                    <p className="app-empty-desc">
                      {activeTab === 'adopt'
                        ? 'You haven\'t applied for any rescued pets yet. Discover hundreds of dogs, cats, and small animals ready for adoption.'
                        : 'You haven\'t submitted any pet release applications. Pet Heaven connects responsible caregivers with certified animal welfare shelters.'}
                    </p>
                    <button
                      type="button"
                      className="app-empty-cta-btn"
                      onClick={() => {
                        onClose();
                        if (onNavigate) {
                          onNavigate(activeTab === 'adopt' ? 'find-pet' : 'release-pet');
                        }
                      }}
                    >
                      {activeTab === 'adopt' ? 'Find a Pet' : 'Release a Pet'}
                    </button>
                  </div>
                ) : (

                  <div className="app-cards-container">
                    {currentList.map((app) => (
                      <div
                        key={app.referenceCode}
                        className="app-card"
                        onClick={() => setSelectedApp(app)}
                      >
                        <div className="app-card-left">
                          <img
                            src={resolveImage(app.petImage, app.petType)}
                            alt={app.petName}
                            className="app-card-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getPetPlaceholder(app.petType);
                            }}
                          />
                          <div className="app-card-info">
                            <div className="app-card-title-row">
                              <h4 className="app-card-pet-name">{app.petName}</h4>
                              <span className="app-ref-badge">#{app.referenceCode}</span>
                            </div>
                            <p className="app-card-breed">
                              {app.petBreed || app.breed || 'Rescue Pet'}
                            </p>
                            <div className="app-card-shelter-row">
                              <svg className="app-card-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                              <span>{app.petShelter || app.assignedShelter || 'SPCA Singapore'}</span>
                            </div>
                            <div className="app-card-date-row">
                              <span>{app.submissionDate}</span>
                            </div>
                          </div>
                        </div>

                        <div className="app-card-right">
                          <button
                            type="button"
                            className="app-card-action-btn primary"
                            onClick={() => setSelectedApp(app)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {confirmDeleteTarget && (
          <div className="app-withdraw-confirm-overlay" onClick={() => setConfirmDeleteTarget(null)}>
            <div className="app-withdraw-confirm-box" onClick={(e) => e.stopPropagation()}>
              <div className="withdraw-icon-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </div>
              <h4 className="withdraw-title">Withdraw Application?</h4>
              <p className="withdraw-desc">
                Are you sure you want to withdraw application
                <br />
                <strong>#{confirmDeleteTarget.referenceCode}</strong> for <strong>{confirmDeleteTarget.petName}</strong>?
              </p>
              <div className="withdraw-btn-group">
                <button
                  type="button"
                  className="app-secondary-btn"
                  onClick={() => setConfirmDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="app-danger-btn"
                  onClick={() => {
                    handleDeleteRecord(confirmDeleteTarget.referenceCode);
                    setConfirmDeleteTarget(null);
                  }}
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
