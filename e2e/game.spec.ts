import { test, expect } from '@playwright/test';

test.describe('Hand Betting Game E2E', () => {

  test('Title and initial route', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vite \+ React/i); // Default title or we can check header
    await expect(page.locator('h1.neon-title')).toHaveText('Hand Betting Game');
  });

  test('Name validation and starts game', async ({ page }) => {
    await page.goto('/');
    const nameInput = page.getByTestId('player-name-input');
    const newGameBtn = page.getByTestId('landing-new-game');

    await expect(newGameBtn).toBeDisabled();

    // Invalid length
    await nameInput.fill('A');
    await expect(newGameBtn).toBeDisabled();

    // Invalid chars
    await nameInput.fill('Alice@123');
    await expect(newGameBtn).toBeDisabled();

    // Valid
    await nameInput.fill('Alice');
    await expect(newGameBtn).toBeEnabled();

    // Start game
    await newGameBtn.click();
    await expect(page.url()).toContain('/game');
    
    // Check HUD
    await expect(page.getByTestId('game-total')).toBeVisible();
    await expect(page.getByTestId('pile-draw-count')).toContainText('132'); // 136 total - 4 drawn
  });

  test('Gameplay mechanics - bet, resolve and history', async ({ page }) => {
    // Setup and start
    await page.goto('/');
    await page.getByTestId('player-name-input').fill('Bob');
    await page.getByTestId('landing-new-game').click();
    await expect(page.getByTestId('game-total')).toBeVisible();

    const higherBtn = page.getByTestId('bet-higher');
    const lowerBtn = page.getByTestId('bet-lower');

    // Place bet
    await higherBtn.click();
    
    // Both should be disabled during resolve phase
    await expect(higherBtn).toBeDisabled();
    await expect(lowerBtn).toBeDisabled();

    // Verify history panel updated
    const historyStrip = page.getByTestId('history-strip');
    await expect(historyStrip.locator('.history-item')).toHaveCount(1, { timeout: 3000 });

    // Verify scores panel updated
    const scoresPanel = page.getByTestId('scores-panel');
    await expect(scoresPanel.locator('.score-row')).toHaveCount(1);
    
    // Next round should be ready
    await expect(higherBtn).toBeEnabled();
  });
  
});
