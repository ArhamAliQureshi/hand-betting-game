import { test, expect } from '@playwright/test';

test.describe('Layout regression', () => {

  test('layout does not shift horizontally on bet clicks', async ({ page }) => {
    // Setup and start game
    await page.goto('/');
    await page.getByTestId('player-name-input').fill('TestUser');
    await page.getByTestId('landing-new-game').click();
    await expect(page.getByTestId('game-total')).toBeVisible();

    const frame = page.getByTestId('game-frame');
    
    // Get initial bounding box of the frame container
    const initialBox = await frame.boundingBox();
    expect(initialBox).not.toBeNull();
    const initialLeft = initialBox!.x;

    const higherBtn = page.getByTestId('bet-higher');

    // Click 10 times to force history strip to overflow width
    for (let i = 0; i < 10; i++) {
      await expect(higherBtn).toBeEnabled();
      await higherBtn.click();
      
      // Wait for resolve phase to end and next round to be ready
      await expect(higherBtn).toBeEnabled({ timeout: 4000 });
      
      // Check bounding box again after each click
      const currentBox = await frame.boundingBox();
      expect(currentBox).not.toBeNull();
      const currentLeft = currentBox!.x;
      
      const delta = Math.abs(currentLeft - initialLeft);
      // Assert that the horizontal shift is at most 1 pixel (to account for minor sub-pixel rendering differences)
      expect(delta).toBeLessThanOrEqual(1);
    }
  });

  test('no unexpected horizontal scroll', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('player-name-input').fill('TestUser');
    await page.getByTestId('landing-new-game').click();
    await expect(page.getByTestId('game-total')).toBeVisible();
    
    // Check horizontal scroll
    const scrollInfo = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth
      };
    });
    
    // They should be exactly equal, meaning no horizontal scrollbar
    expect(scrollInfo.scrollWidth).toBeLessThanOrEqual(scrollInfo.clientWidth);
  });
});
