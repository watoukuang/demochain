import React, {useState, useEffect} from 'react';
import Sidebar from './components/Sidebar';
import TermsGrid from './components/TermsGrid';
import TermModal from './components/TermModal';
import {pageTermAPI, Term} from '@/src/shared/api/term';
import {category} from '@/src/config/term';

interface GlossaryTerm {
    id?: number;
    term: string;
    definition: string;
    category: string;
    relatedTerms?: string[];
    popularity: number; // 热门程度 1-5，5最热门
}


export default function Glossary(): React.ReactElement {
    const [selectedCategory, setSelectedCategory] = useState('🎯 入门必学');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([
        '🎯 入门必学',
        '🔧 技术原理',
        '💰 实用应用',
        '🚀 热门应用',
        '📈 投资交易',
        '🔬 高级概念'
    ]);
    const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 后端数据状态
    const [terms, setTerms] = useState<GlossaryTerm[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;

    // 直接使用配置中的分类结构
    const categoryStructure = category;

    // 切换分类展开状态
    const toggleCategory = (categoryName: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(name => name !== categoryName)
                : [...prev, categoryName]
        );
    };

    // 获取当前选中的编码
    const getSelectedCode = () => {
        if (selectedSubcategory) {
            // 查找子分类编码
            const category = categoryStructure.find(cat => cat.name === selectedCategory);
            const subcategory = category?.subcategories.find(sub => sub.name === selectedSubcategory);
            return subcategory?.code;
        } else {
            // 查找主分类编码
            const category = categoryStructure.find(cat => cat.name === selectedCategory);
            return category?.code;
        }
    };

    // 获取术语数据
    const fetchTerms = async () => {
        setLoading(true);
        try {
            const code = getSelectedCode();
            const response = await pageTermAPI({
                page: currentPage,
                size: pageSize,
                category: code,
                search: searchTerm.trim() || undefined,
            });

            const convertedTerms: GlossaryTerm[] = response.items.map(item => ({
                id: item.id,
                term: item.term,
                definition: item.definition,
                category: item.category,
                relatedTerms: item.related_terms,
                popularity: item.popularity,
            }));

            setTerms(convertedTerms);
            setTotal(response.total);
            setTotalPages(Math.ceil(response.total / pageSize));
        } catch (error) {
            console.error('Failed to fetch terms:', error);
            setTerms([]);
            setTotal(0);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // 监听分类、搜索、分页变化
    useEffect(() => {
        void fetchTerms();
    }, [selectedCategory, selectedSubcategory, searchTerm, currentPage]);

    // 分类或搜索变化时重置页码
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubcategory, searchTerm]);

    // 页面变化处理
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="flex min-h-screen dark:bg-[#0f1115] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
                <Sidebar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    expandedCategories={expandedCategories}
                    onToggleCategory={toggleCategory}
                    selectedCategory={selectedCategory}
                    selectedSubcategory={selectedSubcategory}
                    onSelectCategory={(name) => {
                        setSelectedCategory(name);
                        setSelectedSubcategory(null);
                    }}
                    onSelectSubcategory={(parent, name) => {
                        setSelectedCategory(parent);
                        setSelectedSubcategory(name);
                    }}
                    categoryStructure={categoryStructure}
                />

                {/* 右侧卡片网格 */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div>
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {selectedSubcategory ? `${selectedCategory} - ${selectedSubcategory}` : selectedCategory}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">共 {total} 个术语</p>
                        </div>

                        <TermsGrid
                            terms={terms as any}
                            onSelect={setSelectedTerm}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            total={total}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    </div>
                </div>

                {/* 术语详情弹窗 */}
                <TermModal
                    term={selectedTerm as any}
                    onClose={() => setSelectedTerm(null)}
                    glossaryData={terms as any}
                    onSelectTerm={setSelectedTerm as any}
                />
        </div>
    );
}
