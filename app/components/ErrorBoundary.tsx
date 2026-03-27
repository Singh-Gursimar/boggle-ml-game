"use client";

import React from "react";
import { logger } from "../utils/logger";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("ErrorBoundary caught an error", error, {
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-4 dark:from-zinc-950 dark:to-zinc-900">
          <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-900">
            <div className="text-red-500 text-6xl mb-4 text-center">⚠️</div>
            <h1 className="mb-4 text-center text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-center text-zinc-600 dark:text-zinc-400">
              The game encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-sm">
                <summary className="cursor-pointer text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200">
                  Technical details
                </summary>
                <pre className="mt-2 overflow-auto rounded bg-zinc-100 p-3 text-xs dark:bg-zinc-800 dark:text-zinc-300">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-lg bg-zinc-900 px-6 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
