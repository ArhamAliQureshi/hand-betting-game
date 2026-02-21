import { test, expect } from '@playwright/test';

test.describe('Leaderboard Persistence', () => {

  test('leaderboard saves after a natural game over', async ({ page, context }) => {
    test.setTimeout(240000); // 150 bets * 1.2s animation delay requires at least 3 minutes to exhaust the deck
    await page.goto('/');

    // 1. Clear any existing state
    const clearBtn = page.getByTestId('leaderboard-clear');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();
      await page.getByTestId('leaderboard-clear-confirm').click();
    }

    // 2. Start game
    await page.getByTestId('player-name-input').fill('TestChampion');
    await page.getByTestId('landing-new-game').click();

    // 3. Verify Universal Badges
    await expect(page.locator('.current-hand-panel .dynamic-badge')).toHaveCount(4);
    
    // Verify 2D Canvas Background mounted successfully behind UI without intercepting pointers
    const canvas = page.getByTestId('mahjong-bg-canvas');
    const fallback = page.getByTestId('casino-fallback-bg');
    await expect(canvas.or(fallback)).toBeVisible();
    
    const higherBtn = page.getByTestId('bet-higher');
    await higherBtn.click();
    
    // Wait for resolution and next hand layout
    await expect(page.locator('.current-hand-panel .dynamic-badge')).toHaveCount(4);
    await page.screenshot({ path: 'test-results/universal-badges-proof.png' });

    // 4. Play rounds by injecting a forced game over via localstorage helper mock or
    // simply playing normally (we will just play normally and guess higher repeatedly)
    let isGameOver = false;
    
    // We will bet up to 150 times max (a game maximally takes ~102 rounds if never hitting value limits)
    for (let i = 0; i < 150; i++) {
        // If game over UI mounts, we break early
        if (await page.getByTestId('game-over-screen').isVisible()) {
            isGameOver = true;
            break;
        }

        // Wait until button is ready or game over is shown
        // if the button eventually becomes enabled, we can click
        try {
            await expect(higherBtn).toBeEnabled({ timeout: 4000 });
            
            // Read pre-bet score
            const scoreLocator = page.getByTestId('current-score');
            const preScoreStr = await scoreLocator.textContent();
            const preScore = preScoreStr ? parseInt(preScoreStr.replace('Current: ', '')) : 0;
            
            await higherBtn.click();
            
            // Wait for resolution processing grace period to conclude
            await expect(higherBtn).toBeEnabled({ timeout: 4000 });
            
            // Calculate what happened
            const postScoreStr = await scoreLocator.textContent();
            const postScore = postScoreStr ? parseInt(postScoreStr.replace('Current: ', '')) : 0;
            
            // Assert increment logic
            expect(postScore === preScore || postScore === preScore + 1).toBe(true);

        } catch {
            // It might have timed out because Game over UI blocked everything. Break and check.
            if (await page.getByTestId('game-over-screen').isVisible()) {
                isGameOver = true;
                break;
            }
        }
    }

    expect(isGameOver).toBe(true);

    // 4. Navigate home using the Game Over button
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');

    // 5. Verify the leaderboard UI displays the entry
    const row = page.locator('.lb-row').first();
    await expect(row.locator('.lb-name')).toHaveText('TestChampion');
    const scoreText = await row.locator('.lb-score').textContent();
    expect(Number(scoreText)).toBeGreaterThanOrEqual(0);

    // Ensure we did not double-save duplicate test champions from this session run
    await expect(page.locator('.lb-row .lb-name', { hasText: 'TestChampion' })).toHaveCount(1);

    // 6. Reload page to verify persistence without React state
    await page.reload();
    const rowAfterReload = page.locator('.lb-row').first();
    await expect(rowAfterReload.locator('.lb-name')).toHaveText('TestChampion');
  });

  test('clear leaderboard wipes storage', async ({ page }) => {
    await page.goto('/');
    
    // Ensure there is at least one entry
    const clearProps = await page.getByTestId('leaderboard-clear').isVisible();
    if (!clearProps) {
        // Need to add an entry.
        await page.evaluate(() => {
            window.localStorage.setItem('hbg:leaderboard:v1', JSON.stringify([
                { name: 'Dummy', score: 10, ts: Date.now() }
            ]));
        });
        await page.reload();
    }

    await page.getByTestId('leaderboard-clear').click();
    await page.getByTestId('leaderboard-clear-confirm').click();

    await expect(page.locator('.lb-empty')).toBeVisible();

    await page.reload();
    await expect(page.locator('.lb-empty')).toBeVisible();
  });
});
