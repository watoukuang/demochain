import React, { useState } from 'react';

export default function ApiTester(): React.ReactElement {
    const [requestData, setRequestData] = useState({
        method: 'GET',
        url: '',
        headers: '',
        body: ''
    });
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'headers' | 'body'>('headers');

    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setResponse('');

        try {
            const headers: Record<string, string> = {};
            
            // 解析 headers
            if (requestData.headers.trim()) {
                try {
                    const parsedHeaders = JSON.parse(requestData.headers);
                    Object.assign(headers, parsedHeaders);
                } catch (error) {
                    setResponse('Headers 格式错误，请使用有效的 JSON 格式');
                    setIsLoading(false);
                    return;
                }
            }

            const config: RequestInit = {
                method: requestData.method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            };

            if (requestData.method !== 'GET' && requestData.method !== 'HEAD' && requestData.body.trim()) {
                config.body = requestData.body;
            }

            const startTime = Date.now();
            const res = await fetch(requestData.url, config);
            const endTime = Date.now();
            
            const responseText = await res.text();
            let formattedResponse;
            
            try {
                const jsonResponse = JSON.parse(responseText);
                formattedResponse = JSON.stringify(jsonResponse, null, 2);
            } catch {
                formattedResponse = responseText;
            }

            const responseInfo = {
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
                time: `${endTime - startTime}ms`,
                body: formattedResponse
            };

            setResponse(JSON.stringify(responseInfo, null, 2));
        } catch (error) {
            setResponse(`请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const formatJson = (field: 'headers' | 'body') => {
        const value = requestData[field];
        if (!value.trim()) return;
        
        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            setRequestData(prev => ({ ...prev, [field]: formatted }));
        } catch (error) {
            // 如果不是有效 JSON，保持原样
        }
    };

    const copyResponse = async () => {
        try {
            await navigator.clipboard.writeText(response);
        } catch (error) {
            console.error('复制失败:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 请求配置区域 */}
            <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">接口测试</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 请求方法和URL */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            请求配置
                        </label>
                        <div className="flex gap-3">
                            <select
                                value={requestData.method}
                                onChange={(e) => setRequestData(prev => ({ ...prev, method: e.target.value }))}
                                className="h-12 px-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 text-gray-900 dark:text-white rounded-lg transition-colors"
                                disabled={isLoading}
                            >
                                {methods.map(method => (
                                    <option key={method} value={method}>{method}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                value={requestData.url}
                                onChange={(e) => setRequestData(prev => ({ ...prev, url: e.target.value }))}
                                className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors"
                                placeholder="https://api.example.com/users"
                                disabled={isLoading}
                                required
                            />
                        </div>
                    </div>

                    {/* 标签页 */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                type="button"
                                onClick={() => setActiveTab('headers')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'headers'
                                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Headers
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('body')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'body'
                                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                }`}
                            >
                                Body
                            </button>
                        </nav>
                    </div>

                    {/* Headers 标签页内容 */}
                    {activeTab === 'headers' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    请求头 (JSON格式)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => formatJson('headers')}
                                    className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    格式化
                                </button>
                            </div>
                            <textarea
                                value={requestData.headers}
                                onChange={(e) => setRequestData(prev => ({ ...prev, headers: e.target.value }))}
                                placeholder='{"Authorization": "Bearer token", "Content-Type": "application/json"}'
                                className="w-full min-h-[120px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Body 标签页内容 */}
                    {activeTab === 'body' && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    请求体 (JSON格式)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => formatJson('body')}
                                    className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors"
                                    disabled={isLoading}
                                >
                                    格式化
                                </button>
                            </div>
                            <textarea
                                value={requestData.body}
                                onChange={(e) => setRequestData(prev => ({ ...prev, body: e.target.value }))}
                                placeholder='{"name": "张三", "email": "zhangsan@example.com"}'
                                className="w-full min-h-[120px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm"
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* 发送按钮 */}
                    <button
                        type="submit"
                        disabled={isLoading || !requestData.url.trim()}
                        className={`w-full px-6 h-12 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-200 ${
                            isLoading || !requestData.url.trim()
                                ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                发送中...
                            </>
                        ) : '发送请求'}
                    </button>
                </form>
            </div>

            {/* 响应区域 */}
            <div className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">响应结果</h3>
                    </div>
                    {response && (
                        <button
                            onClick={copyResponse}
                            className="text-xs px-3 py-1.5 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded transition-colors flex items-center gap-1"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            复制
                        </button>
                    )}
                </div>

                <div className="relative">
                    <textarea
                        value={response}
                        placeholder="发送请求后将显示响应结果..."
                        className="w-full min-h-[400px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-orange-500 rounded-lg transition-colors font-mono text-sm resize-none"
                        readOnly
                    />
                    {!response && !isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                <p className="text-lg font-medium mb-2">等待请求</p>
                                <p className="text-base opacity-80">配置请求参数并发送后将显示响应结果</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
