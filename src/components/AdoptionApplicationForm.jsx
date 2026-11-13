import { useState, useEffect } from 'react';
import { getPetImageUrl } from '../data/petsData';
import iconShelter from '../assets/house.svg';
import CustomSelect from './CustomSelect';
import './AdoptionApplicationForm.css';

export default function AdoptionApplicationForm({
  pet,
  user,
  onBack,
  onShowToast,
}) {

  const isAccountLocked = Boolean(user);
  const accountName = isAccountLocked
    ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Alex Tan')
    : '';
  const accountEmail = isAccountLocked
    ? (user.email || 'alex@example.com')
    : '';

  const [formData, setFormData] = useState({
    fullName: accountName,
    email: accountEmail,
    phone: '',
    nricLast4: '',
    streetAddress: '',
    postalCode: '',
    occupation: '',

    housingType: '',
    familyAgreement: '',
    windowMeshed: '',
    existingPets: '',
    childrenInHome: '',

    hoursAlone: '',
    primaryCaregiver: '',
    petExperience: '',
    monthlyBudget: '',

    motivation: '',

    agreedAccuracy: false,
    agreedHomeVisit: false,
    agreedCommitment: false,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const resolvedFullName = isAccountLocked ? accountName : formData.fullName;
  const resolvedEmail = isAccountLocked ? accountEmail : formData.email;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePrefillTestData = () => {
    setFormData({
      fullName: isAccountLocked ? accountName : 'Alex Tan',
      email: isAccountLocked ? accountEmail : 'alex.tan@example.sg',
      phone: '9123 4567',
      nricLast4: '567A',
      streetAddress: 'Blk 123 Ang Mo Kio Ave 4 #08-12',
      postalCode: '560123',
      occupation: 'Software Engineer',
      housingType: 'HDB 4-Room / 5-Room / Executive',
      familyAgreement: 'Yes - All Agree',
      windowMeshed: 'Fully Meshed',
      existingPets: 'None',
      childrenInHome: 'None',
      hoursAlone: 'Under 4 Hours',
      primaryCaregiver: 'Myself',
      petExperience: 'Previously Owned',
      monthlyBudget: '$200 - $350',
      motivation: `Our household works a flexible hybrid schedule and loves daily morning and evening walks around our neighbourhood park. All windows and gates at home are fully meshed, and we are ready to provide ${pet.name} with a calm, loving forever home and regular veterinary care.`,
      agreedAccuracy: true,
      agreedHomeVisit: true,
      agreedCommitment: true,
    });
    if (onShowToast) {
      onShowToast('Test adoption details have been pre-filled.', 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!resolvedFullName.trim() || !resolvedEmail.trim() || !formData.phone.trim()) {
      if (onShowToast) {
        onShowToast('Please fill in all required contact information.', 'warning');
      }
      return;
    }

    if (!formData.agreedAccuracy || !formData.agreedHomeVisit || !formData.agreedCommitment) {
      if (onShowToast) {
        onShowToast('Please review and agree to all declaration terms before submitting.', 'warning');
      }
      return;
    }

    const refCode = `PH-APP-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString('en-SG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newApplication = {
      referenceCode: refCode,
      petId: pet.id,
      petName: pet.name,
      petBreed: pet.breed,
      petImage: pet.image,
      petShelter: pet.shelter,
      petLocation: pet.currentLocation,
      applicantName: resolvedFullName,
      applicantEmail: resolvedEmail,
      applicantPhone: formData.phone,
      housingType: formData.housingType,
      submissionDate: nowStr,
      status: 'Under Review',
      type: 'Adoption Application',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('pet_heaven_user_applications') || '[]');
      existing.unshift(newApplication);
      localStorage.setItem('pet_heaven_user_applications', JSON.stringify(existing));
    } catch (err) {
      console.warn('Failed to save application to localStorage', err);
    }

    setReferenceCode(refCode);
    setSubmissionDate(nowStr);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (onShowToast) {
      onShowToast(`Adoption application for ${pet.name} submitted successfully! Reference: ${refCode}`, 'success');
    }
  };

  return (
    <div className="adopt-application-page">

      <section className="adopt-app-hero-banner">
        <div className="adopt-app-hero-inner">
          <div className="adopt-header-top-row">
            {!isSubmitted && (
              <button
                type="button"
                className="adopt-back-btn"
                onClick={onBack}
                aria-label="Back"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="adopt-app-hero-title-box">
            <h1 className="adopt-app-hero-title">
              {isSubmitted ? 'Application Transmitted' : `Apply to Adopt ${pet.name}`}
            </h1>
            <p className="adopt-app-hero-subtitle">
              {isSubmitted
                ? `Thank you for opening your heart to ${pet.name}. Your details have been sent to ${pet.shelter}.`
                : `Submit your adoption inquiry to ${pet.shelter}. Rescue coordinators will review your home profile within 1-2 business days.`}
            </p>
          </div>

          <div className="adopt-header-bottom-spacer" aria-hidden="true" />
        </div>
      </section>

      <div className="adopt-app-container">

        <div className="target-pet-summary-card">
          <div className="summary-thumb-box">
            <img
              src={getPetImageUrl(pet.image)}
              alt={`${pet.name} - ${pet.breed}`}
              className="summary-pet-thumb"
            />
          </div>
          <div className="summary-pet-details">
            <div className="summary-badge-row">
              <span className="summary-id-badge">ID: {pet.id.toUpperCase()}</span>
            </div>
            <h2 className="summary-pet-name">{pet.name}</h2>
            <p className="summary-pet-meta">
              <strong>{pet.breed}</strong> • {pet.ageDetail || `${pet.age} yrs`} • {pet.gender} • {pet.size}
            </p>
            <p className="summary-pet-shelter">
              <img src={iconShelter} alt="" className="summary-shelter-icon" />
              <span><strong>{pet.shelter}</strong> ({pet.currentLocation})</span>
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="adopt-success-view">
            <div className="success-icon-bubble">
              <svg
                className="success-check-svg"
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
                <path className="success-check-path" d="M4 12 L9 17 L20 6" />
              </svg>
            </div>

            <h2 className="success-heading">Application Submitted Successfully!</h2>
            <p className="success-subheading">
              Application Reference Code: <strong className="ref-code-highlight">{referenceCode}</strong>
            </p>

            <div className="success-card-summary">
              <div className="success-row">
                <span className="success-label">Target Pet:</span>
                <span className="success-value">{pet.name} ({pet.breed})</span>
              </div>
              <div className="success-row">
                <span className="success-label">Shelter Partner:</span>
                <span className="success-value">{pet.shelter}</span>
              </div>
              <div className="success-row">
                <span className="success-label">Applicant:</span>
                <span className="success-value">{resolvedFullName} ({resolvedEmail})</span>
              </div>
              <div className="success-row">
                <span className="success-label">Submission Date:</span>
                <span className="success-value">{submissionDate}</span>
              </div>
            </div>

            <div className="success-next-steps">
              <h4>Next Steps in the Adoption Process:</h4>
              <ol className="next-steps-list">
                <li>
                  <strong>Application Assessment:</strong> The adoption committee at <strong>{pet.shelter}</strong> will assess your home environment and family compatibility.
                </li>
                <li>
                  <strong>Phone / Virtual Interview:</strong> A rescue coordinator will contact you at <strong>{formData.phone || resolvedEmail}</strong> within 1-2 business days.
                </li>
                <li>
                  <strong>Meet-and-Greet:</strong> An in-person interaction session will be arranged at the shelter to let {pet.name} meet you and your household!
                </li>
              </ol>
            </div>

            <div className="success-actions">
              <button
                type="button"
                className="btn-return-profile"
                onClick={onBack}
              >
                Back to {pet.name}'s Profile
              </button>
              <button
                type="button"
                className="btn-browse-more"
                onClick={() => {
                  window.location.hash = '#find-a-pet';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Browse More Pets
              </button>
            </div>
          </div>
        ) : (
          /* ---------------- 核心申请表单 ---------------- */
          <form className="adopt-application-form" onSubmit={handleSubmit}>
            {/* Section 1: 申请人基础信息 */}
            <div className="form-section-card">
              <div className="section-card-title-row">
                <div className="section-title-icon-wrap">1</div>
                <h3 className="section-card-title">Applicant Profile</h3>
              </div>

              <div className="form-grid-2col">
                <div className="form-field">
                  <label htmlFor="fullName">Full Legal Name <span className="required-star">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={isAccountLocked ? 'is-account-locked' : undefined}
                    value={resolvedFullName}
                    onChange={isAccountLocked ? undefined : handleChange}
                    readOnly={isAccountLocked}
                    placeholder="e.g. Alex Tan"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="email">Email Address <span className="required-star">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={isAccountLocked ? 'is-account-locked' : undefined}
                    value={resolvedEmail}
                    onChange={isAccountLocked ? undefined : handleChange}
                    readOnly={isAccountLocked}
                    placeholder="e.g. alex@example.com"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Contact Phone (+65) <span className="required-star">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9123 4567"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="nricLast4">NRIC / FIN (Last 4 digits) <span className="required-star">*</span></label>
                  <input
                    type="text"
                    id="nricLast4"
                    name="nricLast4"
                    value={formData.nricLast4}
                    onChange={handleChange}
                    placeholder="e.g. 567A"
                    maxLength={5}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="streetAddress">Residential Street Address <span className="required-star">*</span></label>
                  <input
                    type="text"
                    id="streetAddress"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleChange}
                    placeholder="e.g. Blk 123 Ang Mo Kio Ave 4 #08-12"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="postalCode">Singapore Postal Code <span className="required-star">*</span></label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="e.g. 560123 (6 digits)"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: 居住环境与家庭成员评估 (新加坡 SPCA/AVS 准则) */}
            <div className="form-section-card">
              <div className="section-card-title-row">
                <div className="section-title-icon-wrap">2</div>
                <h3 className="section-card-title">Housing & Household Environment</h3>
              </div>

              <div className="form-grid-2col">
                <div className="form-field">
                  <label htmlFor="housingType">Housing Type <span className="required-star">*</span></label>
                  <CustomSelect
                    id="housingType"
                    name="housingType"
                    value={formData.housingType}
                    onChange={handleChange}
                    required
                    className={formData.housingType === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="HDB 3-Room">HDB 3-Room Flat</option>
                    <option value="HDB 4-Room / 5-Room / Executive">HDB 4-Room / 5-Room / Executive</option>
                    <option value="Condominium">Private Condominium / EC</option>
                    <option value="Landed Property">Landed House (Terrace / Semi-D / Bungalow)</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="familyAgreement">Family & Household Consensus <span className="required-star">*</span></label>
                  <CustomSelect
                    id="familyAgreement"
                    name="familyAgreement"
                    value={formData.familyAgreement}
                    onChange={handleChange}
                    required
                    className={formData.familyAgreement === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="Yes - All Agree">Yes, all household members are 100% supportive</option>
                    <option value="Pending Discussion">Discussion in progress</option>
                    <option value="Living Alone">Living alone (Sole decision maker)</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="windowMeshed">Window & Gate Pet-Proofing / Mesh <span className="required-star">*</span></label>
                  <CustomSelect
                    id="windowMeshed"
                    name="windowMeshed"
                    value={formData.windowMeshed}
                    onChange={handleChange}
                    required
                    className={formData.windowMeshed === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="Fully Meshed">Already fully meshed / safe grilles installed</option>
                    <option value="Will Install">Will install before welcoming pet home</option>
                    <option value="Need Advice">Need advice from shelter coordinator</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="existingPets">Existing Pets in Household <span className="required-star">*</span></label>
                  <CustomSelect
                    id="existingPets"
                    name="existingPets"
                    value={formData.existingPets}
                    onChange={handleChange}
                    required
                    className={formData.existingPets === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="None">No other pets</option>
                    <option value="1 Dog">1 Dog</option>
                    <option value="2+ Dogs">2 or more Dogs</option>
                    <option value="1 Cat">1 Cat</option>
                    <option value="2+ Cats">2 or more Cats</option>
                    <option value="Other">Other small animals (Rabbits, birds, etc.)</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="childrenInHome">Children in Household <span className="required-star">*</span></label>
                  <CustomSelect
                    id="childrenInHome"
                    name="childrenInHome"
                    value={formData.childrenInHome}
                    onChange={handleChange}
                    required
                    className={formData.childrenInHome === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="None">No children under 12</option>
                    <option value="Children 6-12">Children aged 6-12 years</option>
                    <option value="Toddlers under 6">Toddlers / infants under 6 years</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="hoursAlone">Daily Hours Pet Will Be Alone <span className="required-star">*</span></label>
                  <CustomSelect
                    id="hoursAlone"
                    name="hoursAlone"
                    value={formData.hoursAlone}
                    onChange={handleChange}
                    required
                    className={formData.hoursAlone === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="Always Someone Home">Someone is always home (WFH / Family / Helper)</option>
                    <option value="Under 4 Hours">Less than 4 hours</option>
                    <option value="4 to 8 Hours">4 to 8 hours</option>
                    <option value="Over 8 Hours">More than 8 hours</option>
                  </CustomSelect>
                </div>
              </div>
            </div>

            {/* Section 3: 照护责任与经验 */}
            <div className="form-section-card">
              <div className="section-card-title-row">
                <div className="section-title-icon-wrap">3</div>
                <h3 className="section-card-title">Care Routine & Experience</h3>
              </div>

              <div className="form-grid-2col">
                <div className="form-field">
                  <label htmlFor="primaryCaregiver">Primary Caregiver <span className="required-star">*</span></label>
                  <CustomSelect
                    id="primaryCaregiver"
                    name="primaryCaregiver"
                    value={formData.primaryCaregiver}
                    onChange={handleChange}
                    required
                    className={formData.primaryCaregiver === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="Myself">Myself</option>
                    <option value="Spouse/Partner">Spouse / Partner</option>
                    <option value="Shared Family">Shared family responsibility</option>
                    <option value="Domestic Helper">Domestic Helper (with family supervision)</option>
                  </CustomSelect>
                </div>

                <div className="form-field">
                  <label htmlFor="petExperience">Pet Care Experience <span className="required-star">*</span></label>
                  <CustomSelect
                    id="petExperience"
                    name="petExperience"
                    value={formData.petExperience}
                    onChange={handleChange}
                    required
                    className={formData.petExperience === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="First-Time">First-time pet owner (eager to learn)</option>
                    <option value="Previously Owned">Previously had pets</option>
                    <option value="Experienced Parent">Experienced pet parent</option>
                  </CustomSelect>
                </div>

                <div className="form-field full-width-col">
                  <label htmlFor="monthlyBudget">Monthly Pet Care & Medical Budget <span className="required-star">*</span></label>
                  <CustomSelect
                    id="monthlyBudget"
                    name="monthlyBudget"
                    value={formData.monthlyBudget}
                    onChange={handleChange}
                    required
                    className={formData.monthlyBudget === '' ? 'select-placeholder' : ''}
                  >
                    <option value="" disabled hidden>Please select</option>
                    <option value="$100 - $200">$100 - $200 / month</option>
                    <option value="$200 - $350">$200 - $350 / month (Recommended for quality nutrition)</option>
                    <option value="$350 - $500">$350 - $500 / month (Includes vet insurance & routine care)</option>
                    <option value="$500+">$500+ / month</option>
                  </CustomSelect>
                </div>

                <div className="form-field full-width-col">
                  <label htmlFor="motivation">
                    Why do you wish to adopt {pet.name}? <span className="required-star">*</span>
                  </label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    rows={4}
                    value={formData.motivation}
                    onChange={handleChange}
                    placeholder={`Tell ${pet.shelter} about your lifestyle, daily routine, and why you feel ${pet.name} is the right companion for your family...`}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 4: 领养声明与法律合规条款 */}
            <div className="form-section-card">
              <div className="section-card-title-row">
                <div className="section-title-icon-wrap">4</div>
                <h3 className="section-card-title">Declarations & Agreements</h3>
              </div>

              <div className="declarations-list">
                <label className="declaration-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreedAccuracy"
                    checked={formData.agreedAccuracy}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I confirm that all details provided in this application are accurate and complete.
                  </span>
                </label>

                <label className="declaration-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreedHomeVisit"
                    checked={formData.agreedHomeVisit}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I agree to an in-person or virtual pre-adoption home assessment arranged by <strong>{pet.shelter}</strong> coordinators to verify window mesh and safety.
                  </span>
                </label>

                <label className="declaration-checkbox-label">
                  <input
                    type="checkbox"
                    name="agreedCommitment"
                    checked={formData.agreedCommitment}
                    onChange={handleChange}
                    required
                  />
                  <span>
                    I commit to lifelong pet care (approx. 10-15 years), veterinary vaccinations, microchip registration with AVS, and will never abandon or mistreat this pet.
                  </span>
                </label>
              </div>
            </div>

            {/* 底部表单提交操作条 */}
            <div className="form-submit-bar">
              <button
                type="button"
                className="adopt-prefill-btn"
                onClick={handlePrefillTestData}
              >
                Auto-Fill Test Data
              </button>
              <button
                type="submit"
                className="adopt-submit-btn"
              >
                SUBMIT ADOPTION APPLICATION
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
