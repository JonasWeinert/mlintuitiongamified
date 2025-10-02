import React, { useState, useCallback, useMemo } from 'react';
import { ChapterContent, COURSE_STRUCTURE } from './components/ChapterContent';

const totalSteps = COURSE_STRUCTURE.reduce((acc, chapter) => acc + chapter.steps.length, 0);

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
}> = ({ onPrev, onNext, isFirstStep, isLastStep }) => (
  <div className="flex justify-between w-full">
    <button
      onClick={onPrev}
      disabled={isFirstStep}
      className="px-6 py-2 bg-slate-700 text-white rounded-lg shadow-md hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
    >
      Previous
    </button>
    <button
      onClick={onNext}
      disabled={isLastStep}
      className="px-6 py-2 bg-brand-accent text-white font-bold rounded-lg shadow-md hover:bg-brand-blue disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
    >
      {isLastStep ? 'Finish' : 'Next'}
    </button>
  </div>
);

const App: React.FC = () => {
  const [progress, setProgress] = useState({ chapter: 0, step: 0 });

  const currentStepNumber = useMemo(() => {
    let steps = 0;
    for (let i = 0; i < progress.chapter; i++) {
      steps += COURSE_STRUCTURE[i].steps.length;
    }
    return steps + progress.step + 1;
  }, [progress]);

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
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-blue mb-2">The Art of Prediction</h1>
          <p className="text-center text-slate-400 text-lg mb-6">Learning from Data with Linear Regression</p>
          <ProgressBar current={currentStepNumber} total={totalSteps} />
        </header>

        <main className="mb-8">
          <ChapterContent 
            key={`${progress.chapter}-${progress.step}`} 
            chapter={progress.chapter} 
            step={progress.step} 
          />
        </main>

        <footer className="mt-auto">
          <Navigation
            onPrev={handlePrev}
            onNext={handleNext}
            isFirstStep={isFirstStep}
            isLastStep={isLastStep}
          />
        </footer>
      </div>
    </div>
  );
};

export default App;