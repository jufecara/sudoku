import React from 'react';
import { Trophy, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import type { Difficulty } from '../../utils/sudokuGenerator';
import type { Stats } from '../../hooks/useStats';

interface StatsScreenProps {
  stats: Stats;
  setView: (view: 'home' | 'play' | 'stats' | 'settings') => void;
  resetStats: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ stats, setView, resetStats }) => {
  const { t } = useTranslation();

  const formatTime = (secs: number | null) => {
    if (secs === null) return '--:--';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <main className="stats-screen">
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h2 className="font-display" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy color="var(--color-warn)" /> {t.generalStats}
        </h2>
        <div className="stats-grid">
          <div className="glass-panel stat-card">
            <span className="stat-value">{stats.played}</span>
            <span className="stat-label">{t.played}</span>
          </div>
          <div className="glass-panel stat-card">
            <span className="stat-value">
              {stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0}%
            </span>
            <span className="stat-label">{t.victories}</span>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 className="font-display" style={{ fontSize: '1.2rem' }}>{t.bestTimes}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((diff) => (
            <div key={diff} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>{t.difficultyLabels[diff]}</span>
              <span style={{ fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(stats.bestTimes[diff])}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="primary-btn" style={{ flex: 1 }} onClick={() => setView('home')}>
          {t.returnMenu}
        </button>
        <button
          className="icon-btn"
          onClick={resetStats}
          title={t.restartStats}
          style={{ width: '50px', height: '50px', borderRadius: '16px' }}
        >
          <RefreshCw size={20} />
        </button>
      </div>
    </main>
  );
};
