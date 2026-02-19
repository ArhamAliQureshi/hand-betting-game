import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getLeaderboard, saveToLeaderboard, clearLeaderboard } from '../storage/leaderboard';
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
    saveToLeaderboard('P1', 10);
    
    vi.setSystemTime(2000);
    saveToLeaderboard('P2', 20);
    
    vi.setSystemTime(3000);
    saveToLeaderboard('P3', 10);
    
    let lb = getLeaderboard();
    expect(lb.length).toBe(3);
    expect(lb[0].name).toBe('P2'); // 20
    expect(lb[1].name).toBe('P1'); // 10, earlier ts
    expect(lb[2].name).toBe('P3'); // 10, later ts

    // Add more to drop P3 entirely and push out smaller ones
    vi.setSystemTime(4000);
    saveToLeaderboard('P4', 30);
    vi.setSystemTime(5000);
    saveToLeaderboard('P5', 40);
    vi.setSystemTime(6000);
    saveToLeaderboard('P6', 50);
    vi.setSystemTime(7000);
    saveToLeaderboard('P7', 5);

    lb = getLeaderboard();
    expect(lb.length).toBe(5);
    expect(lb[0].name).toBe('P6'); // 50
    expect(lb[1].name).toBe('P5'); // 40
    expect(lb[2].name).toBe('P4'); // 30
    expect(lb[3].name).toBe('P2'); // 20
    expect(lb[4].name).toBe('P1'); // 10

    clearLeaderboard();
    expect(getLeaderboard().length).toBe(0);
  });
});
