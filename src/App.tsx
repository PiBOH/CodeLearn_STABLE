import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import BottomNav from './components/BottomNav';
import CoursePath from './components/CoursePath';
import LessonView from './components/LessonView';
import Profile from './components/Profile';
import CoursesList from './components/CoursesList';
import BadgesPage from './components/BadgesPage';
import Leaderboard from './components/Leaderboard';
import CareerPaths from './components/CareerPaths';

function AppContent() {
  const { onboardingDone } = useApp();
  const location = useLocation();

  if (!onboardingDone) {
    return <Onboarding />;
  }

  const showNav = ['/', '/courses', '/badges', '/profile'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<CoursesList />} />
            <Route path="/course/:courseId" element={<CoursePath />} />
            <Route path="/lesson/:lessonId" element={<LessonView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/careers" element={<CareerPaths />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
