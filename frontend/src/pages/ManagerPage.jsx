import { Link } from 'react-router';

function ManagerPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Manager Area</h1>

        <p>
          Manager functionalities will be implemented in future sprints.
        </p>

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default ManagerPage;