import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface UserProgress {
  completedLessons: string[];
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  courseProgress: Record<string, number>;
  startedCourses: string[];   // per badge Poliglotta
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  xp: 0,
  level: 1,
  streak: 0,
  badges: [],
  courseProgress: {},
  startedCourses: [],
};

// ── Streak helpers ────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function daysBetween(a: string, b: string) {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / 86_400_000
  );
}

/** Calcola la nuova streak dato l'ultimo giorno attivo. Restituisce il nuovo valore. */
function computeStreak(current: number, lastActive: string | null): { streak: number; lastActive: string } {
  const today = todayStr();
  if (!lastActive) return { streak: 1, lastActive: today };
  if (lastActive === today) return { streak: current, lastActive: today };
  const diff = daysBetween(lastActive, today);
  if (diff === 1) return { streak: current + 1, lastActive: today };
  // Broken streak
  return { streak: 1, lastActive: today };
}

// ── Badge check helper (pure) ─────────────────────────────────────────
function evaluateBadges(
  completed: number,
  level: number,
  streak: number,
  startedCourses: number,
  existing: string[]
): string[] {
  const add = (id: string) => !existing.includes(id) && existing.push(id);
  if (completed >= 1)  add('first-step');
  if (completed >= 5)  add('explorer');
  if (completed >= 10) add('coder');
  if (completed >= 20) add('rocket');
  if (level >= 5)      add('master');
  if (level >= 10)     add('crown');
  if (streak >= 7)     add('streak-7');
  if (startedCourses >= 3) add('polyglot');
  return existing;
}

interface AppContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, courseId: string, xp: number, onNewBadges?: (ids: string[]) => void) => void;
  hasCompleted: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string, totalLessons: number) => number;
  unlockBadge: (badgeId: string) => void;
  onboardingDone: boolean;
  setOnboardingDone: (v: boolean) => void;
  username: string;
  setUsername: (v: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('codelearn-progress');
    const base = saved ? JSON.parse(saved) : defaultProgress;
    // migrate: assicuriamo che startedCourses esista sempre
    if (!base.startedCourses) base.startedCourses = [];
    return base;
  });

  const [onboardingDone, setOnboardingDone] = useState(() => {
    return localStorage.getItem('codelearn-onboarding') === 'true';
  });

  const [username, setUsernameState] = useState(() => {
    return localStorage.getItem('codelearn-username') || '';
  });

  const setUsername = useCallback((v: string) => {
    setUsernameState(v);
    localStorage.setItem('codelearn-username', v);
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const next = { ...prev, badges: [...prev.badges, badgeId] };
      localStorage.setItem('codelearn-progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, courseId: string, xp: number, onNewBadges?: (ids: string[]) => void) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;

      // ── Lezioni & XP ──────────────────────────────────────────────
      const newCompleted = [...prev.completedLessons, lessonId];
      const newXp        = prev.xp + xp;
      const newLevel     = Math.floor(newXp / 100) + 1;

      // ── Progresso corso ───────────────────────────────────────────
      const newCourseProgress = { ...prev.courseProgress };
      newCourseProgress[courseId] = (newCourseProgress[courseId] || 0) + 1;

      // ── Corsi avviati (per Poliglotta) ────────────────────────────
      const newStarted = prev.startedCourses.includes(courseId)
        ? prev.startedCourses
        : [...prev.startedCourses, courseId];

      // ── Streak reale ──────────────────────────────────────────────
      const lastActive = localStorage.getItem('codelearn-last-active');
      const { streak: newStreak, lastActive: newLastActive } =
        computeStreak(prev.streak, lastActive);
      localStorage.setItem('codelearn-last-active', newLastActive);

      // ── Badge ─────────────────────────────────────────────────────
      const newBadges = evaluateBadges(
        newCompleted.length,
        newLevel,
        newStreak,
        newStarted.length,
        [...prev.badges],
      );

      // Callback con i badge appena sbloccati in questa sessione
      const justUnlocked = newBadges.filter(id => !prev.badges.includes(id));
      if (justUnlocked.length > 0) {
        setTimeout(() => onNewBadges?.(justUnlocked), 300);
      }

      const next: UserProgress = {
        ...prev,
        completedLessons: newCompleted,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        badges: newBadges,
        courseProgress: newCourseProgress,
        startedCourses: newStarted,
      };

      localStorage.setItem('codelearn-progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const hasCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons]
  );

  const getCourseProgress = useCallback(
    (courseId: string, totalLessons: number) => {
      const done = progress.courseProgress[courseId] || 0;
      return Math.round((done / totalLessons) * 100);
    },
    [progress.courseProgress]
  );

  const handleOnboarding = useCallback((v: boolean) => {
    setOnboardingDone(v);
    localStorage.setItem('codelearn-onboarding', String(v));
  }, []);

  return (
    <AppContext.Provider value={{
      progress,
      completeLesson,
      hasCompleted,
      getCourseProgress,
      unlockBadge,
      onboardingDone,
      setOnboardingDone: handleOnboarding,
      username,
      setUsername,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
