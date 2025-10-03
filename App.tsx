import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ChapterContent, COURSE_STRUCTURE } from './components/ChapterContent';

const totalSteps = COURSE_STRUCTURE.reduce((acc, chapter) => acc + chapter.steps.length, 0);

interface GameStats {
  points: number;
  streak: number;
  bestStreak: number;
  perfectAnswers: number;
  totalQuizzes: number;
  badges: string[];
}

const BADGES = [
  { id: 'first_correct', name: 'First Success', emoji: '🎯', condition: (stats: GameStats) => stats.perfectAnswers >= 1 },
  { id: 'streak_3', name: 'On Fire', emoji: '🔥', condition: (stats: GameStats) => stats.streak >= 3 },
  { id: 'streak_5', name: 'Combo Master', emoji: '⚡', condition: (stats: GameStats) => stats.bestStreak >= 5 },
  { id: 'streak_10', name: 'Unstoppable', emoji: '💥', condition: (stats: GameStats) => stats.bestStreak >= 10 },
  { id: 'perfectionist', name: 'Perfectionist', emoji: '⭐', condition: (stats: GameStats) => stats.perfectAnswers >= 5 },
  { id: 'points_50', name: 'Rising Star', emoji: '🌟', condition: (stats: GameStats) => stats.points >= 50 },
  { id: 'points_100', name: 'Century', emoji: '💯', condition: (stats: GameStats) => stats.points >= 100 },
  { id: 'points_200', name: 'Elite Scholar', emoji: '🏆', condition: (stats: GameStats) => stats.points >= 200 },
  { id: 'completionist', name: 'Completionist', emoji: '✨', condition: (stats: GameStats) => stats.totalQuizzes >= 12 },
  { id: 'master', name: 'Regression Master', emoji: '👑', condition: (stats: GameStats) => stats.totalQuizzes >= 12 && stats.perfectAnswers >= 10 },
];

const IntroModal: React.FC<{ onClose: () => void; feedbackMode: boolean; setFeedbackMode: (mode: boolean) => void }> = ({ onClose, feedbackMode, setFeedbackMode }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-2 border-brand-blue shadow-2xl">
        <div className="p-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-blue mb-4 text-center">🎓 Welcome to The Art of Prediction!</h2>
          
          <div className="space-y-4 text-slate-300">
            <p className="text-center text-sm sm:text-base">Learn linear regression through interactive lessons and earn rewards as you master the concepts!</p>
            
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-brand-blue text-sm sm:text-base flex items-center gap-2">
                <span>🎮</span> How It Works
              </h3>
              
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-green-400 font-bold">✓</span>
                  <span><strong className="text-green-400">First try correct:</strong> +15 points, streak continues!</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-400 font-bold">💡</span>
                  <span><strong className="text-yellow-400">Wrong answer:</strong> Get a hint, try again! (Fewer points but you still earn!)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-400 font-bold">🔥</span>
                  <span><strong className="text-orange-400">Streak Bonus:</strong> 5+ streak = 2x points! 10+ = 3x points!</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-bold">🎁</span>
                  <span><strong className="text-purple-400">Chapter Bonus:</strong> Complete a chapter for extra rewards!</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2">
              <h3 className="font-bold text-brand-blue text-sm sm:text-base flex items-center gap-2">
                <span>🏆</span> Unlock Badges
              </h3>
              <div className="flex flex-wrap gap-2 justify-center text-xs sm:text-sm">
                {BADGES.map(badge => (
                  <div key={badge.id} className="px-2 py-1 bg-slate-700 rounded-full flex items-center gap-1">
                    <span>{badge.emoji}</span>
                    <span className="text-[10px] sm:text-xs">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-brand-blue/20 to-purple-500/20 rounded-lg p-3 text-center text-xs sm:text-sm border border-brand-blue/30">
              <p className="font-semibold">Every 50 points = Level Up! 🎯</p>
              <p className="text-slate-400 text-[10px] sm:text-xs mt-1">Progress is saved automatically</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex-1">
                <span className="text-sm sm:text-base font-semibold text-slate-200">💬 Feedback Mode</span>
                <p className="text-xs text-slate-400 mt-1">Enable to provide feedback on each step via GitHub</p>
              </div>
              <div className="relative ml-4">
                <input
                  type="checkbox"
                  checked={feedbackMode}
                  onChange={(e) => setFeedbackMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:bg-brand-blue transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-accent text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform text-sm sm:text-base"
          >
            Start Learning! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

const GamificationDisplay: React.FC<{ stats: GameStats; showAnimation: string | null; onShowIntro: () => void }> = ({ stats, showAnimation, onShowIntro }) => {
  const level = Math.floor(stats.points / 50) + 1;
  const xpProgress = ((stats.points % 50) / 50) * 100;
  const multiplier = stats.streak >= 10 ? 3 : stats.streak >= 5 ? 2 : 1;

  return (
    <div className="bg-slate-800/50 rounded-lg p-3 mb-4 border border-slate-700/50">
      {/* Compact Stats Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-brand-blue text-lg sm:text-xl font-bold">{stats.points}</span>
            <span className="text-[10px] text-slate-500">pts</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-orange-400 text-base sm:text-lg">🔥</span>
            <span className="text-orange-400 font-bold text-sm sm:text-base">{stats.streak}</span>
            {multiplier > 1 && (
              <span className="text-xs font-bold text-yellow-400 animate-pulse">×{multiplier}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-green-400 text-base sm:text-lg">⭐</span>
            <span className="text-green-400 font-bold text-sm sm:text-base">{stats.perfectAnswers}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-purple-400 font-bold text-sm sm:text-base">Lv.{level}</div>
          <button
            onClick={onShowIntro}
            className="text-slate-400 hover:text-brand-blue transition-colors text-lg"
            title="How it works"
          >
            ℹ️
          </button>
        </div>
      </div>
      
      {/* Compact XP Bar */}
      <div className="mb-2">
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-gradient-to-r from-brand-blue to-purple-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Compact Badges */}
      {stats.badges.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {BADGES.filter(b => stats.badges.includes(b.id)).map(badge => (
            <div
              key={badge.id}
              className="px-2 py-0.5 bg-slate-700 rounded-full text-xs flex items-center gap-1 hover:scale-110 transition-transform"
              title={badge.name}
            >
              <span className="text-sm">{badge.emoji}</span>
              <span className="hidden sm:inline text-[10px]">{badge.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Floating Animation */}
      {showAnimation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="text-4xl sm:text-6xl animate-bounce-up opacity-0">
            {showAnimation}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => {
  const progressPercentage = (current / total) * 100;
  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5">
      <div
        className="bg-brand-blue h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

const Navigation: React.FC<{
  onPrev: () => void;
  onNext: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
}> = ({ onPrev, onNext, isFirstStep, isLastStep, canProceed }) => (
  <div className="flex justify-between gap-2 w-full">
    <button
      onClick={onPrev}
      disabled={isFirstStep}
      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-slate-700 text-white rounded-lg shadow-md hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
    >
      ← Previous
    </button>
    <button
      onClick={onNext}
      disabled={isLastStep || !canProceed}
      className="px-4 sm:px-6 py-2 sm:py-2.5 bg-brand-accent text-white font-bold rounded-lg shadow-md hover:bg-brand-blue disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
      title={!canProceed ? 'Complete the quiz to continue' : ''}
    >
      {isLastStep ? 'Finish ✓' : 'Next →'}
    </button>
  </div>
);

const App: React.FC = () => {
  const [progress, setProgress] = useState({ chapter: 0, step: 0 });
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('ml-tutor-stats');
    return saved ? JSON.parse(saved) : {
      points: 0,
      streak: 0,
      bestStreak: 0,
      perfectAnswers: 0,
      totalQuizzes: 0,
      badges: []
    };
  });
  const [showAnimation, setShowAnimation] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(() => {
    return !localStorage.getItem('ml-tutor-intro-seen');
  });
  const [currentStepCompleted, setCurrentStepCompleted] = useState(false);
  const [feedbackMode, setFeedbackMode] = useState(() => {
    const saved = localStorage.getItem('ml-tutor-feedback-mode');
    return saved === 'true';
  });

  const handleCloseIntro = () => {
    localStorage.setItem('ml-tutor-intro-seen', 'true');
    setShowIntro(false);
  };

  // Save feedback mode preference
  useEffect(() => {
    localStorage.setItem('ml-tutor-feedback-mode', feedbackMode.toString());
  }, [feedbackMode]);

  // Reset completion status when step changes
  useEffect(() => {
    setCurrentStepCompleted(true); // Default to true (allow navigation for non-quiz steps)
    
    const handleQuizPresent = () => {
      setCurrentStepCompleted(false); // Quiz detected, require completion
    };
    
    window.addEventListener('quiz-present', handleQuizPresent);
    
    return () => {
      window.removeEventListener('quiz-present', handleQuizPresent);
    };
  }, [progress.chapter, progress.step]);

  const currentStepNumber = useMemo(() => {
    let steps = 0;
    for (let i = 0; i < progress.chapter; i++) {
      steps += COURSE_STRUCTURE[i].steps.length;
    }
    return steps + progress.step + 1;
  }, [progress]);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('ml-tutor-stats', JSON.stringify(stats));
  }, [stats]);

  // Check for new badges
  const checkBadges = useCallback((newStats: GameStats) => {
    const newBadges = BADGES
      .filter(badge => !newStats.badges.includes(badge.id) && badge.condition(newStats))
      .map(badge => badge.id);
    
    if (newBadges.length > 0) {
      const badge = BADGES.find(b => b.id === newBadges[0]);
      if (badge) {
        setShowAnimation(`${badge.emoji} ${badge.name}!`);
        setTimeout(() => setShowAnimation(null), 2000);
      }
      return [...newStats.badges, ...newBadges];
    }
    return newStats.badges;
  }, []);

  // Handle quiz events
  useEffect(() => {
    const handleCorrect = (e: Event) => {
      const customEvent = e as CustomEvent;
      const attempts = customEvent.detail.attempts;
      const isPerfect = attempts === 1;
      
      // Mark current step as completed
      setCurrentStepCompleted(true);
      
      setStats(prev => {
        const newStreak = prev.streak + 1;
        const multiplier = newStreak >= 10 ? 3 : newStreak >= 5 ? 2 : 1;
        const basePoints = isPerfect ? 15 : Math.max(5, 15 - (attempts - 1) * 3);
        const pointsEarned = basePoints * multiplier;
        
        const newStats = {
          ...prev,
          points: prev.points + pointsEarned,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          perfectAnswers: prev.perfectAnswers + (isPerfect ? 1 : 0),
          totalQuizzes: prev.totalQuizzes + 1,
        };
        
        newStats.badges = checkBadges(newStats);
        
        // Show animation with multiplier
        let animationText = '';
        if (multiplier > 1) {
          animationText = `🔥 +${pointsEarned} (×${multiplier})`;
        } else if (isPerfect) {
          animationText = '🎯 +15!';
        } else {
          animationText = `+${pointsEarned}`;
        }
        setShowAnimation(animationText);
        setTimeout(() => setShowAnimation(null), 1500);
        
        return newStats;
      });
    };

    const handleWrong = () => {
      setStats(prev => {
        const lostStreak = prev.streak > 0;
        if (lostStreak && prev.streak >= 3) {
          setShowAnimation('💔 Streak lost!');
          setTimeout(() => setShowAnimation(null), 1500);
        }
        return {
          ...prev,
          streak: 0
        };
      });
    };

    const handleChapterComplete = () => {
      setStats(prev => {
        const bonus = 25;
        const newStats = {
          ...prev,
          points: prev.points + bonus
        };
        newStats.badges = checkBadges(newStats);
        
        setShowAnimation('🎉 Chapter Complete! +25');
        setTimeout(() => setShowAnimation(null), 2000);
        
        return newStats;
      });
    };

    window.addEventListener('quiz-correct', handleCorrect);
    window.addEventListener('quiz-wrong', handleWrong);
    window.addEventListener('chapter-complete', handleChapterComplete);

    return () => {
      window.removeEventListener('quiz-correct', handleCorrect);
      window.removeEventListener('quiz-wrong', handleWrong);
      window.removeEventListener('chapter-complete', handleChapterComplete);
    };
  }, [checkBadges]);

  const handleNext = useCallback(() => {
    setProgress(prev => {
      const isLastStepInChapter = prev.step === COURSE_STRUCTURE[prev.chapter].steps.length - 1;
      const isLastChapter = prev.chapter === COURSE_STRUCTURE.length - 1;

      if (isLastStepInChapter && isLastChapter) return prev;
      if (isLastStepInChapter) return { chapter: prev.chapter + 1, step: 0 };
      return { ...prev, step: prev.step + 1 };
    });
  }, []);

  const handlePrev = useCallback(() => {
    setProgress(prev => {
      const isFirstStepInChapter = prev.step === 0;
      const isFirstChapter = prev.chapter === 0;

      if (isFirstStepInChapter && isFirstChapter) return prev;
      if (isFirstStepInChapter) {
        const prevChapterIndex = prev.chapter - 1;
        const lastStepInPrevChapter = COURSE_STRUCTURE[prevChapterIndex].steps.length - 1;
        return { chapter: prevChapterIndex, step: lastStepInPrevChapter };
      }
      return { ...prev, step: prev.step - 1 };
    });
  }, []);

  const isFirstStep = progress.chapter === 0 && progress.step === 0;
  const isLastStep = progress.chapter === COURSE_STRUCTURE.length - 1 && progress.step === COURSE_STRUCTURE[progress.chapter].steps.length - 1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-3 sm:p-6">
      {showIntro && <IntroModal onClose={handleCloseIntro} feedbackMode={feedbackMode} setFeedbackMode={setFeedbackMode} />}
      
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-brand-blue mb-1">The Art of Prediction</h1>
          <p className="text-center text-slate-400 text-sm sm:text-base">Learning from Data with Linear Regression</p>
        </header>

        <GamificationDisplay stats={stats} showAnimation={showAnimation} onShowIntro={() => setShowIntro(true)} />

        <main className="mb-4">
          <ChapterContent 
            key={`${progress.chapter}-${progress.step}`} 
            chapter={progress.chapter} 
            step={progress.step}
            feedbackMode={feedbackMode}
            userStats={stats}
          />
        </main>

        <footer className="mt-auto sticky bottom-0 bg-slate-900 pt-3 pb-2">
          <Navigation
            onPrev={handlePrev}
            onNext={handleNext}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
            canProceed={currentStepCompleted}
          />
        </footer>
      </div>
    </div>
  );
};

export default App;