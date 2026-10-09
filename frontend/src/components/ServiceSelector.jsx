import { useEffect, useState } from 'react';

import { getServices, requestTicket } from '../api/api.js';

function ServiceSelector({ onTicketIssued }) {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [loadingServices, setLoadingServices] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    getServices()
      .then((data) => {
        if (!ignore) setServices(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoadingServices(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleGetTicket = async () => {
    if (selectedServiceId === null) return;

    setRequesting(true);
    setError(null);

    try {
      const ticket = await requestTicket(selectedServiceId);
      const service = services.find((s) => s.code === selectedServiceId);
      onTicketIssued(ticket, service);
    } catch (err) {
      setError(err.message);
    } finally {
      setRequesting(false);
    }
  };

  if (loadingServices) {
    return <p className="status-message">Loading services…</p>;
  }

  return (
    <div className="service-selector">
      <p className="subtitle">Select the service you need</p>

      {!services.some((service) => service.active) && !error && (
        <p className="status-message">No services are available at the moment.</p>
      )}

      <div className="service-list" role="radiogroup" aria-label="Available services">
        {services.map((service) => {
          const selected = service.code === selectedServiceId;
          const active = Boolean(service.active);

          return (
            <button
              key={service.code}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`service-card${selected ? ' selected' : ''}${active ? '' : ' inactive'}`}
              onClick={() => setSelectedServiceId(service.code)}
              disabled={!active || requesting}
              title={active ? undefined : 'This service is currently unavailable'}
            >
              <span className="service-code">{service.code}</span>
              <span className="service-name">{service.name}</span>
              {!active && <span className="service-badge">Unavailable</span>}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className="primary-button"
        onClick={handleGetTicket}
        disabled={selectedServiceId === null || requesting}
      >
        {requesting ? 'Getting your ticket…' : 'Get ticket'}
      </button>
    </div>
  );
}

export default ServiceSelector;
