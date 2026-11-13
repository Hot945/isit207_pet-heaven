import { useState, useMemo, useEffect, useRef } from 'react';
import PETS_DATABASE, { getPetImageUrl, SHELTERS_LIST } from '../data/petsData';
import iconBreed from '../assets/pet-svgrepo-com.svg';
import iconAge from '../assets/cake-svgrepo-com.svg';
import iconSize from '../assets/ruler-svgrepo-com.svg';
import iconGender from '../assets/woman-svgrepo-com.svg';
import iconGoodWith from '../assets/task-square-svgrepo-com.svg';
import iconCoatLength from '../assets/fatrows-svgrepo-com.svg';
import iconColor from '../assets/colorfilter-svgrepo-com.svg';
import iconCareBehavior from '../assets/lifebuoy-svgrepo-com.svg';
import iconShelter from '../assets/home-2-svgrepo-com.svg';
import searchIcon from '../assets/search.svg';
import PetDetailView from '../components/PetDetailView';
import AdoptionApplicationForm from '../components/AdoptionApplicationForm';
import './FindPet.css';

let catalogScrollMemory = null;

function saveCatalogScrollPosition(scrollY) {
  catalogScrollMemory = scrollY;
}

function consumeCatalogScrollPosition() {
  const val = catalogScrollMemory;
  catalogScrollMemory = null;
  return val;
}

function syncDocumentTitle(title) {
  document.title = title;
}

function syncLocationHash(hash) {
  if (window.location.hash !== `#${hash}`) {
    window.location.hash = hash;
  }
}

function findPetByUrlParam(param) {
  if (!param) return null;
  const lowered = param.toLowerCase();
  return (
    PETS_DATABASE.find(
      (p) =>
        p.id.toLowerCase() === lowered ||
        p.name.toLowerCase() === lowered ||
        encodeURIComponent(p.name).toLowerCase() === lowered
    ) || null
  );
}

function DogIcon({ className = '', size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11.25 16.25h1.5L12 17z" />
      <path d="M16 14v.5" />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
      <path d="M8 14v.5" />
      <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
    </svg>
  );
}

function CatIcon({ className = '', size = 20 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
      <path d="M8 14v.5" />
      <path d="M16 14v.5" />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
    </svg>
  );
}

export default function FindPet({
  initialPetType = 'dog',
  initialPetId = null,
  isLoggedIn = false,
  onOpenLoginModal,
  onShowToast,
  user,
  favorites: propFavorites,
  toggleFavorite: propToggleFavorite,
}) {

  const [applyingPet, setApplyingPet] = useState(null);

  const [petType, setPetType] = useState(() => {
    if (initialPetType === 'cat' || initialPetType === 'cats') return 'cat';
    return 'dog';
  });
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);

  const [globalKeyword, setGlobalKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [searchInputVal, setSearchInputVal] = useState('');

  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedGoodWith, setSelectedGoodWith] = useState([]);
  const [selectedCoats, setSelectedCoats] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [houseTrainedFilter, setHouseTrainedFilter] = useState('');
  const [specialNeedsFilter, setSpecialNeedsFilter] = useState(false);
  const [selectedShelters, setSelectedShelters] = useState([]);

  const [openSections, setOpenSections] = useState({
    breed: false,
    age: false,
    size: false,
    gender: false,
    goodWith: false,
    coatLength: false,
    color: false,
    careBehavior: false,
    shelter: false
  });

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const [sortState, setSortState] = useState('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  const [flippedCards, setFlippedCards] = useState({});

  const toggleCardFlip = (e, petId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFlippedCards(prev => ({
      ...prev,
      [petId]: !prev[petId]
    }));
  };

  const [localFavorites, setLocalFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pet_heaven_favorites');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const favorites = propFavorites !== undefined ? propFavorites : localFavorites;

  const toggleFavorite = (e, petId) => {
    if (propToggleFavorite) {
      propToggleFavorite(e, petId);
      return;
    }
    if (e && e.stopPropagation) e.stopPropagation();
    setLocalFavorites(prev => {
      const next = { ...prev, [petId]: !prev[petId] };
      try {
        localStorage.setItem('pet_heaven_favorites', JSON.stringify(next));
      } catch (err) {
        console.warn('Failed to persist favorites', err);
      }
      return next;
    });
  };

  const normalizedInitialType = initialPetType === 'cat' || initialPetType === 'cats' ? 'cat' : 'dog';
  const [prevInitialType, setPrevInitialType] = useState(normalizedInitialType);
  if (prevInitialType !== normalizedInitialType) {
    setPrevInitialType(normalizedInitialType);
    setPetType(normalizedInitialType);
  }

  const [activePetDetail, setActivePetDetail] = useState(() => findPetByUrlParam(initialPetId));
  const [prevInitialPetId, setPrevInitialPetId] = useState(initialPetId);
  if (prevInitialPetId !== initialPetId) {
    setPrevInitialPetId(initialPetId);
    if (initialPetId) {
      const target = findPetByUrlParam(initialPetId);
      setActivePetDetail(target);
      if (target?.type === 'cat') setPetType('cat');
      else if (target?.type === 'dog') setPetType('dog');
    } else {
      setActivePetDetail(null);
    }
  }

  useEffect(() => {
    if (activePetDetail) {
      syncDocumentTitle(`${activePetDetail.name} | Pet Heaven`);
    } else {
      syncDocumentTitle('Pet Heaven - Rescue Pet Adoption & Care');
      const targetY = consumeCatalogScrollPosition();
      if (targetY !== null) {
        setTimeout(() => {
          window.scrollTo({ top: targetY, behavior: 'instant' });
        }, 0);
      }
    }
  }, [activePetDetail]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setIsTypeDropdownOpen(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterCardRef = useRef(null);

  useEffect(() => {
    const cardEl = filterCardRef.current;
    if (!cardEl) return;

    const handleWheel = (e) => {
      let deltaY = e.deltaY;
      if (e.deltaMode === 1) deltaY *= 33;
      else if (e.deltaMode === 2) deltaY *= (cardEl.clientHeight || 400);

      const isDown = deltaY > 0;
      const isUp = deltaY < 0;

      const accordionGroupEl = cardEl.querySelector('.filter-accordions-group');

      let targetScrollable = null;
      let curr = e.target;
      while (curr && curr !== accordionGroupEl && curr !== cardEl) {
        if (curr.scrollHeight > curr.clientHeight + 2) {
          const overflowY = window.getComputedStyle(curr).overflowY;
          if (overflowY === 'auto' || overflowY === 'scroll') {
            targetScrollable = curr;
            break;
          }
        }
        curr = curr.parentElement;
      }

      if (targetScrollable) {
        const { scrollTop, scrollHeight, clientHeight } = targetScrollable;
        const canScrollSubDown = isDown && Math.ceil(scrollTop + clientHeight) < scrollHeight - 1;
        const canScrollSubUp = isUp && scrollTop > 1;

        if (canScrollSubDown || canScrollSubUp) {
          targetScrollable.scrollTop += deltaY;
          e.preventDefault();
          return;
        }

        if (accordionGroupEl) {
          const { scrollTop: aTop, scrollHeight: aHeight, clientHeight: aClient } = accordionGroupEl;
          const canScrollAccDown = isDown && Math.ceil(aTop + aClient) < aHeight - 1;
          const canScrollAccUp = isUp && aTop > 1;
          if (canScrollAccDown || canScrollAccUp) {
            accordionGroupEl.scrollTop += deltaY;
            e.preventDefault();
            return;
          }
        }
      }

      if (accordionGroupEl) {
        const { scrollTop, scrollHeight, clientHeight } = accordionGroupEl;
        const hasOverflow = scrollHeight > clientHeight + 2;
        const canScrollDown = isDown && hasOverflow && Math.ceil(scrollTop + clientHeight) < scrollHeight - 1;
        const canScrollUp = isUp && hasOverflow && scrollTop > 1;

        if (canScrollDown || canScrollUp) {
          accordionGroupEl.scrollTop += deltaY;
          e.preventDefault();
          return;
        }
      }

    };

    cardEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      cardEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleClearAll = () => {
    setSelectedBreeds([]);
    setSelectedAges([]);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setSelectedGoodWith([]);
    setSelectedCoats([]);
    setSelectedColors([]);
    setHouseTrainedFilter('');
    setSpecialNeedsFilter(false);
    setSelectedShelters([]);
    setNameKeyword('');
    setSearchInputVal('');
    setGlobalKeyword('');
  };

  const hasActiveFilters = Boolean(
    selectedBreeds.length > 0 ||
    selectedAges.length > 0 ||
    selectedSizes.length > 0 ||
    selectedGenders.length > 0 ||
    selectedGoodWith.length > 0 ||
    selectedCoats.length > 0 ||
    selectedColors.length > 0 ||
    houseTrainedFilter !== '' ||
    specialNeedsFilter ||
    selectedShelters.length > 0 ||
    nameKeyword.trim() !== '' ||
    searchInputVal.trim() !== '' ||
    globalKeyword.trim() !== ''
  );

  const availableBreeds = useMemo(() => {
    const breedCounts = {};
    PETS_DATABASE.forEach(pet => {
      if (pet.type !== petType) return;
      breedCounts[pet.breedFolder] = (breedCounts[pet.breedFolder] || 0) + 1;
    });
    return Object.entries(breedCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [petType]);

  const [breedSearchTerm, setBreedSearchTerm] = useState('');
  const filteredBreedsList = useMemo(() => {
    if (!breedSearchTerm.trim()) return availableBreeds;
    return availableBreeds.filter(b => b.name.toLowerCase().includes(breedSearchTerm.toLowerCase()));
  }, [availableBreeds, breedSearchTerm]);

  const filteredPets = useMemo(() => {
    let result = PETS_DATABASE.filter(pet => {

      if (pet.type !== petType) return false;

      if (nameKeyword.trim()) {
        const kw = nameKeyword.toLowerCase().trim();
        const matchName = pet.name.toLowerCase().includes(kw);
        const matchBreed = pet.breed.toLowerCase().includes(kw);
        if (!matchName && !matchBreed) return false;
      }

      if (globalKeyword.trim()) {
        const kw = globalKeyword.toLowerCase().trim();
        const matchesGlobal = (
          (pet.name && pet.name.toLowerCase().includes(kw)) ||
          (pet.breed && pet.breed.toLowerCase().includes(kw)) ||
          (pet.shelter && pet.shelter.toLowerCase().includes(kw)) ||
          (pet.color && pet.color.toLowerCase().includes(kw)) ||
          (pet.story && pet.story.toLowerCase().includes(kw))
        );
        if (!matchesGlobal) return false;
      }

      if (selectedBreeds.length > 0 && !selectedBreeds.includes(pet.breedFolder)) {
        return false;
      }

      if (selectedAges.length > 0) {
        const matchesAge = selectedAges.some(age => {
          if (age === 'Puppy/Kitten') {
            return pet.ageGroup === 'Puppy' || pet.ageGroup === 'Kitten';
          }
          return pet.ageGroup === age;
        });
        if (!matchesAge) return false;
      }

      if (selectedSizes.length > 0 && !selectedSizes.includes(pet.sizeGroup)) {
        return false;
      }

      if (selectedGenders.length > 0 && !selectedGenders.includes(pet.gender)) {
        return false;
      }

      if (selectedGoodWith.length > 0) {
        const hasAll = selectedGoodWith.every(item => pet.goodWith && pet.goodWith.includes(item));
        if (!hasAll) return false;
      }

      if (selectedCoats.length > 0 && !selectedCoats.includes(pet.coatLength)) {
        return false;
      }

      if (selectedColors.length > 0 && !selectedColors.includes(pet.color)) {
        return false;
      }

      if (houseTrainedFilter && pet.houseTrained !== houseTrainedFilter) {
        return false;
      }
      if (specialNeedsFilter && !pet.specialNeeds) {
        return false;
      }

      if (selectedShelters.length > 0 && !selectedShelters.includes(pet.shelter)) {
        return false;
      }

      return true;
    });

    if (sortState === 'newest') {
      result.sort((a, b) => new Date(b.additionDate) - new Date(a.additionDate));
    } else if (sortState === 'oldest') {
      result.sort((a, b) => new Date(a.additionDate) - new Date(b.additionDate));
    }

    return result;
  }, [
    petType,
    nameKeyword,
    globalKeyword,
    selectedBreeds,
    selectedAges,
    selectedSizes,
    selectedGenders,
    selectedGoodWith,
    selectedCoats,
    selectedColors,
    houseTrainedFilter,
    specialNeedsFilter,
    selectedShelters,
    sortState
  ]);

  const toggleArrayItem = (setter, item) => {
    setter(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const handleOpenDetail = (pet) => {
    saveCatalogScrollPosition(window.scrollY);
    setActivePetDetail(pet);
    syncLocationHash(`pet/${pet.id}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackToCatalog = () => {
    const targetY = consumeCatalogScrollPosition();
    setActivePetDetail(null);
    const targetHash = petType === 'cat' ? 'cats' : 'dogs';
    syncLocationHash(targetHash);
    if (targetY !== null) {
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'instant' });
      }, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="find-pet-page">
      {applyingPet ? (
        <AdoptionApplicationForm
          pet={applyingPet}
          user={user}
          onBack={() => {
            setApplyingPet(null);
            setTimeout(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }, 0);
          }}
          onShowToast={onShowToast}
        />
      ) : activePetDetail ? (
        <PetDetailView
          pet={activePetDetail}
          onBack={handleBackToCatalog}
          onAdopt={(petToAdopt) => {
            if (!isLoggedIn) {
              if (onShowToast) {
                onShowToast(`Please log in first to apply for adopting ${petToAdopt.name}.`, 'warning');
              }
              if (onOpenLoginModal) {
                onOpenLoginModal();
              }
              return;
            }
            setApplyingPet(petToAdopt);
            setTimeout(() => {
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }, 0);
          }}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="find-pet-catalog-view">

          <section className="find-pet-header-bar">
        <div className="header-bar-content">
          <div className="header-title-box">
            <h1 className="header-main-title">Find Your Forever Friend</h1>
            <p className="header-sub-title">Browse hundreds of rescued pets ready for loving homes across Singapore</p>
          </div>

          <div className="header-controls-group">

            <div className="pet-type-dropdown-wrapper" ref={typeDropdownRef}>
              <button
                type="button"
                className={`pet-type-selector-btn ${isTypeDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                aria-expanded={isTypeDropdownOpen}
              >
                <div className="pet-type-label-col">
                  <span className="type-micro-label">Pet Type</span>
                  <span className="type-active-val">
                    {petType === 'cat' ? 'Cats' : 'Dogs'}
                  </span>
                </div>
                <svg
                  className={`type-arrow-icon ${isTypeDropdownOpen ? 'rotate' : ''}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isTypeDropdownOpen && (
                <div className="pet-type-menu">
                  <button
                    type="button"
                    className={`type-menu-item ${petType === 'dog' ? 'selected' : ''}`}
                    onClick={() => { setPetType('dog'); setIsTypeDropdownOpen(false); }}
                  >
                    <div className="type-menu-item-left">
                      <DogIcon className="type-menu-icon" size={20} />
                      <span>Dogs</span>
                    </div>
                    {petType === 'dog' && <span className="type-check">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`type-menu-item ${petType === 'cat' ? 'selected' : ''}`}
                    onClick={() => { setPetType('cat'); setIsTypeDropdownOpen(false); }}
                  >
                    <div className="type-menu-item-left">
                      <CatIcon className="type-menu-icon" size={20} />
                      <span>Cats</span>
                    </div>
                    {petType === 'cat' && <span className="type-check">✓</span>}
                  </button>
                </div>
              )}
            </div>

            <div className="header-search-input-wrap">
              <svg
                className="header-search-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="header-search-input"
                placeholder="Search by pet name, breed, shelter, or keyword..."
                value={globalKeyword}
                onChange={(e) => setGlobalKeyword(e.target.value)}
              />
              {globalKeyword && (
                <button
                  type="button"
                  className="input-clear-btn"
                  onClick={() => setGlobalKeyword('')}
                  aria-label="Clear search"
                  title="Clear"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={`find-pet-catalog-wrapper ${filteredPets.length === 0 ? 'is-empty-catalog' : ''}`}>

        <div className="filters-sidebar-dock">
          <aside ref={filterCardRef} className="filters-sidebar-card">
            <div className="filters-top-header">
              <h2 className="filters-title">Filters</h2>
              <button
                type="button"
                className={`filters-clear-btn ${!hasActiveFilters ? 'is-disabled' : ''}`}
                onClick={handleClearAll}
                disabled={!hasActiveFilters}
                aria-disabled={!hasActiveFilters}
              >
                Clear All
              </button>
            </div>

            <div className="filter-accordions-group">

            <div className={`accordion-item ${openSections.breed ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('breed')}
                aria-expanded={openSections.breed}
              >
                <div className="accordion-header-left">
                  <img src={iconBreed} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Breed</span>
                </div>
                <svg className={`accordion-chevron ${openSections.breed ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.breed && (
                <div className="accordion-body-content">
                  <div className="breed-search-input-box">
                    <img src={searchIcon} alt="" className="breed-search-icon" />
                    <input
                      type="text"
                      className="breed-inner-search"
                      placeholder="Search breeds..."
                      value={breedSearchTerm}
                      onChange={(e) => setBreedSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="filter-options-scrollable">
                    {filteredBreedsList.map(b => (
                      <label key={b.name} className="filter-option-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedBreeds.includes(b.name)}
                          onChange={() => toggleArrayItem(setSelectedBreeds, b.name)}
                        />
                        <span className="checkbox-custom-box"></span>
                        <span className="option-name">{b.name}</span>
                        <span className="option-count">({b.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.age ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('age')}
                aria-expanded={openSections.age}
              >
                <div className="accordion-header-left">
                  <img src={iconAge} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Age</span>
                </div>
                <svg className={`accordion-chevron ${openSections.age ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.age && (
                <div className="accordion-body-content">
                  {['Puppy/Kitten', 'Young', 'Adult', 'Senior'].map(age => (
                    <label key={age} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedAges.includes(age)}
                        onChange={() => toggleArrayItem(setSelectedAges, age)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{age}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.size ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('size')}
                aria-expanded={openSections.size}
              >
                <div className="accordion-header-left">
                  <img src={iconSize} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Size</span>
                </div>
                <svg className={`accordion-chevron ${openSections.size ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.size && (
                <div className="accordion-body-content">
                  {['Small', 'Medium', 'Large', 'Extra Large'].map(size => (
                    <label key={size} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleArrayItem(setSelectedSizes, size)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{size}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.gender ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('gender')}
                aria-expanded={openSections.gender}
              >
                <div className="accordion-header-left">
                  <img src={iconGender} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Gender</span>
                </div>
                <svg className={`accordion-chevron ${openSections.gender ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.gender && (
                <div className="accordion-body-content">
                  {['Male', 'Female'].map(gender => (
                    <label key={gender} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedGenders.includes(gender)}
                        onChange={() => toggleArrayItem(setSelectedGenders, gender)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{gender}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.goodWith ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('goodWith')}
                aria-expanded={openSections.goodWith}
              >
                <div className="accordion-header-left">
                  <img src={iconGoodWith} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Good With</span>
                </div>
                <svg className={`accordion-chevron ${openSections.goodWith ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.goodWith && (
                <div className="accordion-body-content">
                  {['Kids', 'Dogs', 'Cats'].map(item => (
                    <label key={item} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedGoodWith.includes(item)}
                        onChange={() => toggleArrayItem(setSelectedGoodWith, item)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.coatLength ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('coatLength')}
                aria-expanded={openSections.coatLength}
              >
                <div className="accordion-header-left">
                  <img src={iconCoatLength} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Coat Length</span>
                </div>
                <svg className={`accordion-chevron ${openSections.coatLength ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.coatLength && (
                <div className="accordion-body-content">
                  {['Short', 'Medium', 'Long', 'Hairless'].map(coat => (
                    <label key={coat} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedCoats.includes(coat)}
                        onChange={() => toggleArrayItem(setSelectedCoats, coat)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{coat}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.color ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('color')}
                aria-expanded={openSections.color}
              >
                <div className="accordion-header-left">
                  <img src={iconColor} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Color</span>
                </div>
                <svg className={`accordion-chevron ${openSections.color ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.color && (
                <div className="accordion-body-content">
                  {[
                    'Brown/Chocolate',
                    'Golden/Yellow',
                    'Black',
                    'White',
                    'Spotted/Tabby',
                    'Bicolor',
                    'Tricolor',
                    'Gray/Silver',
                    'Cream'
                  ].map(c => (
                    <label key={c} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(c)}
                        onChange={() => toggleArrayItem(setSelectedColors, c)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{c}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.careBehavior ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('careBehavior')}
                aria-expanded={openSections.careBehavior}
              >
                <div className="accordion-header-left">
                  <img src={iconCareBehavior} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Care & Behavior</span>
                </div>
                <svg className={`accordion-chevron ${openSections.careBehavior ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.careBehavior && (
                <div className="accordion-body-content">
                  <label className="filter-option-checkbox">
                    <input
                      type="checkbox"
                      checked={houseTrainedFilter === 'Yes'}
                      onChange={(e) => setHouseTrainedFilter(e.target.checked ? 'Yes' : '')}
                    />
                    <span className="checkbox-custom-box"></span>
                    <span className="option-name">House-trained</span>
                  </label>
                  <label className="filter-option-checkbox">
                    <input
                      type="checkbox"
                      checked={specialNeedsFilter}
                      onChange={(e) => setSpecialNeedsFilter(e.target.checked)}
                    />
                    <span className="checkbox-custom-box"></span>
                    <span className="option-name">Special Needs</span>
                  </label>
                </div>
              )}
            </div>

            <div className={`accordion-item ${openSections.shelter ? 'is-open' : ''}`}>
              <button
                type="button"
                className="accordion-header-btn"
                onClick={() => toggleSection('shelter')}
                aria-expanded={openSections.shelter}
              >
                <div className="accordion-header-left">
                  <img src={iconShelter} alt="" className="accordion-header-icon" />
                  <span className="accordion-label-text">Shelter or Rescue</span>
                </div>
                <svg className={`accordion-chevron ${openSections.shelter ? 'rotate' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {openSections.shelter && (
                <div className="accordion-body-content filter-options-scrollable">
                  {SHELTERS_LIST.map(s => (
                    <label key={s.name} className="filter-option-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedShelters.includes(s.name)}
                        onChange={() => toggleArrayItem(setSelectedShelters, s.name)}
                      />
                      <span className="checkbox-custom-box"></span>
                      <span className="option-name">{s.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sidebar-bottom-name-search">
            <div className="search-field-inner">
              <span className="search-micro-label">Pet Name</span>
              <input
                type="text"
                className="search-field-input"
                placeholder="Type here..."
                value={searchInputVal}
                onChange={(e) => setSearchInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setNameKeyword(searchInputVal);
                }}
              />
            </div>
            <button
              type="button"
              className="search-submit-btn"
              onClick={() => setNameKeyword(searchInputVal)}
              aria-label="Search by pet name"
              title="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </div>
        </aside>
        </div>

        <div className={`find-pet-main-layout ${filteredPets.length === 0 ? 'is-empty-layout' : ''}`}>
          <section className="results-content-area">

          <div className="results-header-row">
            <div className="results-count-box">
              <span className="results-count-num">{filteredPets.length.toLocaleString()}</span>
              <span className="results-count-text"> pet results</span>
              {nameKeyword && (
                <span className="filter-pill-tag">
                  Name: "{nameKeyword}"
                  <button type="button" onClick={() => { setNameKeyword(''); setSearchInputVal(''); }}>×</button>
                </span>
              )}
            </div>

            <div className="sort-by-container" ref={sortDropdownRef}>
              <span
                className="sort-by-prefix"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                Sort By:
              </span>
              <button
                type="button"
                className={`sort-by-toggle-btn ${isSortOpen ? 'open' : ''} ${sortState !== 'default' ? 'is-active-sort' : ''}`}
                onClick={() => setIsSortOpen(!isSortOpen)}
                aria-expanded={isSortOpen}
                aria-haspopup="listbox"
                title="Sort options"
              >
                <span className="sort-by-current-val">
                  {sortState === 'default' && 'Default'}
                  {sortState === 'newest' && 'Newest Addition'}
                  {sortState === 'oldest' && 'Oldest Addition'}
                </span>
                <svg
                  className={`sort-chevron-icon ${isSortOpen ? 'rotate' : ''}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isSortOpen && (
                <div className="sort-dropdown-menu" role="listbox">
                  <button
                    type="button"
                    className={`sort-menu-option ${sortState === 'default' ? 'selected' : ''}`}
                    onClick={() => {
                      setSortState('default');
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortState === 'default'}
                  >
                    <span>Default</span>
                    {sortState === 'default' && <span className="sort-option-check">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`sort-menu-option ${sortState === 'newest' ? 'selected' : ''}`}
                    onClick={() => {
                      setSortState('newest');
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortState === 'newest'}
                  >
                    <span>Newest Addition</span>
                    {sortState === 'newest' && <span className="sort-option-check">✓</span>}
                  </button>
                  <button
                    type="button"
                    className={`sort-menu-option ${sortState === 'oldest' ? 'selected' : ''}`}
                    onClick={() => {
                      setSortState('oldest');
                      setIsSortOpen(false);
                    }}
                    role="option"
                    aria-selected={sortState === 'oldest'}
                  >
                    <span>Oldest Addition</span>
                    {sortState === 'oldest' && <span className="sort-option-check">✓</span>}
                  </button>
                </div>
              )}
            </div>
          </div>

          {filteredPets.length === 0 ? (
            <div className="empty-results-box">
              <div className="empty-icon-wrap">🐾</div>
              <h3>No pets found matching your filters</h3>
              <p>Try clearing some filters or searching for another breed or shelter.</p>
              <button type="button" className="clear-filters-action-btn" onClick={handleClearAll}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="pets-cards-grid">
              {filteredPets.map(pet => {
                const isFav = !!favorites[pet.id];
                const isFlipped = !!flippedCards[pet.id];
                const resolvedImg = getPetImageUrl(pet.image);

                return (
                  <article key={pet.id} className={`pet-card-item ${isFlipped ? 'is-flipped' : ''}`}>
                    <div className="pet-card-inner">

                      <div className="pet-card-front">
                        <div className="pet-card-image-box" onClick={() => handleOpenDetail(pet)}>
                          <img
                            src={resolvedImg}
                            alt={`${pet.name} - ${pet.breed}`}
                            className="pet-card-photo"
                            loading="lazy"
                          />

                          <button
                            type="button"
                            className={`pet-favorite-toggle-btn ${isFav ? 'is-favorited' : ''}`}
                            onClick={(e) => toggleFavorite(e, pet.id)}
                            aria-label={isFav ? 'Remove from favorites' : 'Save to favorites'}
                            title={isFav ? 'Favorited' : 'Add to Favorites'}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill={isFav ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                            </svg>
                          </button>

                          <div className="pet-image-bottom-gradient">
                            <h3 className="pet-gradient-name">{pet.name}</h3>
                            <p className="pet-gradient-location">
                              {pet.shelter}
                            </p>
                          </div>
                        </div>

                        <div className="pet-card-body">
                          <div className="pet-card-traits">
                            <span className="pet-trait-line">
                              {pet.ageGroup} • {pet.gender}
                            </span>
                            <span className="pet-breed-line" title={pet.breed}>
                              {pet.breed}
                            </span>
                          </div>

                          <div className="pet-card-actions">
                            <button
                              type="button"
                              className="pet-btn-view-profile"
                              onClick={() => handleOpenDetail(pet)}
                            >
                              VIEW PROFILE
                            </button>
                            <button
                              type="button"
                              className="pet-btn-fast-facts"
                              onClick={(e) => toggleCardFlip(e, pet.id)}
                              title="Click to flip card for Fast Facts"
                            >
                              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </svg>
                              <span>FAST FACTS</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pet-card-back">
                        <div className="fast-facts-top-content">
                          <h3 className="fast-facts-heading">Fast Facts about {pet.name}</h3>

                          <div className="fast-facts-rows-list">

                            <div className="fast-facts-row">
                              <div className="fact-row-label">
                                <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                </svg>
                                <span>Shelter</span>
                              </div>
                              <span className="fact-row-val" title={pet.shelter}>{pet.shelter}</span>
                            </div>

                            <div className="fast-facts-row">
                              <div className="fact-row-label">
                                <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                  <path d="M9 14h6" />
                                </svg>
                                <span>House-trained?</span>
                              </div>
                              <span className="fact-row-val">{pet.houseTrained}</span>
                            </div>

                            <div className="fast-facts-row">
                              <div className="fact-row-label">
                                <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
                                  <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
                                  <path d="M2 21h20" />
                                  <path d="M7 8v3" />
                                  <path d="M12 8v3" />
                                  <path d="M17 8v3" />
                                </svg>
                                <span>Age</span>
                              </div>
                              <span className="fact-row-val">{pet.ageGroup}</span>
                            </div>

                            <div className="fast-facts-row">
                              <div className="fact-row-label">
                                <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <circle cx="12" cy="12" r="9" />
                                  <path d="M12 3v18" />
                                </svg>
                                <span>Gender & Size</span>
                              </div>
                              <span className="fact-row-val">{pet.gender} • {pet.sizeGroup}</span>
                            </div>

                            <div className="fast-facts-row">
                              <div className="fact-row-label">
                                <svg className="fact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                <span>Good With</span>
                              </div>
                              <span className="fact-row-val">{pet.goodWith && pet.goodWith.length > 0 ? pet.goodWith.join(', ') : 'Inquire'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="fast-facts-bottom-actions">
                          <div className="fast-facts-dual-btns">
                            <button
                              type="button"
                              className="btn-back-view-profile"
                              onClick={() => handleOpenDetail(pet)}
                            >
                              VIEW PROFILE
                            </button>
                            <button
                              type="button"
                              className="btn-back-pet-card"
                              onClick={(e) => toggleCardFlip(e, pet.id)}
                              title="Flip back to pet photo card"
                            >
                              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <path d="M9 15l-3 3 3 3" />
                                <path d="M6 18h7a3 3 0 0 0 3-3" />
                              </svg>
                              <span>PET CARD</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
