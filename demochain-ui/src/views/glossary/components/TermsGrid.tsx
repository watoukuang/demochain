import React from 'react';
import TermCard, { GlossaryTerm } from './TermCard';

interface TermsGridProps {
  terms: GlossaryTerm[];
  onSelect: (term: GlossaryTerm) => void;
}

const TermsGrid: React.FC<TermsGridProps> = ({ terms, onSelect }) => {
  return (
    <>
      {/* 页面标题在父级处理，这里只负责网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {terms.map((term, index) => (
          <TermCard key={index} term={term} onClick={onSelect} />
        ))}
      </div>

      {/* 无结果提示 */}
      {terms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">未找到相关术语</h3>
          <p className="text-gray-500 dark:text-gray-400">尝试调整搜索关键词或选择其他分类</p>
        </div>
      )}
    </>
  );
};

export default TermsGrid;
