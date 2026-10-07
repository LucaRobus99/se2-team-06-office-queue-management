import { Link } from 'react-router';

function NotFoundPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>404 - Page Not Found</h1>

        <p>
          The requested page does not exist.
        </p>

        <Link className="back-link" to="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;