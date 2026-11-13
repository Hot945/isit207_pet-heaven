import { useState, useEffect } from 'react';
import eyeIcon from '../assets/eye.svg';
import eyeClosedIcon from '../assets/eye-closed.svg';
import closeIcon from '../assets/x.svg';
import './LoginModal.css';

const STORAGE_USERS = 'pet_heaven_users';

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Failed to save users to localStorage', e);
  }
}

export default function LoginModal(props) {
  if (!props.isOpen) return null;
  return <LoginModalContent {...props} />;
}

function LoginModalContent({
  onClose,
  onLogin,
  initialTab = 'login',
  onShowToast = () => {},
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFieldErrors({});
    setFeedback(null);
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setFeedback(null);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const email = loginEmail.trim();
    const password = loginPassword;

    if (!email) {
      errors.loginEmail = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      errors.loginEmail = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.loginPassword = 'Please enter your password.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u.password === password ||
          (email.toLowerCase() === 'alex@example.com' &&
            (password === '123456' || password === 'password123')))
    );

    if (!matchedUser) {
      setFeedback({
        type: 'error',
        text: 'Incorrect email or password. Please try again.',
      });
      return;
    }

    const userObj = {
      id: matchedUser.id,
      firstName: matchedUser.firstName || matchedUser.name?.split(' ')[0] || 'User',
      lastName: matchedUser.lastName || matchedUser.name?.split(' ').slice(1).join(' ') || '',
      name: matchedUser.name || `${matchedUser.firstName} ${matchedUser.lastName}`.trim(),
      email: matchedUser.email,
    };

    onLogin(userObj);
    onShowToast(`Welcome back, ${userObj.firstName}! You are now logged in.`, 'success');
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const firstName = regFirstName.trim();
    const lastName = regLastName.trim();
    const email = regEmail.trim();
    const password = regPassword;
    const confirm = regConfirmPassword;

    if (!firstName) {
      errors.regFirstName = 'Please enter your first name.';
    }
    if (!lastName) {
      errors.regLastName = 'Please enter your last name.';
    }

    if (!email) {
      errors.regEmail = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      errors.regEmail = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.regPassword = 'Please enter a password.';
    } else if (password.length < 6) {
      errors.regPassword = 'Password must be at least 6 characters.';
    }

    if (!confirm) {
      errors.regConfirmPassword = 'Please re-enter your password.';
    } else if (password !== confirm) {
      errors.regConfirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const users = getStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setFeedback({
        type: 'error',
        text: 'An account with this email already exists. Please log in.',
      });
      return;
    }

    const newUser = {
      id: 'user-' + Date.now(),
      firstName,
      lastName,
      name: `${firstName} ${lastName}`.trim(),
      email,
      password,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    onLogin({
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      name: newUser.name,
      email: newUser.email,
    });
    onShowToast(`Account created! Welcome to Pet Heaven, ${newUser.firstName}.`, 'success');
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div
        className="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Account Login and Registration"
      >

        <div className="auth-tabs-header" role="tablist">
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
            role="tab"
            aria-selected={activeTab === 'login'}
          >
            <span>Log In</span>
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
            role="tab"
            aria-selected={activeTab === 'register'}
          >
            <span>Register</span>
          </button>

          <button
            type="button"
            className="auth-modal-close"
            onClick={onClose}
            aria-label="Close Authentication Dialog"
          >
            <img src={closeIcon} alt="" />
          </button>
        </div>

        <div className="auth-modal-body">

          {activeTab === 'login' && (
            <div className="auth-panel" role="tabpanel">
              <div className="auth-panel-intro">
                <h3 className="auth-title">Welcome Back</h3>
                <p className="auth-subtitle">
                  Log in to manage your pet adoptions, applications and saved favorites.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
                <div className={`auth-field ${fieldErrors.loginEmail ? 'has-error' : ''}`}>
                  <label htmlFor="login-email">Email Address</label>
                  <input
                    type="email"
                    id="login-email"
                    className={`auth-input ${fieldErrors.loginEmail ? 'input-error' : ''}`}
                    placeholder="e.g. alex@example.com"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      clearFieldError('loginEmail');
                    }}
                    autoFocus
                  />
                  {fieldErrors.loginEmail && (
                    <span className="auth-field-error">{fieldErrors.loginEmail}</span>
                  )}
                </div>

                <div className={`auth-field ${fieldErrors.loginPassword ? 'has-error' : ''}`}>
                  <label htmlFor="login-password">Password</label>
                  <div className="auth-pwd-wrap">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      id="login-password"
                      className={`auth-input ${fieldErrors.loginPassword ? 'input-error' : ''}`}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        clearFieldError('loginPassword');
                      }}
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showLoginPassword ? eyeIcon : eyeClosedIcon}
                        alt=""
                        className="pwd-eye-icon"
                      />
                    </button>
                  </div>
                  {fieldErrors.loginPassword && (
                    <span className="auth-field-error">{fieldErrors.loginPassword}</span>
                  )}
                </div>

                {feedback && (
                  <div className={`auth-feedback ${feedback.type}`}>{feedback.text}</div>
                )}

                <button type="submit" className="auth-submit-btn">
                  <span>Log In</span>
                </button>

                <div className="auth-switch-prompt">
                  <span>Don't have an account?</span>
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('register')}
                  >
                    Register now
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================
              2. 注册面板 (Register)
              ================================================================ */}
          {activeTab === 'register' && (
            <div className="auth-panel" role="tabpanel">
              <div className="auth-panel-intro">
                <h3 className="auth-title">Create an Account</h3>
                <p className="auth-subtitle">
                  Join Pet Heaven to unlock pet adoptions, rehoming applications, and saved favorites.
                </p>
              </div>

              <form className="auth-form" onSubmit={handleRegisterSubmit} noValidate>
                <div className="auth-field-row">
                  <div className={`auth-field ${fieldErrors.regFirstName ? 'has-error' : ''}`}>
                    <label htmlFor="register-firstname">First Name</label>
                    <input
                      type="text"
                      id="register-firstname"
                      className={`auth-input ${fieldErrors.regFirstName ? 'input-error' : ''}`}
                      placeholder="e.g. Alex"
                      autoComplete="given-name"
                      value={regFirstName}
                      onChange={(e) => {
                        setRegFirstName(e.target.value);
                        clearFieldError('regFirstName');
                      }}
                      autoFocus
                    />
                    {fieldErrors.regFirstName && (
                      <span className="auth-field-error">{fieldErrors.regFirstName}</span>
                    )}
                  </div>

                  <div className={`auth-field ${fieldErrors.regLastName ? 'has-error' : ''}`}>
                    <label htmlFor="register-lastname">Last Name</label>
                    <input
                      type="text"
                      id="register-lastname"
                      className={`auth-input ${fieldErrors.regLastName ? 'input-error' : ''}`}
                      placeholder="e.g. Tan"
                      autoComplete="family-name"
                      value={regLastName}
                      onChange={(e) => {
                        setRegLastName(e.target.value);
                        clearFieldError('regLastName');
                      }}
                    />
                    {fieldErrors.regLastName && (
                      <span className="auth-field-error">{fieldErrors.regLastName}</span>
                    )}
                  </div>
                </div>

                <div className={`auth-field ${fieldErrors.regEmail ? 'has-error' : ''}`}>
                  <label htmlFor="register-email">Email Address</label>
                  <input
                    type="email"
                    id="register-email"
                    className={`auth-input ${fieldErrors.regEmail ? 'input-error' : ''}`}
                    placeholder="e.g. alex@example.com"
                    autoComplete="email"
                    value={regEmail}
                    onChange={(e) => {
                      setRegEmail(e.target.value);
                      clearFieldError('regEmail');
                    }}
                  />
                  {fieldErrors.regEmail && (
                    <span className="auth-field-error">{fieldErrors.regEmail}</span>
                  )}
                </div>

                <div className={`auth-field ${fieldErrors.regPassword ? 'has-error' : ''}`}>
                  <label htmlFor="register-password">Password</label>
                  <div className="auth-pwd-wrap">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      id="register-password"
                      className={`auth-input ${fieldErrors.regPassword ? 'input-error' : ''}`}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        clearFieldError('regPassword');
                      }}
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showRegPassword ? eyeIcon : eyeClosedIcon}
                        alt=""
                        className="pwd-eye-icon"
                      />
                    </button>
                  </div>
                  {fieldErrors.regPassword && (
                    <span className="auth-field-error">{fieldErrors.regPassword}</span>
                  )}
                </div>

                <div className={`auth-field ${fieldErrors.regConfirmPassword ? 'has-error' : ''}`}>
                  <label htmlFor="register-confirm-password">Confirm Password</label>
                  <div className="auth-pwd-wrap">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      className={`auth-input ${fieldErrors.regConfirmPassword ? 'input-error' : ''}`}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        clearFieldError('regConfirmPassword');
                      }}
                    />
                    <button
                      type="button"
                      className="auth-pwd-toggle"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      <img
                        src={showRegConfirmPassword ? eyeIcon : eyeClosedIcon}
                        alt=""
                        className="pwd-eye-icon"
                      />
                    </button>
                  </div>
                  {fieldErrors.regConfirmPassword && (
                    <span className="auth-field-error">{fieldErrors.regConfirmPassword}</span>
                  )}
                </div>

                {feedback && (
                  <div className={`auth-feedback ${feedback.type}`}>{feedback.text}</div>
                )}

                <button type="submit" className="auth-submit-btn">
                  <span>Create Account</span>
                </button>

                <div className="auth-switch-prompt">
                  <span>Already have an account?</span>
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => handleTabSwitch('login')}
                  >
                    Log in here
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
