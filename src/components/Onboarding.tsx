import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Trophy, Zap, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const slides = [
  {
    icon: Code2,
    title: 'Impara a Programmare',
    desc: 'Inizia il tuo viaggio nel mondo del coding con lezioni interattive e pratiche.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
  },
  {
    icon: Zap,
    title: 'Esercizi Pratici',
    desc: 'Scrivi codice reale nel nostro editor integrato e vedi i risultati istantaneamente.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Trophy,
    title: 'Livelli e Badge',
    desc: 'Guadagna XP, sblocca badge e scala la classifica mentre impari.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const { setOnboardingDone, setUsername, username } = useApp();
  const [nameInput, setNameInput] = useState('');

  const next = () => {
    if (step < slides.length - 1) setStep(s => s + 1);
  };

  const finish = () => {
    if (nameInput.trim()) setUsername(nameInput.trim());
    setOnboardingDone(true);
  };

  const SlideIcon = slides[step].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-fuchsia-50 flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          <div className={`w-24 h-24 mx-auto rounded-3xl ${slides[step].bg} flex items-center justify-center mb-8 shadow-lg`}>
            <SlideIcon className={`w-12 h-12 ${slides[step].color}`} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">{slides[step].title}</h1>
          <p className="text-slate-600 text-center text-lg leading-relaxed mb-10">{slides[step].desc}</p>

          {step === slides.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-2">Come ti chiami?</label>
              <input
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                placeholder="Il tuo nome"
                className="w-full px-4 py-3 rounded-xl border-2 border-indigo-100 focus:border-indigo-500 focus:outline-none text-slate-800 bg-white shadow-sm"
              />
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mb-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-indigo-500' : 'w-2 bg-indigo-200'}`}
          />
        ))}
      </div>

      {step < slides.length - 1 ? (
        <button
          onClick={next}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          Avanti <ChevronRight className="w-5 h-5" />
        </button>
      ) : (
        <button
          onClick={finish}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
        >
          Inizia <Sparkles className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
