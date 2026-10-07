import { Link } from 'react-router';

function OfficerPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Officer Area</h1>

        <p>
          Officer functionalities will be implemented in future sprints.
        </p>

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default OfficerPage;