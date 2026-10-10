import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getServices } from '../../src/api/api.js';
import App from '../../src/App.jsx';

vi.mock('../../src/api/api.js', () => ({
  getServices: vi.fn(),
  requestTicket: vi.fn(),
}));

function renderAt(path) {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
  return { user };
}

describe('App routing', () => {
  beforeEach(() => {
    getServices.mockResolvedValue([]);
  });

  it.each([
    ['/', /office queue management/i],
    ['/customer', /customer area/i],
    ['/officer', /officer area/i],
    ['/manager', /manager area/i],
    ['/admin', /administrator area/i],
    ['/display', /public display/i],
  ])('renders the right page at %s', (path, heading) => {
    renderAt(path);

    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('renders the 404 page for unknown routes', () => {
    renderAt('/does-not-exist');

    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/');
  });

  describe('role selection page', () => {
    it.each([
      ['Customer', '/customer'],
      ['Officer', '/officer'],
      ['Manager', '/manager'],
      ['Administrator', '/admin'],
      ['Open Public Display', '/display'],
    ])('has a "%s" link to %s', (name, href) => {
      renderAt('/');

      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
    });

    it('navigates to the customer area and back', async () => {
      const { user } = renderAt('/');

      await user.click(screen.getByRole('link', { name: 'Customer' }));
      expect(screen.getByRole('heading', { name: /customer area/i })).toBeInTheDocument();

      await user.click(screen.getByRole('link', { name: /back to role selection/i }));
      expect(screen.getByRole('heading', { name: /office queue management/i })).toBeInTheDocument();
    });
  });
});
