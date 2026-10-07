import { Link } from 'react-router';

function RoleSelectionPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Office Queue Management</h1>

        <p className="subtitle">
          Select your role
        </p>

        <div className="role-list">
          <Link className="role-button" to="/customer">
            Customer
          </Link>

          <Link className="role-button" to="/officer">
            Officer
          </Link>

          <Link className="role-button" to="/manager">
            Manager
          </Link>

          <Link className="role-button" to="/admin">
            Administrator
          </Link>

          <Link className="role-button secondary" to="/display">
            Open Public Display
          </Link>
        </div>
      </section>
    </main>
  );
}

export default RoleSelectionPage;