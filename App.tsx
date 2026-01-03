import React, { useState, useCallback, useEffect } from 'react';
import { AppState, CompanySize, TechMaturity, CareerGoalType, CompanyAnalysis, ProfileRole, AppMode } from './types';
import InputSection from './components/InputSection';
import CompanyCard from './components/CompanyCard';
import SkeletonCard from './components/SkeletonCard';
import { generateOutreachStrategy } from './services/geminiService';

const INITIAL_STATE: AppState = {
  profile: {
    role: ProfileRole.SOFTWARE_ENGINEER,
    skills: '',
    experienceYears: 5,
    industries: '',
  },
  criteria: {
    industry: '',
    companySize: CompanySize.MID_MARKET,
    geography: 'Global',
    techMaturity: TechMaturity.MEDIUM,
  },
  goal: CareerGoalType.JOB,
  mode: AppMode.STRATEGIC_AUDIT,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<CompanyAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [needsKey, setNeedsKey] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Check key selection for Market Intelligence mode
  useEffect(() => {
    const checkKey = async () => {
      if (state.mode === AppMode.MARKET_INTELLIGENCE && window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsKey(!hasKey);
      } else {
        setNeedsKey(false);
      }
    };
    checkKey();
  }, [state.mode]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleUpdateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setNeedsKey(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setResults(null); 
    try {
      const data = await generateOutreachStrategy(state);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      if (err?.message?.includes('Entity not found')) {
        setError("Market Intelligence requires a selected API key with Google Cloud billing enabled. Please select your key and try again.");
        setNeedsKey(true);
      } else {
        setError("Analysis failed. Try simplifying your industry search or switching back to Strategic Audit mode.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [state]);

  const handleReset = () => {
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-indigo-500 selection:text-white transition-colors duration-300 bg-white dark:bg-[#09090b]">
      {/* Header */}
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">DevProspect<span className="text-indigo-500 font-black">.AI</span></h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Strategic Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-indigo-500 transition-all shadow-sm"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            {(results || isLoading) && (
              <button 
                onClick={handleReset}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors"
              >
                New Search
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-12">
        {!results && !isLoading ? (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <div className="flex justify-center mb-8">
                <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 inline-flex shadow-inner">
                  {Object.values(AppMode).map(mode => (
                    <button
                      key={mode}
                      onClick={() => handleUpdateState({ mode })}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        state.mode === mode 
                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-zinc-500 hover:text-zinc-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {needsKey && (
                <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300 shadow-xl shadow-amber-500/5">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-800 rounded-full flex items-center justify-center mx-auto mb-2 text-amber-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-amber-800 dark:text-amber-300 font-bold text-lg">Real-Time Search Requires a Paid Key</h3>
                    <p className="text-amber-700/80 dark:text-amber-400/80 text-sm max-w-md mx-auto mt-1">
                      To crawl live company blogs and news, you must select an API key from a project with billing enabled.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 max-w-xs mx-auto">
                    <button 
                      onClick={handleSelectKey}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-amber-600/20"
                    >
                      SELECT PAID API KEY
                    </button>
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-[10px] text-amber-500 font-bold hover:underline uppercase tracking-widest">
                      How Billing Works
                    </a>
                  </div>
                </div>
              )}

              <h2 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight">
                {state.mode === AppMode.STRATEGIC_AUDIT 
                  ? "Audit Corporate Pain Points." 
                  : "Target Real-Time Velocity."}
                <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">
                  {state.mode === AppMode.STRATEGIC_AUDIT ? "Value-First Strategies." : "Crawl Blogs & News."}
                </span>
              </h2>
            </div>
            
            <InputSection 
              state={state} 
              onChange={handleUpdateState} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />

            {error && (
              <div className="max-w-4xl mx-auto bg-red-500/10 border border-red-500/50 p-4 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-3 shadow-lg shadow-red-500/5">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div className="flex-grow">{error}</div>
                <button onClick={() => setError(null)} className="p-1 hover:bg-red-500/20 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-1000">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
              <div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight italic">
                  {isLoading ? "Analyzing Target Market..." : `${state.mode} Results`}
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                  {isLoading 
                    ? `Mapping your skills to high-ROI ${state.criteria.industry} interventions...` 
                    : `Analysis complete. Found ${results?.length || 0} high-alignment companies.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <SkeletonCard key={idx} />
                ))
              ) : (
                results?.map((analysis, idx) => (
                  <CompanyCard 
                    key={idx} 
                    analysis={analysis} 
                    userSkills={state.profile.skills} 
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-zinc-100 dark:border-zinc-900 py-12 text-center">
        <p className="text-zinc-400 dark:text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          Strategic Intelligence Protocol &copy; 2024 DevProspect AI
        </p>
      </footer>
    </div>
  );
};

export default App;