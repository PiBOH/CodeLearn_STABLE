// ─────────────────────────────────────────────────────────────────────────────
// AppContext.tsx — Stato globale + sincronizzazione cloud ibrida
// CodeLearn BETA V1.1.1a-1 - The Synch Update
//
// Modalità utente:
//   Normale       → sync cloud Supabase (se configurato)
//   -LOCAL        → solo localStorage, dati PERSISTENTI alla chiusura
//   -GUEST / -EXIT → solo localStorage, dati CANCELLATI alla chiusura
// ─────────────────────────────────────────────────────────────────────────────

import {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react';
import { detectDevice } from '../lib/deviceInfo';
import {
  createCloudUser, updateCloudUser, getUserByUsername,
  isSupabaseConfigured,
} from '../lib/supabase';

// ── Costanti ──────────────────────────────────────────────────────────────────

export const APP_VERSION      = '1.1.1a-7';
export const APP_VERSION_FULL = '1.1.1a-7 - The Synch Update';

/**
 * Nomi base che hanno accesso alla GodMode.
 * Funziona anche con qualsiasi suffisso speciale (-GUEST, -LOCAL, -EXIT, ecc.)
 */
const GODMODE_BASE_NAMES = new Set(['piboh']);

/** Ritorna true se il nome utente (con o senza suffisso) è un account GodMode */
export function isGodModeUser(name: string): boolean {
  if (!name) return false;
  // Rimuove TUTTI i suffissi speciali per estrarre il nome base
  // Supporta: -GUEST, -TEMP, -EXIT, -LOCAL (e qualsiasi combinazione)
  const base = name
    .replace(/-GUEST$/i, '')
    .replace(/-TEMP$/i, '')   // PiBOH-TEMP → GodMode ✓
    .replace(/-EXIT$/i, '')
    .replace(/-LOCAL$/i, '')
    .trim()
    .toLowerCase();
  return GODMODE_BASE_NAMES.has(base);
}

const LS_PROGRESS    = 'codelearn-progress';
const LS_ONBOARDING  = 'codelearn-onboarding';
const LS_USERNAME    = 'codelearn-username';
const LS_CLOUD_ID    = 'codelearn-cloud-id';
const LS_USER_MODE   = 'codelearn-user-mode';   // 'guest' | 'local' | 'cloud'
const LS_LAST_ACTIVE = 'codelearn-last-active';
const LS_PENDING     = 'codelearn-pending-badges';

// ── Tipi ──────────────────────────────────────────────────────────────────────

export interface UserProgress {
  completedLessons: string[];
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  courseProgress: Record<string, number>;
  startedCourses: string[];
}

/** 
 * guest  → -GUEST / -EXIT: locale, cancellato alla chiusura
 * local  → -LOCAL: locale, persistente
 * cloud  → utente normale con sync Supabase
 */
export type UserMode   = 'guest' | 'local' | 'cloud';
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

const defaultProgress: UserProgress = {
  completedLessons: [],
  xp: 0, level: 1, streak: 0,
  badges: [], courseProgress: {}, startedCourses: [],
};

// ── Helpers streak ────────────────────────────────────────────────────────────

function todayStr() { return new Date().toISOString().slice(0, 10); }

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function computeStreak(
  current: number, lastActive: string | null,
): { streak: number; lastActive: string } {
  const today = todayStr();
  if (!lastActive)          return { streak: 1, lastActive: today };
  if (lastActive === today) return { streak: current, lastActive: today };
  const diff = daysBetween(lastActive, today);
  if (diff === 1)           return { streak: current + 1, lastActive: today };
  return { streak: 1, lastActive: today };
}

// ── Badge helper ──────────────────────────────────────────────────────────────

function evaluateBadges(
  completed: number, level: number, streak: number,
  startedCourses: number, existing: string[],
): string[] {
  const add = (id: string) => !existing.includes(id) && existing.push(id);
  if (completed >= 1)      add('first-step');
  if (completed >= 5)      add('explorer');
  if (completed >= 10)     add('coder');
  if (completed >= 20)     add('rocket');
  if (level >= 5)          add('master');
  if (level >= 10)         add('crown');
  if (streak >= 7)         add('streak-7');
  if (startedCourses >= 3) add('polyglot');
  return existing;
}

// ── Rilevamento modalità dal nome ─────────────────────────────────────────────

/** Ritorna true per nomi che usano solo storage locale */
export function isOfflineUsername(name: string): boolean {
  const u = name.toUpperCase();
  return u.endsWith('-GUEST') || u.endsWith('-EXIT') || u.endsWith('-LOCAL');
}

/** Ritorna true solo per i nomi guest (dati cancellati alla chiusura) */
export function isGuestUsername(name: string): boolean {
  const u = name.toUpperCase();
  return u.endsWith('-GUEST') || u.endsWith('-EXIT');
}

/** Ritorna true per la modalità locale persistente */
export function isLocalUsername(name: string): boolean {
  return name.toUpperCase().endsWith('-LOCAL');
}

/** Determina la UserMode dal nome */
export function resolveUserMode(name: string): UserMode {
  if (isGuestUsername(name))  return 'guest';
  if (isLocalUsername(name))  return 'local';
  return 'cloud';
}

// ── Pulizia dati guest (NON usata per -LOCAL) ─────────────────────────────────

function clearGuestData() {
  [LS_PROGRESS, LS_USERNAME, LS_CLOUD_ID, LS_USER_MODE,
    LS_LAST_ACTIVE, LS_PENDING, LS_ONBOARDING].forEach(k =>
    localStorage.removeItem(k));
}

// ── Tipo context ──────────────────────────────────────────────────────────────

interface AppContextType {
  progress: UserProgress;
  username: string;
  onboardingDone: boolean;
  userMode: UserMode;
  isGuestMode: boolean;   // true solo per -GUEST/-EXIT (compat)
  isLocalMode: boolean;   // true solo per -LOCAL
  cloudUserId: string | null;
  syncStatus: SyncStatus;
  isGodMode: boolean;

  completeLesson: (
    lessonId: string, courseId: string, xp: number,
    onNewBadges?: (ids: string[]) => void,
  ) => void;
  hasCompleted:     (lessonId: string) => boolean;
  getCourseProgress:(courseId: string, totalLessons: number) => number;
  unlockBadge:      (badgeId: string) => void;

  setOnboardingDone:(v: boolean) => void;
  setUsername:      (v: string) => void;
  loginAs:          (username: string, forceNew?: boolean) => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {

  // Pulizia automatica all'avvio solo se la sessione precedente era GUEST
  // (non -LOCAL, i cui dati devono persistere)
  useEffect(() => {
    const prevMode = localStorage.getItem(LS_USER_MODE);
    if (prevMode === 'guest') {
      clearGuestData();
      window.location.reload();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── State ─────────────────────────────────────────────────────────────────

  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem(LS_PROGRESS);
    const base  = saved ? (JSON.parse(saved) as UserProgress) : defaultProgress;
    if (!base.startedCourses) base.startedCourses = [];
    return base;
  });

  const [onboardingDone, setOnboardingDoneState] = useState(
    () => localStorage.getItem(LS_ONBOARDING) === 'true',
  );
  const [username, setUsernameState] = useState(
    () => localStorage.getItem(LS_USERNAME) ?? '',
  );
  const [userMode, setUserMode] = useState<UserMode>(() => {
    const saved = localStorage.getItem(LS_USER_MODE);
    return (saved as UserMode | null) ?? 'cloud';
  });
  const [cloudUserId, setCloudUserId] = useState<string | null>(
    () => localStorage.getItem(LS_CLOUD_ID),
  );
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // GodMode: true se il nome corrente è un account privilegiato
  const [isGodMode, setIsGodMode] = useState(
    () => isGodModeUser(localStorage.getItem(LS_USERNAME) ?? ''),
  );

  // ── Blocco screenshot e selezione testo per utenti non-GodMode ─────────────
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    if (!isGodMode) {
      // Blocca selezione testo via CSS
      body.style.userSelect = 'none';
      body.style.webkitUserSelect = 'none';
      html.style.userSelect = 'none';
      html.style.webkitUserSelect = 'none';

      // Blocca tasto Print Screen e combinazioni comuni di screenshot
      const blockScreenshot = (e: KeyboardEvent) => {
        if (
          e.key === 'PrintScreen' ||
          (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac screenshot
          (e.ctrlKey && e.key === 'PrintScreen')
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener('keydown', blockScreenshot, true);

      // Su mobile: blocca il menu contestuale (long press)
      const blockContext = (e: Event) => e.preventDefault();
      document.addEventListener('contextmenu', blockContext);

      return () => {
        body.style.userSelect = '';
        body.style.webkitUserSelect = '';
        html.style.userSelect = '';
        html.style.webkitUserSelect = '';
        document.removeEventListener('keydown', blockScreenshot, true);
        document.removeEventListener('contextmenu', blockContext);
      };
    } else {
      // GodMode: rimuove tutte le restrizioni
      body.style.userSelect = '';
      body.style.webkitUserSelect = '';
      html.style.userSelect = '';
      html.style.webkitUserSelect = '';
    }
  }, [isGodMode]);

  // Computed shortcuts
  const isGuestMode = userMode === 'guest';
  const isLocalMode = userMode === 'local';

  // refs anti-stale-closure
  const userModeRef = useRef(userMode);
  const cloudIdRef  = useRef(cloudUserId);
  const syncTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { userModeRef.current = userMode; }, [userMode]);
  useEffect(() => { cloudIdRef.current  = cloudUserId; }, [cloudUserId]);

  // Pulizia guest SOLO su chiusura tab/WebView, mai per -LOCAL
  useEffect(() => {
    const onUnload = () => {
      if (userModeRef.current === 'guest') clearGuestData();
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, []);

  // ── Cloud sync debounced ──────────────────────────────────────────────────

  const syncToCloud = useCallback(async (p: UserProgress) => {
    if (userModeRef.current !== 'cloud') return;
    if (!cloudIdRef.current || !isSupabaseConfigured()) return;
    setSyncStatus('syncing');
    try {
      const { platform, deviceDetails } = detectDevice();
      await updateCloudUser(cloudIdRef.current, {
        last_version: APP_VERSION, platform,
        device_info: deviceDetails, progress_data: p,
      });
      setSyncStatus('synced');
    } catch (err) {
      console.warn('[CodeLearn] sync error:', err);
      setSyncStatus('error');
    }
  }, []);

  const debouncedSync = useCallback((p: UserProgress) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => syncToCloud(p), 2000);
  }, [syncToCloud]);

  // ── loginAs ───────────────────────────────────────────────────────────────

  const loginAs = useCallback(async (name: string, forceNew = false) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const mode = resolveUserMode(trimmed);

    // Imposta GodMode subito, prima di qualsiasi redirect
    setIsGodMode(isGodModeUser(trimmed));

    // ── Modalità GUEST (-GUEST / -EXIT) ───────────────────────────────────
    if (mode === 'guest') {
      setUserMode('guest');
      userModeRef.current = 'guest';
      localStorage.setItem(LS_USER_MODE, 'guest');
      setUsernameState(trimmed);
      localStorage.setItem(LS_USERNAME, trimmed);
      setSyncStatus('offline');
      return;
    }

    // ── Modalità LOCAL (-LOCAL) ──────────────────────────────────────────
    if (mode === 'local') {
      setUserMode('local');
      userModeRef.current = 'local';
      localStorage.setItem(LS_USER_MODE, 'local');
      setUsernameState(trimmed);
      localStorage.setItem(LS_USERNAME, trimmed);
      setSyncStatus('offline');
      return;
    }

    // ── Modalità CLOUD (utente normale) ─────────────────────────────────
    if (!isSupabaseConfigured()) {
      setUserMode('local');
      userModeRef.current = 'local';
      localStorage.setItem(LS_USER_MODE, 'local');
      setUsernameState(trimmed);
      localStorage.setItem(LS_USERNAME, trimmed);
      setSyncStatus('offline');
      return;
    }

    setSyncStatus('syncing');
    try {
      const { platform, deviceDetails } = detectDevice();

      if (!forceNew) {
        const existing = await getUserByUsername(trimmed);
        if (existing) {
          const cp: UserProgress = {
            ...defaultProgress, ...(existing.progress_data ?? {}),
          };
          if (!cp.startedCourses) cp.startedCourses = [];
          setProgress(cp);
          localStorage.setItem(LS_PROGRESS, JSON.stringify(cp));

          setCloudUserId(existing.id);
          cloudIdRef.current = existing.id;
          localStorage.setItem(LS_CLOUD_ID, existing.id);
          setUsernameState(trimmed);
          localStorage.setItem(LS_USERNAME, trimmed);
          setUserMode('cloud');
          userModeRef.current = 'cloud';
          localStorage.setItem(LS_USER_MODE, 'cloud');

          await updateCloudUser(existing.id, {
            last_version: APP_VERSION, platform, device_info: deviceDetails,
          });
          setSyncStatus('synced');
          return;
        }
      }

      // Crea nuovo utente
      const created = await createCloudUser({
        username: trimmed, last_version: APP_VERSION,
        platform, device_info: deviceDetails,
        progress_data: progress,
      });
      setCloudUserId(created.id);
      cloudIdRef.current = created.id;
      localStorage.setItem(LS_CLOUD_ID, created.id);
      setUsernameState(trimmed);
      localStorage.setItem(LS_USERNAME, trimmed);
      setUserMode('cloud');
      userModeRef.current = 'cloud';
      localStorage.setItem(LS_USER_MODE, 'cloud');
      setSyncStatus('synced');
    } catch (err) {
      console.warn('[CodeLearn] loginAs error:', err);
      setUsernameState(trimmed);
      localStorage.setItem(LS_USERNAME, trimmed);
      setUserMode('local');
      userModeRef.current = 'local';
      localStorage.setItem(LS_USER_MODE, 'local');
      setSyncStatus('error');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  // ── setUsername (compat) ──────────────────────────────────────────────────

  const setUsername = useCallback((v: string) => {
    setUsernameState(v);
    localStorage.setItem(LS_USERNAME, v);
  }, []);

  // ── unlockBadge ───────────────────────────────────────────────────────────

  const unlockBadge = useCallback((badgeId: string) => {
    setProgress(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      const next = { ...prev, badges: [...prev.badges, badgeId] };
      localStorage.setItem(LS_PROGRESS, JSON.stringify(next));
      debouncedSync(next);
      return next;
    });
  }, [debouncedSync]);

  // ── completeLesson ────────────────────────────────────────────────────────

  const completeLesson = useCallback((
    lessonId: string, courseId: string, xp: number,
    onNewBadges?: (ids: string[]) => void,
  ) => {
    setProgress(prev => {
      if (prev.completedLessons.includes(lessonId)) return prev;

      const newCompleted = [...prev.completedLessons, lessonId];
      const newXp        = prev.xp + xp;
      const newLevel     = Math.floor(newXp / 100) + 1;
      const newCP        = { ...prev.courseProgress };
      newCP[courseId]    = (newCP[courseId] ?? 0) + 1;
      const newStarted   = prev.startedCourses.includes(courseId)
        ? prev.startedCourses : [...prev.startedCourses, courseId];

      const lastActive = localStorage.getItem(LS_LAST_ACTIVE);
      const { streak: newStreak, lastActive: nla } =
        computeStreak(prev.streak, lastActive);
      localStorage.setItem(LS_LAST_ACTIVE, nla);

      const newBadges = evaluateBadges(
        newCompleted.length, newLevel, newStreak, newStarted.length,
        [...prev.badges],
      );
      const justUnlocked = newBadges.filter(id => !prev.badges.includes(id));
      if (justUnlocked.length > 0 && onNewBadges) {
        localStorage.setItem(LS_PENDING, JSON.stringify(justUnlocked));
      }

      const next: UserProgress = {
        ...prev, completedLessons: newCompleted,
        xp: newXp, level: newLevel, streak: newStreak,
        badges: newBadges, courseProgress: newCP, startedCourses: newStarted,
      };
      localStorage.setItem(LS_PROGRESS, JSON.stringify(next));
      debouncedSync(next);
      return next;
    });

    setTimeout(() => {
      const pending = localStorage.getItem(LS_PENDING);
      if (pending) {
        localStorage.removeItem(LS_PENDING);
        const ids: string[] = JSON.parse(pending);
        if (ids.length > 0) onNewBadges?.(ids);
      }
    }, 350);
  }, [debouncedSync]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const hasCompleted = useCallback(
    (lid: string) => progress.completedLessons.includes(lid),
    [progress.completedLessons],
  );
  const getCourseProgress = useCallback(
    (cid: string, total: number) =>
      Math.round(((progress.courseProgress[cid] ?? 0) / total) * 100),
    [progress.courseProgress],
  );
  const setOnboardingDone = useCallback((v: boolean) => {
    setOnboardingDoneState(v);
    localStorage.setItem(LS_ONBOARDING, String(v));
  }, []);

  // ── Provider ──────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider value={{
      progress, username, onboardingDone,
      userMode, isGuestMode, isLocalMode, isGodMode,
      cloudUserId, syncStatus,
      completeLesson, hasCompleted, getCourseProgress, unlockBadge,
      setOnboardingDone, setUsername, loginAs,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve essere usato dentro AppProvider');
  return ctx;
}
