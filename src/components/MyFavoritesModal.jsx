import { useState, useMemo } from 'react';
import PETS_DATABASE, { getPetImageUrl } from '../data/petsData';
import './MyFavoritesModal.css';

export default function MyFavoritesModal({
  isOpen,
  onClose,
  favorites = {},
  toggleFavorite,
  onViewPet,
  onBrowsePets,
  onShowToast,
}) {
  const [activeTab, setActiveTab] = useState('all');

  const favoritedPets = useMemo(() => {
    return PETS_DATABASE.filter((pet) => !!favorites[pet.id]);
  }, [favorites]);

  const dogsList = useMemo(() => {
    return favoritedPets.filter((p) => p.type === 'dog');
  }, [favoritedPets]);

  const catsList = useMemo(() => {
    return favoritedPets.filter((p) => p.type === 'cat');
  }, [favoritedPets]);

  const currentDisplayList = useMemo(() => {
    if (activeTab === 'dog') return dogsList;
    if (activeTab === 'cat') return catsList;
    return favoritedPets;
  }, [activeTab, favoritedPets, dogsList, catsList]);

  if (!isOpen) return null;

  const handleToggle = (e, pet) => {
    e.stopPropagation();
    if (toggleFavorite) {
      toggleFavorite(e, pet.id);
      if (onShowToast) {
        const isRemoving = !!favorites[pet.id];
        if (isRemoving) {
          onShowToast(`Removed ${pet.name} from your favorites.`, 'info');
        } else {
          onShowToast(`Added ${pet.name} to your favorites!`, 'success');
        }
      }
    }
  };

  const handleCardClick = (pet) => {
    if (onViewPet) {
      onViewPet(pet);
    }
  };

  return (
    <div
      className="manage-favorites-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-favorites-title"
    >
      <div
        className="manage-favorites-dialog"
        onClick={(e) => e.stopPropagation()}
      >

        <header className="manage-favorites-header">
          <h2 id="manage-favorites-title" className="manage-favorites-title">
            My Favorites
          </h2>

          <button
            type="button"
            className="manage-favorites-close-btn"
            onClick={onClose}
            aria-label="Close favorites dialog"
            title="Close (Esc)"
          >
            ✕
          </button>
        </header>

        <div className="manage-favorites-body">

          <aside className="manage-favorites-sidebar">
            <nav className="favorites-nav-list" aria-label="Favorites Categories">

              <button
                type="button"
                className={`favorites-nav-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                <div className="favorites-nav-btn-left">
                  <svg
                    className="favorites-nav-icon"
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
                  </svg>
                  <span className="favorites-nav-label">All Saved Pets</span>
                </div>
                <span className="favorites-nav-count">{favoritedPets.length}</span>
              </button>

              <button
                type="button"
                className={`favorites-nav-btn ${activeTab === 'dog' ? 'active' : ''}`}
                onClick={() => setActiveTab('dog')}
              >
                <div className="favorites-nav-btn-left">
                  <svg
                    className="favorites-nav-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11.25 16.25h1.5L12 17z" />
                    <path d="M16 14v.5" />
                    <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
                    <path d="M8 14v.5" />
                    <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
                  </svg>
                  <span className="favorites-nav-label">Dogs</span>
                </div>
                <span className="favorites-nav-count">{dogsList.length}</span>
              </button>

              <button
                type="button"
                className={`favorites-nav-btn ${activeTab === 'cat' ? 'active' : ''}`}
                onClick={() => setActiveTab('cat')}
              >
                <div className="favorites-nav-btn-left">
                  <svg
                    className="favorites-nav-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
                    <path d="M8 14v.5" />
                    <path d="M16 14v.5" />
                    <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
                  </svg>
                  <span className="favorites-nav-label">Cats</span>
                </div>
                <span className="favorites-nav-count">{catsList.length}</span>
              </button>
            </nav>
          </aside>

          <main className="manage-favorites-content">

            <div className="favorites-list-header">
              <h3 className="favorites-list-heading">
                {activeTab === 'dog'
                  ? 'Saved Dogs'
                  : activeTab === 'cat'
                  ? 'Saved Cats'
                  : 'All Saved Companions'}
              </h3>
              <p className="favorites-list-subtitle">
                Shortlisted rescue pets synced with your account. Click any card to explore their full profile.
              </p>
            </div>

            {favoritedPets.length === 0 ? (

              <div className="favorites-empty-box">
                <div className="favorites-empty-icon-wrap" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8E1EA2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h4 className="favorites-empty-heading">No Favorites Saved Yet</h4>
                <p className="favorites-empty-desc">
                  You haven't added any pets to your shortlist yet. Click the heart icon on any pet in the catalog to save them here!
                </p>
                <button
                  type="button"
                  className="favorites-explore-btn"
                  onClick={() => {
                    onClose();
                    if (onBrowsePets) onBrowsePets();
                    else window.location.hash = '#find-a-pet';
                  }}
                >
                  Browse Rescue Pets
                </button>
              </div>
            ) : currentDisplayList.length === 0 ? (
              /* 当前分类下无收藏 */
              <div className="favorites-empty-tab-box">
                <p>No {activeTab === 'dog' ? 'dogs' : 'cats'} currently saved in your favorites.</p>
                <button
                  type="button"
                  className="favorites-reset-tab-link"
                  onClick={() => setActiveTab('all')}
                >
                  View all saved pets ({favoritedPets.length})
                </button>
              </div>
            ) : (
              /* 竖向单列列表 (纵向向下滚动) */
              <div className="favorites-vertical-cards-list">
                {currentDisplayList.map((pet) => {
                  const isFav = !!favorites[pet.id];
                  return (
                    <div
                      key={pet.id}
                      className="fav-row-card"
                      onClick={() => handleCardClick(pet)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCardClick(pet);
                      }}
                    >
                      {/* 左侧实景缩略图 */}
                      <div className="fav-row-thumb-wrap">
                        <img
                          src={getPetImageUrl(pet.image)}
                          alt={pet.name}
                          className="fav-row-thumb-img"
                          loading="lazy"
                        />
                        <span className="fav-row-type-badge">
                          {pet.type === 'cat' ? 'Cat' : 'Dog'}
                        </span>
                      </div>

                      {/* 中间核心信息 */}
                      <div className="fav-row-details">
                        <div className="fav-row-title-line">
                          <h4 className="fav-row-name">{pet.name}</h4>
                          <span className="fav-row-breed">{pet.breed}</span>
                        </div>

                        <div className="fav-row-specs-line">
                          <span className="fav-spec-badge">{pet.gender}</span>
                          <span className="fav-spec-badge">{pet.ageDetail || `${pet.ageGroup} Age`}</span>
                          <span className="fav-spec-badge">{pet.sizeGroup} Size</span>
                        </div>

                        <div className="fav-row-shelter-line">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="fav-row-home-icon">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                          <span className="fav-row-shelter-text">
                            {pet.shelter} • {pet.currentLocation}
                          </span>
                        </div>
                      </div>

                      {/* 右侧操作区：心形按钮 + 查看详情按钮 */}
                      <div className="fav-row-actions">
                        <button
                          type="button"
                          className={`fav-row-heart-btn ${isFav ? 'is-fav' : ''}`}
                          onClick={(e) => handleToggle(e, pet)}
                          aria-label={isFav ? `Remove ${pet.name} from favorites` : `Add ${pet.name} to favorites`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill={isFav ? 'currentColor' : 'none'}
                            stroke="currentColor"
                            strokeWidth="2.2"
                          >
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="fav-row-arrow-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick(pet);
                          }}
                          aria-label={`View ${pet.name}'s profile`}
                          title="View Profile"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
