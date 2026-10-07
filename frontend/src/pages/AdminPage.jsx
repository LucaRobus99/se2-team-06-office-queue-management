import { Link } from 'react-router';

function AdminPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Administrator Area</h1>

        <p>
          Administrator functionalities will be implemented in future sprints.
        </p>

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default AdminPage;