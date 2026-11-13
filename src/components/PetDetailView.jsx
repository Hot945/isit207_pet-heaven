import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getPetImageUrl } from '../data/petsData';
import iconBreed from '../assets/pet-svgrepo-com.svg';
import iconAge from '../assets/cake-svgrepo-com.svg';
import iconSize from '../assets/ruler-svgrepo-com.svg';
import iconGender from '../assets/woman-svgrepo-com.svg';
import iconCoatLength from '../assets/fatrows-svgrepo-com.svg';
import iconColor from '../assets/colorfilter-svgrepo-com.svg';
import iconCareBehavior from '../assets/lifebuoy-svgrepo-com.svg';
import iconBabyCarriage from '../assets/baby-carriage-svgrepo-com.svg';
import iconPaw from '../assets/paw-svgrepo-com.svg';
import iconBell from '../assets/bell-svgrepo-com.svg';
import iconMapPin from '../assets/map-pin.svg';
import iconClock from '../assets/clock.svg';
import iconPhone from '../assets/phone.svg';
import GoogleMapCanvas from './GoogleMapCanvas';
import './PetDetailView.css';

const SHELTER_DIRECTORY = {
  'SPCA Singapore': {
    address: '50 Sungei Tengah Rd, Singapore 699012',
    phone: '+65 6760 1200',
    hours: '11:00 AM - 4:00 PM (Daily, Closed Wed)',
    website: 'https://spca.org.sg'
  },
  'Causes for Animals Singapore (CAS)': {
    address: '81 Pasir Ris Drive 1, Singapore 519599',
    phone: '+65 9793 7162',
    hours: '10:00 AM - 5:00 PM (By appointment)',
    website: 'https://causesforanimals.com'
  },
  'Action for Singapore Dogs (ASD)': {
    address: '80 Lim Chu Kang Lane 1, Singapore 718911',
    phone: '+65 6100 2737',
    hours: '12:00 PM - 5:00 PM (Weekends)',
    website: 'http://asdsingapore.com'
  },
  'Cat Welfare Society (CWS)': {
    address: 'Bishan Community Hub, Singapore 579799',
    phone: '+65 6250 8272',
    hours: '10:00 AM - 6:00 PM (Mon - Fri)',
    website: 'https://catwelfare.org'
  },
  'SOSD Singapore': {
    address: '59 Sungei Tengah Rd, The Animal Lodge, Singapore 699014',
    phone: '+65 9735 8677',
    hours: '12:00 PM - 4:00 PM (Sat - Sun)',
    website: 'https://sosd.org.sg'
  },
  'Animal Lovers League (ALL)': {
    address: '61 Sungei Tengah Rd, #03-40, Singapore 699003',
    phone: '+65 9154 6422',
    hours: '1:00 PM - 5:00 PM (Weekends)',
    website: 'https://animalloversleague.com'
  },
  'Purely Adoptions': {
    address: 'Ang Mo Kio Ave 10, Singapore 569628',
    phone: '+65 9001 8899',
    hours: '10:00 AM - 6:00 PM (Daily)',
    website: 'https://purelyadoptions.com'
  },
  'Oasis Second Chance Animal Shelter (OSCAS)': {
    address: '50 Sungei Tengah Rd, Block G, Singapore 699012',
    phone: '+65 9764 4455',
    hours: '2:00 PM - 5:00 PM (Weekends by appointment)',
    website: 'https://oscas.sg'
  }
};

function parseHoursDisplay(hoursText) {
  const raw = String(hoursText || '');
  const parenIndex = raw.indexOf('(');
  if (parenIndex <= 0) {
    return { main: raw, note: '' };
  }
  return {
    main: raw.slice(0, parenIndex).trim(),
    note: raw.slice(parenIndex).trim(),
  };
}

export default function PetDetailView({
  pet,
  onBack,
  onAdopt,
  favorites = {},
  toggleFavorite
}) {
  const isFav = !!(pet && favorites[pet.id]);
  const [activeTab, setActiveTab] = useState('photos');
  const [copiedShare, setCopiedShare] = useState(false);
  const [isPhotoFullscreen, setIsPhotoFullscreen] = useState(false);

  useEffect(() => {
    if (isPhotoFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setIsPhotoFullscreen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isPhotoFullscreen]);

  const adoptionFeeInfo = useMemo(() => {
    if (!pet) return { amount: '$180 SGD', note: 'Standard adoption fee' };
    if (pet.type === 'cat') {
      if (pet.ageGroup === 'Puppy' || pet.ageGroup === 'Kitten') {
        return { amount: '$150 SGD', tier: 'Kitten Adoption Fee' };
      }
      if (pet.ageGroup === 'Senior') {
        return { amount: '$70 SGD', tier: 'Senior Cat Adoption Fee' };
      }
      return { amount: '$100 SGD', tier: 'Adult Cat Adoption Fee' };
    } else {
      if (pet.ageGroup === 'Puppy' || pet.ageGroup === 'Kitten') {
        return { amount: '$250 SGD', tier: 'Puppy Adoption Fee' };
      }
      if (pet.ageGroup === 'Senior') {
        return { amount: '$120 SGD', tier: 'Senior Dog Adoption Fee' };
      }
      return { amount: '$180 SGD', tier: 'Adult Dog Adoption Fee' };
    }
  }, [pet]);

  const shelterInfo = useMemo(() => {
    if (!pet || !pet.shelter) {
      return {
        address: 'Singapore Central Rescue Facility',
        phone: '+65 6760 1200',
        hours: '10:00 AM - 5:00 PM (Daily)',
        website: 'https://spca.org.sg'
      };
    }
    return SHELTER_DIRECTORY[pet.shelter] || {
      address: `${pet.currentLocation || 'Singapore'}, Singapore`,
      phone: '+65 6760 1200',
      hours: '10:00 AM - 5:00 PM (Daily)',
      website: 'https://spca.org.sg'
    };
  }, [pet]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const targetEl = document.getElementById(`pet-section-${sectionId}`);
    if (targetEl) {
      const yOffset = -140;
      const y = targetEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['photos', 'about', 'story', 'how-to-adopt', 'shelter'];
      const scrollPos = window.scrollY + 180;
      for (const sectionId of sections) {
        const el = document.getElementById(`pet-section-${sectionId}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    }
  };

  if (!pet) return null;

  return (
    <div className="pet-detail-page-container">

      <header className="pet-detail-header-bar">
        <div className="detail-header-inner">

          <div className="detail-header-top-row">
            <button
              type="button"
              className="detail-back-catalog-btn"
              onClick={onBack}
              aria-label="Back"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Back</span>
            </button>
          </div>

          <div className="detail-header-profile-block">
            <div className="detail-profile-title-row">
              <h1 className="detail-pet-name">{pet.name}</h1>
              <div className="detail-header-action-btns">
                <button
                  type="button"
                  className={`detail-header-icon-btn ${isFav ? 'is-fav' : ''}`}
                  onClick={(e) => toggleFavorite && toggleFavorite(e, pet.id)}
                  aria-label="Save to favorites"
                  title="Save to favorites"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={isFav ? '#ff4081' : 'none'} stroke={isFav ? '#ff4081' : 'currentColor'} strokeWidth="2.2">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="detail-header-icon-btn"
                  onClick={handleShare}
                  aria-label="Share pet profile"
                  title="Share pet profile"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
                {copiedShare && <span className="share-toast-pill">Link copied!</span>}
              </div>
            </div>

            <div className="detail-profile-location-wrap">
              <div className="detail-location-entry">
                <svg className="detail-home-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="detail-location-val-text">{pet.shelter} • {pet.currentLocation}</span>
              </div>
            </div>
          </div>

          <nav className="detail-header-jump-nav" aria-label="Detail page sections">
            <button
              type="button"
              className={`jump-nav-item ${activeTab === 'photos' ? 'is-active' : ''}`}
              onClick={() => scrollToSection('photos')}
            >
              Photos
            </button>
            <button
              type="button"
              className={`jump-nav-item ${activeTab === 'about' ? 'is-active' : ''}`}
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button
              type="button"
              className={`jump-nav-item ${activeTab === 'story' ? 'is-active' : ''}`}
              onClick={() => scrollToSection('story')}
            >
              Story
            </button>
            <button
              type="button"
              className={`jump-nav-item ${activeTab === 'how-to-adopt' ? 'is-active' : ''}`}
              onClick={() => scrollToSection('how-to-adopt')}
            >
              How To Adopt
            </button>
            <button
              type="button"
              className={`jump-nav-item ${activeTab === 'shelter' ? 'is-active' : ''}`}
              onClick={() => scrollToSection('shelter')}
            >
              Shelter/Rescue
            </button>
          </nav>
        </div>
      </header>

      <div className="pet-detail-main-wrap">
        <div className="pet-detail-content-columns">

          <div className="pet-detail-left-flow">

            <section id="pet-section-photos" className="detail-section-card gallery-section-card">
              <div
                className="main-photo-stage"
                onClick={() => setIsPhotoFullscreen(true)}
                role="button"
                tabIndex={0}
                aria-label={`View ${pet.name}'s photo in fullscreen`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsPhotoFullscreen(true);
                  }
                }}
              >
                <img
                  src={getPetImageUrl(pet.image)}
                  alt={`${pet.name} - ${pet.breed}`}
                  className="main-stage-img"
                />

                <button
                  type="button"
                  className="photo-stage-fullscreen-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPhotoFullscreen(true);
                  }}
                  aria-label="View photo in fullscreen"
                  title="Expand to fullscreen"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="photo-expand-icon">
                    <path d="m15 15 6 6" />
                    <path d="m15 9 6-6" />
                    <path d="M21 16v5h-5" />
                    <path d="M21 8V3h-5" />
                    <path d="M3 16v5h5" />
                    <path d="m3 21 6-6" />
                    <path d="M3 8V3h5" />
                    <path d="M9 9 3 3" />
                  </svg>
                  <span className="photo-expand-label">Fullscreen</span>
                </button>
              </div>
            </section>
          </div>

          <aside className="pet-detail-right-sidebar">
            <div className="detail-adopt-sticky-card">
              <div className="adopt-card-header-icon">
                <img src={iconBreed} alt="" className="adopt-paw-svg" />
              </div>

              <h3 className="adopt-card-title">
                Consider {pet.name} for adoption?
              </h3>

              <div className="adopt-card-action-single">
                <button
                  type="button"
                  className="detail-primary-inquiry-btn"
                  onClick={() => onAdopt && onAdopt(pet)}
                >
                  APPLY TO ADOPT
                </button>
              </div>
            </div>
          </aside>
        </div>

        <div className="pet-detail-full-stack">

          <section id="pet-section-about" className="detail-section-card about-section-card">
              <h2 className="section-block-title">About {pet.name}</h2>

              <div className="detail-trait-group">
                <h3 className="trait-group-heading">BREED</h3>
                <div className="trait-highlight-pill">
                  <img src={iconBreed} alt="Breed" className="detail-trait-svg" />
                  <span className="trait-highlight-text">{pet.breed}</span>
                </div>
              </div>

              <div className="detail-trait-group">
                <h3 className="trait-group-heading">PHYSICAL TRAITS</h3>
                <ul className="trait-spec-list">
                  <li className="trait-spec-item">
                    <img src={iconAge} alt="Age" className="detail-trait-svg" />
                    <span className="spec-val"><strong>{pet.ageDetail || `${pet.ageGroup} Age`}</strong></span>
                  </li>
                  <li className="trait-spec-item">
                    <img src={iconGender} alt="Gender" className="detail-trait-svg" />
                    <span className="spec-val"><strong>{pet.gender}</strong></span>
                  </li>
                  <li className="trait-spec-item">
                    <img src={iconSize} alt="Size" className="detail-trait-svg" />
                    <span className="spec-val"><strong>{pet.sizeDetail || `${pet.sizeGroup} Size`}</strong></span>
                  </li>
                  <li className="trait-spec-item">
                    <img src={iconCoatLength} alt="Coat Length" className="detail-trait-svg" />
                    <span className="spec-val">Coat Length: <strong>{pet.coatLength}</strong></span>
                  </li>
                  <li className="trait-spec-item">
                    <img src={iconColor} alt="Color" className="detail-trait-svg" />
                    <span className="spec-val">Color: <strong>{pet.color}</strong></span>
                  </li>
                </ul>
              </div>

              <div className="detail-trait-group">
                <h3 className="trait-group-heading">BEHAVIOR</h3>
                <ul className="trait-spec-list">
                  <li className="trait-spec-item">
                    <img src={iconCareBehavior} alt="House-trained" className="detail-trait-svg" />
                    <span className="spec-val">House-trained: <strong>{pet.houseTrained || 'Unknown'}</strong></span>
                  </li>
                  {pet.specialNeeds && (
                    <li className="trait-spec-item special-care-item">
                      <img src={iconCareBehavior} alt="Special care" className="detail-trait-svg" />
                      <span className="spec-val special-care-text">Special needs care requested by rescue</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="detail-trait-group">
                <h3 className="trait-group-heading">{pet.name}'s Compatibility</h3>
                <div className="compat-cards-grid">
                  <div className="compat-card">
                    <span className="compat-status-indicator">
                      {pet.goodWith && pet.goodWith.includes('Kids') ? '✓' : '?'}
                    </span>
                    <div className="compat-icon-wrap">
                      <img src={iconBabyCarriage} alt="Kids" className="compat-custom-svg" />
                    </div>
                    <span className="compat-label">Kids</span>
                    <span className="compat-val-sub">
                      {pet.goodWith && pet.goodWith.includes('Kids') ? 'Friendly' : 'Unknown'}
                    </span>
                  </div>

                  <div className="compat-card">
                    <span className="compat-status-indicator">
                      {pet.goodWith && pet.goodWith.includes('Dogs') ? '✓' : '?'}
                    </span>
                    <div className="compat-icon-wrap">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>
                      </svg>
                    </div>
                    <span className="compat-label">Dogs</span>
                    <span className="compat-val-sub">
                      {pet.goodWith && pet.goodWith.includes('Dogs') ? 'Friendly' : 'Unknown'}
                    </span>
                  </div>

                  <div className="compat-card">
                    <span className="compat-status-indicator">
                      {pet.goodWith && pet.goodWith.includes('Cats') ? '✓' : '?'}
                    </span>
                    <div className="compat-icon-wrap">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17l-.75-.75Z"/>
                      </svg>
                    </div>
                    <span className="compat-label">Cats</span>
                    <span className="compat-val-sub">
                      {pet.goodWith && pet.goodWith.includes('Cats') ? 'Friendly' : 'Unknown'}
                    </span>
                  </div>

                  <div className="compat-card">
                    <span className="compat-status-indicator">?</span>
                    <div className="compat-icon-wrap">
                      <img src={iconPaw} alt="Other Animals" className="compat-custom-svg" />
                    </div>
                    <span className="compat-label">Other Animals</span>
                    <span className="compat-val-sub">Unknown</span>
                  </div>
                </div>
              </div>

              {/* Adoption Fee (满足需求1：直接写出透明领养费用) */}
              <div className="detail-trait-group fee-trait-group">
                <h3 className="trait-group-heading">Adoption Fee</h3>
                <div className="adoption-fee-direct-box">
                  <div className="fee-primary-banner">
                    <div className="fee-amount-col">
                      <span className="fee-price-tag">{adoptionFeeInfo.amount}</span>
                    </div>
                    <div className="fee-includes-col">
                      <span className="includes-title">Includes full welfare package:</span>
                      <ul className="fee-perks-list">
                        <li>✓ Core Vaccinations & Internal/External Parasite Deworming</li>
                        <li>✓ AVS-Mandatory Microchip Registration with Lifelong Registry</li>
                        <li>✓ Spay/Neuter Sterilization Voucher Covered</li>
                        <li>✓ Pre-adoption Veterinary Health Screening & Medical Booklet</li>
                      </ul>
                    </div>
                  </div>
                  <div className="fee-security-tip">
                    <img src={iconBell} alt="" className="tip-bell-svg" />
                    <p className="tip-text">
                      Pet Heaven verifies that all adoption fees are strictly non-profit and go directly toward medical rehabilitation and shelter nourishment. Fees are finalized upon approved adoption.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ---------------- 3. STORY 故事板块 (匹配 p3) ---------------- */}
            <section id="pet-section-story" className="detail-section-card story-section-card">
              <h2 className="section-block-title">{pet.name}'s Story</h2>
              <div className="story-content-box">
                <p className="story-lead-para">{pet.story}</p>
                <p className="story-sub-para">
                  {pet.name} is currently resting comfortably at <strong>{pet.shelter}</strong> under dedicated volunteer enrichment and veterinary care. If you are ready to open your heart and home, submit your inquiry today to schedule an in-person meet & greet.
                </p>
              </div>
            </section>

        <div className="pet-detail-bottom-pair-grid">

          <section id="pet-section-how-to-adopt" className="detail-section-card how-to-adopt-card">
            <h2 className="section-block-title">How To Adopt {pet.name}</h2>
            <div className="adopt-steps-timeline">
              <div className="step-card-col">
                <span className="step-badge-num">1</span>
                <div className="step-card-body">
                  <h4 className="step-card-heading">Submit Inquiry</h4>
                  <p className="step-card-desc">Click "Apply to Adopt" to share your home environment and pet experience.</p>
                </div>
              </div>
              <div className="step-card-col">
                <span className="step-badge-num">2</span>
                <div className="step-card-body">
                  <h4 className="step-card-heading">Meet & Greet</h4>
                  <p className="step-card-desc">The rescue team at {pet.shelter} will arrange a private bonding session to ensure mutual compatibility.</p>
                </div>
              </div>
              <div className="step-card-col">
                <span className="step-badge-num">3</span>
                <div className="step-card-body">
                  <h4 className="step-card-heading">Welcome Home</h4>
                  <p className="step-card-desc">Complete microchip transfer and adoption agreement, and follow our 3-3-3 decompression guide at home!</p>
                </div>
              </div>
            </div>
          </section>

          <section id="pet-section-shelter" className="detail-section-card shelter-section-card">
            <h2 className="section-block-title">{pet.name} is from {pet.shelter}</h2>
            <p className="shelter-sub-district">[{pet.currentLocation}]</p>

            <div className="shelter-info-layout">

              <div className="shelter-contacts-card">
                <div className="shelter-contact-rows">

                  <div className="contact-row">
                    <img src={iconMapPin} alt="Address" className="contact-custom-svg" />
                    <div className="contact-info-block">
                      <span className="contact-label">Address</span>
                      <span className="contact-val">{shelterInfo.address}</span>
                    </div>
                  </div>

                  <div className="contact-row">
                    <img src={iconClock} alt="Hours" className="contact-custom-svg" />
                    <div className="contact-info-block">
                      <span className="contact-label">Hours</span>
                      {(() => {
                        const { main, note } = parseHoursDisplay(shelterInfo.hours);
                        return (
                          <span className="contact-val">
                            <span>{main}</span>
                            {note && <span className="contact-hours-note">{note}</span>}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="contact-row">
                    <img src={iconPhone} alt="Phone" className="contact-custom-svg" />
                    <div className="contact-info-block">
                      <span className="contact-label">Phone</span>
                      <a href={`tel:${shelterInfo.phone}`} className="contact-val contact-link">{shelterInfo.phone}</a>
                    </div>
                  </div>
                </div>

                <a
                  href={shelterInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shelter-visit-btn"
                >
                  VISIT OUR PROFILE PAGE
                </a>
              </div>

              <div className="shelter-map-preview-card">
                <div className="shelter-gmap-frame">
                  <GoogleMapCanvas
                    address={shelterInfo.address}
                    title={pet.shelter}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
        </div>
      </div>

      {isPhotoFullscreen && typeof document !== 'undefined' && createPortal(
        <div
          className="pet-photo-fullscreen-backdrop"
          onClick={() => setIsPhotoFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${pet.name} photo fullscreen view`}
        >

          <div className="fullscreen-top-left-title" onClick={(e) => e.stopPropagation()}>
            <span className="fullscreen-pet-name">{pet.name}</span>
          </div>

          <button
            type="button"
            className="fullscreen-top-right-close"
            onClick={(e) => {
              e.stopPropagation();
              setIsPhotoFullscreen(false);
            }}
            aria-label="Close fullscreen"
            title="Close (Esc)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="fullscreen-image-wrapper">
            <img
              src={getPetImageUrl(pet.image)}
              alt={`${pet.name} - ${pet.breed}`}
              className="fullscreen-zoomed-img"
              onClick={() => setIsPhotoFullscreen(false)}
              title="Click to exit fullscreen"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
