import React from 'react';

export interface GlossaryTerm {
    id?: number;
    term: string;
    definition: string;
    category: string;
    relatedTerms?: string[];
    popularity: number;
}

interface TermCardProps {
    term: GlossaryTerm;
    onClick: (term: GlossaryTerm) => void;
}

const TermCard: React.FC<TermCardProps> = ({term, onClick}) => {
    return (
        <div
            className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-200 dark:border-[#2a2c31] p-5 hover:shadow-lg dark:hover:shadow-2xl hover:border-orange-300 dark:hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 cursor-pointer group"
            onClick={() => onClick(term)}
        >
            {/* 卡片头部 */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {term.term}
                    </h3>
                </div>
                {/* 热门程度指示器 */}
                <div className="flex items-center gap-1 ml-2">
                    {Array.from({length: term.popularity}, (_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
                    ))}
                </div>
            </div>

            {/* 卡片内容 */}
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-3">
                {term.definition}
            </p>

            {/* 相关术语标签 */}
            {term.relatedTerms && term.relatedTerms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                    {term.relatedTerms.slice(0, 3).map((relatedTerm, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded dark:bg-orange-500/20 dark:text-orange-300"
                        >
              {relatedTerm}
            </span>
                    ))}
                    {term.relatedTerms.length > 3 && (
                        <span
                            className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">+{term.relatedTerms.length - 3}</span>
                    )}
                </div>
            )}

            {/* 查看详情指示 */}
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2a2c31]">
                <div
                    className="flex items-center text-xs text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    <span>点击查看详情</span>
                    <svg className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none"
                         stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default TermCard;
