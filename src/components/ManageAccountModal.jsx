import { useState, useEffect } from 'react';
import eyeIcon from '../assets/eye.svg';
import eyeClosedIcon from '../assets/eye-closed.svg';
import './ManageAccountModal.css';

export default function ManageAccountModal(props) {
  if (!props.isOpen) return null;
  return <ManageAccountModalContent {...props} />;
}

function ManageAccountModalContent({
  onClose,
  user,
  onUpdateUser,
  onDeleteAccount,
  onShowToast = () => {},
}) {
  const [activeTab, setActiveTab] = useState('personal');
  const initialNameParts = (user?.name || '').trim().split(/\s+/);

  const [firstName, setFirstName] = useState(user?.firstName || initialNameParts[0] || '');
  const [lastName, setLastName] = useState(
    user?.lastName || (initialNameParts.length > 1 ? initialNameParts.slice(1).join(' ') : '')
  );
  const [email, setEmail] = useState(user?.email || '');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();
    const cleanEmail = email.trim();

    if (!cleanFirst && !cleanLast) {
      onShowToast('Please provide at least a first name or last name.', 'warning');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      onShowToast('Please enter a valid email address.', 'warning');
      return;
    }

    const fullName = `${cleanFirst} ${cleanLast}`.trim();
    if (onUpdateUser) {
      onUpdateUser({
        firstName: cleanFirst,
        lastName: cleanLast,
        name: fullName || cleanFirst,
        email: cleanEmail,
      });
    }

    onShowToast('Profile updated successfully!', 'success');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword.trim()) {
      onShowToast('Please enter your current password.', 'warning');
      return;
    }

    if (newPassword.length < 6) {
      onShowToast('New password must be at least 6 characters long.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      onShowToast('New password and confirmation do not match.', 'warning');
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem('pet_heaven_users') || '[]');
      const currentUser = JSON.parse(localStorage.getItem('pet_heaven_current_user') || '{}');

      const foundIdx = users.findIndex(
        (u) => u.email.toLowerCase() === (currentUser.email || '').toLowerCase()
      );

      if (foundIdx !== -1 && users[foundIdx].password && users[foundIdx].password !== currentPassword) {
        onShowToast('Current password does not match our records.', 'warning');
        return;
      }

      if (foundIdx !== -1) {
        users[foundIdx].password = newPassword;
        localStorage.setItem('pet_heaven_users', JSON.stringify(users));
      }
      currentUser.password = newPassword;
      localStorage.setItem('pet_heaven_current_user', JSON.stringify(currentUser));
    } catch (err) {
      console.warn('Failed to update password in storage', err);
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Password updated successfully!', 'success');
  };

  const handleDeleteAccountSubmit = () => {
    if (deleteConfirmText.trim() !== 'DELETE') return;
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    onClose();
  };

  return (
    <div
      className="manage-account-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="manage-account-title"
    >
      <div className="manage-account-dialog">

        <div className="manage-account-header">
          <h2 id="manage-account-title" className="manage-account-title">
            Manage Account
          </h2>
          <button
            type="button"
            className="manage-account-close-btn"
            onClick={onClose}
            aria-label="Close Manage Account dialog"
          >
            ✕
          </button>
        </div>

        <div className="manage-account-body">

          <aside className="manage-account-sidebar">
            <nav className="account-nav-list" aria-label="Account Settings Tabs">
              <button
                type="button"
                className={`account-nav-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <svg
                  className="account-nav-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Personal Info</span>
              </button>

              <button
                type="button"
                className={`account-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <svg
                  className="account-nav-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Security</span>
              </button>
            </nav>

            <div className="account-sidebar-footer">
              <button
                type="button"
                className={`account-delete-nav-btn ${activeTab === 'delete' ? 'active' : ''}`}
                onClick={() => setActiveTab('delete')}
              >
                <svg
                  className="account-nav-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Delete Account</span>
              </button>
            </div>
          </aside>

          <main className="manage-account-content">

            {activeTab === 'personal' && (
              <div className="account-tab-pane">
                <h3 className="account-content-heading">Update your profile</h3>
                <form onSubmit={handleSavePersonalInfo} className="account-form">
                  <div className="account-form-row two-cols">
                    <div className="account-form-group">
                      <label htmlFor="account-first-name" className="account-form-label">
                        First Name
                      </label>
                      <input
                        id="account-first-name"
                        type="text"
                        className="account-form-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First name"
                        autoComplete="given-name"
                      />
                    </div>
                    <div className="account-form-group">
                      <label htmlFor="account-last-name" className="account-form-label">
                        Last Name
                      </label>
                      <input
                        id="account-last-name"
                        type="text"
                        className="account-form-input"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last name"
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="account-form-group">
                    <label htmlFor="account-email" className="account-form-label">
                      Email Address
                    </label>
                    <input
                      id="account-email"
                      type="email"
                      className="account-form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </div>

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="account-tab-pane">
                <h3 className="account-content-heading">Change your password</h3>
                <form onSubmit={handleUpdatePassword} className="account-form">
                  <div className="account-form-group">
                    <label htmlFor="account-curr-pass" className="account-form-label">
                      Current Password
                    </label>
                    <div className="password-input-wrap">
                      <input
                        id="account-curr-pass"
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="account-form-input with-toggle"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? 'Hide password' : 'Show password'}
                      >
                        <img
                          src={showCurrentPassword ? eyeIcon : eyeClosedIcon}
                          alt=""
                          className="password-eye-icon"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="account-form-group">
                    <label htmlFor="account-new-pass" className="account-form-label">
                      New Password
                    </label>
                    <div className="password-input-wrap">
                      <input
                        id="account-new-pass"
                        type={showNewPassword ? 'text' : 'password'}
                        className="account-form-input with-toggle"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        <img
                          src={showNewPassword ? eyeIcon : eyeClosedIcon}
                          alt=""
                          className="password-eye-icon"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="account-form-group">
                    <label htmlFor="account-confirm-pass" className="account-form-label">
                      Confirm New Password
                    </label>
                    <div className="password-input-wrap">
                      <input
                        id="account-confirm-pass"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="account-form-input with-toggle"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        <img
                          src={showConfirmPassword ? eyeIcon : eyeClosedIcon}
                          alt=""
                          className="password-eye-icon"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>

                  <div className="account-form-actions">
                    <button type="submit" className="account-primary-btn">
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'delete' && (
              <div className="account-tab-pane">
                <h3 className="account-content-heading is-danger">Delete Account</h3>

                <div className="account-delete-box">
                  <div className="account-delete-box-header">
                    <svg
                      className="account-delete-alert-icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <strong className="account-delete-box-title">
                      Warning: This action is permanent and cannot be undone
                    </strong>
                  </div>
                  <p className="account-delete-box-desc">
                    Deleting your account will permanently erase your profile,{' '}
                    <strong>all active applications, and past adoption history</strong>. You will lose access
                    to all saved applications, inquiry records, and member privileges. Please ensure all ongoing
                    adoption matters have been completed before proceeding.
                  </p>
                </div>

                <div className="account-delete-confirm-section">
                  <p className="account-delete-confirm-label">
                    To confirm deletion, please type <span className="account-delete-badge">DELETE</span> below:
                  </p>
                  <input
                    type="text"
                    className="account-form-input account-delete-input"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                  />
                  <div className="account-form-actions">
                    <button
                      type="button"
                      className="account-delete-btn"
                      disabled={deleteConfirmText !== 'DELETE'}
                      onClick={handleDeleteAccountSubmit}
                    >
                      Permanently Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
