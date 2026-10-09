import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getServices, requestTicket } from '../../src/api/api.js';
import CustomerPage from '../../src/pages/CustomerPage.jsx';
import { SERVICES, TICKET } from '../fixtures.js';

vi.mock('../../src/api/api.js', () => ({
  getServices: vi.fn(),
  requestTicket: vi.fn(),
}));

function renderPage() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <CustomerPage />
    </MemoryRouter>,
  );
  return { user };
}

async function issueTicketFor(user, code) {
  await user.click(await screen.findByRole('radio', { name: new RegExp(code) }));
  await user.click(screen.getByRole('button', { name: /get ticket/i }));
}

describe('CustomerPage', () => {
  beforeEach(() => {
    getServices.mockResolvedValue(SERVICES);
    requestTicket.mockResolvedValue(TICKET);
  });

  it('starts in the service selection state', async () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /customer area/i })).toBeInTheDocument();
    expect(await screen.findByRole('radiogroup', { name: /available services/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /done/i })).not.toBeInTheDocument();
  });

  it('switches to the ticket issued state once a ticket is obtained', async () => {
    const { user } = renderPage();

    await issueTicketFor(user, 'PAY');

    await waitFor(() => expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument());
    expect(screen.queryByRole('button', { name: /get ticket/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /customer area/i })).toBeInTheDocument();
    expect(screen.getByText('YOUR TICKET')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('displays the ticket details and returns to service selection on clicking DONE', async () => {
    const { user } = renderPage();

    await issueTicketFor(user, 'PAY');

    await waitFor(() => expect(screen.getByText('YOUR TICKET')).toBeInTheDocument());
    expect(screen.getByText('T-000005')).toBeInTheDocument();
    expect(screen.getByText(/payment service/i)).toBeInTheDocument();

    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    await waitFor(() => expect(screen.getByRole('radiogroup', { name: /available services/i })).toBeInTheDocument());
    expect(screen.queryByText('YOUR TICKET')).not.toBeInTheDocument();
  });

  it('stays in the selection state when the ticket request fails', async () => {
    requestTicket.mockRejectedValue(new Error('Could not issue ticket'));
    const { user } = renderPage();

    await issueTicketFor(user, 'PAY');

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not issue ticket');
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('keeps the link back to the role selection in both states', async () => {
    const { user } = renderPage();

    expect(screen.getByRole('link', { name: /back to role selection/i })).toHaveAttribute('href', '/');

    await issueTicketFor(user, 'PAY');
    await waitFor(() => expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument());

    expect(screen.getByRole('link', { name: /back to role selection/i })).toHaveAttribute('href', '/');
  });
});
