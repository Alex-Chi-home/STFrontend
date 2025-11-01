import { Skeleton } from "./Skeleton";

export function ChatSkeleton() {
  return (
    <div className="flex h-full">
      {/* Sidebar Skeleton */}
      <div className="hidden sm:flex w-80 min-w-48 bg-gray-100 border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area Skeleton */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex ${
                i % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-end space-x-2 ${
                  i % 2 === 0 ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <Skeleton className="w-8 h-8 rounded-full" />
                <div
                  className={`space-y-2 ${
                    i % 2 === 0 ? "items-end" : "items-start"
                  }`}
                >
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-64 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
