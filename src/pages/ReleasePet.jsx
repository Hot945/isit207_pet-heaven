import { useState, useRef } from 'react';
import iconDog from '../assets/dog.svg';
import iconCat from '../assets/cat.svg';
import iconHouseHeart from '../assets/house-heart.svg';
import iconHandHeart from '../assets/hand-heart.svg';
import iconHeartHandshake from '../assets/heart-handshake.svg';
import iconBriefcase from '../assets/briefcase-medical.svg';
import iconPaw from '../assets/paw-svgrepo-com.svg';
import iconBell from '../assets/bell-svgrepo-com.svg';
import iconLogIn from '../assets/log-in.svg';
import iconMale from '../assets/man-svgrepo-com.svg';
import iconFemale from '../assets/woman-svgrepo-com.svg';
import CustomSelect from '../components/CustomSelect';
import './ReleasePet.css';

export default function ReleasePet({
  isLoggedIn: externalIsLoggedIn,
  user: externalUser,
  onOpenLoginModal: externalOpenLoginModal,
  onLogout: externalLogout,
  onShowToast,
} = {}) {

  const [localLoggedIn, setLocalLoggedIn] = useState(false);
  const [localShowLoginModal, setLocalShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const isLoggedIn = externalIsLoggedIn !== undefined ? externalIsLoggedIn : localLoggedIn;
  const openLoginModal = externalOpenLoginModal || (() => setLocalShowLoginModal(true));
  const handleLogout = externalLogout || (() => { setLocalLoggedIn(false); setIsSubmitted(false); });
  const handleLocalLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setLocalLoggedIn(true);
    setLocalShowLoginModal(false);
  };

  const accountName = isLoggedIn
    ? (externalUser?.name || `${externalUser?.firstName || ''} ${externalUser?.lastName || ''}`.trim() || 'Alex Tan')
    : '';
  const accountEmail = isLoggedIn
    ? (externalUser?.email || 'alex@example.com')
    : '';

  const [petType, setPetType] = useState('dog');
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [gender, setGender] = useState('male');
  const [isSpayed, setIsSpayed] = useState('');
  const [microchipNo, setMicrochipNo] = useState('');
  const [coatLength, setCoatLength] = useState('');
  const [color, setColor] = useState('');
  const [goodWithKids, setGoodWithKids] = useState('');
  const [goodWithDogs, setGoodWithDogs] = useState('');
  const [goodWithCats, setGoodWithCats] = useState('');
  const [energyLevel, setEnergyLevel] = useState('');
  const [houseTrained, setHouseTrained] = useState('');
  const [vaccinationStatus, setVaccinationStatus] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [rehomeReason, setRehomeReason] = useState('');
  const [petStory, setPetStory] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [ownerPostal, setOwnerPostal] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRefCode, setSubmittedRefCode] = useState('');
  const [submittedDate, setSubmittedDate] = useState('');
  const phoneInputRef = useRef(null);

  const handlePrefillTestData = () => {
    setPetType('dog');
    setPetName('Biscuit');
    setBreed('Singapore Special');
    setAgeYears('2');
    setAgeMonths('6');
    setGender('male');
    setIsSpayed('yes');
    setMicrochipNo('702000008192345');
    setCoatLength('short');
    setColor('Golden Tan & White');
    setGoodWithKids('yes');
    setGoodWithDogs('yes');
    setGoodWithCats('yes');
    setEnergyLevel('moderate');
    setHouseTrained('fully');
    setVaccinationStatus('up_to_date');
    setRehomeReason('relocation');
    setMedicalNotes('Healthy with no chronic conditions. Annual vaccinations and monthly heartworm prevention are up to date.');
    setPetStory('Biscuit is an affectionate, house-trained companion who loves gentle evening walks, squeaky plush toys, and relaxing quietly beside his family.');
    setOwnerPhone('81234567');
    setPhoneError('');
    if (phoneInputRef.current) {
      phoneInputRef.current.setCustomValidity('');
    }
    setOwnerPostal('520123');

    if (onShowToast) {
      onShowToast('Test rehoming details have been pre-filled.', 'success');
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openLoginModal();
      return;
    }

    if (!/^\d{8}$/.test(ownerPhone)) {
      const msg = 'Singapore contact phone must be exactly 8 digits (without +65).';
      setPhoneError(msg);
      if (onShowToast) {
        onShowToast(msg, 'warning');
      }
      return;
    }

    const refCode = `REL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowStr = new Date().toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRelease = {
      referenceCode: refCode,
      petName: petName || 'Unnamed Pet',
      petType: petType ? petType.charAt(0).toUpperCase() + petType.slice(1) : 'Dog',
      petBreed: breed || 'Mixed Breed',
      petAge: `${ageYears || '1'} yr${ageYears === '1' ? '' : 's'} ${ageMonths || '0'} mo`,
      petGender: gender === 'female' ? 'Female' : 'Male',
      petShelter: 'SPCA Singapore Rehoming Intake',
      petLocation: 'Sungei Tengah, Singapore',
      vaccinationStatus: vaccinationStatus || 'Up-to-date',
      medicalNotes: medicalNotes || 'None reported',
      rehomeReason: rehomeReason || 'Family circumstances',
      petStory: petStory || '',
      ownerName: accountName || 'Pet Caregiver',
      ownerPhone: ownerPhone ? `+65 ${ownerPhone}` : '',
      ownerEmail: accountEmail || '',
      ownerPostal: ownerPostal || '',
      submissionDate: nowStr,
      status: 'Under Review',
      type: 'Release Application',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('pet_heaven_user_release_applications') || '[]');
      existing.unshift(newRelease);
      localStorage.setItem('pet_heaven_user_release_applications', JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save release application to localStorage', err);
    }

    setSubmittedRefCode(refCode);
    setSubmittedDate(nowStr);
    setIsSubmitted(true);
    if (onShowToast) {
      onShowToast(`Rehoming application #${refCode} submitted successfully!`, 'success');
    }
    window.scrollTo({ top: document.getElementById('release-form-section')?.offsetTop - 80 || 0, behavior: 'smooth' });
  };

  return (
    <div className="release-pet-page">

      <section className="release-hero-banner">
        <div className="release-hero-inner">
          <h1 className="release-hero-title">Release a Pet for Loving Rehoming</h1>
          <p className="release-hero-subtitle">
            Every animal deserves lifelong care and safety. If you can no longer care for your pet due to unavoidable circumstances, Pet Heaven connects you with certified animal shelters, dedicated foster volunteers, and pre-screened adopters across Singapore.
          </p>
        </div>
      </section>

      <section className="release-intro-content">
        <div className="release-intro-container">

          <div className="rehome-commitments-grid">
            <div className="commitment-card">
              <div className="commitment-icon-wrap">
                <img src={iconHandHeart} alt="" className="commitment-svg" />
              </div>
              <h3 className="commitment-title">Zero Judgment, Full Support</h3>
              <p className="commitment-desc">
                We understand that life situations change (housing limitations, severe allergies, or financial hardship). We provide compassionate, confidential assistance without stigma.
              </p>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon-wrap">
                <img src={iconHeartHandshake} alt="" className="commitment-svg" />
              </div>
              <h3 className="commitment-title">Strict Adopter Screening</h3>
              <p className="commitment-desc">
                Potential adopters undergo rigorous home suitability checks, HDB approval verifications, and mandatory meet-and-greets to ensure permanent, loving matches.
              </p>
            </div>

            <div className="commitment-card">
              <div className="commitment-icon-wrap">
                <img src={iconBriefcase} alt="" className="commitment-svg" />
              </div>
              <h3 className="commitment-title">Veterinary & Legal Compliance</h3>
              <p className="commitment-desc">
                All rehoming transfers strictly comply with Singapore Animal & Veterinary Service (AVS / NParks) regulations, including lifelong microchip registration and health records.
              </p>
            </div>
          </div>

          <div className="rehome-process-timeline-box">
            <div className="process-header">
              <h2 className="process-title">How the Pet Rehoming Process Works</h2>
              <p className="process-desc">
                A structured, humane pathway designed to keep your pet secure at every single stage until they enter their forever home.
              </p>
            </div>

            <div className="process-steps-row">
              <div className="process-step-item">
                <div className="step-number-bubble">1</div>
                <h4 className="step-title">Submit Pet Profile</h4>
                <p className="step-body">
                  Complete the intake form below with medical records, personality quirks, diet habits, and background details.
                </p>
              </div>

              <div className="process-step-item">
                <div className="step-number-bubble">2</div>
                <h4 className="step-title">Intake & Health Review</h4>
                <p className="step-body">
                  Our rescue coordinators at SPCA, CAS, or certified fosters review medical notes and verify vaccination and microchip status.
                </p>
              </div>

              <div className="process-step-item">
                <div className="step-number-bubble">3</div>
                <h4 className="step-title">Foster or In-Home Care</h4>
                <p className="step-body">
                  Your pet remains safely in your home or placed with a certified foster parent while our platform highlights them to screened adopters.
                </p>
              </div>

              <div className="process-step-item">
                <div className="step-number-bubble">4</div>
                <h4 className="step-title">Adoption & Legal Transfer</h4>
                <p className="step-body">
                  After a successful meet-and-greet and home inspection, legal AVS microchip transfer is completed with a signed adoption deed.
                </p>
              </div>
            </div>
          </div>

          <div className="rehome-notice-callout">
            <div className="notice-icon-col">
              <img src={iconBell} alt="" className="notice-bell-svg" />
            </div>
            <div className="notice-text-col">
              <h4 className="notice-heading">Important Legal & Animal Welfare Notice</h4>
              <p className="notice-body">
                Under the Singapore Animals and Birds Act, pet abandonment is an offense punishable by law with fines up to $10,000 and imprisonment. Rehoming through verified shelters is the safe, legal, and humane choice. Please be honest regarding your pet's behavioral or health conditions so we can arrange suitable foster placement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
         下半部分：送养申请表单与未登录高斯模糊层 (Form & Gaussian Blur Gate)
         ------------------------------------------------------------------ */}
      <section id="release-form-section" className="release-form-section">
        <div className="release-form-container">
          <div className="form-section-header">
            <h2 className="form-main-heading">Pet Rehoming Intake Form</h2>
            <p className="form-sub-heading">
              Please provide comprehensive information about your pet so our adoption coordinators and shelter partners can assess their placement.
            </p>
          </div>

          {/* 登录状态条（已登录时显示身份并提供退出测试选项） */}
          {isLoggedIn && (
            <div className="logged-in-status-bar">
              <div className="user-info-pill">
                <span className="user-status-dot"></span>
                <span>Signed in as <strong>{accountName}</strong> ({accountEmail})</span>
              </div>
              <button type="button" className="demo-signout-btn" onClick={handleLogout}>
                Sign Out (Test Blur View)
              </button>
            </div>
          )}

          {/* 表单包裹区：未登录时整体应用高斯模糊，提交后统一呈现与领养申请一致的成功回执卡片 */}
          <div className={`form-blur-wrapper ${isLoggedIn && isSubmitted ? 'is-submitted' : ''}`}>
            {isLoggedIn && isSubmitted ? (
              <div className="rehome-success-card">
                <div className="rehome-success-icon-bubble">
                  <svg
                    className="rehome-success-check-svg"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path className="rehome-success-check-path" d="M4 12 L9 17 L20 6" />
                  </svg>
                </div>

                <h2 className="rehome-success-heading">Rehoming Application Submitted Successfully!</h2>
                <p className="rehome-success-subheading">
                  Application Reference Code:{' '}
                  <strong className="rehome-ref-code-highlight">#{submittedRefCode || 'REL-2026-8842'}</strong>
                </p>

                <div className="rehome-success-summary">
                  <div className="rehome-success-row">
                    <span className="rehome-success-label">Pet Profile:</span>
                    <span className="rehome-success-value">
                      {petName || 'Unnamed Pet'} ({breed || 'Mixed Breed'})
                    </span>
                  </div>
                  <div className="rehome-success-row">
                    <span className="rehome-success-label">Intake Partner:</span>
                    <span className="rehome-success-value">SPCA Singapore Rehoming Intake</span>
                  </div>
                  <div className="rehome-success-row">
                    <span className="rehome-success-label">Caregiver:</span>
                    <span className="rehome-success-value">
                      {accountName || 'Pet Caregiver'} ({accountEmail})
                    </span>
                  </div>
                  <div className="rehome-success-row">
                    <span className="rehome-success-label">Submission Date:</span>
                    <span className="rehome-success-value">{submittedDate}</span>
                  </div>
                </div>

                <div className="rehome-success-next-steps">
                  <h4>Next Steps in the Rehoming Process:</h4>
                  <ol className="rehome-next-steps-list">
                    <li>
                      <strong>Welfare &amp; Profile Assessment:</strong> Our intake coordinators at{' '}
                      <strong>SPCA Singapore Rehoming Intake</strong> will review{' '}
                      {petName || 'your pet'}&apos;s health records, microchip details, and personality notes.
                    </li>
                    <li>
                      <strong>Phone / Intake Consultation:</strong> A rescue specialist will contact you at{' '}
                      <strong>{ownerPhone ? `+65 ${ownerPhone}` : accountEmail}</strong> within 24–48 hours to discuss foster or intake arrangements.
                    </li>
                    <li>
                      <strong>Safe Transition &amp; Matching:</strong> Once intake is confirmed, we will coordinate pre-homing checks and match{' '}
                      {petName || 'your pet'} with a loving adopter!
                    </li>
                  </ol>
                </div>

                <div className="rehome-success-actions">
                  <button
                    type="button"
                    className="btn-success-reset"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Submit Another Pet
                  </button>
                </div>
              </div>
            ) : (
              <form
                className={`rehome-actual-form ${!isLoggedIn ? 'is-blurred' : ''}`}
                onSubmit={handleSubmitForm}
              >
                <>
                  {/* 第一部分：宠物基本信息 */}
                  <div className="form-fieldset">
                    <div className="fieldset-legend">
                      <span className="legend-num">1</span>
                      <h3 className="legend-title">Pet Basic Details</h3>
                    </div>

                    <div className="form-row-grid grid-3">
                      <div className="form-field-group">
                        <label className="field-label">Pet Name *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Milo, Buster"
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Pet Category *</label>
                        <div className="pet-type-pill-selector">
                          <button
                            type="button"
                            className={`type-pill-btn ${petType === 'dog' ? 'selected' : ''}`}
                            onClick={() => setPetType('dog')}
                            disabled={!isLoggedIn}
                          >
                            <img src={iconDog} alt="" className="pill-type-svg" />
                            <span>Dog</span>
                          </button>
                          <button
                            type="button"
                            className={`type-pill-btn ${petType === 'cat' ? 'selected' : ''}`}
                            onClick={() => setPetType('cat')}
                            disabled={!isLoggedIn}
                          >
                            <img src={iconCat} alt="" className="pill-type-svg" />
                            <span>Cat</span>
                          </button>
                          <button
                            type="button"
                            className={`type-pill-btn ${petType === 'other' ? 'selected' : ''}`}
                            onClick={() => setPetType('other')}
                            disabled={!isLoggedIn}
                          >
                            <img src={iconPaw} alt="" className="pill-type-svg" />
                            <span>Other</span>
                          </button>
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Breed *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Singapore Special, Domestic Shorthair"
                          value={breed}
                          onChange={(e) => setBreed(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-grid grid-3">
                      <div className="form-field-group">
                        <label className="field-label">Approximate Age *</label>
                        <div className="age-split-fields">
                          <input
                            type="number"
                            className="form-input"
                            placeholder="Years"
                            min="0"
                            max="30"
                            value={ageYears}
                            onChange={(e) => setAgeYears(e.target.value)}
                            disabled={!isLoggedIn}
                          />
                          <input
                            type="number"
                            className="form-input"
                            placeholder="Months"
                            min="0"
                            max="11"
                            value={ageMonths}
                            onChange={(e) => setAgeMonths(e.target.value)}
                            disabled={!isLoggedIn}
                          />
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Gender *</label>
                        <div className="gender-pill-selector">
                          <button
                            type="button"
                            className={`gender-btn ${gender === 'male' ? 'selected' : ''}`}
                            onClick={() => setGender('male')}
                            disabled={!isLoggedIn}
                          >
                            <img src={iconMale} alt="" className="gender-pill-svg" />
                            <span>Male</span>
                          </button>
                          <button
                            type="button"
                            className={`gender-btn ${gender === 'female' ? 'selected' : ''}`}
                            onClick={() => setGender('female')}
                            disabled={!isLoggedIn}
                          >
                            <img src={iconFemale} alt="" className="gender-pill-svg" />
                            <span>Female</span>
                          </button>
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Spayed / Neutered *</label>
                        <CustomSelect
                          className={`form-select ${!isSpayed ? 'is-placeholder' : ''}`}
                          value={isSpayed}
                          onChange={(e) => setIsSpayed(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="yes">Yes (Sterilized)</option>
                          <option value="no">No (Intact)</option>
                          <option value="unknown">Not Sure</option>
                        </CustomSelect>
                      </div>
                    </div>

                    <div className="form-row-grid grid-2">
                      <div className="form-field-group">
                        <label className="field-label">AVS Microchip Number (Mandatory in SG) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="15-digit microchip number (e.g. 702000001234567)"
                          value={microchipNo}
                          onChange={(e) => setMicrochipNo(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Coat & Color *</label>
                        <div className="coat-color-split">
                          <CustomSelect
                            className={`form-select ${!coatLength ? 'is-placeholder' : ''}`}
                            value={coatLength}
                            onChange={(e) => setCoatLength(e.target.value)}
                            disabled={!isLoggedIn}
                            required
                          >
                            <option value="" disabled hidden>Please select</option>
                            <option value="short">Short Coat</option>
                            <option value="medium">Medium Coat</option>
                            <option value="long">Long Coat</option>
                            <option value="wirehair">Wirehair / Curly</option>
                          </CustomSelect>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="Color (e.g. Brown & White)"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            disabled={!isLoggedIn}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 第二部分：性格行为与兼容性 */}
                  <div className="form-fieldset">
                    <div className="fieldset-legend">
                      <span className="legend-num">2</span>
                      <h3 className="legend-title">Behavior, Temperament & Compatibility</h3>
                    </div>

                    <div className="form-row-grid grid-3">
                      <div className="form-field-group">
                        <label className="field-label">Good with Children?</label>
                        <CustomSelect
                          className={`form-select ${!goodWithKids ? 'is-placeholder' : ''}`}
                          value={goodWithKids}
                          onChange={(e) => setGoodWithKids(e.target.value)}
                          disabled={!isLoggedIn}
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="yes">Yes, loves kids</option>
                          <option value="older_kids">Older kids only (10+)</option>
                          <option value="no">No, prefers adult-only home</option>
                          <option value="unknown">Unknown / Not tested</option>
                        </CustomSelect>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Good with Other Dogs?</label>
                        <CustomSelect
                          className={`form-select ${!goodWithDogs ? 'is-placeholder' : ''}`}
                          value={goodWithDogs}
                          onChange={(e) => setGoodWithDogs(e.target.value)}
                          disabled={!isLoggedIn}
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="yes">Friendly with dogs</option>
                          <option value="selective">Selective / Needs slow intro</option>
                          <option value="no">Prefers being only dog</option>
                          <option value="unknown">Unknown</option>
                        </CustomSelect>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Good with Cats?</label>
                        <CustomSelect
                          className={`form-select ${!goodWithCats ? 'is-placeholder' : ''}`}
                          value={goodWithCats}
                          onChange={(e) => setGoodWithCats(e.target.value)}
                          disabled={!isLoggedIn}
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="yes">Calm / Friendly with cats</option>
                          <option value="no">Has high prey drive</option>
                          <option value="unknown">Unknown / Never tested</option>
                        </CustomSelect>
                      </div>
                    </div>

                    <div className="form-row-grid grid-2">
                      <div className="form-field-group">
                        <label className="field-label">Energy & Activity Level</label>
                        <CustomSelect
                          className={`form-select ${!energyLevel ? 'is-placeholder' : ''}`}
                          value={energyLevel}
                          onChange={(e) => setEnergyLevel(e.target.value)}
                          disabled={!isLoggedIn}
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="calm">Low / Couch potato (Gentle walks)</option>
                          <option value="moderate">Moderate (Daily regular walks)</option>
                          <option value="high">High (Active runner / Agility)</option>
                        </CustomSelect>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">House / Toilet Training Status</label>
                        <CustomSelect
                          className={`form-select ${!houseTrained ? 'is-placeholder' : ''}`}
                          value={houseTrained}
                          onChange={(e) => setHouseTrained(e.target.value)}
                          disabled={!isLoggedIn}
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="fully">100% Fully Pee-pad / Outdoor trained</option>
                          <option value="in_progress">In progress / Minor accidents</option>
                          <option value="not_trained">Needs full house training</option>
                        </CustomSelect>
                      </div>
                    </div>
                  </div>

                  {/* 第三部分：健康状态与送养原因 */}
                  <div className="form-fieldset">
                    <div className="fieldset-legend">
                      <span className="legend-num">3</span>
                      <h3 className="legend-title">Health, Story & Reason for Rehoming</h3>
                    </div>

                    <div className="form-row-grid grid-2">
                      <div className="form-field-group">
                        <label className="field-label">Vaccination Status *</label>
                        <CustomSelect
                          className={`form-select ${!vaccinationStatus ? 'is-placeholder' : ''}`}
                          value={vaccinationStatus}
                          onChange={(e) => setVaccinationStatus(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="up_to_date">Up to Date (Annual booster valid)</option>
                          <option value="needs_booster">Needs Booster / Overdue</option>
                          <option value="never">Never Vaccinated / Unknown</option>
                        </CustomSelect>
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Primary Reason for Rehoming *</label>
                        <CustomSelect
                          className={`form-select ${!rehomeReason ? 'is-placeholder' : ''}`}
                          value={rehomeReason}
                          onChange={(e) => setRehomeReason(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        >
                          <option value="" disabled hidden>Please select</option>
                          <option value="relocation">Relocation / Moving Overseas</option>
                          <option value="allergies">Family Allergies / Health Changes</option>
                          <option value="housing">Housing / Landlord Restrictions</option>
                          <option value="financial">Financial Constraints</option>
                          <option value="time">Time Limitations / Long Work Hours</option>
                          <option value="other">Other Personal Circumstances</option>
                        </CustomSelect>
                      </div>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Known Medical Conditions or Dietary Needs</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        placeholder="e.g. Skin allergies to poultry, requires joint supplements, or heartworm negative..."
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        disabled={!isLoggedIn}
                      ></textarea>
                    </div>

                    <div className="form-field-group">
                      <label className="field-label">Tell Us About Your Pet's Story & Routine *</label>
                      <textarea
                        className="form-textarea"
                        rows="4"
                        placeholder="What are their favorite toys? What makes them happy or scared? Describing their personality accurately helps us find the most compatible match."
                        value={petStory}
                        onChange={(e) => setPetStory(e.target.value)}
                        disabled={!isLoggedIn}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="form-fieldset">
                    <div className="fieldset-legend">
                      <span className="legend-num">4</span>
                      <h3 className="legend-title">Current Owner / Caregiver Verification</h3>
                    </div>

                    <div className="form-row-grid grid-2">
                      <div className="form-field-group">
                        <label className="field-label">Your Full Legal Name *</label>
                        <input
                          type="text"
                          className={`form-input ${isLoggedIn ? 'is-account-locked' : ''}`}
                          placeholder="As registered in AVS microchip"
                          value={accountName}
                          readOnly
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Singapore Contact Phone (+65) *</label>
                        <input
                          ref={phoneInputRef}
                          type="tel"
                          inputMode="numeric"
                          maxLength={8}
                          minLength={8}
                          pattern="\d{8}"
                          className={`form-input ${phoneError ? 'is-invalid-input' : ''}`}
                          placeholder="e.g. 81234567"
                          value={ownerPhone}
                          onKeyDown={(e) => {
                            if (
                              e.ctrlKey ||
                              e.metaKey ||
                              e.altKey ||
                              ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)
                            ) {
                              return;
                            }
                            if (!/^[0-9]$/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 8);
                            setOwnerPhone(digitsOnly);
                            if (phoneError) setPhoneError('');
                            e.target.setCustomValidity('');
                          }}
                          onInvalid={(e) => {
                            const val = e.target.value;
                            const msg = !val
                              ? 'Please enter an 8-digit Singapore phone number (without +65).'
                              : 'Singapore contact phone must be exactly 8 digits (without +65).';
                            e.target.setCustomValidity(msg);
                            setPhoneError(msg);
                            if (e.target.form && e.target.form.querySelector(':invalid') === e.target && onShowToast) {
                              onShowToast(msg, 'warning');
                            }
                          }}
                          disabled={!isLoggedIn}
                          required
                        />
                        {phoneError && <span className="field-error-text">{phoneError}</span>}
                      </div>
                    </div>

                    <div className="form-row-grid grid-2">
                      <div className="form-field-group">
                        <label className="field-label">Email Address *</label>
                        <input
                          type="email"
                          className={`form-input ${isLoggedIn ? 'is-account-locked' : ''}`}
                          placeholder="you@example.com"
                          value={accountEmail}
                          readOnly
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>

                      <div className="form-field-group">
                        <label className="field-label">Singapore Postal Code (Location) *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 520123 (For local foster matching)"
                          value={ownerPostal}
                          onChange={(e) => setOwnerPostal(e.target.value)}
                          disabled={!isLoggedIn}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-submit-footer">
                    <button
                      type="button"
                      className="rehome-prefill-btn"
                      onClick={handlePrefillTestData}
                      disabled={!isLoggedIn}
                    >
                      Auto-Fill Test Data
                    </button>
                    <p className="privacy-declaration-text">
                      By submitting this form, you confirm you are the legal caregiver of the animal and agree to Pet Heaven's Non-Profit Animal Welfare Rehoming Protocols.
                    </p>
                    <button
                      type="submit"
                      className="rehome-submit-cta-btn"
                      disabled={!isLoggedIn}
                    >
                      SUBMIT REHOMING REQUEST
                    </button>
                  </div>
                </>
              </form>
            )}

            {/* 未登录高斯模糊浮层卡片 (满足需求：未登陆时高斯模糊，提示请先登陆，然后按钮) */}
            {!isLoggedIn && (
              <div className="login-required-gate-backdrop">
                <div className="login-gate-card">
                  <div className="gate-icon-badge">
                    <img src={iconLogIn} alt="" className="gate-login-svg" />
                  </div>

                  <h3 className="gate-heading">Please Sign In to Release a Pet</h3>
                  <p className="gate-description">
                    To prevent fraudulent pet surrenders, safeguard animal welfare, and allow you to track your intake review in real time, you must be signed in with your Pet Heaven account.
                  </p>

                  <div className="gate-actions-wrap">
                    <button
                      type="button"
                      className="gate-primary-login-btn"
                      onClick={openLoginModal}
                    >
                      LOG IN TO CONTINUE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 独立运行时备用登录弹窗 (Login Modal Fallback) */}
      {!externalOpenLoginModal && localShowLoginModal && (
        <div className="rehome-modal-backdrop" onClick={() => setLocalShowLoginModal(false)}>
          <div className="rehome-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-icon-btn"
              onClick={() => setLocalShowLoginModal(false)}
            >
              ✕
            </button>

            <div className="modal-header-block">
              <div className="modal-pet-brand-badge">
                <img src={iconHouseHeart} alt="" className="modal-badge-svg" />
              </div>
              <h3 className="modal-dialog-title">Welcome to Pet Heaven</h3>
              <p className="modal-dialog-subtitle">Sign in to submit and track your pet rehoming intake application</p>
            </div>

            <form onSubmit={handleLocalLoginSubmit} className="modal-login-form">
              <div className="modal-field-group">
                <label className="modal-field-label">Email Address</label>
                <input
                  type="email"
                  className="modal-field-input"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-field-label">Password</label>
                <input
                  type="password"
                  className="modal-field-input"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="modal-submit-login-btn">
                SIGN IN & UNLOCK FORM
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
