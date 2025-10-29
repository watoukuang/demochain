import React from 'react';
import type { GlossaryTerm } from './TermCard';

interface TermModalProps {
  term: GlossaryTerm | null;
  onClose: () => void;
  glossaryData: GlossaryTerm[];
  onSelectTerm: (t: GlossaryTerm) => void;
}

const TermModal: React.FC<TermModalProps> = ({ term, onClose, glossaryData, onSelectTerm }) => {
  if (!term) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d24] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-[#2a2c31]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2a2c31]">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{term.term}</h2>
            <span className="px-3 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300">
              {term.category}
            </span>
            {/* 热门程度 */}
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < term.popularity ? 'text-orange-400 dark:text-orange-500' : 'text-gray-300 dark:text-gray-600'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2c31] rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 弹窗内容 */}
        <div className="p-6">
          {/* 定义 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">定义</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">{term.definition}</p>
          </div>

          {/* 相关术语 */}
          {term.relatedTerms && term.relatedTerms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">相关术语</h3>
              <div className="flex flex-wrap gap-2">
                {term.relatedTerms.map((relatedTerm, idx) => {
                  const relatedTermData = glossaryData.find((t) => t.term === relatedTerm);
                  return (
                    <button
                      key={idx}
                      onClick={() => relatedTermData && onSelectTerm(relatedTermData)}
                      className="px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-all duration-200 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30 hover:scale-105"
                    >
                      {relatedTerm}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermModal;
