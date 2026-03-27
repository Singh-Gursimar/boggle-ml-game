import { Suspense } from 'react';
import GameBoard from './components/GameBoard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 bg-zinc-50 text-zinc-900 font-sans">
      <header className="w-full max-w-4xl flex flex-col items-center mb-12">
        <h1 className="text-3xl font-light tracking-tight mb-2">Boggle vs AI</h1>
        <p className="text-zinc-500 text-sm">A minimalist machine learning experiment</p>
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
