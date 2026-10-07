import { Link } from 'react-router';

function CustomerPage() {
  return (
    <main className="page-container">
      <section className="card">
        <h1>Customer Area</h1>

        <p>
          Service selection and ticket issuing will be implemented here.
        </p>

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default CustomerPage;