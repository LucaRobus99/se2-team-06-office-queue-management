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
      <div className="ticket-card">
        <p className="ticket-title">YOUR TICKET</p>

        <div className="ticket-code-container" aria-label={`Ticket ${ticketCode}`}>
          <span className="ticket-hash"># </span>
          <span className="ticket-code-text">{ticketCode}</span>
        </div>

        {serviceName && (
          <p className="ticket-service-name">{serviceName}</p>
        )}

        <hr className="ticket-info-divider" />

        {formattedTime && (
          <p className="ticket-issued-at">Issued at {formattedTime}</p>
        )}

        <p className="ticket-people-ahead">{peopleAhead} people ahead</p>
      </div>

      <button
        type="button"
        className="primary-button done-button"
        onClick={onDone}
      >
        DONE
      </button>
    </div>
  );
}

export default TicketResult;
