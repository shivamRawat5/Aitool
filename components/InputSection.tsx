import React from 'react';
import { CompanySize, TechMaturity, CareerGoalType, AppState, ProfileRole, AppMode } from '../types';

interface Props {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const ROLE_SKILLS: Record<ProfileRole, string[]> = {
  [ProfileRole.SOFTWARE_ENGINEER]: [
    'System Architecture', 'Scalability', 'Tech Debt Reduction', 'Cloud Migration', 
    'AI Implementation', 'Process Automation', 'SaaS Infrastructure', 'Legacy Modernization'
  ],
  [ProfileRole.PERFORMANCE_MARKETING]: [
    'CAC Optimization', 'LTV Growth', 'Funnel Analytics', 'Conversion Rate Optimization',
    'Attribution Modeling', 'Retention Strategy', 'Market Expansion'
  ],
  [ProfileRole.SALES_BUSINESS_DEV]: [
    'Strategic Partnerships', 'Pipeline Efficiency', 'Market Entry Strategy', 
    'Revenue Operations', 'B2B Scaling', 'Channel Development'
  ],
  [ProfileRole.SALES]: [
    'Enterprise Deal Closing', 'Complex Negotiation', 'Value-Based Selling',
    'Sales Enablement', 'Market Intelligence', 'Key Account Management'
  ],
  [ProfileRole.GROWTH_LEAD]: [
    'Cross-functional Growth', 'Viral Growth Modeling', 'Unit Economics Optimization',
    'GTM Execution', 'Product-Led Growth (PLG)', 'Scaling Operations'
  ],
  [ProfileRole.AUTOMATION_CONSULTANT]: [
    'Operational Efficiency', 'ERP/CRM Integration', 'No-Code Ecosystems',
    'Internal Tooling', 'Process Re-engineering', 'AI-Agent Workflows'
  ]
};

const INDUSTRY_OPTIONS = [
  'E-commerce', 'Fintech', 'Healthcare', 'Logistics', 'Manufacturing', 
  'SaaS', 'EdTech', 'Real Estate', 'Cybersecurity', 'AI/ML Services'
];

const GEOGRAPHY_OPTIONS = [
  'Global', 'USA', 'India', 'Europe', 'UK', 'Singapore', 'Remote'
];

const InputSection: React.FC<Props> = ({ state, onChange, onSubmit, isLoading }) => {
  const isIntelligence = state.mode === AppMode.MARKET_INTELLIGENCE;

  const updateProfile = (updates: Partial<AppState['profile']>) => {
    onChange({ profile: { ...state.profile, ...updates } });
  };

  const updateCriteria = (updates: Partial<AppState['criteria']>) => {
    onChange({ criteria: { ...state.criteria, ...updates } });
  };

  const toggleSelection = (current: string, value: string, setter: (val: string) => void) => {
    const items = current ? current.split(',').map(i => i.trim()).filter(Boolean) : [];
    const index = items.indexOf(value);
    if (index > -1) {
      items.splice(index, 1);
    } else {
      items.push(value);
    }
    setter(items.join(', '));
  };

  const SelectionBadges = ({ 
    options, 
    selected, 
    onToggle 
  }: { 
    options: string[], 
    selected: string, 
    onToggle: (val: string) => void 
  }) => {
    const selectedList = selected ? selected.split(',').map(i => i.trim()) : [];
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {options.map(option => {
          const isActive = selectedList.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm' 
                  : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-indigo-400 dark:hover:border-zinc-500'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Your Value Proposition */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-5 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Your Expert Profile
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Expertise Domain</label>
            <select
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={state.profile.role}
              onChange={(e) => updateProfile({ role: e.target.value as ProfileRole, skills: '' })}
            >
              {Object.values(ProfileRole).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Core Technical/Growth Skills</label>
            <input
              type="text"
              placeholder="React, Java, SEO, Sales Ops..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm"
              value={state.profile.skills}
              onChange={(e) => updateProfile({ skills: e.target.value })}
            />
            <SelectionBadges 
              options={ROLE_SKILLS[state.profile.role]} 
              selected={state.profile.skills} 
              onToggle={(val) => toggleSelection(state.profile.skills, val, (s) => updateProfile({ skills: s }))} 
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Years Driving ROI</label>
            <input
              type="number"
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              value={state.profile.experienceYears}
              onChange={(e) => updateProfile({ experienceYears: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Target Market Intelligence */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-5 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Target Intelligence
          </h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Target Industry</label>
            <input
              type="text"
              placeholder="e.g. Fintech, SaaS..."
              className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600 text-sm"
              value={state.criteria.industry}
              onChange={(e) => updateCriteria({ industry: e.target.value })}
            />
            <SelectionBadges 
              options={INDUSTRY_OPTIONS} 
              selected={state.criteria.industry} 
              onToggle={(val) => toggleSelection(state.criteria.industry, val, (s) => updateCriteria({ industry: s }))} 
            />
          </div>

          {isIntelligence && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-bold text-indigo-600 dark:text-indigo-400">Specific Search Signal (Blogs/Planning)</label>
              <input
                type="text"
                placeholder="e.g. 'recent migration to microservices' or 'new hiring plans'..."
                className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/50 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-indigo-400/50 text-sm"
                value={state.criteria.specificQuery || ''}
                onChange={(e) => updateCriteria({ specificQuery: e.target.value })}
              />
              <p className="text-[10px] text-zinc-500 italic">This directs the AI to crawl for specific keywords in company blogs/news.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Org Size</label>
              <select
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={state.criteria.companySize}
                onChange={(e) => updateCriteria({ companySize: e.target.value as CompanySize })}
              >
                {Object.values(CompanySize).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300">Geo Scope</label>
              <select
                className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-700 rounded-lg p-2.5 text-zinc-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                value={state.criteria.geography}
                onChange={(e) => updateCriteria({ geography: e.target.value })}
              >
                {GEOGRAPHY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onSubmit}
          disabled={isLoading || !state.profile.skills || !state.criteria.industry}
          className="group relative px-12 py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.03] active:scale-[0.97] flex items-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
          {isLoading ? (
            <>
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isIntelligence ? 'Crawling Global Intelligence...' : 'Running Strategic Audit...'}
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              {isIntelligence ? 'Find High-Alignment Targets' : 'Generate Strategic Analysis'}
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default InputSection;