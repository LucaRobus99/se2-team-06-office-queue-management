import { useState } from 'react';
import { Link } from 'react-router';

import ServiceSelector from '../components/ServiceSelector.jsx';

/**
 * Customer flow:
 *  1. SELECTING_SERVICE → the customer picks a service and requests a ticket
 *  2. TICKET_ISSUED     → the issued ticket (number + issue time) is shown
 */
const STEP = {
  SELECTING_SERVICE: 'SELECTING_SERVICE',
  TICKET_ISSUED: 'TICKET_ISSUED',
};

function CustomerPage() {
  const [step, setStep] = useState(STEP.SELECTING_SERVICE);
  const [ticket, setTicket] = useState(null);
  const [service, setService] = useState(null);

  const handleTicketIssued = (issuedTicket, selectedService) => {
    setTicket(issuedTicket);
    setService(selectedService);
    setStep(STEP.TICKET_ISSUED);
  };

  const handleNewTicket = () => {
    setTicket(null);
    setService(null);
    setStep(STEP.SELECTING_SERVICE);
  };

  return (
    <main className="page-container">
      <section className="card">
        <h1>Customer Area</h1>

        {step === STEP.SELECTING_SERVICE && (
          <ServiceSelector onTicketIssued={handleTicketIssued} />
        )}

        {step === STEP.TICKET_ISSUED && (
          // TODO: replace with the TicketInfo component (ticket number + issue time)
          <div>
            <p>TODO: replace with the TicketInfo component (ticket number + issue time)</p>
          </div>
        )}

        <Link className="back-link" to="/">
          Back to role selection
        </Link>
      </section>
    </main>
  );
}

export default CustomerPage;
