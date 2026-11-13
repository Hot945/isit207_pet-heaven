import { useState, useEffect, useRef } from 'react';
import pet1 from '../assets/bg/pexels-pinamon-34102912.jpg';
import pet2 from '../assets/bg/pexels-shivang-kushwaha-801525826-40249824.jpg';
import pet3 from '../assets/bg/pexels-andreasebnerfotografie-40108335.jpg';
import pet4 from '../assets/bg/pexels-helenalopes-39741909.jpg';
import pet5 from '../assets/bg/pexels-izin51-10254186.jpg';
import pet6 from '../assets/bg/pexels-vu-nguy-n-2154635959-39303355.jpg';
import pet7 from '../assets/bg/pexels-marina-zvada-844583049-25772144.jpg';
import pet8 from '../assets/bg/pexels-saramazin-19994667.jpg';
import pet9 from '../assets/bg/pexels-erwin-bosman-118283-39224067.jpg';
import reviewImg1 from '../assets/bg/pexels-viktoriia-kondratiuk-458099300-30617496.jpg';
import reviewImg2 from '../assets/bg/pexels-mikhail-nilov-7474468.jpg';
import reviewImg3 from '../assets/bg/pexels-nishantaneja-5393419.jpg';
import './Home.css';

const HERO_STATE_ICONS = ['heart', 'house', 'paw'];

const HERO_PATTERN_ITEMS = (() => {
  const step = 50;
  const S_line = 100;
  const stateColors = ['pink', 'mint'];
  const list = [];
  for (let y = 0; y < 600; y += step) {
    const rowIdx = y / step;
    const xOffset = rowIdx % 2 === 0 ? 0 : 50;
    for (let x = xOffset; x < 600; x += S_line) {
      const colIdx = x / 50;

      const colorIdx = ((((x + y) / 100) % 2) + 2) % 2;
      list.push({
        id: `${x}-${y}`,
        colIdx,
        colorName: stateColors[colorIdx],
        x: x + 13,
        y: y + 13,
      });
    }
  }
  return list;
})();

const TESTIMONIALS_BG_ITEMS = [
  { id: 1, x: 247, y: 480, size: 24, rot: 15.2, type: 'heart', scale: 1, opacity: 0.25 },
  { id: 2, x: 354, y: 399, size: 24, rot: 1.5, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 3, x: 512, y: 462, size: 36, rot: -22.7, type: 'heart', scale: 1.5, opacity: 0.28 },
  { id: 4, x: 532, y: 179, size: 24, rot: -35.0, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 5, x: 624, y: 178, size: 36, rot: 3.4, type: 'heart', scale: 1.5, opacity: 0.26 },
  { id: 6, x: 88, y: 162, size: 42, rot: 21.4, type: 'thumbs-up', scale: 1.75, opacity: 0.28 },
  { id: 7, x: 494, y: 323, size: 30, rot: 12.1, type: 'heart', scale: 1.25, opacity: 0.25 },
  { id: 8, x: 470, y: 171, size: 24, rot: -4.3, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 9, x: 446, y: 261, size: 36, rot: -25.5, type: 'heart', scale: 1.5, opacity: 0.26 },
  { id: 10, x: 338, y: 262, size: 30, rot: -2.6, type: 'thumbs-up', scale: 1.25, opacity: 0.24 },
  { id: 11, x: 277, y: 350, size: 24, rot: -25.7, type: 'heart', scale: 1, opacity: 0.22 },
  { id: 12, x: 271, y: 150, size: 24, rot: 30.8, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 13, x: 126, y: 417, size: 24, rot: -36.7, type: 'heart', scale: 1, opacity: 0.22 },
  { id: 14, x: 299, y: 435, size: 24, rot: -16.6, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 15, x: 221, y: 254, size: 30, rot: 19.9, type: 'heart', scale: 1.25, opacity: 0.26 },
  { id: 16, x: 592, y: 436, size: 30, rot: -36.1, type: 'thumbs-up', scale: 1.25, opacity: 0.25 },
  { id: 17, x: 387, y: 480, size: 42, rot: -38.8, type: 'heart', scale: 1.75, opacity: 0.28 },
  { id: 18, x: 56, y: 57, size: 24, rot: 29.9, type: 'thumbs-up', scale: 1, opacity: 0.22 },
  { id: 19, x: 109, y: 483, size: 30, rot: 37.7, type: 'heart', scale: 1.25, opacity: 0.25 },
  { id: 20, x: 354, y: 127, size: 24, rot: -21.4, type: 'thumbs-up', scale: 1, opacity: 0.22 },
];

const DECOR_WAVE_ICONS = [
  { href: '#decor-icon-moon', x: 40, y: 22, rotate: -15, opacity: 0.88 },
  { href: '#decor-icon-sparkle', x: 120, y: 75, rotate: 18, opacity: 0.82 },
  { href: '#decor-icon-moon-star', x: 200, y: 35, rotate: -12, opacity: 0.88 },
  { href: '#decor-icon-sparkles', x: 280, y: 52, rotate: 20, opacity: 0.85 },
  { href: '#decor-icon-sparkle', x: 360, y: 118, rotate: -16, opacity: 0.82 },
  { href: '#decor-icon-moon', x: 440, y: 22, rotate: 14, opacity: 0.88 },
  { href: '#decor-icon-moon-star', x: 520, y: 75, rotate: -18, opacity: 0.88 },
  { href: '#decor-icon-sparkles', x: 600, y: 35, rotate: 16, opacity: 0.85 },
  { href: '#decor-icon-moon', x: 680, y: 52, rotate: -10, opacity: 0.88 },
  { href: '#decor-icon-sparkles', x: 760, y: 118, rotate: 20, opacity: 0.85 },
];

const DECOR_TILE_COUNT = 5;
const DECOR_TOTAL_ICONS = DECOR_TILE_COUNT * DECOR_WAVE_ICONS.length;
const DECOR_ICON_SAFE_MARGIN = 20;

const TESTIMONIALS_TILE_COLS = 4;
const TESTIMONIALS_TILE_ROWS = 3;
const TESTIMONIALS_TOTAL_ICONS =
  TESTIMONIALS_TILE_COLS * TESTIMONIALS_TILE_ROWS * TESTIMONIALS_BG_ITEMS.length;

function Home() {

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [patternTick, setPatternTick] = useState(0);

  const [glowingDecorIndices, setGlowingDecorIndices] = useState(() => new Set());

  const [jigglingTestimonialIndices, setJigglingTestimonialIndices] = useState(() => new Set());

  const decorRef = useRef(null);
  const [decorWidth, setDecorWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1440
  );

  useEffect(() => {
    const el = decorRef.current;
    if (!el) return undefined;

    const updateWidth = () => {
      const nextWidth = el.clientWidth;
      if (nextWidth > 0) {
        setDecorWidth((prev) => (prev === nextWidth ? prev : nextWidth));
      }
    };

    updateWidth();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }
    const timer = setInterval(() => {
      setPatternTick((prev) => (prev + 1) % HERO_STATE_ICONS.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const timers = new Set();
    let cancelled = false;

    const scheduleIconGlow = (iconIndex, isInitial = false) => {
      if (cancelled) return;
      const delay = isInitial
        ? 300 + Math.random() * 4500
        : 1800 + Math.random() * 5200;

      const onTimer = setTimeout(() => {
        timers.delete(onTimer);
        if (cancelled) return;

        setGlowingDecorIndices((prev) => {
          const next = new Set(prev);
          next.add(iconIndex);
          return next;
        });

        const holdDuration = 650 + Math.random() * 450;
        const offTimer = setTimeout(() => {
          timers.delete(offTimer);
          if (cancelled) return;

          setGlowingDecorIndices((prev) => {
            if (!prev.has(iconIndex)) return prev;
            const next = new Set(prev);
            next.delete(iconIndex);
            return next;
          });

          scheduleIconGlow(iconIndex, false);
        }, holdDuration);

        timers.add(offTimer);
      }, delay);

      timers.add(onTimer);
    };

    for (let i = 0; i < DECOR_TOTAL_ICONS; i += 1) {
      scheduleIconGlow(i, true);
    }

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    const timers = new Set();
    let cancelled = false;

    const scheduleIconJiggle = (iconIndex, isInitial = false) => {
      if (cancelled) return;
      const delay = isInitial
        ? 150 + Math.random() * 2400
        : 800 + Math.random() * 2800;

      const onTimer = setTimeout(() => {
        timers.delete(onTimer);
        if (cancelled) return;

        setJigglingTestimonialIndices((prev) => {
          const next = new Set(prev);
          next.add(iconIndex);
          return next;
        });

        const offTimer = setTimeout(() => {
          timers.delete(offTimer);
          if (cancelled) return;

          setJigglingTestimonialIndices((prev) => {
            if (!prev.has(iconIndex)) return prev;
            const next = new Set(prev);
            next.delete(iconIndex);
            return next;
          });

          scheduleIconJiggle(iconIndex, false);
        }, 680);

        timers.add(offTimer);
      }, delay);

      timers.add(onTimer);
    };

    for (let i = 0; i < TESTIMONIALS_TOTAL_ICONS; i += 1) {
      scheduleIconJiggle(i, true);
    }

    return () => {
      cancelled = true;
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  const categories = [
    {
      id: 'dogs',
      label: 'Dogs',
      href: '#dogs',

      icon: (
        <svg
          className="category-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11.25 16.25h1.5L12 17z" />
          <path d="M16 14v.5" />
          <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
          <path d="M8 14v.5" />
          <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
        </svg>
      ),
    },
    {
      id: 'cats',
      label: 'Cats',
      href: '#cats',

      icon: (
        <svg
          className="category-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
          <path d="M8 14v.5" />
          <path d="M16 14v.5" />
          <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
        </svg>
      ),
    },
    {
      id: 'release',
      label: 'Release',
      href: '#release',

      icon: (
        <svg
          className="category-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      ),
    },
  ];

  const heroPetGrid = [
    { id: 1, src: pet1, alt: 'Cute sleeping cat' },
    { id: 2, src: pet2, alt: 'Golden retriever dog' },
    { id: 3, src: pet3, alt: 'Rescue dog on couch' },
    { id: 4, src: pet4, alt: 'Playful fluffy dog' },
    { id: 5, src: pet5, alt: 'Curious tabby kitten' },
    { id: 6, src: pet6, alt: 'Relaxed orange cat' },
    { id: 7, src: pet7, alt: 'Lovely corgi dog' },
    { id: 8, src: pet8, alt: 'Calico cat portrait' },
    { id: 9, src: pet9, alt: 'Adorable rescue puppy' },
  ];

  const keyGuides = [
    {
      id: 'adopter-guide',
      badge: 'Adoption Guide',
      title: 'First-Time Adopter’s Preparation & 3-3-3 Rule',
      desc: 'Essential home-proofing checklist, must-have supplies, and how to help your rescue pet decompress and thrive during their first 3 days, 3 weeks, and 3 months.',
      linkText: 'View',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M8 7h8" />
          <path d="M8 11h8" />
          <path d="M8 15h5" />
        </svg>
      ),
    },
    {
      id: 'foster-volunteer',
      badge: 'Volunteer & Foster',
      title: 'Become a Foster Hero or Shelter Volunteer',
      desc: 'Open your home temporarily for recovering pets, or lend your talents through dog walking, cat socialization, rescue photography, and weekend adoption events.',
      linkText: 'View',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      id: 'pet-health-care',
      badge: 'Health & Care Science',
      title: 'Nutrition, Core Vaccines & Body Language Essentials',
      desc: 'Veterinarian-approved tips on life-stage balanced nutrition, core vaccination protocols, parasite prevention, and understanding subtle pet stress indicators.',
      linkText: 'View',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Viktoriia Kondratiuk',
      initial: 'V',
      avatarBg: '#0F9D58',
      date: 'October 25, 2026',
      rating: 5,
      comment:
        'Adopting Toby was the best choice our family ever made. He gets chilly during brisk morning walks, so we bundled him up in his favorite grey sweater before heading out to the park. He loves snuggling in the grass! Pet Heaven’s adoption process and care advice made everything so effortless and reassuring.',
      photo: reviewImg1,
    },
    {
      id: 2,
      name: 'Mikhail & Elena Nilov',
      initial: 'M',
      avatarBg: '#1A73E8',
      date: 'October 8, 2026',
      rating: 5,
      comment:
        'We fell in love with Cooper the second we met him at Pet Heaven. He is the gentlest, sweetest golden boy and brings so much warmth into our home every day. The medical transparency, complete vaccination records, and post-adoption support were truly top tier. Highly recommended!',
      photo: reviewImg2,
    },
    {
      id: 3,
      name: 'Nishan Taneja',
      initial: 'N',
      avatarBg: '#E37400',
      date: 'August 12, 2026',
      rating: 5,
      comment:
        'As an apartment dweller, I was looking for a calm, friendly companion. Pet Heaven introduced me to Charlie, and he has been pure joy. He loves lounging on the cool living room floor after our daily walks. The staff’s 3-3-3 decompression guide made his transition so smooth.',
      photo: reviewImg3,
    },
  ];

  return (
    <main className="home-page">

      <div className="home-hero">

        <div className="hero-pattern-bg" aria-hidden="true">
          <svg className="hero-pattern-svg" width="100%" height="100%">
            <defs>

              <g id="pat-heart-pink" fill="none" stroke="#D552A3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </g>
              <g id="pat-heart-mint" fill="none" stroke="#98E8DE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </g>

              <g id="pat-house-pink" fill="none" stroke="#D552A3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </g>
              <g id="pat-house-mint" fill="none" stroke="#98E8DE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </g>

              <g id="pat-paw-pink" fill="none" stroke="#D552A3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="4" r="2" />
                <circle cx="18" cy="8" r="2" />
                <circle cx="20" cy="16" r="2" />
                <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
              </g>
              <g id="pat-paw-mint" fill="none" stroke="#98E8DE" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="4" r="2" />
                <circle cx="18" cy="8" r="2" />
                <circle cx="20" cy="16" r="2" />
                <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
              </g>

              <pattern id="hero-pet-pattern" width="600" height="600" patternUnits="userSpaceOnUse">
                {HERO_PATTERN_ITEMS.map((item) => {
                  const iconIdx =
                    (((item.colIdx - patternTick) % HERO_STATE_ICONS.length) +
                      HERO_STATE_ICONS.length) %
                    HERO_STATE_ICONS.length;
                  const iconRef = `#pat-${HERO_STATE_ICONS[iconIdx]}-${item.colorName}`;
                  return <use key={item.id} href={iconRef} x={item.x} y={item.y} />;
                })}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-pet-pattern)" />
          </svg>
        </div>

        <div className="hero-split-container">

          <div className="hero-text-col">
            <h1 className="home-title">
              Find Your Forever Friend
              <br />
              @Pet Heaven
            </h1>
            <p className="home-subtitle">
              Every pet deserves a loving family. Explore our rescue dogs and cats, get involved in our charity mission, or reach out to us today.
            </p>
          </div>

          <div className="hero-image-col">
            <div className="hero-pet-grid">
              {heroPetGrid.map((pet) => (
                <div key={pet.id} className="grid-pet-item">
                  <img
                    src={pet.src}
                    alt={pet.alt}
                    className="grid-pet-img"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="category-cards-container">
          {categories.map((item) => {
            const isSelected = selectedCategory === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`category-card ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategory(item.id);
                  if (window.location.hash === item.href) {
                    window.dispatchEvent(new HashChangeEvent('hashchange'));
                  }
                }}
              >
                <div className="category-icon-wrapper">
                  {item.icon}
                </div>
                <span className="category-card-label">{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="purple-gradient-section">

        <div className="purple-transition-decor" ref={decorRef} aria-hidden="true">
          <svg className="decor-svg" width="100%" height="140">
            <defs>
              <filter id="decor-icon-glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <filter id="decor-wave-glow" x="-10%" y="-60%" width="120%" height="220%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="decor-wave-sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="38%" stopColor="#000000" />
                <stop offset="46%" stopColor="#888888" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="54%" stopColor="#888888" />
                <stop offset="62%" stopColor="#000000" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              <mask id="decor-wave-sweep-mask">
                <rect
                  className="decor-wave-sweep-rect"
                  x="0"
                  y="0"
                  width="100%"
                  height="140"
                  fill="url(#decor-wave-sweep-grad)"
                />
              </mask>

              <g id="decor-icon-sparkles" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                <path d="M20 2v4" />
                <path d="M22 4h-4" />
                <circle cx="4" cy="20" r="2" />
              </g>

              <g id="decor-icon-sparkle" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
              </g>

              <g id="decor-icon-moon" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </g>

              <g id="decor-icon-moon-star" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 5h4" />
                <path d="M20 3v4" />
                <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
              </g>

              <pattern id="purple-decor-pattern" width="800" height="140" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 70 C 57 36.6, 143 36.6, 200 70 C 257 103.4, 343 103.4, 400 70 C 457 36.6, 543 36.6, 600 70 C 657 103.4, 743 103.4, 800 70"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.45)"
                  strokeWidth="1.3"
                  strokeDasharray="5.96 5.96"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </pattern>

              <pattern id="purple-decor-highlight-pattern" width="800" height="140" patternUnits="userSpaceOnUse">
                <path
                  d="M 0 70 C 57 36.6, 143 36.6, 200 70 C 257 103.4, 343 103.4, 400 70 C 457 36.6, 543 36.6, 600 70 C 657 103.4, 743 103.4, 800 70"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  strokeDasharray="5.96 5.96"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#decor-wave-glow)"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#purple-decor-pattern)" />
            <rect
              width="100%"
              height="100%"
              fill="url(#purple-decor-highlight-pattern)"
              mask="url(#decor-wave-sweep-mask)"
            />
            {Array.from({ length: DECOR_TILE_COUNT }, (_, tileIdx) =>
              DECOR_WAVE_ICONS.map((icon, localIdx) => {
                const absX = tileIdx * 800 + icon.x;
                if (absX + DECOR_ICON_SAFE_MARGIN > decorWidth) {
                  return null;
                }
                const globalIdx = tileIdx * DECOR_WAVE_ICONS.length + localIdx;
                const isGlowing = glowingDecorIndices.has(globalIdx);
                const transform = `translate(${absX}, ${icon.y}) rotate(${icon.rotate}) translate(-12, -12)`;
                return (
                  <g key={globalIdx} transform={transform}>
                    <use
                      href={icon.href}
                      stroke="#ffffff"
                      strokeWidth="2"
                      opacity={icon.opacity}
                    />
                    <use
                      href={icon.href}
                      className={`decor-icon-glow-layer${isGlowing ? ' is-active' : ''}`}
                      stroke="#ffffff"
                      strokeWidth="2.8"
                      filter="url(#decor-icon-glow)"
                    />
                  </g>
                );
              })
            )}
          </svg>
        </div>

        <div className="purple-gradient-container">
          <section className="impact-section">
            <div className="impact-header">
              <h2 className="impact-title">Making a Real Difference Every Day</h2>
              <p className="impact-description">
                With the support of our loving community, we rescue, rehabilitate, and rehome vulnerable pets across the region.
              </p>
            </div>

            <div className="impact-grid">

              <div className="impact-card">
                <svg className="impact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path className="impact-anim-heart-beat" d="M8.62 13.8A2.25 2.25 0 1 1 12 10.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <div className="impact-number">3,850+</div>
                <div className="impact-label">Pets Rehomed</div>
                <p className="impact-text">
                  Rescued from hardship and placed into verified, loving forever families.
                </p>
              </div>

              <div className="impact-card">
                <svg className="impact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 14h2a2 2 0 0 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" />
                  <path className="impact-anim-heart-float" d="m14.45 13.39 5.05-4.694C20.196 8 21 6.85 21 5.75a2.75 2.75 0 0 0-4.797-1.837.276.276 0 0 1-.406 0A2.75 2.75 0 0 0 11 5.75c0 1.2.802 2.248 1.5 2.946L16 11.95" />
                  <path d="m2 15 6 6" />
                  <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a1 1 0 0 0-2.75-2.91" />
                </svg>
                <div className="impact-number">98.5%</div>
                <div className="impact-label">Adoption Success</div>
                <p className="impact-text">
                  Thoughtful behavioral and lifestyle matching ensures lifelong companionship.
                </p>
              </div>

              <div className="impact-card">
                <svg className="impact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <g className="impact-anim-briefcase-shake">
                    <path d="M12 11v4" />
                    <path d="M14 13h-4" />
                    <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    <path d="M18 6v14" />
                    <path d="M6 6v14" />
                    <rect width="20" height="14" x="2" y="6" rx="2" />
                  </g>
                </svg>
                <div className="impact-number">12,400+</div>
                <div className="impact-label">Medical Treatments</div>
                <p className="impact-text">
                  Comprehensive health checks, essential vaccines, and spay/neuter surgeries.
                </p>
              </div>

              <div className="impact-card">
                <svg className="impact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path className="impact-anim-handshake-pulse" d="M19.414 14.414C21 12.828 22 11.5 22 9.5a5.5 5.5 0 0 0-9.591-3.676.6.6 0 0 1-.818.001A5.5 5.5 0 0 0 2 9.5c0 2.3 1.5 4 3 5.5l5.535 5.362a2 2 0 0 0 2.879.052 2.12 2.12 0 0 0-.004-3 2.124 2.124 0 1 0 3-3 2.124 2.124 0 0 0 3.004 0 2 2 0 0 0 0-2.828l-1.881-1.882a2.41 2.41 0 0 0-3.409 0l-1.71 1.71a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l2.823-2.762" />
                </svg>
                <div className="impact-number">1,200+</div>
                <div className="impact-label">Active Volunteers</div>
                <p className="impact-text">
                  Dedicated animal advocates supporting daily shelter care, fostering, and events.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <section className="guides-section" id="get-involved-preview">
        <div className="guides-container">
          <div className="guides-layout-row">

            <aside className="guides-aside">
              <div className="guides-main-icon-circle">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.65"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="guides-main-svg"
                  aria-hidden="true"
                >
                  <path
                    className="guides-anim-bubble"
                    d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"
                  />
                  <g className="guides-anim-question">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </g>
                </svg>
              </div>
            </aside>

            <div className="guides-main-col">
              <div className="guides-header">
                <h2 className="guides-title">Helpful Guides</h2>
                <p className="guides-description">
                  Explore essential pet care advice, adoption preparation, and volunteer opportunities.
                </p>
              </div>

              <div className="guides-horizontal-list">
                {keyGuides.map((guide) => (
                  <a
                    key={guide.id}
                    href={`#get-involved?item=${guide.id}`}
                    className="guide-horizontal-row"
                  >

                    <span className="guide-thick-bar" aria-hidden="true" />

                    <div className="guide-row-content">
                      <div className="guide-badge-wrapper">
                        <span className="guide-badge">{guide.badge}</span>
                      </div>
                      <h3 className="guide-row-title">{guide.title}</h3>
                      <p className="guide-row-desc">{guide.desc}</p>
                    </div>

                    <div className="guide-row-right">
                      <span className="guide-action-text">{guide.linkText}</span>
                      <div className="guide-arrow-circle">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              <div className="guides-more-prompt">
                <div className="more-prompt-text-group">
                  <h3 className="more-prompt-title">Want to explore more?</h3>
                  <p className="more-prompt-text">
                    Looking for comprehensive pet care guides, detailed adoption procedures, foster manuals, or volunteer applications? Explore our full community hub.
                  </p>
                </div>
                <a href="#get-involved" className="more-prompt-btn">
                  <span>Get Involved</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section" id="stories">

        <div className="testimonials-bg-decor" aria-hidden="true">
          <svg className="testimonials-bg-svg" width="100%" height="100%">
            <defs>

              <g id="bg-icon-heart" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </g>

              <g id="bg-icon-thumbs-up" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                <path d="M7 10v12" />
              </g>
            </defs>
            {Array.from({ length: TESTIMONIALS_TILE_ROWS }, (_, rowIdx) =>
              Array.from({ length: TESTIMONIALS_TILE_COLS }, (__, colIdx) =>
                TESTIMONIALS_BG_ITEMS.map((item, localIdx) => {
                  const globalIdx =
                    (rowIdx * TESTIMONIALS_TILE_COLS + colIdx) * TESTIMONIALS_BG_ITEMS.length +
                    localIdx;
                  const isJiggling = jigglingTestimonialIndices.has(globalIdx);
                  return (
                    <g
                      key={globalIdx}
                      transform={`translate(${colIdx * 700 + item.x}, ${rowIdx * 550 + item.y}) rotate(${item.rot}) scale(${item.scale})`}
                    >
                      <g className={isJiggling ? 'testimonials-bg-jiggle' : undefined}>
                        <use
                          href={`#bg-icon-${item.type}`}
                          transform="translate(-12, -12)"
                          opacity={item.opacity}
                        />
                      </g>
                    </g>
                  );
                })
              )
            )}
          </svg>
        </div>

        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">Loved by Adopters & Pet Parents</h2>
            <p className="testimonials-description">
              Real reflections from families who welcomed rescue dogs and cats into their lives through Pet Heaven.
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">

                <div className="review-user-row">
                  <div className="review-avatar" style={{ backgroundColor: t.avatarBg }}>
                    {t.initial}
                  </div>
                  <span className="review-username">{t.name}</span>
                  <button type="button" className="review-more-btn" aria-label="More options">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <circle cx="12" cy="5" r="1.75" />
                      <circle cx="12" cy="12" r="1.75" />
                      <circle cx="12" cy="19" r="1.75" />
                    </svg>
                  </button>
                </div>

                <div className="review-rating-row">
                  <div className="review-stars-group">
                    {[...Array(t.rating)].map((_, i) => (
                      <svg key={i} className="review-star-icon" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <span className="review-date">{t.date}</span>
                </div>

                <p className="review-comment-text">{t.comment}</p>

                <div className="review-photo-wrapper">
                  <img
                    src={t.photo}
                    alt={`Photo shared by ${t.name}`}
                    className="review-photo"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
