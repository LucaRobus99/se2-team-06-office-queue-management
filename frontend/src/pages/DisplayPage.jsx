import { Link } from 'react-router';

function DisplayPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Public Display</h1>

        <p>
          Public display functionalities will be implemented in future sprints.
        </p>

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default DisplayPage;