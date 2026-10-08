import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getServices, requestTicket } from '../../src/api/api.js';
import ServiceSelector from '../../src/components/ServiceSelector.jsx';
import { deferred, SERVICES, TICKET } from '../fixtures.js';

vi.mock('../../src/api/api.js', () => ({
  getServices: vi.fn(),
  requestTicket: vi.fn(),
}));

/** Renders the selector and waits until the services have loaded. */
async function renderLoaded(props = {}) {
  const onTicketIssued = vi.fn();
  const user = userEvent.setup();
  render(<ServiceSelector onTicketIssued={onTicketIssued} {...props} />);
  await screen.findByRole('radiogroup', { name: /available services/i });
  return { user, onTicketIssued };
}

const card = (code) => screen.getByRole('radio', { name: new RegExp(code) });
const getTicketButton = () => screen.getByRole('button', { name: /get ticket/i });

describe('ServiceSelector', () => {
  beforeEach(() => {
    getServices.mockResolvedValue(SERVICES);
    requestTicket.mockResolvedValue(TICKET);
  });

  describe('loading services', () => {
    it('shows a loading message while services are being fetched', () => {
      getServices.mockReturnValue(new Promise(() => {}));

      render(<ServiceSelector onTicketIssued={vi.fn()} />);

      expect(screen.getByText(/loading services/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /get ticket/i })).not.toBeInTheDocument();
    });

    it('fetches the services once on mount', async () => {
      await renderLoaded();

      expect(getServices).toHaveBeenCalledTimes(1);
    });

    it('renders one card per service with its code and name', async () => {
      await renderLoaded();

      const cards = screen.getAllByRole('radio');
      expect(cards).toHaveLength(SERVICES.length);
      for (const service of SERVICES) {
        const serviceCard = card(service.code);
        expect(within(serviceCard).getByText(service.code)).toBeInTheDocument();
        expect(within(serviceCard).getByText(service.name)).toBeInTheDocument();
      }
    });

    it('shows the error when services cannot be loaded', async () => {
      getServices.mockRejectedValue(new Error('Server unavailable'));

      render(<ServiceSelector onTicketIssued={vi.fn()} />);

      expect(await screen.findByRole('alert')).toHaveTextContent('Server unavailable');
      expect(screen.queryByText(/loading services/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/no services are available/i)).not.toBeInTheDocument();
    });

    it('shows a message when there are no services', async () => {
      getServices.mockResolvedValue([]);

      render(<ServiceSelector onTicketIssued={vi.fn()} />);

      expect(await screen.findByText(/no services are available/i)).toBeInTheDocument();
      expect(getTicketButton()).toBeDisabled();
    });

    it('shows a message when every service is inactive', async () => {
      getServices.mockResolvedValue(SERVICES.map((s) => ({ ...s, active: 0 })));

      render(<ServiceSelector onTicketIssued={vi.fn()} />);

      expect(await screen.findByText(/no services are available/i)).toBeInTheDocument();
    });

    it('does not show the "no services" message when at least one service is active', async () => {
      await renderLoaded();

      expect(screen.queryByText(/no services are available/i)).not.toBeInTheDocument();
    });
  });

  describe('inactive services', () => {
    it('are shown but disabled and marked as unavailable', async () => {
      await renderLoaded();

      const extra = card('EXTRA');
      expect(extra).toBeDisabled();
      expect(extra).toHaveClass('inactive');
      expect(within(extra).getByText(/unavailable/i)).toBeInTheDocument();
    });

    it('active services are enabled and not marked as unavailable', async () => {
      await renderLoaded();

      for (const code of ['SHIP', 'PAY', 'INFO']) {
        expect(card(code)).toBeEnabled();
        expect(within(card(code)).queryByText(/unavailable/i)).not.toBeInTheDocument();
      }
    });

    it('cannot be selected by clicking', async () => {
      const { user } = await renderLoaded();

      await user.click(card('EXTRA'));

      expect(card('EXTRA')).toHaveAttribute('aria-checked', 'false');
      expect(getTicketButton()).toBeDisabled();
    });
  });

  describe('selecting a service', () => {
    it('starts with nothing selected and the button disabled', async () => {
      await renderLoaded();

      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toHaveAttribute('aria-checked', 'false');
      }
      expect(getTicketButton()).toBeDisabled();
    });

    it('marks the clicked card as selected and enables the button', async () => {
      const { user } = await renderLoaded();

      await user.click(card('PAY'));

      expect(card('PAY')).toHaveAttribute('aria-checked', 'true');
      expect(card('PAY')).toHaveClass('selected');
      expect(getTicketButton()).toBeEnabled();
    });

    it('allows only one selected service at a time', async () => {
      const { user } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(card('SHIP'));

      expect(card('SHIP')).toHaveAttribute('aria-checked', 'true');
      expect(card('PAY')).toHaveAttribute('aria-checked', 'false');
      expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    });

    it('can be selected with the keyboard', async () => {
      const { user } = await renderLoaded();

      await user.tab();
      expect(card('SHIP')).toHaveFocus();
      await user.keyboard('{Enter}');

      expect(card('SHIP')).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('getting a ticket', () => {
    it('requests a ticket using the selected service code', async () => {
      const { user } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(getTicketButton());

      expect(requestTicket).toHaveBeenCalledTimes(1);
      expect(requestTicket).toHaveBeenCalledWith('PAY');
    });

    it('passes the issued ticket and the selected service to onTicketIssued', async () => {
      const { user, onTicketIssued } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(getTicketButton());

      await waitFor(() => expect(onTicketIssued).toHaveBeenCalledTimes(1));
      expect(onTicketIssued).toHaveBeenCalledWith(TICKET, SERVICES[1]);
    });

    it('shows a pending state and disables the cards while the request is running', async () => {
      const pending = deferred();
      requestTicket.mockReturnValue(pending.promise);
      const { user, onTicketIssued } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(getTicketButton());

      const button = screen.getByRole('button', { name: /getting your ticket/i });
      expect(button).toBeDisabled();
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled();
      }

      pending.resolve(TICKET);
      await waitFor(() => expect(onTicketIssued).toHaveBeenCalled());
    });

    it('does not send a second request when clicked again while pending', async () => {
      requestTicket.mockReturnValue(new Promise(() => {}));
      const { user } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(getTicketButton());
      await user.click(screen.getByRole('button', { name: /getting your ticket/i }));

      expect(requestTicket).toHaveBeenCalledTimes(1);
    });

    it('shows the error and lets the customer retry when the request fails', async () => {
      requestTicket.mockRejectedValueOnce(new Error('Could not issue ticket'));
      const { user, onTicketIssued } = await renderLoaded();

      await user.click(card('PAY'));
      await user.click(getTicketButton());

      expect(await screen.findByRole('alert')).toHaveTextContent('Could not issue ticket');
      expect(onTicketIssued).not.toHaveBeenCalled();
      // selection is kept and the button is usable again
      expect(card('PAY')).toHaveAttribute('aria-checked', 'true');
      expect(getTicketButton()).toBeEnabled();

      await user.click(getTicketButton());

      await waitFor(() => expect(onTicketIssued).toHaveBeenCalledWith(TICKET, SERVICES[1]));
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  it('does not update state after being unmounted while loading', async () => {
    const pending = deferred();
    getServices.mockReturnValue(pending.promise);
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = render(<ServiceSelector onTicketIssued={vi.fn()} />);
    unmount();
    pending.resolve(SERVICES);
    await pending.promise;

    expect(errorSpy).not.toHaveBeenCalled();
  });
});
