"use client";

import { useEffect, useMemo, useState, useCallback, memo } from 'react';
import { calculateScore, generateBoard, sigmoid, solveBoard } from '../utils/gameLogic';
import { validateWeights, validateDictionary, type Weights, type Difficulty } from '../utils/validation';
import { logger } from '../utils/logger';

type Turn = 'player' | 'ai';

const WIN_SCORE = 75;

const AI_DELAY_MS: Record<Difficulty, number> = {
  easy: 1200,
  medium: 900,
  hard: 700,
};

const DIFFICULTY_MULTIPLIER: Record<Difficulty, number> = {
  easy: 0.85,
  medium: 0.9,
  hard: 1.15,
};

const MIN_AI_THRESHOLD: Record<Difficulty, number> = {
  easy: 0.42,
  medium: 0.42,
  hard: 0.3,
};

function chooseAiWord(
  words: string[],
  frequencies: Record<string, number>,
  weights: Weights,
  difficulty: Difficulty
): string {
  let bestWord = '';
  let bestScore = 0;

  for (const word of words) {
    const length = word.length;
    const score = calculateScore(word);
    const freq = frequencies[word] ?? 0;

    const z =
      weights.bias +
      weights.length * length +
      weights.score * score +
      weights.freq * freq;

    const probability = sigmoid(z) * DIFFICULTY_MULTIPLIER[difficulty];
    if (probability > bestScore) {
      bestScore = probability;
      bestWord = word;
    }
  }

  if (bestWord && bestScore > MIN_AI_THRESHOLD[difficulty]) {
    return bestWord;
  }

  return '';
}

function buildRound(dictionary: Record<string, number>) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const nextBoard = generateBoard();
    const words = solveBoard(nextBoard, dictionary);

    if (Object.keys(words).length > 0) {
      return { board: nextBoard, words };
    }
  }

  const fallbackBoard = generateBoard();
  return { board: fallbackBoard, words: solveBoard(fallbackBoard, dictionary) };
}

export default function GameBoard() {
  const [board, setBoard] = useState<string[][]>([]);
  const [dictionary, setDictionary] = useState<Record<string, number> | null>(null);
  const [validWordsOnBoard, setValidWordsOnBoard] = useState<Record<string, number>>({});

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [turn, setTurn] = useState<Turn>('player');

  const [currentWord, setCurrentWord] = useState('');
  const [message, setMessage] = useState('');

  const [mlWeights, setMlWeights] = useState<Record<Difficulty, Weights> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const [userWords, setUserWords] = useState<string[]>([]);
  const [aiWords, setAiWords] = useState<string[]>([]);

  const allBoardWords = useMemo(() => Object.keys(validWordsOnBoard), [validWordsOnBoard]);

  const availableWords = useMemo(
    () => allBoardWords.filter((word) => !userWords.includes(word) && !aiWords.includes(word)),
    [allBoardWords, userWords, aiWords]
  );

  const userScore = useMemo(
    () => userWords.reduce((acc, word) => acc + calculateScore(word), 0),
    [userWords]
  );

  const aiScore = useMemo(
    () => aiWords.reduce((acc, word) => acc + calculateScore(word), 0),
    [aiWords]
  );

  const winner: 'player' | 'ai' | null =
    userScore >= WIN_SCORE ? 'player' :
      aiScore >= WIN_SCORE ? 'ai' :
        null;

  const isRoundOver =
    !isLoading &&
    !loadError &&
    Object.keys(validWordsOnBoard).length > 0 &&
    (availableWords.length === 0 || winner !== null);

  const resetRoundState = useCallback(() => {
    setCurrentWord('');
    setMessage('');
    setUserWords([]);
    setAiWords([]);
    setTurn('player');
  }, []);

  const startNewRound = useCallback((dict: Record<string, number>) => {
    const { board: nextBoard, words } = buildRound(dict);

    setBoard(nextBoard);
    setValidWordsOnBoard(words);
    resetRoundState();
  }, [resetRoundState]);

  useEffect(() => {
    let active = true;

    const loadAssets = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        logger.info('Loading game assets');

        const [weightsRes, dictionaryRes] = await Promise.all([
          fetch('/ml_weights.json'),
          fetch('/dictionary.json'),
        ]);

        if (!weightsRes.ok || !dictionaryRes.ok) {
          throw new Error(`Failed to fetch game assets (${weightsRes.status}, ${dictionaryRes.status})`);
        }

        const [weightsData, dictionaryData] = await Promise.all([
          weightsRes.json(),
          dictionaryRes.json(),
        ]);

        if (!active) {
          return;
        }

        // Validate data structure
        const typedWeights = validateWeights(weightsData);
        const typedDictionary = validateDictionary(dictionaryData);

        setMlWeights(typedWeights);
        setDictionary(typedDictionary);
        startNewRound(typedDictionary);

        logger.info('Game assets loaded successfully');
        logger.trackEvent('game_initialized', { difficulty });
      } catch (error) {
        logger.error('Failed to initialize game assets', error instanceof Error ? error : undefined);
        if (active) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setLoadError(`Could not load game assets: ${errorMessage}`);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadAssets();

    return () => {
      active = false;
    };
  }, [retryCount, startNewRound]);

  useEffect(() => {
    if (turn !== 'ai' || isLoading || isRoundOver || !mlWeights) {
      return;
    }

    const timer = setTimeout(() => {
      const weights = mlWeights[difficulty];
      if (!weights) {
        setMessage('Error: model for selected difficulty unavailable.');
        setTurn('player');
        return;
      }

      if (availableWords.length === 0) {
        setMessage('Round complete: no words remaining.');
        setTurn('player');
        return;
      }

      const chosen = chooseAiWord(availableWords, validWordsOnBoard, weights, difficulty);

      if (chosen) {
        setAiWords((prev) => [...prev, chosen]);
        setMessage(`AI played: ${chosen.toUpperCase()}`);
        logger.trackEvent('word_played', { word: chosen, score: calculateScore(chosen), player: 'ai', difficulty });
      } else {
        setMessage('AI passes this turn.');
      }

      setTurn('player');
    }, AI_DELAY_MS[difficulty]);

    return () => clearTimeout(timer);
  }, [turn, difficulty, isLoading, isRoundOver, mlWeights, availableWords, validWordsOnBoard]);

  useEffect(() => {
    if (isRoundOver) {
      if (winner === 'player') {
        setMessage(`🏆 You win! Reached ${WIN_SCORE} points first!`);
      } else if (winner === 'ai') {
        setMessage(`🤖 AI wins! Reached ${WIN_SCORE} points first.`);
      } else {
        setMessage('Round complete: no words remaining.');
      }
      setTurn('player');
    }
  }, [isRoundOver, winner]);

  const handleUserSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || loadError || isRoundOver || turn !== 'player') {
      return;
    }

    const word = currentWord.toLowerCase().replace(/[^a-z]/g, '').trim();
    if (!word) {
      return;
    }

    if (userWords.includes(word) || aiWords.includes(word)) {
      setMessage('Word already played.');
    } else if (!(word in validWordsOnBoard)) {
      setMessage('Invalid word or not found on board.');
    } else {
      setUserWords((prev) => [...prev, word]);
      setMessage('Good word. AI is thinking...');
      setTurn('ai');
      logger.trackEvent('word_played', { word, score: calculateScore(word), player: 'human' });
    }

    setCurrentWord('');
  }, [isLoading, loadError, isRoundOver, turn, currentWord, userWords, aiWords, validWordsOnBoard]);

  const handleNewRound = useCallback(() => {
    if (!dictionary) {
      return;
    }

    startNewRound(dictionary);
    logger.trackEvent('new_round', { difficulty });
  }, [dictionary, startNewRound, difficulty]);

  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  if (loadError && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8">
        <div className="text-red-500 text-6xl">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-800">Failed to Load Game</h2>
        <p className="text-gray-600 text-center max-w-md">{loadError}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full gap-10">
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs tracking-widest text-zinc-500 uppercase">
        <span>Status</span>
        <span className="border border-zinc-200 px-2 py-1 text-zinc-700 bg-zinc-50">
          {isLoading ? 'Loading assets...' : 'Ready'}
        </span>

        <span>Difficulty</span>
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              disabled={isLoading}
              className={`px-3 py-1 border transition-colors ${difficulty === level
                ? 'border-zinc-900 bg-zinc-900 text-white'
                : 'border-zinc-200 hover:border-zinc-400 text-zinc-500 disabled:opacity-30'
                }`}
            >
              {level}
            </button>
          ))}
        </div>

        <button
          onClick={handleNewRound}
          disabled={isLoading || !dictionary}
          className="px-3 py-1 border border-zinc-200 hover:border-zinc-400 text-zinc-600 disabled:opacity-30 transition-colors"
        >
          New Round
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-16 w-full justify-center items-start">
        <div className="flex-1 max-w-xs flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-zinc-200 pb-2">
            <h2 className="text-sm font-medium tracking-wide uppercase flex items-center gap-2">
              Player {turn === 'player' && !isLoading && <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full animate-pulse" />}
            </h2>
            <span className="text-xl font-light">{userScore}</span>
          </div>
          <div className="min-h-[100px] flex flex-wrap gap-2 content-start">
            {userWords.length === 0 && <span className="text-zinc-400 text-sm">No words yet</span>}
            {userWords.map((word) => (
              <span key={word} className="px-2 py-1 bg-zinc-100 text-xs border border-zinc-200 text-zinc-700">
                {word} <span className="text-zinc-400 ml-1">{calculateScore(word)}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="grid grid-cols-5 gap-1.5 bg-zinc-100 p-2 border border-zinc-200">
            {board.flat().map((letter, i) => (
              <div
                key={i}
                onClick={() => turn === 'player' && !isLoading && !isRoundOver && setCurrentWord((prev) => prev + letter.toLowerCase())}
                className={`
                  w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
                  bg-white border border-zinc-200 text-2xl font-light text-zinc-800
                  transition-all duration-150
                  ${turn === 'player' && !isLoading && !isRoundOver ? 'cursor-pointer hover:bg-zinc-50 hover:border-zinc-400 active:bg-zinc-100' : 'cursor-default opacity-80'}
                `}
              >
                {letter}
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-2">
            <form onSubmit={handleUserSubmit} className="flex gap-2">
              <input
                type="text"
                value={currentWord}
                onChange={(e) => setCurrentWord(e.target.value)}
                disabled={turn !== 'player' || isLoading || isRoundOver}
                placeholder={isRoundOver ? 'Round complete' : turn === 'player' ? 'Type word...' : 'AI turn...'}
                className="flex-1 px-4 py-2 bg-transparent border-b border-zinc-300 focus:border-zinc-900 focus:outline-none disabled:opacity-50 text-center text-lg font-light uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:text-zinc-400 transition-colors"
                autoComplete="off"
                autoCapitalize="off"
              />
              <button
                type="submit"
                disabled={turn !== 'player' || !currentWord || isLoading || isRoundOver}
                className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 text-white transition-colors text-sm uppercase tracking-wider"
              >
                Play
              </button>
            </form>
            <div className="h-4 text-center mt-2">
              <span className={`text-xs tracking-wide transition-opacity ${winner ? 'text-zinc-900 font-medium' : 'text-zinc-500'
                }`}>
                {message || `Playable words: ${allBoardWords.length} | Remaining: ${availableWords.length} | First to ${WIN_SCORE} wins`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-xs flex flex-col gap-4">
          <div className="flex justify-between items-end border-b border-zinc-200 pb-2">
            <h2 className="text-sm font-medium tracking-wide uppercase flex items-center gap-2">
              AI {turn === 'ai' && !isLoading && <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full animate-pulse" />}
            </h2>
            <span className="text-xl font-light">{aiScore}</span>
          </div>
          <div className="min-h-[100px] flex flex-wrap gap-2 content-start">
            {aiWords.length === 0 && <span className="text-zinc-400 text-sm">No words yet</span>}
            {aiWords.map((word) => (
              <span key={word} className="px-2 py-1 bg-zinc-100 text-xs border border-zinc-200 text-zinc-700">
                {word} <span className="text-zinc-400 ml-1">{calculateScore(word)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
