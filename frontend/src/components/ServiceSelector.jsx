import { useEffect, useState } from 'react';
import { getServices, requestTicket } from '../api/api.js';
import UiIcon from './UiIcon.jsx';
import ServiceIllustration from './ServiceIllustration.jsx';

// Visual labels only: the service name, code and availability always come from the API.
const serviceAppearance = {
  SHIP: { icon: 'package', description: 'Send and collect packages', tone: 'blue' },
  PAY: { icon: 'card', description: 'Payments and fees', tone: 'green' },
  INFO: { icon: 'info', description: 'General information and support', tone: 'purple' },
  EXTRA: { icon: 'file', description: 'Other available services', tone: 'gray' },
};

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
      <div className="service-section-heading">
        <p className="subtitle">Select the service you need</p>
      </div>

      {!services.some((service) => service.active) && !error && (
        <p className="status-message">No services are available at the moment.</p>
      )}

      <div className="service-list" role="radiogroup" aria-label="Available services">
        {services.map((service) => {
          const selected = service.code === selectedServiceId;
          const active = Boolean(service.active);
          const appearance = serviceAppearance[service.code] ?? {
            icon: 'file', description: 'Office service', tone: 'blue',
          };

          return (
            <button
              key={service.code}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`service-card service-card--${appearance.tone}${selected ? ' selected' : ''}${active ? '' : ' inactive'}`}
              onClick={() => setSelectedServiceId(service.code)}
              disabled={!active || requesting}
              title={active ? undefined : 'This service is currently unavailable'}
            >
              <span className="service-icon" aria-hidden="true">
                <ServiceIllustration name={appearance.icon} />
              </span>
              <span className="service-copy">
                <span className="service-name">{service.name}</span>
                <span className="service-description">{active ? appearance.description : 'Currently unavailable'}</span>
                <span className="service-meta">
                  <span className="service-code">{service.code}</span>
              </span>
              </span>
              <span className="service-arrow" aria-hidden="true">
                <UiIcon name={selected ? 'check' : active ? 'chevron' : 'alert'} size={21} />
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="error-message" role="alert">
          <UiIcon name="alert" size={18} />
          {error}
        </p>
      )}

      <button
        type="button"
        className="primary-button get-ticket-button"
        onClick={handleGetTicket}
        disabled={selectedServiceId === null || requesting}
      >
        <UiIcon name="ticket" size={20} />
        {requesting ? 'Getting your ticket…' : 'Get ticket'}
        <UiIcon name="arrowRight" size={19} />
      </button>
    </div>
  );
}

export default ServiceSelector;
