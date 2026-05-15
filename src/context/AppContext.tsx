import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface UserProgress {
  completedLessons: string[];
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  courseProgress: Record<string, number>;
}

const defaultProgress: UserProgress = {
  completedLessons: [],
  xp: 0,
  level: 1,
  streak: 3,
  badges: [],
  courseProgress: {},
};

interface AppContextType {
  progress: UserProgress;
  completeLesson: (lessonId: string, courseId: string, xp: number) => void;
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
    return saved ? JSON.parse(saved) : defaultProgress;
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

  const completeLesson = useCallback((lessonId: string, courseId: string, xp: number) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const newCompleted = [...prev.completedLessons, lessonId];
      const newXp = prev.xp + xp;
      const newLevel = Math.floor(newXp / 100) + 1;
      const newCourseProgress = { ...prev.courseProgress };
      newCourseProgress[courseId] = (newCourseProgress[courseId] || 0) + 1;

      const newBadges = [...prev.badges];
      if (newCompleted.length >= 1 && !newBadges.includes('first-step')) newBadges.push('first-step');
      if (newCompleted.length >= 5 && !newBadges.includes('explorer')) newBadges.push('explorer');
      if (newCompleted.length >= 10 && !newBadges.includes('coder')) newBadges.push('coder');
      if (newLevel >= 5 && !newBadges.includes('master')) newBadges.push('master');

      const next = {
        ...prev,
        completedLessons: newCompleted,
        xp: newXp,
        level: newLevel,
        badges: newBadges,
        courseProgress: newCourseProgress,
      };
      localStorage.setItem('codelearn-progress', JSON.stringify(next));
      return next;
    });
  }, []);

  const hasCompleted = useCallback((lessonId: string) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const getCourseProgress = useCallback((courseId: string, totalLessons: number) => {
    const done = progress.courseProgress[courseId] || 0;
    return Math.round((done / totalLessons) * 100);
  }, [progress.courseProgress]);

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
