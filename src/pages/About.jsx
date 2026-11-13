import { useState } from 'react';
import './About.css';
import aboutHeroImg from '../assets/bg/pexels-zen-chung-5748790.jpg';
import storyGarageImg from '../assets/bg/pexels-giovanni-spoletini-311699-27689913.jpg';
import principleImg1 from '../assets/bg/pexels-goochie-poochie-19145898.jpg';
import principleImg2 from '../assets/bg/pexels-dcc-pets-1225360955-22504402.jpg';
import principleImg3 from '../assets/bg/pexels-gustavo-fring-6816851.jpg';
import principleImg4 from '../assets/bg/pexels-shivang-kushwaha-801525826-40249947.jpg';
import CustomSelect from '../components/CustomSelect';
import GoogleMapCanvas from '../components/GoogleMapCanvas';

const SANCTUARY_ADDRESS = '50 Sungei Tengah Road, Singapore 699012';

function About() {
  const values = [
    {
      id: 1,
      title: 'No-Kill & Compassionate Care',
      desc: 'We believe every life is precious. Animals in our sanctuary stay with us, receiving ongoing behavioral and veterinary care for as long as it takes to find their forever family.',
      image: principleImg1,
      alt: 'Compassionate pet grooming and care at Pet Heaven',
    },
    {
      id: 2,
      title: '3-3-3 Scientific Decompression',
      desc: 'Transitioning from shelter to home takes time. We educate every adopter on decompression science — first 3 days, 3 weeks, and 3 months — ensuring lasting adoption success.',
      image: principleImg2,
      alt: 'Veterinary team and adopter practicing gentle animal socialization',
    },
    {
      id: 3,
      title: '100% Medical Transparency',
      desc: 'No hidden diagnoses. Every rescue receives comprehensive wellness exams, spay/neuter surgery, core vaccinations, microchipping, and complete veterinary disclosure.',
      image: principleImg3,
      alt: 'Veterinarian providing gentle clinical care to a rescue cat',
    },
    {
      id: 4,
      title: 'Community & Foster Network',
      desc: 'Our work extends far beyond our shelter doors. Through dedicated foster heroes and youth outreach, we cultivate a culture of animal welfare across the region.',
      image: principleImg4,
      alt: 'Two playful shelter puppies looking forward to adoption day',
    },
  ];

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.subject || !formData.message) return;
    setFormSubmitted(true);
  };

  return (
    <main className="about-page">

      <section className="about-hero-section">
        <div className="about-container">
          <div className="about-bark-hero-grid">

            <div className="about-bark-card">
              <h1 className="about-bark-title">About</h1>
              <p className="about-bark-text">
                At Pet Heaven, our mission is simple—make all rescue pets happy, healthy, and loved. That's why we're proud to champion zero-euthanasia, compassionate medical rehabilitation, and lifelong matching for every dog and cat that walks through our doors.
              </p>
            </div>

            <div className="about-bark-media">
              <img
                src={aboutHeroImg}
                alt="Cozy pet adoption moments at Pet Heaven sanctuary"
                className="about-bark-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="about-container">

          <div className="about-story-top-header">
            <h2 className="about-story-main-title">How It Began</h2>
          </div>

          <div className="about-story-card">

            <div className="about-story-media-pane">
              <img
                src={storyGarageImg}
                alt="The rented garage where Pet Heaven rescue work began in 2018"
                className="about-story-img"
              />
            </div>

            <div className="about-story-content-pane">
              <h3 className="about-story-headline">
                From a Humble Garage to a Community Sanctuary
              </h3>
              <p className="about-story-lead">
                In 2018, Pet Heaven began with three volunteer animal lovers and a rented garage, rescuing dogs and cats facing euthanasia in overcrowded regional shelters. We witnessed firsthand how fear, illness, and lack of decompression time prevented extraordinary pets from finding the homes they deserved.
              </p>
              <p className="about-story-desc">
                Today, Pet Heaven has expanded into a purpose-built adoption center featuring free-roam cat lounges, outdoor dog play yards, and an on-site veterinary suite. While our facility has grown, our core promise remains unchanged: every animal in our care is family until they find their own.
              </p>
              <div className="about-story-handwriting-note">
                <p className="handwriting-text">
                  “Every big rescue mission starts with a single open door. For us, that door was a humble neighborhood garage.”
                </p>
                <span className="handwriting-signature">— Founders' Journal, 2018</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 我们的四大核心价值观（以中轴为基准、占满屏幕的 50/50 左右交替棋盘布局） */}
      <section className="about-values-fullscreen-section">
        <div className="about-container">
          <div className="about-principles-header">
            <h2 className="about-principles-title">Our Guiding Principles</h2>
          </div>
        </div>

        {/* 占满屏幕：以 50% 中轴为基准左右交替 */}
        <div className="principles-fullscreen-grid">
          {values.map((v, idx) => {
            const isEven = idx % 2 === 1; // 0,2: 文在左图在右; 1,3: 图在左文在右
            const bgClass = isEven ? 'bg-mint' : 'bg-white';

            const textPane = (
              <div className={`principle-fullscreen-text-pane ${bgClass}`}>
                <div className="principle-text-inner">
                  <h3 className="principle-fullscreen-title">{v.title}</h3>
                  <p className="principle-fullscreen-desc">{v.desc}</p>
                </div>
              </div>
            );

            const mediaPane = (
              <div className="principle-fullscreen-media-pane">
                <img
                  src={v.image}
                  alt={v.alt}
                  className="principle-fullscreen-img"
                />
              </div>
            );

            return (
              <div
                key={v.id}
                className={`principles-fullscreen-row ${isEven ? 'row-reversed' : 'row-normal'}`}
              >
                {isEven ? (
                  <>
                    {mediaPane}
                    {textPane}
                  </>
                ) : (
                  <>
                    {textPane}
                    {mediaPane}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 联系我们（Contact Us 专属板块） */}
      <section className="about-contact-section" id="contact-us">
        <div className="about-container">
          <div className="about-contact-header">
            <h2 className="about-contact-title">Contact Us</h2>
          </div>

          <div className="about-contact-grid">
            {/* 左侧：详细联系方式与探访指南 */}
            <div className="about-contact-info-card">
              <div className="contact-info-header">
                <h3 className="contact-info-heading">Get in Touch</h3>
                <p className="contact-info-subtext">
                  Have questions about pet adoption or want to visit us in Singapore? Reach out to us anytime.
                </p>
              </div>

              <div className="contact-info-body">
                <div className="contact-detail-list">
                  <div className="contact-detail-item">
                    <div className="contact-icon-bubble">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="contact-detail-text">
                      <span className="contact-detail-label">Address</span>
                      <span className="contact-detail-value">50 Sungei Tengah Road, Singapore 699012</span>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-bubble">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="contact-detail-text">
                      <span className="contact-detail-label">Hours</span>
                      <span className="contact-detail-value">Monday – Sunday: 10:00 AM – 6:00 PM</span>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-bubble">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </div>
                    <div className="contact-detail-text">
                      <span className="contact-detail-label">Phone</span>
                      <a href="tel:+6565550199" className="contact-detail-value contact-detail-link">
                        +65 6555 0199
                      </a>
                    </div>
                  </div>

                  <div className="contact-detail-item">
                    <div className="contact-icon-bubble">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </div>
                    <div className="contact-detail-text">
                      <span className="contact-detail-label">Email</span>
                      <a href="mailto:support@petheaven.sg" className="contact-detail-value contact-detail-link">
                        support@petheaven.sg
                      </a>
                    </div>
                  </div>
                </div>

                {/* Google Maps JavaScript API 实时交互地图 */}
                <div className="contact-map-embed-wrap">
                  <GoogleMapCanvas
                    address={SANCTUARY_ADDRESS}
                    title="Pet Heaven Singapore Sanctuary"
                  />
                </div>
              </div>
            </div>

            {/* 右侧：在线留言与咨询表单 */}
            <div className="about-contact-form-card">
              <div className="contact-form-stack">
                <form
                  className={`contact-form ${formSubmitted ? 'is-submitted-hidden' : ''}`}
                  onSubmit={handleFormSubmit}
                  aria-hidden={formSubmitted}
                  inert={formSubmitted ? '' : undefined}
                >
                  <div className="contact-form-header">
                    <h3 className="contact-form-heading">Send Us a Message</h3>
                    <p className="contact-form-subtext">
                      Fill out the form below and our adoption team will get back to you within 24 hours.
                    </p>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="contact-first-name">First Name</label>
                      <input
                        id="contact-first-name"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name"
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label htmlFor="contact-last-name">Last Name</label>
                      <input
                        id="contact-last-name"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email">Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-subject">Subject</label>
                    <CustomSelect
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={!formData.subject ? 'is-placeholder' : ''}
                      required
                    >
                      <option value="" disabled hidden>Please select</option>
                      <option value="Adoption Inquiry">Adoption Inquiry</option>
                      <option value="Foster Care Program">Foster Care Program</option>
                      <option value="Shelter Volunteering">Shelter Volunteering</option>
                      <option value="Donations & Supplies">Donations & Supplies</option>
                      <option value="Other Questions">Other Questions</option>
                    </CustomSelect>
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="contact-submit-btn">
                    Send Message
                  </button>
                </form>

                {formSubmitted && (
                  <div className="contact-form-success">
                    <div className="form-success-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <h4 className="form-success-title">Message Sent!</h4>
                    <p className="form-success-desc">
                      Thank you, {formData.firstName || 'friend'}! We’ve received your message and will reply within 24 hours.
                    </p>
                    <button
                      type="button"
                      className="form-reset-btn"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
                      }}
                    >
                      Send Another Message
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
