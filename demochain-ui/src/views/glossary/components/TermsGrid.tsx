import React from 'react';
import TermCard, { GlossaryTerm } from './TermCard';

interface TermsGridProps {
  terms: GlossaryTerm[];
  onSelect: (term: GlossaryTerm) => void;
  // 分页相关
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const TermsGrid: React.FC<TermsGridProps> = ({ 
  terms, 
  onSelect, 
  currentPage, 
  totalPages, 
  total, 
  onPageChange, 
  loading = false 
}) => {
  // 生成页码数组
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <>
      {/* 术语网格 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1d24] rounded-xl border border-gray-200 dark:border-[#2a2c31] p-5 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {terms.map((term, index) => (
            <TermCard key={term.id || index} term={term} onClick={onSelect} />
          ))}
        </div>
      )}

      {/* 无结果提示 */}
      {!loading && terms.length === 0 && (
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

      {/* 分页组件 */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            共 {total} 个术语，第 {currentPage} / {totalPages} 页
          </div>
          
          <div className="flex items-center space-x-2">
            {/* 上一页 */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#1a1d24] dark:border-[#2a2c31] dark:text-gray-400 dark:hover:bg-[#26292e] dark:hover:text-gray-200"
            >
              上一页
            </button>
            
            {/* 页码 */}
            {generatePageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">...</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 dark:bg-[#1a1d24] dark:border-[#2a2c31] dark:text-gray-400 dark:hover:bg-[#26292e] dark:hover:text-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
            
            {/* 下一页 */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#1a1d24] dark:border-[#2a2c31] dark:text-gray-400 dark:hover:bg-[#26292e] dark:hover:text-gray-200"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsGrid;
