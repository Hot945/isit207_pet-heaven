import { useState, useEffect, useRef } from 'react';
import './GetInvolved.css';

import handHeartIcon from '../assets/hand-heart.svg';
import briefcaseIcon from '../assets/briefcase-medical.svg';
import heartHandshakeIcon from '../assets/heart-handshake.svg';
import houseHeartIcon from '../assets/house-heart.svg';
import pawIcon from '../assets/paw-print.svg';

import img333 from '../assets/involved/adopter-333-guide.jpg';
import imgHdb from '../assets/involved/hdb-housing-guide.jpg';
import imgVolunteer from '../assets/involved/volunteer-foster.jpg';
import imgYouth from '../assets/involved/youth-outreach.jpg';
import imgMedical from '../assets/involved/pet-health-care.jpg';
import imgFeline from '../assets/involved/feline-wellness.jpg';
import imgTraining from '../assets/involved/positive-training.jpg';
import imgGuardian from '../assets/involved/medical-guardian.jpg';
import imgCsr from '../assets/involved/corporate-csr.jpg';

const CATEGORIES = [
  { id: 'all', label: 'All Guides & Programs' },
  { id: 'adoption', label: 'Adoption Guide', icon: briefcaseIcon },
  { id: 'volunteer', label: 'Volunteer & Foster', icon: handHeartIcon },
  { id: 'health', label: 'Health & Care Science', icon: heartHandshakeIcon },
  { id: 'support', label: 'Donation & CSR', icon: houseHeartIcon },
];

const ITEMS = [

  {
    id: 'adopter-guide',
    categoryId: 'adoption',
    categoryName: 'Adoption Guide',
    badge: 'Adoption Guide',
    title: 'First-Time Adopter’s Preparation & 3-3-3 Rule',
    summary:
      'Essential home-proofing checklist, must-have supplies, and how to help your rescue pet decompress and thrive during their first 3 days, 3 weeks, and 3 months.',
    readTime: '5 min read',
    location: 'Singapore Home Environment',
    commitment: 'Day 1 – Month 3 Roadmap',
    image: img333,
    icon: briefcaseIcon,
    overview:
      'Welcoming a rescue pet into your family is an extraordinarily heartwarming journey. To help shelter animals smoothly adjust to Singapore’s urban lifestyle, Pet Heaven champions the internationally recognized 3-3-3 Decompression Rule. This proven behavioral framework guides adopters through the critical sensory stages of the first 3 days, 3 weeks, and 3 months, ensuring a lifelong bond built on trust and mutual security.',
    highlights: [
      {
        title: 'First 3 Days: Quiet Sensory Decompression',
        desc: 'Shelter transitions trigger acute sensory overload. Your pet may feel confused, hide in secluded corners, or have a suppressed appetite. Set up a secure, low-traffic haven with a cozy bed and water. Avoid inviting guests or overwhelming them with continuous handling.',
      },
      {
        title: 'First 3 Weeks: Establishing Daily Rhythm & Safety',
        desc: 'As cortisol stress levels drop, your pet starts recognizing house rules and daily timetables (feeding, morning potty breaks, and rest times). Their true personality begins emerging. Begin positive reinforcement routines and keep interactions calm and predictable.',
      },
      {
        title: 'First 3 Months: Complete Trust & Lifelong Bond',
        desc: 'By month three, your companion recognizes that your home is their permanent sanctuary. Attachment anxiety softens into deep confidence, obedience cues become second nature, and their unique joyful character shines in full bloom.',
      },
    ],
    requirements: [
      'Safety grilles or protective mesh installed on high-rise windows and balconies (standard Singapore shelter prerequisite)',
      'AVS (Animal & Veterinary Service) microchip transfer and mandatory pet licensing completion',
      'Escape-proof Y-harness with dual-clip leash attachments for all outdoor walks',
      'Quiet resting retreat equipped with a comfortable orthopedic pet bed away from household drafts',
    ],
    actionType: 'download',
    actionLabel: 'Download 3-3-3 Adopter Guide & Checklist (PDF)',
    actionSuccess:
      'Checklist successfully downloaded! Keep this guide pinned at home for daily reference during your pet’s transition.',
    video: {
      youtubeId: 'uVNFkQm2a1U',
      title: 'The 3-3-3 Rule for Rescue Dogs: What Every New Adopter Needs to Know',
      duration: '9:42 min',
      author: 'K9 of Mine (Certified Dog Behaviorist)',
      description:
        'A comprehensive visual guide breaking down the critical sensory and behavioral transitions of a newly adopted rescue pet during the first 3 days, 3 weeks, and 3 months.',
      chapters: [
        { time: '00:00', title: 'Welcome & Introduction to Decompression' },
        { time: '01:20', title: 'Day 1–3: The Sensory Overload Phase' },
        { time: '04:15', title: 'Week 1–3: Routine, Safety & Personality Emergence' },
        { time: '07:30', title: 'Month 1–3: Mutual Trust & Lifelong Bond' },
      ],
    },
  },
  {
    id: 'hdb-adoption-guide',
    categoryId: 'adoption',
    categoryName: 'Adoption Guide',
    badge: 'Adoption Guide',
    title: 'Singapore HDB & Housing Pet Ownership Guide',
    summary:
      'Navigating Project ADORE guidelines, approved local cross-breed sizing, mandatory window meshing, and polite high-rise neighborhood etiquette.',
    readTime: '4 min read',
    location: 'Singapore Housing Guidelines',
    commitment: 'Essential Pre-Adoption',
    image: imgHdb,
    icon: houseHeartIcon,
    overview:
      'Adopting a rescue pet in Singapore requires navigating specific housing regulations and community living guidelines. Under Project ADORE (Adoption and Rehoming of Dogs), local cross-breed canines (Singapore Specials) measuring up to 55cm at shoulder height and 15kg can be legally homed in HDB flats with approved certification. We guide you through every step of compliance.',
    highlights: [
      {
        title: 'Project ADORE & HDB Approval Framework',
        desc: 'How Pet Heaven collaborates with AVS and HDB to handle microchip records, mandatory basic obedience class enrollment, and official housing endorsement.',
      },
      {
        title: 'High-Rise Balcony & Window Safety Meshing',
        desc: 'Why window meshing (maximum 1.5 to 2-inch gap) is vital for high-rise apartments, effectively preventing falls and creating an escape-proof living environment.',
      },
      {
        title: 'Urban High-Density Community Etiquette',
        desc: 'Practicing courteous elevator manners, quiet morning void deck walking, proper waste disposal, and positive neighbor socialization.',
      },
    ],
    requirements: [
      'Verification of HDB flat or condominium animal approval status',
      'High-tensile magnetic mesh or stainless steel grilles on all openable windows and balcony doors',
      'Enrollment in an accredited force-free basic obedience course (for Project ADORE dogs)',
    ],
    actionType: 'download',
    actionLabel: 'Download Singapore Housing Compliance Pack',
    actionSuccess:
      'Compliance pack downloaded! Our adoption coordinators are here to assist with all your HDB clearance paperwork.',
  },

  {
    id: 'foster-volunteer',
    categoryId: 'volunteer',
    categoryName: 'Volunteer & Foster',
    badge: 'Volunteer & Foster',
    title: 'Become a Foster Hero or Shelter Volunteer',
    summary:
      'Open your home temporarily for recovering pets, or lend your talents through dog walking, cat socialization, rescue photography, and weekend adoption events.',
    readTime: '4 min read',
    location: '50 Sungei Tengah Road / Islandwide',
    commitment: '2-4 hrs / fortnight or 2-8 wks foster',
    image: imgVolunteer,
    icon: handHeartIcon,
    overview:
      'Volunteers and foster caregivers are the beating heart of Pet Heaven. Our 80+ rescue residents at Sungei Tengah rely on compassionate individuals who bring warmth, exercise, and love into their daily lives. Whether you have weekend hours to spare for sanctuary dog walking, or an open guest room to foster an animal during post-surgery recovery, your dedication directly transforms innocent lives.',
    highlights: [
      {
        title: 'Sanctuary Canine Walking & Cattery Socialization',
        desc: 'Join our morning and weekend shifts to provide exercise, mental stimulation, leash walking manners, and quiet grooming for shelter dogs and shy rescue felines.',
      },
      {
        title: 'Foster Hero Program (100% Fully Sponsored)',
        desc: 'Provide a tranquil home for post-surgical recovery pets, senior rescues, or vulnerable neonatal litters. Pet Heaven provides all food, litter, crates, medications, and covers 100% of veterinary clinic expenses.',
      },
      {
        title: 'Specialized Skills & Event Support',
        desc: 'Contribute your talents in pet photography, social media storytelling, event hosting, graphic design, or weekend adoption roadshow coordination across Singapore.',
      },
    ],
    requirements: [
      'Must be at least 18 years old (youth volunteers 16-17 welcome with parental consent)',
      'Commit to a minimum of two 3-hour weekend shifts per month for at least 3 months, or available for temporary foster durations',
      'Attend mandatory 90-minute safety and low-stress animal handling induction at Sungei Tengah',
      'Compassionate heart, reliability, and readiness to work as a team for animal welfare',
    ],
    actionType: 'apply',
    actionLabel: 'Sign Up for Volunteer or Foster Orientation',
    actionSuccess:
      'Application submitted! Our volunteer coordinator will reach out within 24 hours with the next induction schedule.',
    video: {
      youtubeId: 'm5KYLP1ScUQ',
      title: 'Day in the Life of an Animal Shelter Volunteer & Foster Hero',
      duration: '8:35 min',
      author: 'Animal Care & Volunteer Collective',
      description:
        'An authentic behind-the-scenes walkthrough of morning canine shifts, cattery socialization, medical recovery support, and foster pet care.',
      chapters: [
        { time: '00:00', title: 'Morning Check-In & Shelter Briefing' },
        { time: '01:45', title: 'Field Walks & Low-Stress Leash Handling' },
        { time: '04:10', title: 'Cat Lounge Socialization & Enrichment' },
        { time: '06:30', title: 'Foster Family Transition Prep' },
      ],
    },
  },
  {
    id: 'youth-outreach',
    categoryId: 'volunteer',
    categoryName: 'Volunteer & Foster',
    badge: 'Volunteer & Foster',
    title: 'Humane Education & Campus Outreach',
    summary:
      'Empower student communities across Singapore through pet empathy workshops, campus charity drives, and talks.',
    readTime: '3 min read',
    location: 'Schools & Community Hubs, Singapore',
    commitment: 'Flexible / Project-Based',
    image: imgYouth,
    icon: handHeartIcon,
    overview:
      'Long-term animal welfare begins with compassionate education. Our youth ambassadors partner with Singapore polytechnics, junior colleges, and international schools to promote the "Adopt, Don\'t Shop" ethos and responsible lifetime guardianship.',
    highlights: [
      {
        title: 'Interactive School Talks',
        desc: 'Co-deliver interactive presentations on dog body language, stray animal respect, and responsible sterilization.',
      },
      {
        title: 'Campus Donation Drives',
        desc: 'Organize pet food and supply donation booths during school charity weeks and community service fairs.',
      },
      {
        title: 'Youth Sanctuary Field Trips',
        desc: 'Coordinate supervised small-group student visits to Pet Heaven sanctuary to learn shelter operations firsthand.',
      },
    ],
    requirements: [
      'Passionate about public speaking, student leadership, or educational workshops',
      'Students and educators enrolled in Singapore educational institutions',
      'Commit to organizing or supporting at least one campus outreach event per academic year',
    ],
    actionType: 'apply',
    actionLabel: 'Register Campus Group or Club',
    actionSuccess:
      'Thank you, student leader! Our outreach team will get in touch to coordinate materials and dates.',
  },

  {
    id: 'pet-health-care',
    categoryId: 'health',
    categoryName: 'Health & Care Science',
    badge: 'Health & Care Science',
    title: 'Nutrition, Core Vaccines & Body Language Essentials',
    summary:
      'Veterinarian-approved tips on life-stage balanced nutrition, core vaccination protocols, parasite prevention, and understanding subtle pet stress indicators.',
    readTime: '5 min read',
    location: 'Veterinary Preventive Care',
    commitment: 'Daily & Lifelong Habits',
    image: imgMedical,
    icon: heartHandshakeIcon,
    overview:
      'Preventive veterinary medicine and empathetic behavioral awareness form the bedrock of a thriving, long-lived companion. In Singapore’s tropical climate, high ambient humidity and heat necessitate vigilant parasite defense, thoughtful hydration management, and an acute understanding of subtle animal stress signals. Pet Heaven\'s veterinary advisory panel curates this foundational care science.',
    highlights: [
      {
        title: 'Tropical Parasite Prevention & Core Vaccinations',
        desc: 'Year-round warmth allows tick and mosquito vectors to flourish in Singapore. Maintain strict monthly heartworm, tick, and flea preventatives (e.g., NexGard Spectra or Revolution Plus) alongside annual core vaccine boosters (DHPPi for canines, FVRCP for felines).',
      },
      {
        title: 'Life-Stage Balanced Nutrition & Active Hydration',
        desc: 'Formulate diets based on species, life stage, and daily activity. Combat Singapore heat with moisture-rich foods, fresh filtered water fountains, and electrolyte awareness during humid outdoor walks.',
      },
      {
        title: 'Decoding Subtle Stress Signals & Body Language',
        desc: 'Animals communicate discomfort well before growling or snapping. Recognize subtle displacement behaviors: repetitive lip-licking, whale eye (showing white of the eye), yawning out of context, stiff tail posture, or flattened feline ears.',
      },
    ],
    requirements: [
      'Annual comprehensive veterinary checkup, blood panel (for seniors 7+), and dental grading',
      'Never walk pets on unshaded sun-baked asphalt between 11:00 AM and 4:30 PM (paw burn and heatstroke risk)',
      'Strict adherence to monthly veterinarian-prescribed parasite prevention',
      'Commitment to 100% certified force-free handling and positive reinforcement',
    ],
    actionType: 'download',
    actionLabel: 'Download Veterinary Care & Body Language Chart (PDF)',
    actionSuccess:
      'Care guide downloaded! Keep this handy digital reference for peace of mind in your daily pet care.',
  },
  {
    id: 'feline-wellness',
    categoryId: 'health',
    categoryName: 'Health & Care Science',
    badge: 'Health & Care Science',
    title: 'Indoor Feline Enrichment & Stress Prevention',
    summary:
      'Design vertical climbing highways, optimize litter box satisfaction, and prevent indoor boredom for happy housecats.',
    readTime: '4 min read',
    location: 'Home Environment Guide',
    commitment: 'Applicable Daily',
    image: imgFeline,
    icon: briefcaseIcon,
    overview:
      'In Singapore, where cats are largely indoor companions, satisfying natural feline predatory instincts is vital to preventing stress-induced urinary issues and nocturnal restlessness. Learn how simple furniture arrangements transform your cat\'s well-being.',
    highlights: [
      {
        title: 'The "Vertical Highway" Concept',
        desc: 'Cats navigate territory three-dimensionally. Install wall perches, tall cat trees, and window hammock lookouts so they can observe rooms from safe heights.',
      },
      {
        title: 'The N+1 Litter Box Rule',
        desc: 'Always provide one more litter box than the number of cats you own. Place boxes in quiet, well-ventilated areas away from washing machines and food bowls.',
      },
      {
        title: 'Simulated Hunt-Catch-Kill-Eat Play',
        desc: 'Use wand toys in 10-minute bursts before mealtime. Allow your cat to catch the "prey" and immediately feed their meal to trigger natural sleep satisfaction.',
      },
    ],
    requirements: [
      'Mesh window and gate grilles installed (mandatory under Singapore animal safety standards)',
      'Multiple scratching posts placed along primary walking paths and sleeping zones',
      'Clean, fresh water fountains cleaned daily to encourage high feline hydration',
    ],
    actionType: 'download',
    actionLabel: 'Download Cat Habitat Blueprint (PDF)',
    actionSuccess: 'Blueprint saved! Give your cat the indoor paradise they deserve.',
    video: {
      youtubeId: 'EaVttlOqcX4',
      title: 'How to Keep Indoor Cats HAPPY: Catification & Environmental Enrichment',
      duration: '10:05 min',
      author: 'Jackson Galaxy (Cat Behavior Expert)',
      description:
        'Step-by-step techniques to create vertical highways, stimulate hunting instincts safely indoors, and prevent feline boredom and anxiety.',
      chapters: [
        { time: '00:00', title: 'The Indoor Cat Mojo Concept' },
        { time: '02:15', title: 'Designing Vertical Highways & Wall Shelves' },
        { time: '05:10', title: 'The Hunt-Catch-Kill-Eat Play Routine' },
        { time: '08:00', title: 'Window Lookouts & Visual Enrichment' },
      ],
    },
  },
  {
    id: 'positive-training',
    categoryId: 'health',
    categoryName: 'Health & Care Science',
    badge: 'Health & Care Science',
    title: 'Positive Reinforcement & Loose-Leash Manners',
    summary:
      'Build mutual trust and joyful walking habits through force-free rewards, clicker fundamentals, and gentle guidance.',
    readTime: '4 min read',
    location: 'Interactive Tutorial',
    commitment: '10 mins / day',
    image: imgTraining,
    icon: pawIcon,
    overview:
      'Force-free, positive reinforcement training teaches your dog that good decisions lead to rewarding outcomes. We firmly reject choke chains, prong collars, and punishment-based methods in favor of high-value treats, toy play, and verbal praise.',
    highlights: [
      {
        title: 'The "Yes & Reward" Timing Principle',
        desc: 'Capture the exact second your dog offers eye contact or loose leash with a verbal marker ("Yes!"), immediately followed by a treat.',
      },
      {
        title: 'Redirecting Leash Pulling',
        desc: 'When tension is felt on the leash, stop walking like a tree. As soon as your dog turns back and the leash goes slack, resume walking together.',
      },
      {
        title: 'Singapore High-Density Walking Etiquette',
        desc: 'Teaching calm elevator manners, void deck polite greetings, and safe navigation around bicycles and strollers.',
      },
    ],
    requirements: [
      'High-value soft treats (boiled chicken, freeze-dried liver, or cheese bites)',
      'Comfortable Y-shaped chest harness and a standard 1.8m flat nylon leash (avoid retractable flexi-leashes)',
      'Commit to short, positive 5-minute training sessions rather than marathon lectures',
    ],
    actionType: 'download',
    actionLabel: 'Save Loose-Leash Training Guide',
    actionSuccess: 'Training guide bookmarked! Practice 5 minutes daily for the fastest results.',
    video: {
      youtubeId: '4fUVXntWPOM',
      title: 'How to Train Heel & Loose Leash Walking: Complete Positive Reinforcement Guide',
      duration: '11:18 min',
      author: 'Zak George’s Dog Training Revolution',
      description:
        'Learn force-free leash mechanics, high-value treat timing, and how to stop pulling before it starts using positive encouragement.',
      chapters: [
        { time: '00:00', title: 'Proper Y-Harness & Leash Fit' },
        { time: '01:35', title: 'The "Yes & Reward" Timing Principle' },
        { time: '04:20', title: 'Redirecting Leash Pressure (Be a Tree)' },
        { time: '08:15', title: 'Navigating Busy Streets & Distractions' },
      ],
    },
  },

  {
    id: 'medical-guardian',
    categoryId: 'support',
    categoryName: 'Donation & CSR',
    badge: 'Donation & CSR',
    title: 'Medical Rehabilitation Sponsorship',
    summary:
      'Directly fund urgent orthopedic surgeries, heartworm treatments, and dental care for injured rescue animals.',
    readTime: '3 min read',
    location: 'Sanctuary Veterinary Suite',
    commitment: 'One-Time or Monthly',
    image: imgGuardian,
    icon: heartHandshakeIcon,
    overview:
      'Over 60% of street rescues arriving at Pet Heaven require intensive veterinary intervention—ranging from vehicular collision bone fractures and skin infections to tick-borne blood parasites. Your sponsorship directly restores their health and gives them a second chance at life.',
    highlights: [
      {
        title: '100% Direct Allocation',
        desc: 'Every cent of medical sponsorships goes directly into external clinic surgical bills, anesthesia, and ongoing prescription medicine.',
      },
      {
        title: 'Personalized Recovery Updates',
        desc: 'Sponsors receive monthly photo reports and recovery milestones of the specific rescue dogs or cats undergoing treatment.',
      },
      {
        title: 'Tax-Deductible Receipts',
        desc: 'Official digital tax receipts are issued instantly for eligible charitable contributions in Singapore.',
      },
    ],
    requirements: [
      'Flexible contribution amounts starting from S$20 / month',
      'Secure payment processing via PayNow, GIRO, Credit Card, or Bank Transfer',
      'Transparent financial audit published quarterly in our annual report',
    ],
    actionType: 'donate',
    actionLabel: 'Sponsor a Medical Rescue Fund',
    actionSuccess:
      'Thank you for your generosity! Your gift is actively saving lives in our medical suites right now.',
  },
  {
    id: 'corporate-csr',
    categoryId: 'support',
    categoryName: 'Donation & CSR',
    badge: 'Donation & CSR',
    title: 'Corporate CSR & Sanctuary Team Days',
    summary:
      'Engage your workplace in meaningful team-building through shelter improvements, cattery enrichment, and animal care.',
    readTime: '4 min read',
    location: 'Pet Heaven Sanctuary, Sungei Tengah',
    commitment: 'Half-Day / Full-Day Event',
    image: imgCsr,
    icon: houseHeartIcon,
    overview:
      'Foster deep team camaraderie while making a real tangible difference for Singapore’s rescue community. Our Corporate Social Responsibility (CSR) days combine practical facility improvement with guided animal enrichment workshops.',
    highlights: [
      {
        title: 'Shelter Facility Refurbishment',
        desc: 'Teams assist with fence maintenance, cattery enrichment tree building, agility ramp painting, and shelter deep cleans.',
      },
      {
        title: 'Animal Interaction & Wellness',
        desc: 'Guided group walks, coat brushing sessions, and basic training observation led by our head animal behaviorists.',
      },
      {
        title: 'Impact Certification & Media Pack',
        desc: 'Official CSR recognition certificate, high-resolution photography pack, and social media co-acknowledgment.',
      },
    ],
    requirements: [
      'Group sizes typically between 8 to 25 corporate participants per session',
      'Advance booking required at least 3 weeks prior to secure sanctuary dates',
      'Covers safety equipment, materials, and dedicated staff facilitator time',
    ],
    actionType: 'apply',
    actionLabel: 'Inquire for Corporate CSR Partnership',
    actionSuccess:
      'Thank you! Our partnerships director will email our corporate engagement deck and available dates.',
  },
];

function timeToSeconds(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

function setLocationHash(hash) {
  window.location.hash = hash;
}

function GetInvolved({ initialItemId = null }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(() => {
    if (initialItemId) {
      return ITEMS.find((it) => it.id === initialItemId) || null;
    }
    return null;
  });
  const [prevInitialItemId, setPrevInitialItemId] = useState(initialItemId);
  const [actionDone, setActionDone] = useState(false);
  const [videoStartTime, setVideoStartTime] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [videoAutoplay, setVideoAutoplay] = useState(false);

  const savedOverviewScrollY = useRef(null);

  if (prevInitialItemId !== initialItemId) {
    setPrevInitialItemId(initialItemId);
    const match = initialItemId ? ITEMS.find((it) => it.id === initialItemId) || null : null;
    setSelectedItem(match);
    setVideoStartTime(0);
    setActiveChapterIndex(0);
    setVideoAutoplay(false);
    setActionDone(false);
  }

  useEffect(() => {
    if (initialItemId) {
      const match = ITEMS.find((it) => it.id === initialItemId);
      if (match && savedOverviewScrollY.current === null) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (savedOverviewScrollY.current !== null) {
      const targetY = savedOverviewScrollY.current;
      savedOverviewScrollY.current = null;
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }, 20);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [initialItemId]);

  const handleOpenDetail = (item) => {
    savedOverviewScrollY.current = window.scrollY;
    setSelectedItem(item);
    setVideoStartTime(0);
    setActiveChapterIndex(0);
    setVideoAutoplay(false);
    setActionDone(false);
    setLocationHash(`#get-involved?item=${item.id}`);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleBackToOverview = () => {
    const targetY = savedOverviewScrollY.current;
    savedOverviewScrollY.current = null;
    setSelectedItem(null);
    setVideoStartTime(0);
    setActiveChapterIndex(0);
    setVideoAutoplay(false);
    setActionDone(false);
    setLocationHash('#get-involved');
    if (targetY !== null) {
      setTimeout(() => {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }, 20);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChapterClick = (timeStr, idx) => {
    setActiveChapterIndex(idx);
    setVideoStartTime(timeToSeconds(timeStr));
    setVideoAutoplay(true);
  };

  const filteredItems =
    activeCategory === 'all'
      ? ITEMS
      : ITEMS.filter((item) => item.categoryId === activeCategory);

  return (
    <main className="get-involved-page">

      <section className="gi-hero-section">
        <div className="gi-container">
          <div className="gi-hero-content">
            <h1 className="gi-hero-title">Get Involved</h1>
            <p className="gi-hero-subtitle">
              From hands-on sanctuary volunteering and loving foster care to science-based pet care guides and lifesaving sponsorships—explore how you can champion rescue animals in Singapore.
            </p>
          </div>

          {!selectedItem ? (
            <div className="gi-category-tabs" role="tablist">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat.id}
                  className={`gi-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.icon && (
                    <img src={cat.icon} alt="" className="gi-tab-icon" aria-hidden="true" />
                  )}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="gi-detail-topbar">
              <button
                type="button"
                className="gi-back-btn"
                onClick={handleBackToOverview}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Back to All Programs</span>
              </button>

              <nav className="gi-breadcrumbs" aria-label="Breadcrumb">
                <span>Get Involved</span>
                <span className="bc-sep">/</span>
                <span>{selectedItem.categoryName}</span>
                <span className="bc-sep">/</span>
                <span className="bc-current">{selectedItem.title}</span>
              </nav>
            </div>
          )}
        </div>
      </section>

      {!selectedItem && (
        <section className="gi-list-section">
          <div className="gi-container">
            <div className="gi-cards-grid">
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="gi-card"
                  onClick={() => handleOpenDetail(item)}
                >
                  <div className="gi-card-media">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="gi-card-img"
                      loading="lazy"
                    />
                    <div className="gi-card-badges-row">
                      <span className="gi-card-badge">{item.badge}</span>
                      {item.video && (
                        <span className="gi-card-video-pill">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Video Guide
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="gi-card-body">
                    <h2 className="gi-card-title">{item.title}</h2>
                    <p className="gi-card-summary">{item.summary}</p>

                    <div className="gi-card-footer">
                      <div className="gi-card-spec">
                        <span className="gi-spec-label">Commitment</span>
                        <span className="gi-spec-val">{item.commitment}</span>
                      </div>
                      <span className="gi-card-arrow-btn" aria-label="Learn more">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedItem && (
        <section className="gi-detail-section">
          <div className="gi-container">

            <div className="gi-detail-card">

              <div className="gi-detail-hero-media">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="gi-detail-img"
                />
                <div className="gi-detail-media-overlay">
                  <span className="gi-detail-badge">{selectedItem.badge}</span>
                  <h1 className="gi-detail-title">{selectedItem.title}</h1>
                </div>
              </div>

              <div className="gi-detail-metrics-bar">
                <div className="gi-metric-item">
                  <span className="gi-metric-label">Category</span>
                  <span className="gi-metric-value">{selectedItem.categoryName}</span>
                </div>
                <div className="gi-metric-divider"></div>
                <div className="gi-metric-item">
                  <span className="gi-metric-label">Location</span>
                  <span className="gi-metric-value">{selectedItem.location}</span>
                </div>
                <div className="gi-metric-divider"></div>
                <div className="gi-metric-item">
                  <span className="gi-metric-label">Commitment</span>
                  <span className="gi-metric-value">{selectedItem.commitment}</span>
                </div>
                <div className="gi-metric-divider"></div>
                <div className="gi-metric-item">
                  <span className="gi-metric-label">Guide Length</span>
                  <span className="gi-metric-value">{selectedItem.readTime}</span>
                </div>
              </div>

              <div className="gi-detail-body">

                <div className="gi-detail-section-block">
                  <h2 className="gi-block-heading">Program Overview</h2>
                  <p className="gi-block-paragraph">{selectedItem.overview}</p>
                </div>

                {selectedItem.video && (
                  <div className="gi-detail-section-block gi-video-chapters-block" id="gi-video-curriculum">
                    <div className="gi-video-block-head">
                      <div className="gi-video-head-left">
                        <div className="gi-video-title-row">
                          <div className="gi-video-icon-circle">
                            <svg
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              width="16"
                              height="16"
                              className="gi-video-play-svg"
                            >
                              <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86a1 1 0 0 0-1.5.86z" />
                            </svg>
                          </div>
                          <h2 className="gi-block-heading" style={{ margin: 0 }}>
                            Interactive Video Walkthrough
                          </h2>
                        </div>
                        <p className="gi-video-subtitle">
                          {selectedItem.video.description}
                        </p>
                      </div>
                    </div>

                    <div className="gi-embedded-video-wrap">
                      <div className="gi-embedded-video-aspect">
                        <iframe
                          key={`${selectedItem.video.youtubeId}-${videoStartTime}`}
                          className="gi-embedded-video-iframe"
                          src={`https://www.youtube-nocookie.com/embed/${selectedItem.video.youtubeId}?start=${videoStartTime}&autoplay=${videoAutoplay ? 1 : 0}&rel=0&modestbranding=1`}
                          title={selectedItem.video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>

                    <div className="gi-chapters-section">
                      <div className="gi-chapters-intro-row">
                        <span className="gi-chapters-intro-title">Jump to Chapter:</span>
                        {videoStartTime > 0 && (
                          <button
                            type="button"
                            className="gi-replay-start-btn"
                            onClick={() => handleChapterClick('00:00', 0)}
                          >
                            ↺ Replay from Start (00:00)
                          </button>
                        )}
                      </div>

                      <div className="gi-chapters-grid">
                        {selectedItem.video.chapters.map((ch, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`gi-chapter-pill ${activeChapterIndex === idx ? 'active' : ''}`}
                            onClick={() => handleChapterClick(ch.time, idx)}
                            aria-label={`Jump video to chapter ${ch.time}: ${ch.title}`}
                          >
                            <span className="gi-chapter-timestamp">{ch.time}</span>
                            <span className="gi-chapter-title-text">{ch.title}</span>
                            {activeChapterIndex === idx && (
                              <span className="gi-chapter-active-icon" title="Currently active chapter">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                                  <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="gi-detail-section-block">
                  <h2 className="gi-block-heading">Key Steps & Recommendations</h2>
                  <div className="gi-highlights-grid">
                    {selectedItem.highlights.map((h, i) => (
                      <div key={i} className="gi-highlight-card">
                        <span className="gi-highlight-num">{i + 1}</span>
                        <h3 className="gi-highlight-title">{h.title}</h3>
                        <p className="gi-highlight-desc">{h.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="gi-detail-section-block">
                  <h2 className="gi-block-heading">Requirements & Preparation Checklist</h2>
                  <ul className="gi-requirements-list">
                    {selectedItem.requirements.map((req, i) => (
                      <li key={i} className="gi-req-item">
                        <div className="gi-check-icon">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="gi-action-box">
                  {actionDone ? (
                    <div className="gi-action-success">
                      <div className="gi-success-circle">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <h3 className="gi-success-title">Action Confirmed</h3>
                      <p className="gi-success-desc">{selectedItem.actionSuccess}</p>
                      <button
                        type="button"
                        className="gi-secondary-btn"
                        onClick={() => setActionDone(false)}
                      >
                        Reset / Perform Another Action
                      </button>
                    </div>
                  ) : (
                    <div className="gi-action-prompt">
                      <div className="gi-action-text-pane">
                        <h3 className="gi-action-heading">Ready to Take the Next Step?</h3>
                        <p className="gi-action-desc">
                          Join our community of animal guardians across Singapore. Every volunteer, foster home, and shared guide makes a direct difference.
                        </p>
                      </div>
                      <button
                        type="button"
                        className="gi-primary-btn"
                        onClick={() => setActionDone(true)}
                      >
                        <span>{selectedItem.actionLabel}</span>
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="gi-detail-bottom-nav">
                  <a
                    href="#contact-us"
                    className="gi-contact-link"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.hash = '#contact-us';
                    }}
                  >
                    Have questions? Contact our team →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export default GetInvolved;
