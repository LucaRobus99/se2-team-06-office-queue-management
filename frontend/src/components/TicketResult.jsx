import UiIcon from './UiIcon.jsx';

function formatTicketCode(id) {
  return `T-${String(id).padStart(6, '0')}`;
}

function formatTime(isoString) {
  if (!isoString) return '';
  if (typeof isoString === 'string' && /^\d{1,2}:\d{2}$/.test(isoString.trim())) {
    return isoString.trim();
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return String(isoString);
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function TicketResult({ ticket, service, onDone }) {
  if (!ticket) return null;

  const ticketCode =
    ticket.ticketCode ||
    (ticket.id !== undefined && ticket.id !== null ? formatTicketCode(ticket.id) : '');
  const serviceName = ticket.serviceName || service?.name || '';
  const formattedTime = formatTime(ticket.issuedAt || ticket.issued_at);
  const peopleAhead = ticket.peopleAhead ?? 0;

  return (
    <div className="ticket-result" data-testid="ticket-result">
      <div className="ticket-success-celebration" aria-hidden="true">
        <div className="ticket-success-icon"><UiIcon name="check" size={43} strokeWidth={3.1} /></div>
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
        <span className="ticket-confetti" />
      </div>
      <h2>Your ticket has been issued!</h2>
      <p className="ticket-success-subtitle">Please wait for your turn</p>

      <div className="ticket-card">
        <p className="ticket-title">YOUR TICKET</p>

        <div className="ticket-code-container" aria-label={`Ticket ${ticketCode}`}>
          <span className="ticket-code-text">{ticketCode}</span>
        </div>

        <hr className="ticket-info-divider" />

        {serviceName && (
          <div className="ticket-detail-row">
            <span className="ticket-detail-icon ticket-detail-icon--blue"><UiIcon name="package" size={22} /></span>
            <span className="ticket-detail-copy">
              <span className="ticket-detail-label">Service</span>
              <span className="ticket-service-name">{serviceName}</span>
            </span>
          </div>
        )}

        {formattedTime && (
          <div className="ticket-detail-row">
            <span className="ticket-detail-icon"><UiIcon name="clock" size={22} /></span>
            <span className="ticket-detail-copy">
              <span className="ticket-detail-label">Issue time</span>
              <span className="ticket-issued-at">Issued at {formattedTime}</span>
            </span>
          </div>
        )}

        <div className="ticket-detail-row">
          <span className="ticket-detail-icon"><UiIcon name="customer" size={22} /></span>
          <span className="ticket-detail-copy">
            <span className="ticket-detail-label">Waiting queue</span>
            <span className="ticket-people-ahead">{peopleAhead} people ahead</span>
          </span>
        </div>
      </div>

      <p className="ticket-hint"><UiIcon name="info" size={19} /> Keep your ticket until your turn is called.</p>
      <button
        type="button"
        className="primary-button done-button"
        onClick={onDone}
      >
        <UiIcon name="check" size={19} />
        DONE
      </button>
      <p className="ticket-done-caption">Done takes you back to service selection</p>
    </div>
  );
}

export default TicketResult;
