import { test, expect } from '@playwright/test';

test.describe('Office Queue Management - Customer Flow E2E', () => {
  test('complete flow: role selection -> select service -> issue ticket -> view ticket details -> done', async ({ page }) => {
    // 1. Visit the home page (Role Selection)
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /welcome!/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^Customer/i })).toBeVisible();

    // 2. Click Customer role to enter Customer area
    await page.getByRole('link', { name: /^Customer/i }).click();
    await expect(page).toHaveURL(/\/customer/);
    await expect(page.getByRole('heading', { level: 1, name: /customer area/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /get a ticket/i })).toBeVisible();

    // 3. Verify services loaded from the backend
    const radiogroup = page.getByRole('radiogroup', { name: /available services/i });
    await expect(radiogroup).toBeVisible();

    // Inactive service should be disabled
    const inactiveService = page.getByRole('radio', { name: /EXTRA/i });
    await expect(inactiveService).toBeVisible();
    await expect(inactiveService).toBeDisabled();

    // Get Ticket button should initially be disabled
    const getTicketButton = page.getByRole('button', { name: /get ticket/i });
    await expect(getTicketButton).toBeDisabled();

    // 4. Select an active service (Shipping)
    const shippingService = page.getByRole('radio', { name: /SHIP/i });
    await expect(shippingService).toBeEnabled();
    await shippingService.click();

    // Get Ticket button should now be enabled
    await expect(getTicketButton).toBeEnabled();

    // 5. Click "Get ticket" to submit the request
    await getTicketButton.click();

    // 6. Verify Ticket view is displayed with data from SQLite backend
    const ticketResult = page.getByTestId('ticket-result');
    await expect(ticketResult).toBeVisible();
    await expect(page.getByText('YOUR TICKET', { exact: true })).toBeVisible();

    // Check ticket code pattern T-XXXXXX
    const ticketCodeElement = page.locator('.ticket-code-text');
    await expect(ticketCodeElement).toBeVisible();
    await expect(ticketCodeElement).toHaveText(/^T-\d{6}$/);

    // Check service name and queue count
    await expect(page.locator('.ticket-service-name')).toContainText(/shipping/i);
    await expect(page.locator('.ticket-people-ahead')).toContainText(/people ahead/i);

    // 7. Click DONE button to return to service selection
    const doneButton = page.getByRole('button', { name: /done/i });
    await expect(doneButton).toBeVisible();
    await doneButton.click();

    // 8. Verify we are back to service selection
    await expect(page.getByRole('radiogroup', { name: /available services/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /get ticket/i })).toBeDisabled();
  });

  test('issuing consecutive tickets increments ticket code and tracks queue', async ({ page }) => {
    await page.goto('/customer');

    // Issue first ticket for PAY
    const payService = page.getByRole('radio', { name: /PAY/i });
    await payService.click();
    await page.getByRole('button', { name: /get ticket/i }).click();

    await expect(page.getByTestId('ticket-result')).toBeVisible();
    const firstCodeText = await page.locator('.ticket-code-text').innerText();
    const firstId = Number(firstCodeText.replace('T-', ''));

    // Go back with DONE
    await page.getByRole('button', { name: /done/i }).click();

    // Issue second ticket for PAY
    await page.getByRole('radio', { name: /PAY/i }).click();
    await page.getByRole('button', { name: /get ticket/i }).click();

    await expect(page.getByTestId('ticket-result')).toBeVisible();
    const secondCodeText = await page.locator('.ticket-code-text').innerText();
    const secondId = Number(secondCodeText.replace('T-', ''));

    // Monotonically increasing ticket ID
    expect(secondId).toBeGreaterThan(firstId);
  });
});
