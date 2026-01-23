
import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus, Question, Score, Bird } from './types';
import { generateQuestion } from './gameLogic';
import { ChevronRight, Trophy, RotateCcw, Bird as BirdIcon, CheckCircle, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.START);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedBirdId, setSelectedBirdId] = useState<string | null>(null);
  const [score, setScore] = useState<Score>({ correct: 0, total: 0 });
  const [isAnswered, setIsAnswered] = useState(false);

  // Load a new question
  const loadNewQuestion = useCallback(() => {
    setCurrentQuestion(generateQuestion());
    setSelectedBirdId(null);
    setIsAnswered(false);
    setStatus(GameStatus.PLAYING);
  }, []);

  const handleStartGame = () => {
    setScore({ correct: 0, total: 0 });
    loadNewQuestion();
  };

  const handleOptionClick = (bird: Bird) => {
    if (isAnswered) return;
    
    setSelectedBirdId(bird.id);
    setIsAnswered(true);
    
    const isCorrect = bird.id === currentQuestion?.correctBird.id;
    setScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1
    }));
  };

  const handleNextQuestion = () => {
    loadNewQuestion();
  };

  const resetGame = () => {
    setStatus(GameStatus.START);
    setScore({ correct: 0, total: 0 });
  };

  if (status === GameStatus.START) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-emerald-900 text-white relative overflow-hidden">
        {/* Decorative Background Icons */}
        <BirdIcon className="absolute -top-10 -left-10 w-64 h-64 text-emerald-800 opacity-20 rotate-12" />
        <BirdIcon className="absolute -bottom-10 -right-10 w-64 h-64 text-emerald-800 opacity-20 -rotate-12" />

        <div className="z-10 text-center max-w-lg">
          <div className="inline-block p-4 bg-emerald-800 rounded-full mb-6 shadow-xl border-4 border-emerald-700">
            <BirdIcon className="w-16 h-16 text-yellow-400" />
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight drop-shadow-lg">Avian IQ</h1>
          <p className="text-emerald-100 text-lg mb-10 font-medium">
            Identify 94 unique bird species from California and beyond.
            Infinite levels, smart challenges, and stunning photography.
          </p>
          <button
            onClick={handleStartGame}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-emerald-600 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 hover:bg-emerald-500 shadow-2xl"
          >
            Start Guessing
            <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200">
      {/* Header / Scoreboard */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BirdIcon className="text-emerald-600 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">Avian IQ</span>
        </div>
        
        <div className="flex items-center bg-stone-100 rounded-full px-4 py-1.5 shadow-inner">
          <Trophy className="w-4 h-4 text-yellow-500 mr-2" />
          <span className="font-bold text-stone-700">
            {score.correct} <span className="text-stone-400 text-sm mx-1">/</span> {score.total}
          </span>
        </div>
        
        <button onClick={resetGame} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <RotateCcw className="w-5 h-5 text-stone-500" />
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {currentQuestion && (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Image Section */}
            <div className="w-full lg:w-3/5 bg-stone-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <div className="aspect-square relative group bg-stone-200 flex items-center justify-center">
                <img
                  src={currentQuestion.imageUrl}
                  alt="Guess the bird"
                  className="max-w-full max-h-full object-contain transition-transform duration-500"
                />
                {isAnswered && (
                   <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                      {selectedBirdId === currentQuestion.correctBird.id ? (
                        <div className="bg-emerald-500 p-6 rounded-full shadow-2xl animate-bounce">
                          <CheckCircle className="w-20 h-20 text-white" />
                        </div>
                      ) : (
                        <div className="bg-red-500 p-6 rounded-full shadow-2xl animate-shake">
                          <XCircle className="w-20 h-20 text-white" />
                        </div>
                      )}
                   </div>
                )}
              </div>
            </div>

            {/* Options Section */}
            <div className="w-full lg:w-2/5 flex flex-col space-y-4">
              <div className="mb-2">
                <h2 className="text-2xl font-black text-stone-800 mb-1">Which bird is this?</h2>
                <p className="text-stone-500 text-sm font-medium uppercase tracking-widest">Select the correct name</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option) => {
                  const isCorrect = option.id === currentQuestion.correctBird.id;
                  const isSelected = option.id === selectedBirdId;
                  
                  let buttonClass = "w-full text-left px-6 py-5 rounded-2xl border-2 transition-all duration-200 font-bold text-lg ";
                  
                  if (!isAnswered) {
                    buttonClass += "bg-white border-stone-200 hover:border-emerald-500 hover:shadow-lg hover:-translate-y-0.5 text-stone-700";
                  } else {
                    if (isCorrect) {
                      buttonClass += "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md ring-2 ring-emerald-500 ring-opacity-20";
                    } else if (isSelected) {
                      buttonClass += "bg-red-50 border-red-500 text-red-700 shadow-md ring-2 ring-red-500 ring-opacity-20";
                    } else {
                      buttonClass += "bg-stone-50 border-transparent text-stone-400 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionClick(option)}
                      disabled={isAnswered}
                      className={buttonClass}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.name}</span>
                        {isAnswered && isCorrect && <CheckCircle className="w-6 h-6" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-6 h-6" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-800 text-sm font-medium">
                      <span className="font-bold">Did you know?</span> {currentQuestion.correctBird.name} is part of the <span className="underline decoration-emerald-400">{currentQuestion.correctBird.group}</span> group.
                    </p>
                  </div>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black text-xl hover:bg-stone-800 shadow-xl flex items-center justify-center group"
                  >
                    Next Bird
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default App;
