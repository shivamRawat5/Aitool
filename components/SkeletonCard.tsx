
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-full shadow-md animate-pulse">
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 w-3/4">
            <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-full"></div>
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2"></div>
          </div>
          <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-16"></div>
        </div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        <section className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-5/6"></div>
        </section>

        <section className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-4/5"></div>
        </section>

        <div className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 space-y-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2"></div>
        </div>
      </div>

      <div className="px-6 py-6 bg-zinc-50/50 dark:bg-zinc-950/80 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3"></div>
          <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-20"></div>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 h-32 space-y-2">
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full"></div>
          <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
