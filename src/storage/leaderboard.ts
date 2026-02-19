const LEADERBOARD_KEY = 'hand_betting_leaderboard';

export interface LeaderboardEntry {
  name: string;
  score: number;
  ts: number;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveToLeaderboard(name: string, score: number): void {
  const current = getLeaderboard();
  current.push({ name, score, ts: Date.now() });
  
  current.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.ts - b.ts;
  });

  const top5 = current.slice(0, 5);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(top5));
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
}
