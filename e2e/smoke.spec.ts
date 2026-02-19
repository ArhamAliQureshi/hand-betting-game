import { test, expect } from '@playwright/test';

const ssDir = 'playwright-artifacts/screenshots';

test.describe('Hand Betting Game – Smoke Tests', () => {
  test('Landing page loads and has New Game button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Hand Betting Game')).toBeVisible();
    const btn = page.locator('button', { hasText: /new game/i });
    await expect(btn).toBeVisible();
    await page.screenshot({ path: `${ssDir}/landing.png`, fullPage: true });
  });

  test('Full game flow: start, bet, history, exit', async ({ page }) => {
    // 1. Landing -> Start game
    await page.goto('/');
    
    // Fill player name to enable start button
    await page.fill('input[placeholder="Enter your name"]', 'Test Player');
    
    await page.click('button:has-text("New Game")');
    await page.waitForURL('**/game');

    // 2. Verify gameplay elements
    await expect(page.locator('text=Total')).toBeVisible();
    await expect(page.locator('button:has-text("Bet Higher")')).toBeVisible();
    await expect(page.locator('button:has-text("Bet Lower")')).toBeVisible();

    // Screenshot: initial game state
    await page.screenshot({ path: `${ssDir}/game.png`, fullPage: true });

    // 3. Click bet higher
    await page.click('button:has-text("Bet Higher")');
    await page.waitForTimeout(700);

    // Screenshot: after first bet
    await page.screenshot({ path: `${ssDir}/game-after-bet.png`, fullPage: true });

    // 4. Play a couple more rounds
    for (let i = 0; i < 2; i++) {
      const higherBtn = page.locator('button:has-text("Bet Higher")');
      if (await higherBtn.isEnabled()) {
        await higherBtn.click();
        await page.waitForTimeout(700);
      }
    }

    // 5. Verify history has entries
    await expect(page.getByText('History')).toBeVisible();

    // 6. Exit back to landing
    const backBtn = page.locator('button:has-text("Back")');
    if (await backBtn.isVisible()) {
      await backBtn.click();
      await page.waitForURL('/');
      await expect(page.locator('text=Hand Betting Game')).toBeVisible();
    }
  });
});
