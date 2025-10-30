import React from 'react';
import SearchIcon from "@/components/Icons/SearchIcon";


interface SidebarProps {
    searchTerm: string;
    onSearchChange: (v: string) => void;
    expandedCategories: string[];
    onToggleCategory: (name: string) => void;
    selectedCategory: string;
    selectedSubcategory: string | null;
    onSelectCategory: (name: string) => void;
    onSelectSubcategory: (parentName: string, name: string) => void;
    categoryStructure: Array<{
        name: string;
        code: string;
        subcategories: { name: string; code: string }[];
    }>;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             searchTerm,
                                             onSearchChange,
                                             expandedCategories,
                                             onToggleCategory,
                                             selectedCategory,
                                             selectedSubcategory,
                                             onSelectCategory,
                                             onSelectSubcategory,
                                             categoryStructure,
                                         }) => {
    return (
        <div
            className="w-64 bg-white dark:bg-[#1a1d24] border-r border-gray-200 dark:border-[#2a2c31] flex flex-col sticky top-0 h-screen overflow-y-auto shadow-lg dark:shadow-2xl rounded"
        >
            {/* 标题和搜索 */}
            <div className="p-6 border-b border-gray-200 dark:border-[#2a2c31]">
                {/* 搜索框 */}
                <div className="relative mb-1">
                    <input
                        type="text"
                        placeholder="搜索名词..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-3 py-2 pl-9 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-[#0f1115] dark:border-[#2a2c31] dark:text-white dark:placeholder-gray-400"
                    />
                    <SearchIcon/>
                </div>
            </div>

            {/* 分类列表 */}
            <div className="flex-1 overflow-y-auto">
                {categoryStructure.map((category) => (
                    <div key={category.name}>
                        {/* 主分类 */}
                        <button
                            onClick={() => {
                                onSelectCategory(category.name);
                                if (category.subcategories.length > 0) onToggleCategory(category.name);
                            }}
                            className={`w-full text-left p-4 border-b border-gray-100 dark:border-[#2a2c31] hover:bg-gray-50 dark:hover:bg-[#26292e] transition-all duration-200 ${
                                selectedCategory === category.name && !selectedSubcategory
                                    ? 'bg-orange-50 dark:bg-orange-500/10 border-l-4 border-l-orange-500 dark:border-l-orange-400'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{category.name}</h3>
                                    {category.subcategories.length > 0 && (
                                        <svg
                                            className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${
                                                expandedCategories.includes(category.name) ? 'rotate-90' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M9 5l7 7-7 7"/>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* 二级分类 */}
                        {expandedCategories.includes(category.name) && category.subcategories.length > 0 && (
                            <div className="bg-gray-50 dark:bg-[#0f1115]">
                                {category.subcategories.map((subcategory) => (
                                    <button
                                        key={subcategory.name}
                                        onClick={() => onSelectSubcategory(category.name, subcategory.name)}
                                        className={`w-full text-left p-3 pl-8 border-b border-gray-100 dark:border-[#2a2c31] hover:bg-gray-100 dark:hover:bg-[#1a1d24] transition-all duration-200 ${
                                            selectedSubcategory === subcategory.name
                                                ? 'bg-orange-50 dark:bg-orange-500/10 border-l-4 border-l-orange-500 dark:border-l-orange-400'
                                                : ''
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm text-gray-700 dark:text-gray-300">{subcategory.name}</h4>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
