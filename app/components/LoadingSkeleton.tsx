export function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-6xl rounded-lg bg-white p-8 shadow-xl dark:bg-zinc-900">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="mx-auto mb-8 h-10 w-64 rounded bg-zinc-200 dark:bg-zinc-700"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Board skeleton */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-zinc-200 dark:bg-zinc-700"
                  ></div>
                ))}
              </div>
              <div className="mb-4 h-10 w-full rounded bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="space-y-6">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                <div className="mb-4 h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="space-y-3">
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                </div>
              </div>
              
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                <div className="mb-4 h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 rounded bg-zinc-200 dark:bg-zinc-700"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-6 animate-pulse text-center text-zinc-500 dark:text-zinc-400">
          Loading game assets...
        </p>
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={`${sizeClasses[size]} border-zinc-600 dark:border-zinc-400 border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
