import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { loadLeaderboard, addLeaderboardEntry, clearLeaderboard } from '../storage/leaderboard';
import { getSavedPlayerName, savePlayerName } from '../storage/player';

describe('Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    // mock Date.now so ts logic is deterministic
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('player name persistence', () => {
    expect(getSavedPlayerName()).toBe('');
    savePlayerName(' Alice ');
    expect(getSavedPlayerName()).toBe('Alice');
  });

  it('leaderboard storage logic', () => {
    vi.setSystemTime(1000);
    addLeaderboardEntry({ name: 'P1', score: 10, ts: Date.now() });
    
    vi.setSystemTime(2000);
    addLeaderboardEntry({ name: 'P2', score: 20, ts: Date.now() });
    
    vi.setSystemTime(3000);
    addLeaderboardEntry({ name: 'P3', score: 10, ts: Date.now() });
    
    let lb = loadLeaderboard();
    expect(lb.length).toBe(3);
    expect(lb[0].name).toBe('P2'); // 20
    expect(lb[1].name).toBe('P1'); // 10, earlier ts
    expect(lb[2].name).toBe('P3'); // 10, later ts

    // Add more to drop P3 entirely and push out smaller ones
    vi.setSystemTime(4000);
    addLeaderboardEntry({ name: 'P4', score: 30, ts: Date.now() });
    vi.setSystemTime(5000);
    addLeaderboardEntry({ name: 'P5', score: 40, ts: Date.now() });
    vi.setSystemTime(6000);
    addLeaderboardEntry({ name: 'P6', score: 50, ts: Date.now() });
    vi.setSystemTime(7000);
    addLeaderboardEntry({ name: 'P7', score: 5, ts: Date.now() });

    lb = loadLeaderboard();
    expect(lb.length).toBe(5);
    expect(lb[0].name).toBe('P6'); // 50
    expect(lb[1].name).toBe('P5'); // 40
    expect(lb[2].name).toBe('P4'); // 30
    expect(lb[3].name).toBe('P2'); // 20
    expect(lb[4].name).toBe('P1'); // 10

    clearLeaderboard();
    expect(loadLeaderboard().length).toBe(0);
  });

  it('rejects duplicate entries with the same gameSessionId (idempotency)', () => {
    // Insert new entry with session A
    addLeaderboardEntry({ name: 'Dup Test', score: 10, ts: 100, gameSessionId: 'session1' });
    let lb = loadLeaderboard();
    expect(lb.length).toBe(1);

    // Attempt to insert duplicate (even with diff score/ts) with session A
    addLeaderboardEntry({ name: 'Dup Test 2', score: 20, ts: 101, gameSessionId: 'session1' });
    lb = loadLeaderboard();
    expect(lb.length).toBe(1); // Should still only have 1 entry

    // Insert new valid entry with session B
    addLeaderboardEntry({ name: 'Unique Test', score: 10, ts: 102, gameSessionId: 'session2' });
    lb = loadLeaderboard();
    expect(lb.length).toBe(2);
  });
});
