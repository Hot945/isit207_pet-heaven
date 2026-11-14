import fbIcon from '../assets/logos/facebook-svgrepo-com.svg';
import instaIcon from '../assets/logos/instagram-svgrepo-com.svg';
import ytbIcon from '../assets/logos/youtube-svgrepo-com.svg';
import pinterestIcon from '../assets/logos/pinterest-svgrepo-com.svg';
import BrandLogo from './BrandLogo';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">

        <div className="footer-main-row">
          <a href="#" className="footer-logo">
            <BrandLogo size={27} variant="white" className="footer-brand-logo" />
            <span className="footer-logo-text">et Heaven</span>
          </a>

          <div className="footer-social-links">

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Facebook"
            >
              <img src={fbIcon} alt="Facebook" className="social-icon-img" />
            </a>

            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Instagram"
            >
              <img src={instaIcon} alt="Instagram" className="social-icon-img" />
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="YouTube"
            >
              <img src={ytbIcon} alt="YouTube" className="social-icon-img" />
            </a>

            <a
              href="https://www.pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-btn"
              aria-label="Pinterest"
            >
              <img src={pinterestIcon} alt="Pinterest" className="social-icon-img" />
            </a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Pet Heaven. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <span className="footer-legal-item">Privacy Policy</span>
            <span className="footer-divider">•</span>
            <span className="footer-legal-item">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
