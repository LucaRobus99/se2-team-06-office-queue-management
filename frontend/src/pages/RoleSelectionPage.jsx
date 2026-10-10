import { Link } from 'react-router';
import SiteHeader from '../components/SiteHeader.jsx';
import UiIcon from '../components/UiIcon.jsx';
import HomeRoleIcon from '../components/HomeRoleIcon.jsx';
import officeScene from '../assets/waiting-room-home.webp';

const roles = [
  { label: 'Customer', description: 'Get a ticket and wait your turn', path: '/customer', icon: 'customer', tone: 'blue' },
  { label: 'Officer', description: 'Manage the queue at your counter', path: '/officer', icon: 'officer', tone: 'green' },
  { label: 'Open Public Display', title: 'Public Display', description: 'See the current calls and queue', path: '/display', icon: 'display', tone: 'amber' },
  { label: 'Manager', description: 'View service and queue statistics', path: '/manager', icon: 'manager', tone: 'rose' },
  { label: 'Administrator', description: 'Manage services and system settings', path: '/admin', icon: 'admin', tone: 'purple', wide: true },
];

function RoleSelectionPage() {
  return (
    <main className="app-shell app-shell--home">
      <div className="app-frame">
        <SiteHeader home />
        <div className="welcome-hero">
          <img className="welcome-illustration" src={officeScene} alt="" />
          <div className="welcome-intro">
            <span className="eyebrow">YOUR VISIT, MADE SIMPLE</span>
            <h2>Welcome!</h2>
            <p>Select your role to continue</p>
          </div>
        </div>
        <section className="role-section" aria-label="Choose your role">
          <div className="role-list">
            {roles.map((role) => (
              <Link
                key={role.path}
                className={`role-button role-button--${role.tone}${role.wide ? ' role-button--wide' : ''}`}
                to={role.path}
                aria-label={role.label}
              >
                <span className="role-icon"><HomeRoleIcon name={role.icon} /></span>
                <span className="role-content">
                  <span className="role-title">{role.title ?? role.label}</span>
                  <span className="role-description">{role.description}</span>
                </span>
                <span className="role-arrow"><UiIcon name="chevron" size={21} /></span>
              </Link>
            ))}
          </div>
        </section>
        <footer className="app-footer">
          <UiIcon name="info" size={18} />
          <span>Office Queue Management <span className="footer-separator">·</span> A simpler way to manage your visit</span>
        </footer>
      </div>
    </main>
  );
}

export default RoleSelectionPage;
