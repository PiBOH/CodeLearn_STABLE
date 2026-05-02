import { motion } from 'framer-motion';
import { Star, Flame, Award, TrendingUp, Code2, BookOpen, Zap, BarChart3, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { courses } from '../data/courses';
import { useNavigate } from 'react-router-dom';

const badgeInfo: Record<string, { label: string; icon: React.ElementType; color: string; bg: string; desc: string }> = {
  'first-step': { label: 'Primo Passo', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Hai completato la tua prima lezione' },
  'explorer': { label: 'Esploratore', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50', desc: '5 lezioni completate' },
  'coder': { label: 'Coder', icon: Code2, color: 'text-violet-600', bg: 'bg-violet-50', desc: '10 lezioni completate' },
  'master': { label: 'Maestro', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'Raggiunto livello 5' },
};

export default function Profile() {
  const { progress, username } = useApp();
  const navigate = useNavigate();
  const xpToNext = 100 - (progress.xp % 100);

  const courseProgressData = courses.map(c => ({
    name: c.name,
    pct: Math.min(100, Math.round(((progress.courseProgress[c.id] || 0) / c.totalLessons) * 100)),
    color: c.color,
    bg: c.bgColor,
  })).filter(c => c.pct > 0);

  const activityDays = [30, 45, 20, 60, 40, 80, 55, 35, 70, 90, 50, 25, 65, 85, 40, 75, 95, 30, 55, 70, 45, 85, 60, 40, 90, 50, 75, 35, 65, 80];

  return (
    <div className="pb-24 pt-6 px-5 max-w-lg mx-auto min-h-screen bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg shadow-indigo-200">
          <Code2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">{username || 'Coder'}</h1>
        <p className="text-slate-500 text-sm">Livello {progress.level} • {progress.xp} XP totali</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-800">Progresso Livello</span>
          </div>
          <span className="text-sm font-bold text-indigo-600">{progress.level}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(progress.xp % 100)}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs text-center">{xpToNext} XP al prossimo livello</p>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Flame, label: 'Streak', value: `${progress.streak} gg`, color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: BookOpen, label: 'Lezioni', value: `${progress.completedLessons.length}`, color: 'text-blue-500', bg: 'bg-blue-50' },
          { icon: TrendingUp, label: 'Livello', value: `${progress.level}`, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <h2 className="font-bold text-slate-800">Attività mensile</h2>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {activityDays.map((val, i) => (
            <div
              key={i}
              className="aspect-square rounded-md transition-all"
              style={{
                backgroundColor: val > 70 ? '#6366f1' : val > 40 ? '#a5b4fc' : val > 20 ? '#e0e7ff' : '#f1f5f9',
              }}
              title={`Giorno ${i + 1}: ${val}% attività`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
          <span>Meno</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-100" />
            <div className="w-3 h-3 rounded-sm bg-indigo-100" />
            <div className="w-3 h-3 rounded-sm bg-indigo-300" />
            <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          </div>
          <span>Più</span>
        </div>
      </motion.div>

      {courseProgressData.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            <h2 className="font-bold text-slate-800">Progressi per corso</h2>
          </div>
          <div className="space-y-3">
            {courseProgressData.map((c, i) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                  <span className="text-[10px] font-bold text-slate-500">{c.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.pct}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <h2 className="text-lg font-bold text-slate-800 mb-4">I tuoi badge</h2>
      <div className="space-y-3">
        {Object.keys(badgeInfo).map((key, i) => {
          const info = badgeInfo[key];
          const unlocked = progress.badges.includes(key);
          const Icon = info.icon;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                unlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-100 border-slate-200 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${unlocked ? info.bg : 'bg-slate-200'}`}>
                <Icon className={`w-6 h-6 ${unlocked ? info.color : 'text-slate-400'}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-sm ${unlocked ? 'text-slate-800' : 'text-slate-500'}`}>{info.label}</h3>
                <p className="text-xs text-slate-500">{info.desc}</p>
              </div>
              {unlocked && <Award className="w-5 h-5 text-amber-500" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
