import React, {useState, useEffect} from 'react';
import {createPortal} from 'react-dom';
import {NewWebSocketConfig} from '../types';

const WebSocketConfigForm: React.FC = () => {
    const [formData, setFormData] = useState<NewWebSocketConfig>({
        name: 'WebSocket订阅',
        description: '',
        ws_url: '',
        config_type: 'subscriber',
        headers: '',
        auth_token: '',
        subscribe_message: '',
        auto_reconnect: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string>('');
    const [websocket, setWebsocket] = useState<WebSocket | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [showUrlHelper, setShowUrlHelper] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [urlParams, setUrlParams] = useState<{key: string, value: string}[]>([{key: '', value: ''}]);
    const [isClient, setIsClient] = useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const fullscreenTextareaRef = React.useRef<HTMLTextAreaElement>(null);

    // 确保只在客户端运行
    useEffect(() => {
        setIsClient(true);
    }, []);

    // 工具函数：当前时间与统一追加消息
    const now = () => new Date().toLocaleTimeString();
    const push = (msg: string) => setMessages(prev => prev + `[${now()}] ${msg}\n`);

    // 清理WebSocket连接
    useEffect(() => {
        return () => {
            if (websocket) {
                websocket.close();
            }
        };
    }, [websocket]);

    // ESC键退出全屏
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        if (isFullscreen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);

    // 自动滚动到底部
    useEffect(() => {
        if (messages) {
            if (textareaRef.current) {
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
            }
            if (fullscreenTextareaRef.current) {
                fullscreenTextareaRef.current.scrollTop = fullscreenTextareaRef.current.scrollHeight;
            }
        }
    }, [messages]);

    // 复制消息功能
    const copyMessages = async () => {
        try {
            await navigator.clipboard.writeText(messages);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    // URL查询参数拼接
    const applyUrlParams = () => {
        const validParams = urlParams.filter(p => p.key.trim() && p.value.trim());
        if (validParams.length === 0) return;
        
        const baseUrl = formData.ws_url.split('?')[0];
        const queryString = validParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
        const newUrl = `${baseUrl}?${queryString}`;
        
        handleChange('ws_url', newUrl);
        setShowUrlHelper(false);
    };

    // 添加URL参数行
    const addUrlParam = () => {
        setUrlParams([...urlParams, {key: '', value: ''}]);
    };

    // 移除URL参数行
    const removeUrlParam = (index: number) => {
        if (urlParams.length > 1) {
            setUrlParams(urlParams.filter((_, i) => i !== index));
        }
    };

    // 更新URL参数
    const updateUrlParam = (index: number, field: 'key' | 'value', value: string) => {
        const newParams = [...urlParams];
        newParams[index][field] = value;
        setUrlParams(newParams);
    };

    // 订阅模板 - 使用函数确保客户端生成
    const getSubscriptionTemplates = () => ({
        '交易所': {
            '币安 (Binance)': '{"method":"SUBSCRIBE","params":["btcusdt@ticker"],"id":1}',
            'OKX': '{"op":"subscribe","args":[{"channel":"tickers","instId":"BTC-USDT"}]}',
            'Coinbase': '{"type":"subscribe","channels":[{"name":"ticker","product_ids":["BTC-USD"]}]}',
            'Huobi': '{"sub":"market.btcusdt.ticker","id":"id1"}',
            'Kraken': '{"event":"subscribe","pair":["BTC/USD"],"subscription":{"name":"ticker"}}',
        },
        '实时数据': {
            'Socket.IO 连接': '{"type":"connection","data":{}}',
            '心跳保活': '{"type":"ping","timestamp":1234567890}',
            '房间加入': '{"type":"join","room":"general"}',
            '用户认证': '{"type":"auth","token":"your_token_here"}',
        },
        '物联网': {
            'MQTT over WebSocket': '{"type":"subscribe","topic":"sensor/temperature"}',
            '设备状态订阅': '{"action":"subscribe","device_id":"device_001","events":["status","data"]}',
            '传感器数据': '{"cmd":"subscribe","sensors":["temp","humidity","pressure"]}',
        },
        '游戏/聊天': {
            '聊天室订阅': '{"type":"subscribe","channel":"general","user_id":"user123"}',
            '游戏事件': '{"action":"subscribe","events":["player_join","player_leave","game_start"]}',
            '实时通知': '{"type":"subscribe","notifications":true,"user_id":"user123"}',
        },
        '金融数据': {
            '股票实时价格': '{"type":"subscribe","symbols":["AAPL","GOOGL","MSFT"]}',
            '外汇汇率': '{"action":"subscribe","pairs":["EUR/USD","GBP/USD"]}',
            '期货数据': '{"method":"subscribe","params":{"symbol":"ES","type":"quote"}}',
        },
        '系统监控': {
            '服务器监控': '{"type":"subscribe","metrics":["cpu","memory","disk"]}',
            '日志流': '{"action":"subscribe","log_level":"info","service":"api"}',
            '告警订阅': '{"type":"subscribe","alerts":["critical","warning"]}',
        }
    });

    // 应用订阅模板
    const applyTemplate = (template: string) => {
        handleChange('subscribe_message', template);
        setShowTemplates(false);
    };

    // JSON格式化
    const formatJson = (field: 'headers' | 'subscribe_message') => {
        const value = formData[field];
        if (!value) return;
        
        try {
            const parsed = JSON.parse(value);
            const formatted = JSON.stringify(parsed, null, 2);
            handleChange(field, formatted);
        } catch (e) {
            // 如果不是有效JSON，保持原样
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.ws_url.trim()) {
            newErrors.ws_url = 'WebSocket URL不能为空';
        } else {
            try {
                const url = new URL(formData.ws_url);
                if (!['ws:', 'wss:'].includes(url.protocol)) {
                    newErrors.ws_url = 'WebSocket URL格式不正确，应以ws://或wss://开头';
                }
            } catch {
                newErrors.ws_url = 'WebSocket URL格式不正确';
            }
        }

        if (formData.headers && formData.headers.trim()) {
            try {
                JSON.parse(formData.headers);
            } catch {
                newErrors.headers = '请求头必须是有效的JSON格式';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const connectWebSocket = () => {
        try {
            const ws = new WebSocket(formData.ws_url);

            ws.onopen = () => {
                setIsConnected(true);
                push(`已连接到: ${formData.ws_url}`);
                setIsSubmitting(false);

                if (formData.subscribe_message && formData.subscribe_message.trim()) {
                    try {
                        ws.send(formData.subscribe_message);
                        push('已发送订阅消息');
                    } catch (e) {
                        push('发送订阅消息失败');
                    }
                }
            };

            ws.onmessage = (event) => {
                const timestamp = new Date().toLocaleTimeString();
                try {
                    // 尝试格式化JSON数据
                    const data = JSON.parse(event.data);
                    const formattedData = JSON.stringify(data, null, 2);
                    setMessages(prev => prev + `[${timestamp}] ${formattedData}\n\n`);
                } catch {
                    // 如果不是JSON，直接显示原始数据
                    setMessages(prev => prev + `[${timestamp}] ${event.data}\n`);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket错误:', error);
                push('连接错误，请检查URL是否正确或网络连接');
                setIsSubmitting(false);
            };

            ws.onclose = (event) => {
                setIsConnected(false);
                const getCloseReason = (code: number) => {
                    switch (code) {
                        case 1000: return '正常关闭';
                        case 1001: return '端点离开';
                        case 1002: return '协议错误';
                        case 1003: return '不支持的数据类型';
                        case 1006: return '连接异常断开';
                        case 1007: return '数据格式错误';
                        case 1008: return '策略违规';
                        case 1009: return '消息过大';
                        case 1011: return '服务器错误';
                        case 1015: return 'TLS握手失败';
                        default: return '未知错误';
                    }
                };
                push(`连接已断开 (代码: ${event.code} - ${getCloseReason(event.code)})`);
                setWebsocket(null);

                // 自动重连（非正常关闭时）
                if (event.code !== 1000) {
                    setTimeout(() => {
                        push('尝试重连...');
                        connectWebSocket();
                    }, 3000);
                }
            };

            setWebsocket(ws);
        } catch (error) {
            console.error('连接失败:', error);
            push(`连接失败: ${error}`);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('表单提交，当前数据:', formData);

        if (!validateForm()) {
            console.log('表单验证失败，错误:', errors);
            return;
        }

        console.log('开始连接WebSocket:', formData.ws_url);
        setIsSubmitting(true);
        push(`正在连接到: ${formData.ws_url}`);

        connectWebSocket();
    };

    const handleChange = (field: keyof NewWebSocketConfig, value: any) => {
        setFormData(prev => ({...prev, [field]: value}));
        if (errors[field]) {
            setErrors(prev => ({...prev, [field]: ''}));
        }
    };

    // 全屏组件内容
    const fullscreenContent = (
        <div className="fixed inset-0 z-[9999] bg-gray-800 flex flex-col">
            {/* 全屏顶部工具栏 */}
            <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-white">实时消息</h2>
                    <span className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium ${
                        isConnected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                    }`}>
                        <span
                            className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}/>
                        {isConnected ? '已连接' : '未连接'}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {messages && (
                        <>
                            <button
                                onClick={copyMessages}
                                className={`h-10 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    copySuccess
                                        ? 'text-emerald-300 bg-emerald-700/30'
                                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                                }`}
                            >
                                {copySuccess ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M5 13l4 4L19 7"/>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                    </svg>
                                )}
                                {copySuccess ? '已复制' : '复制消息'}
                            </button>
                            <button
                                onClick={() => setMessages('')}
                                className="h-10 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                清空消息
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="h-10 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v4.5M15 15h4.5m-4.5 0l5.5 5.5"/>
                        </svg>
                        退出全屏
                    </button>
                </div>
            </div>

            {/* 全屏消息内容 */}
            <div className="flex-1 p-0 overflow-hidden">
                <div className="relative h-full">
                    <textarea
                        ref={fullscreenTextareaRef}
                        value={messages}
                        placeholder="等待消息数据..."
                        className="w-full h-full resize-none overflow-auto px-6 py-4 bg-gray-800 border-0 rounded-none text-sm text-white font-mono leading-6 focus:outline-none focus:ring-0 focus:border-0"
                        readOnly
                        style={{fontFamily: 'Monaco, Consolas, "Courier New", monospace'}}
                    />
                    {!messages && !isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                <p className="text-lg font-medium mb-2">等待连接</p>
                                <p className="text-base opacity-80">连接WebSocket后将显示实时消息数据</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 全屏底部状态栏 */}
            <div className="px-4 py-3 bg-gray-800 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd>
                            退出全屏
                        </span>
                        <span>•</span>
                        <span>消息自动滚动到底部</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                  clipRule="evenodd"/>
                        </svg>
                        <span>全屏模式 - 专注查看数据</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 连接配置区域 */}
            <div
                className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">连接配置</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* WebSocket URL 输入 */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            服务地址
                        </label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={formData.ws_url}
                                onChange={(e) => handleChange('ws_url', e.target.value)}
                                className={`flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-2 ${
                                    errors.ws_url ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                                } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors`}
                                placeholder="wss://api.example.com/ws"
                                disabled={isConnected}
                            />
                            <button
                                type="button"
                                onClick={() => setShowUrlHelper(!showUrlHelper)}
                                className="h-12 px-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg transition-colors flex items-center gap-2"
                                disabled={isConnected}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                                </svg>
                                参数
                            </button>
                            {!isConnected ? (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`px-8 h-12 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-200 ${
                                        isSubmitting
                                            ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor"
                                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            连接中...
                                        </>
                                    ) : '连接'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (websocket) {
                                            websocket.close(1000, '用户主动断开');
                                        }
                                    }}
                                    className="px-8 h-12 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    断开
                                </button>
                            )}
                        </div>
                        {errors.ws_url && (
                            <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"/>
                                </svg>
                                {errors.ws_url}
                            </p>
                        )}

                        {/* URL查询参数拼接器 */}
                        {showUrlHelper && (
                            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">查询参数拼接</h4>
                                    <button
                                        type="button"
                                        onClick={addUrlParam}
                                        className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        + 添加参数
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {urlParams.map((param, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                placeholder="参数名"
                                                value={param.key}
                                                onChange={(e) => updateUrlParam(index, 'key', e.target.value)}
                                                className="flex-1 h-8 px-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:border-blue-500"
                                            />
                                            <span className="text-blue-600 dark:text-blue-400">=</span>
                                            <input
                                                type="text"
                                                placeholder="参数值"
                                                value={param.value}
                                                onChange={(e) => updateUrlParam(index, 'value', e.target.value)}
                                                className="flex-1 h-8 px-2 text-sm bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded focus:outline-none focus:border-blue-500"
                                            />
                                            {urlParams.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeUrlParam(index)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <button
                                        type="button"
                                        onClick={applyUrlParams}
                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                    >
                                        应用参数
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowUrlHelper(false)}
                                        className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            认证TOKEN <span className="text-gray-400 text-xs">(可选)</span>
                        </label>
                        <input
                            type="text"
                            value={formData.auth_token}
                            onChange={(e) => handleChange('auth_token', e.target.value)}
                            className="w-full h-12 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors"
                            placeholder="输入认证Token（如需要）"
                            disabled={isConnected}
                        />
                    </div>
                    {/* 请求头(JSON，可选) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                请求头(JSON) <span className="text-gray-400 text-xs">(可选)</span>
                            </label>
                            <button
                                type="button"
                                onClick={() => formatJson('headers')}
                                className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors"
                                disabled={isConnected}
                            >
                                格式化
                            </button>
                        </div>
                        <textarea
                            value={formData.headers || ''}
                            onChange={(e) => handleChange('headers', e.target.value)}
                            placeholder='例如: {"Authorization": "Bearer <token>"}'
                            className={`w-full min-h-[110px] px-4 py-3 bg-white dark:bg-gray-800 border-2 ${
                                errors.headers ? 'border-red-400 focus:border-red-500' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                            } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm`}
                            disabled={isConnected}
                        />
                        {errors.headers && (
                            <p className="text-red-500 dark:text-red-400 text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.headers}
                            </p>
                        )}
                    </div>

                    {/* 订阅消息(JSON/文本，可选) */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                订阅消息(JSON/文本) <span className="text-gray-400 text-xs">(可选)</span>
                            </label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTemplates(!showTemplates)}
                                    className="text-xs px-2 py-1 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 rounded transition-colors"
                                    disabled={isConnected}
                                >
                                    模板
                                </button>
                                <button
                                    type="button"
                                    onClick={() => formatJson('subscribe_message')}
                                    className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded transition-colors"
                                    disabled={isConnected}
                                >
                                    格式化
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={formData.subscribe_message || ''}
                            onChange={(e) => handleChange('subscribe_message', e.target.value)}
                            placeholder='例如: {"method":"SUBSCRIBE","params":["btcusdt@ticker"],"id":1}'
                            className="w-full min-h-[140px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm"
                            disabled={isConnected}
                        />

                        {/* 订阅模板选择器 */}
                        {showTemplates && (
                            <div className="mt-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 max-h-80 overflow-y-auto">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-medium text-green-900 dark:text-green-100">订阅模板</h4>
                                    <button
                                        type="button"
                                        onClick={() => setShowTemplates(false)}
                                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {Object.entries(getSubscriptionTemplates()).map(([category, templates]) => (
                                        <div key={category}>
                                            <h5 className="text-xs font-semibold text-green-800 dark:text-green-200 mb-2 border-b border-green-200 dark:border-green-700 pb-1">
                                                {category}
                                            </h5>
                                            <div className="grid grid-cols-1 gap-1">
                                                {Object.entries(templates as Record<string, string>).map(([name, template]) => (
                                                    <button
                                                        key={name}
                                                        type="button"
                                                        onClick={() => applyTemplate(template)}
                                                        className="text-left text-xs p-2 bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-900/30 rounded border border-green-200 dark:border-green-700 transition-colors"
                                                    >
                                                        <div className="font-medium text-green-700 dark:text-green-300">{name}</div>
                                                        <div className="text-green-600 dark:text-green-400 mt-1 font-mono truncate">{template}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* 消息显示区域 */}
            <div
                className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">实时消息</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium ${
                            isConnected
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                            <span
                                className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}/>
                            {isConnected ? '已连接' : '未连接'}
                        </span>
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                            </svg>
                            全屏查看
                        </button>
                        {messages && (
                            <>
                                <button
                                    onClick={copyMessages}
                                    className={`text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 ${
                                        copySuccess
                                            ? 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30'
                                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                                >
                                    {copySuccess ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M5 13l4 4L19 7"/>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                        </svg>
                                    )}
                                    {copySuccess ? '已复制' : '复制'}
                                </button>
                                <button
                                    onClick={() => setMessages('')}
                                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    清空
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        ref={textareaRef}
                        value={messages}
                        placeholder="等待消息数据..."
                        className="w-full min-h-[650px] max-h-[900px] resize-y overflow-auto px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-mono leading-relaxed focus:outline-none focus:ring-0 focus:border-blue-500 transition-colors"
                        readOnly
                    />
                    {!messages && !isConnected && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center text-gray-400 dark:text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                                </svg>
                                <p className="text-sm">连接后将显示实时消息</p>
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"/>
                    </svg>
                    可拖拽右下角调整高度，点击"全屏查看"获得更好的数据查看体验
                </p>
            </div>

            {/* 使用 Portal 渲染全屏组件到 body */}
            {isClient && isFullscreen && createPortal(
                fullscreenContent,
                document.body
            )}
        </div>
    );
};

export default WebSocketConfigForm;
