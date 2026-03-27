export function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-6xl w-full">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Board skeleton */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[...Array(25)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-lg"
                  ></div>
                ))}
              </div>
              <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-500 mt-6 animate-pulse">
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
      className={`${sizeClasses[size]} border-indigo-600 border-t-transparent rounded-full animate-spin`}
    ></div>
  );
}
