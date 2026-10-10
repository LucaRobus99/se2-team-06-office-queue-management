import { Link } from 'react-router';
import UiIcon from './UiIcon.jsx';

const today = new Date().toLocaleDateString('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

/** Shared visual header. Does not affect navigation or application state. */
export default function SiteHeader({ home = false }) {
  return (
    <header className="site-header">
      {home ? (
        <div className="site-brand">
          <span className="brand-mark"><UiIcon name="building" size={26} /></span>
          <h1>Office Queue Management</h1>
        </div>
      ) : (
        <Link className="site-brand" to="/" aria-label="Office Queue Management home">
          <span className="brand-mark"><UiIcon name="building" size={26} /></span>
          <span className="site-brand-name">Office Queue Management</span>
        </Link>
      )}
      <div className="site-header-date" aria-label={`Today's date: ${today}`}>
        <UiIcon name="clock" size={20} />
        <span>{today}</span>
      </div>
    </header>
  );
}
