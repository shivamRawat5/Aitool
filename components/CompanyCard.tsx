
import React, { useState, useMemo } from 'react';
import { CompanyAnalysis } from '../types';
import { fetchLatestCompanyNews } from '../services/geminiService';

interface Props {
  analysis: CompanyAnalysis;
  userSkills: string;
}

const CompanyCard: React.FC<Props> = ({ analysis, userSkills }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isFetchingNews, setIsFetchingNews] = useState(false);
  const [recentNews, setRecentNews] = useState(analysis.recentNews);
  const [sourceUrls, setSourceUrls] = useState(analysis.sourceUrls || []);

  const copyEmail = () => {
    const text = `Subject: ${analysis.emailSubject}\n\n${analysis.emailBody}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSave = () => {
    setSaved(!saved);
  };

  const handleFetchNews = async () => {
    if (isFetchingNews) return;
    setIsFetchingNews(true);
    try {
      const data = await fetchLatestCompanyNews(analysis.companyName);
      setRecentNews(data.news);
      setSourceUrls(data.sources);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingNews(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: analysis.emailSubject,
      text: `Strategic Outreach for ${analysis.companyName}:\n\nSubject: ${analysis.emailSubject}\n\n${analysis.emailBody}`,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      const encodedText = encodeURIComponent(`${analysis.emailSubject}\n\n${analysis.emailBody}`);
      window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }
  };

  const instagramUrl = useMemo(() => {
    if (!analysis.instagramHandle) return null;
    const handle = analysis.instagramHandle.replace('@', '');
    return `https://instagram.com/${handle}`;
  }, [analysis.instagramHandle]);

  const contactLinks = useMemo(() => [
    {
      id: 'website',
      label: 'Website',
      href: analysis.website?.startsWith('http') ? analysis.website : `https://${analysis.website}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      show: !!analysis.website
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: analysis.linkedinUrl,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      show: !!analysis.linkedinUrl
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: instagramUrl,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      show: !!instagramUrl
    },
    {
      id: 'email',
      label: 'Email',
      href: analysis.contactEmail ? `mailto:${analysis.contactEmail}` : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      show: !!analysis.contactEmail
    },
    {
      id: 'phone',
      label: 'Phone',
      href: analysis.phoneNumber ? `tel:${analysis.phoneNumber}` : null,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      show: !!analysis.phoneNumber
    }
  ], [analysis, instagramUrl]);

  const highlightedSolution = useMemo(() => {
    if (!userSkills || !analysis.proposedSolution) return analysis.proposedSolution;
    const aiKeywords = [
      'AI', 'LLM', 'GPT', 'Machine Learning', 'Automation', 'Neural', 
      'Intelligence', 'Gemini', 'Claude', 'OpenAI', 'NLP', 'Computer Vision',
      'Data Analytics', 'Predictive', 'Bots', 'Java', 'React', 'Cloud', 'SaaS'
    ];
    const userSkillArray = userSkills.split(',').map(s => s.trim().toLowerCase());
    const relevantKeywords = aiKeywords.filter(k => 
      userSkillArray.some(u => u.includes(k.toLowerCase()) || k.toLowerCase().includes(u))
    );
    if (relevantKeywords.length === 0) return analysis.proposedSolution;
    const regex = new RegExp(`(${relevantKeywords.join('|')})`, 'gi');
    const parts = analysis.proposedSolution.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? (
        <span key={i} className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-indigo-500/30 underline-offset-2">
          {part}
        </span>
      ) : (
        part
      )
    );
  }, [analysis.proposedSolution, userSkills]);

  return (
    <div className="bg-white dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all group flex flex-col h-full shadow-md hover:shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {analysis.companyName}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">
              {analysis.industry} • {analysis.businessModel}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-2.5 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] rounded-full border border-zinc-200 dark:border-zinc-700 font-black whitespace-nowrap uppercase tracking-tighter">
              {analysis.approxSize}
            </span>
          </div>
        </div>

        {/* Real-time Citations & News Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-2">
             {sourceUrls && sourceUrls.length > 0 && (
                <div className="flex -space-x-1.5">
                  {sourceUrls.slice(0, 4).map((url, i) => (
                    <a key={i} href={url} target="_blank" className="w-7 h-7 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white dark:border-zinc-900 hover:z-10 hover:scale-110 transition-all shadow-sm" title="Intelligence Source">
                      {url.includes('linkedin') ? 'L' : url.includes('twitter') || url.includes('x.com') ? 'X' : 'S'}
                    </a>
                  ))}
                </div>
              )}
          </div>
          <button 
            onClick={handleFetchNews} 
            disabled={isFetchingNews}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white dark:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isFetchingNews ? (
              <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            )}
            Live Update
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 flex-grow">
        {/* News Feed */}
        {recentNews && (
          <div className="bg-amber-500/5 dark:bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 animate-in slide-in-from-top-2 duration-300">
            <h4 className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              MARKET MOMENTUM
            </h4>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold italic">"{recentNews}"</p>
          </div>
        )}

        {/* Operational Gaps */}
        <section>
          <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-indigo-500"></span>
            {recentNews ? 'CONTEXTUAL NEED' : 'CORE GAP'}
          </h4>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">{analysis.estimatedProblem}</p>
        </section>

        {/* Strategic Intervention */}
        <section>
          <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase mb-2 tracking-[0.2em] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
            INTERVENTION
          </h4>
          <p className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed font-medium">{highlightedSolution}</p>
        </section>

        {/* Digital Presence Grid - Refined Contact Display */}
        <section className="pt-2">
          <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mb-3 tracking-[0.2em]">DIGITAL FOOTPRINT</h4>
          <div className="grid grid-cols-5 gap-2">
            {contactLinks.map(link => link.show && (
              <a 
                key={link.id} 
                href={link.href || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-indigo-500 hover:bg-white dark:hover:bg-zinc-800 transition-all group/link shadow-sm"
                title={link.label}
              >
                <div className="text-zinc-400 group-hover/link:text-indigo-500 transition-colors">
                  {link.icon}
                </div>
              </a>
            ))}
          </div>
        </section>

        {analysis.planningSignals && (
          <section className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 border-l-4 border-l-indigo-500">
            <h4 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase mb-1 tracking-widest">PLANNING SIGNAL</h4>
            <p className="text-zinc-900 dark:text-white font-bold text-xs leading-tight">{analysis.planningSignals}</p>
          </section>
        )}
      </div>

      {/* Action Suite */}
      <div className="px-6 py-5 bg-zinc-50/80 dark:bg-zinc-950/90 border-t border-zinc-100 dark:border-zinc-800 mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={toggleSave} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 border rounded-lg text-xs font-black transition-all ${
              saved 
                ? 'bg-amber-500 border-amber-500 text-white shadow-md' 
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-amber-400'
            }`}
          >
            <svg className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {saved ? 'SAVED' : 'SAVE'}
          </button>
          
          <button 
            onClick={handleShare} 
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-black text-zinc-600 dark:text-zinc-400 hover:border-indigo-400 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            SHARE
          </button>

          <button 
            onClick={copyEmail} 
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-black transition-all shadow-md ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h3m-3 4h3" />
            </svg>
            {copied ? 'COPIED' : 'SCRIPT'}
          </button>
        </div>

        {/* Email Draft Preview */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800 font-mono text-[10px] leading-relaxed max-h-32 overflow-y-auto custom-scrollbar shadow-inner group/preview">
          <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
            <p className="text-indigo-600 dark:text-indigo-400 font-bold truncate pr-4">Subj: {analysis.emailSubject}</p>
            <span className="text-[8px] text-zinc-400 font-bold uppercase tracking-widest whitespace-nowrap">Draft Preview</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 whitespace-pre-wrap selection:bg-indigo-500/30">{analysis.emailBody}</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
