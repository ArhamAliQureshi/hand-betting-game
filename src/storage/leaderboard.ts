import { LEADERBOARD_KEY } from './keys';

export interface LeaderboardEntry {
  name: string;
  score: number;
  ts: number;
  gameSessionId?: string;
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter(e => e && typeof e.name === 'string' && typeof e.score === 'number' && typeof e.ts === 'number');
    }
    return [];
  } catch {
    return [];
  }
}

export function saveLeaderboard(entries: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
    // Dispatch a custom event so other tabs/components can update without polling
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = loadLeaderboard();

  // Idempotency check: if an entry with this gameSessionId already exists, abort
  if (entry.gameSessionId && current.some(e => e.gameSessionId === entry.gameSessionId)) {
    return current;
  }

  current.push(entry);
  
  current.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.ts - b.ts;
  });

  const top5 = current.slice(0, 5);
  saveLeaderboard(top5);
  return top5;
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
  window.dispatchEvent(new Event('storage'));
}
