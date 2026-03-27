import { Suspense } from 'react';
import GameBoard from './components/GameBoard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-50 p-8 font-sans text-zinc-900 transition-colors sm:p-24 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="mb-12 flex w-full max-w-4xl flex-col items-center gap-4">
        <div className="flex w-full justify-end">
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-light tracking-tight">Boggle vs AI</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">A minimalist machine learning experiment</p>
      </header>

      <div className="w-full max-w-5xl flex justify-center">
        <ErrorBoundary>
          <Suspense fallback={<LoadingSkeleton />}>
            <GameBoard />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  );
}
