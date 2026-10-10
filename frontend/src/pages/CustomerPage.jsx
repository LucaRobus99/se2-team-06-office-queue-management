import { useState } from 'react';
import { Link } from 'react-router';

import ServiceSelector from '../components/ServiceSelector.jsx';
import TicketResult from '../components/TicketResult.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import UiIcon from '../components/UiIcon.jsx';

/** The customer flow is unchanged: choose a service, then display the issued ticket. */
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
    <main className="app-shell app-shell--customer">
      <div className="app-frame">
        <SiteHeader />
        <div className="customer-content">
          {step === STEP.SELECTING_SERVICE && (
            <div className="customer-intro">
              <Link className="back-link" to="/">
                <UiIcon name="arrowLeft" size={19} />
                Back to role selection
              </Link>
              <h1 className="customer-page-label">Customer Area</h1>
              <h2>Get a ticket</h2>
              <ServiceSelector onTicketIssued={handleTicketIssued} />
            </div>
          )}

          {step === STEP.TICKET_ISSUED && (
            <div className="customer-ticket-view">
              <h1 className="customer-page-label">Customer Area</h1>
              <TicketResult
                ticket={ticket}
                service={service}
                onDone={handleNewTicket}
              />
              <Link className="back-link back-link--ticket" to="/">
                <UiIcon name="arrowLeft" size={19} />
                Back to role selection
              </Link>
            </div>
          )}
        </div>
        <footer className="app-footer app-footer--compact">
          <UiIcon name="info" size={18} />
          <span>Office Queue Management <span className="footer-separator">·</span> We're here to help</span>
        </footer>
      </div>
    </main>
  );
}

export default CustomerPage;
