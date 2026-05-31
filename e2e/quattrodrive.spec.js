import { test, expect } from '@playwright/test';

test.describe('QuattroDrive E2E Automated Tests', () => {
  // Scenario 1: Authentication - Successful Login
  test('Successful login to dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/QuattroDrive/);
    
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('.sidebar')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Dashboard/);
  });

  // Scenario 2: Authentication - Invalid Login
  test('Invalid login shows error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'wrong');
    await page.fill('input[placeholder="Password"]', 'wrongpass');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('.error-message')).toBeVisible();
  });

  // Scenario 3: Localization Toggle
  test('Toggle language between EN and BS', async ({ page }) => {
    // Setup login state directly or just login again
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await page.click('button.lang-btn:has-text("BS")');
    // After switching to BS, dashboard should say "Nadzorna Ploča" or similar
    await expect(page.locator('h1')).toContainText(/Nadzorna/i);

    // Switch back to EN
    await page.click('button.lang-btn:has-text("EN")');
    await expect(page.locator('h1')).toContainText(/Dashboard/i);
  });

  // Scenario 4: Create a New Candidate
  test('Create a new candidate successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await page.click('a[href="/candidates"]');
    await page.click('button:has-text("Add New Candidate")');
    
    // Fill modal
    await page.fill('input[name="full_name"]', 'Playwright Tester');
    await page.fill('input[name="dob"]', '1995-05-05');
    await page.fill('input[name="personal_id_number"]', '9998887776665');
    await page.selectOption('select[name="license_category"]', 'B');
    await page.fill('input[name="total_course_fee"]', '1500');

    await page.click('button:has-text("Add Candidate")');

    // Verify candidate in table
    await expect(page.locator('table')).toContainText('Playwright Tester');
  });

  // Scenario 5: Edit Candidate Details
  test('Edit an existing candidate', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');
    
    await page.click('a[href="/candidates"]');
    // Click the first candidate in the table to go to profile
    await page.click('table tbody tr:first-child');
    
    await page.click('button:has-text("Edit Profile")');
    await page.fill('input[name="address"]', '123 New Street');
    await page.click('button:has-text("Save Changes")');
    
    await expect(page.locator('.profile-info')).toContainText('123 New Street');
  });

  // Scenario 6: Log a driving lesson
  test('Log a new driving lesson', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');
    
    await page.click('a[href="/candidates"]');
    await page.click('table tbody tr:first-child');
    
    await page.click('button:has-text("Lessons")');
    await page.click('button:has-text("Log Lesson")');
    
    await page.fill('input[name="instructor_name"]', 'Suad');
    await page.fill('input[name="lesson_time"]', '10:00-12:00');
    await page.click('button:has-text("Save Lesson")');
    
    await expect(page.locator('table')).toContainText('Suad');
  });

  // Scenario 7: Record a payment
  test('Record a successful payment', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');
    
    await page.click('a[href="/candidates"]');
    await page.click('table tbody tr:first-child');
    
    await page.click('button:has-text("Payments")');
    await page.click('button:has-text("Record Payment")');
    
    await page.fill('input[name="amount"]', '200');
    await page.selectOption('select[name="payment_method"]', 'Cash');
    await page.click('button:has-text("Save Payment")');
    
    await expect(page.locator('table')).toContainText('200');
  });

  // Scenario 8: Check Dashboard metrics
  test('Verify dashboard metrics render', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await expect(page.locator('.metric-card').first()).toBeVisible();
    await expect(page.locator('.schedule-list')).toBeVisible();
  });

  // Scenario 9: Document Generation View
  test('Navigate to Document Center', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await page.click('a[href="/documents"]');
    await expect(page.locator('h1')).toContainText(/Document Center/i);
    await expect(page.locator('.doc-types-grid')).toBeVisible();
  });

  // Scenario 10: Logout
  test('Logout successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'admin123');
    await page.click('button:has-text("Sign In")');

    await page.click('button:has-text("Logout")');
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });
});
