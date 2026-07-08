import React, { useEffect } from 'react';
import { X, ArrowSquareOut, GitBranch, Star, TrendUp, Lightning } from '@phosphor-icons/react';
import type { AINewsItem, RelatedRepo } from '@/services/news';

interface NewsDetailModalProps {
  article: AINewsItem;
  isOpen: boolean;
  onClose: () => void;
}

export function NewsDetailModal({ article, isOpen, onClose }: NewsDetailModalProps) {
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-full overflow-y-auto bg-stone-50 dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col transform transition-all">
        
        {/* Header Image & Close Button */}
        <div className="relative h-64 md:h-80 w-full shrink-0">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 backdrop-blur text-white rounded-full transition-colors"
          >
            <X size={24} weight="bold" />
          </button>
          
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-widest rounded shadow-sm">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-10">
          
          <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-widest text-slate-500 mb-6">
            <span className="text-emerald-600 dark:text-emerald-400">{article.source}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700"></span>
            <span>{article.publishedAt}</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-slate-900 dark:text-white mb-8 leading-tight">
            {article.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Left Column: Main Content */}
            <div className="md:col-span-2 space-y-8">
              
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <Lightning className="w-5 h-5 text-blue-500" /> The Details
                </h3>
                <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {article.content}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <Star className="w-5 h-5 text-orange-500" /> Key Takeaways
                </h3>
                <ul className="space-y-3">
                  {article.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-stone-700 dark:text-stone-300">
                      <span className="text-emerald-500 font-bold mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                  <TrendUp className="w-5 h-5 text-purple-500" /> Why Developers Care
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-sans p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                  {article.developerImpact}
                </p>
              </div>

            </div>

            {/* Right Column: Related Repos */}
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
                <GitBranch className="w-5 h-5 text-emerald-500" /> Repositories Behind This News
              </h3>
              
              <div className="flex flex-col gap-4">
                {article.relatedRepos.map((repo, idx) => (
                  <a 
                    key={idx} 
                    href={repo.url}
                    className="block p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {repo.name}
                      </h4>
                      <ArrowSquareOut className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <p className="text-xs text-stone-500 dark:text-stone-400 mb-4 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        {repo.language}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" weight="fill" />
                        {repo.stars.toLocaleString()}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
