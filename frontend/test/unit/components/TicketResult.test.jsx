import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import TicketResult from '../../../src/components/TicketResult.jsx';

describe('TicketResult', () => {
  it('returns null if ticket is not provided', () => {
    const { container } = render(<TicketResult ticket={null} onDone={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders all ticket response fields correctly', () => {
    const ticket = {
      ticketCode: 'T-000043',
      serviceName: 'Shipping',
      issuedAt: '10:30',
      peopleAhead: 3,
    };

    render(<TicketResult ticket={ticket} onDone={vi.fn()} />);

    expect(screen.getByText('YOUR TICKET')).toBeInTheDocument();
    expect(screen.getByText('T-000043')).toBeInTheDocument();
    expect(screen.queryByText('#')).not.toBeInTheDocument();
    expect(screen.getByText('Shipping')).toBeInTheDocument();
    expect(screen.getByText('Issued at 10:30')).toBeInTheDocument();
    expect(screen.getByText('3 people ahead')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
  });

  it('formats ticket code from id if ticketCode is missing', () => {
    const ticket = {
      id: 42,
      issuedAt: '10:30',
      peopleAhead: 0,
    };
    const service = { name: 'Payment' };

    render(<TicketResult ticket={ticket} service={service} onDone={vi.fn()} />);

    expect(screen.getByText('T-000042')).toBeInTheDocument();
    expect(screen.getByText('Payment')).toBeInTheDocument();
    expect(screen.getByText('0 people ahead')).toBeInTheDocument();
  });

  it('formats ISO 8601 timestamp properly', () => {
    const ticket = {
      ticketCode: 'T-000001',
      serviceName: 'Information',
      issuedAt: '2026-10-08T08:30:00.000Z',
      peopleAhead: 1,
    };

    render(<TicketResult ticket={ticket} onDone={vi.fn()} />);

    expect(screen.getByText(/Issued at \d{1,2}:\d{2}/)).toBeInTheDocument();
  });

  it('calls onDone callback when DONE button is clicked', async () => {
    const user = userEvent.setup();
    const handleDone = vi.fn();
    const ticket = {
      ticketCode: 'T-000043',
      serviceName: 'Shipping',
      issuedAt: '10:30',
      peopleAhead: 3,
    };

    render(<TicketResult ticket={ticket} onDone={handleDone} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    await user.click(doneButton);

    expect(handleDone).toHaveBeenCalledTimes(1);
  });
});
