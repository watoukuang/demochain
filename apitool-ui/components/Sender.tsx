import React, {useEffect, useRef, useState} from 'react';

const WebSocketSender: React.FC = () => {
    // connection form
    const [wsUrl, setWsUrl] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [headers, setHeaders] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    // runtime
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState('');
    const [outgoing, setOutgoing] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    const [showUrlHelper, setShowUrlHelper] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);
    const [urlParams, setUrlParams] = useState<{ key: string, value: string }[]>([{key: '', value: ''}]);
    const [isClient, setIsClient] = useState(false);

    // refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 确保只在客户端运行
    useEffect(() => {
        setIsClient(true);
    }, []);

    // helpers
    const now = () => new Date().toLocaleTimeString();
    const push = (msg: string) => setMessages(prev => prev + `[${now()}] ${msg}\n`);

    // auto scroll
    useEffect(() => {
        if (messages && textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [messages]);

    // cleanup
    useEffect(() => {
        return () => {
            if (socket) socket.close();
        };
    }, [socket]);

    // copy
    const copyMessages = async () => {
        try {
            await navigator.clipboard.writeText(messages);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch {
        }
    };

    // URL查询参数拼接
    const applyUrlParams = () => {
        const validParams = urlParams.filter(p => p.key.trim() && p.value.trim());
        if (validParams.length === 0) return;

        const baseUrl = wsUrl.split('?')[0];
        const queryString = validParams.map(p => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`).join('&');
        const newUrl = `${baseUrl}?${queryString}`;

        setWsUrl(newUrl);
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

    // 发送消息模板
    const getSendTemplates = () => ({
        '认证与连接': {
            'Token认证': '{"type":"auth","token":"your_token_here"}',
            'API Key认证': '{"type":"authenticate","api_key":"your_api_key"}',
            '用户登录': '{"action":"login","username":"user","password":"pass"}',
            '心跳保活': '{"type":"ping","timestamp":' + Date.now() + '}',
            '连接确认': '{"type":"connection","status":"ready"}',
        },
        '数据订阅': {
            '订阅频道': '{"type":"subscribe","channel":"general"}',
            '取消订阅': '{"type":"unsubscribe","channel":"general"}',
            '订阅用户消息': '{"action":"subscribe","events":["message","notification"]}',
            '订阅实时数据': '{"method":"subscribe","params":["data_stream"]}',
            '房间加入': '{"type":"join","room":"room_001","user_id":"user123"}',
        },
        '消息发送': {
            '发送文本消息': '{"type":"message","content":"Hello World!","to":"user123"}',
            '发送JSON数据': '{"action":"send_data","payload":{"key":"value"}}',
            '广播消息': '{"type":"broadcast","message":"System notification"}',
            '私聊消息': '{"type":"private_message","recipient":"user456","text":"Hello"}',
            '群组消息': '{"type":"group_message","group_id":"group789","content":"Hi everyone"}',
        },
        '系统控制': {
            '获取状态': '{"type":"get_status"}',
            '获取用户列表': '{"action":"get_users"}',
            '获取房间列表': '{"type":"get_rooms"}',
            '系统重启': '{"command":"restart","confirm":true}',
            '清理缓存': '{"action":"clear_cache","type":"all"}',
        },
        '游戏/应用': {
            '游戏开始': '{"action":"start_game","game_id":"game123"}',
            '玩家移动': '{"type":"player_move","x":100,"y":200}',
            '发送指令': '{"command":"attack","target":"enemy1"}',
            '更新分数': '{"action":"update_score","player":"player1","score":1500}',
            '游戏结束': '{"type":"game_over","winner":"player1"}',
        },
        '物联网/监控': {
            '设备控制': '{"device_id":"device001","action":"turn_on"}',
            '传感器数据': '{"sensor":"temperature","value":25.5,"unit":"celsius"}',
            '告警通知': '{"type":"alert","level":"warning","message":"Temperature high"}',
            '状态上报': '{"device":"sensor001","status":"online","battery":85}',
            '固件更新': '{"action":"firmware_update","version":"1.2.3"}',
        }
    });

    // 应用发送模板
    const applyTemplate = (template: string) => {
        setOutgoing(template);
        setShowTemplates(false);
    };

    // validate URL and headers JSON (optional)
    const validate = () => {
        if (!wsUrl.trim()) {
            push('错误: WebSocket URL 不能为空');
            return false;
        }
        try {
            const u = new URL(wsUrl);
            if (!['ws:', 'wss:'].includes(u.protocol)) throw new Error('协议必须为 ws:// 或 wss://');
        } catch (e) {
            push('错误: WebSocket URL 格式不正确');
            return false;
        }
        if (headers && headers.trim()) {
            try {
                JSON.parse(headers);
            } catch {
                push('错误: 请求头必须是有效的 JSON');
                return false;
            }
        }
        return true;
    };

    const connect = () => {
        if (!validate()) return;
        setIsSubmitting(true);
        push(`正在连接到: ${wsUrl}`);

        try {
            const ws = new WebSocket(wsUrl);
            ws.onopen = () => {
                setIsConnected(true);
                setIsSubmitting(false);
                push(`已连接到: ${wsUrl}`);
                // 可选：基于 authToken/headers 的认证应由后端代理支持；前端原生WS不支持自定义请求头
            };
            ws.onmessage = (evt) => {
                const t = now();
                try {
                    const data = JSON.parse(evt.data);
                    setMessages(prev => prev + `[${t}] ${JSON.stringify(data, null, 2)}\n\n`);
                } catch {
                    setMessages(prev => prev + `[${t}] ${evt.data}\n`);
                }
            };
            ws.onerror = (err) => {
                console.error('WebSocket错误:', err);
                push('连接错误，请检查URL或网络');
                setIsSubmitting(false);
            };
            ws.onclose = (event) => {
                setIsConnected(false);
                push(`连接已断开 (代码: ${event.code})`);
                setSocket(null);
            };
            setSocket(ws);
        } catch (e) {
            push(`连接失败: ${e}`);
            setIsSubmitting(false);
        }
    };

    const disconnect = () => {
        if (socket) socket.close(1000, '用户主动断开');
    };

    const sendMessage = () => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            push('错误: 未连接，无法发送');
            return;
        }
        if (!outgoing.trim()) {
            push('提示: 发送内容为空');
            return;
        }
        try {
            socket.send(outgoing);
            push(`已发送: ${outgoing.slice(0, 200)}`);
        } catch (e) {
            push(`发送失败: ${e}`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 连接与发送配置 */}
            <div
                className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"/>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">消息发送</h3>
                </div>

                <div className="space-y-4">
                    {/* URL */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">服务地址</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={wsUrl}
                                onChange={(e) => setWsUrl(e.target.value)}
                                className="flex-1 h-12 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors"
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                                </svg>
                                参数
                            </button>
                            {!isConnected ? (
                                <button
                                    type="button"
                                    onClick={connect}
                                    disabled={isSubmitting}
                                    className={`px-8 h-12 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-200 ${
                                        isSubmitting
                                            ? 'bg-gray-400 dark:bg-gray-600 text-white cursor-not-allowed'
                                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
                                    }`}
                                >
                                    {isSubmitting ? '连接中...' : '连接'}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={disconnect}
                                    className="px-8 h-12 rounded-lg font-medium inline-flex items-center justify-center transition-all duration-200 bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                >
                                    断开
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Auth Token (optional) */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">认证TOKEN
                            (可选)</label>
                        <input
                            type="text"
                            value={authToken}
                            onChange={(e) => setAuthToken(e.target.value)}
                            className="w-full h-12 px-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors"
                            placeholder="输入认证Token（如需要）"
                            disabled={isConnected}
                        />
                    </div>

                    {/* Headers (optional, info only) */}
                    <div className="space-y-2">
                        <label
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">请求头(JSON，可选)</label>
                        <textarea
                            value={headers}
                            onChange={(e) => setHeaders(e.target.value)}
                            placeholder='例如: {"Authorization": "Bearer <token>"}'
                            className="w-full min-h-[110px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm"
                            disabled={isConnected}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">浏览器原生WebSocket不支持自定义请求头，如需携带Token建议拼接到URL或使用后端代理。</p>
                    </div>

                    {/* Outgoing message */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">发送内容</label>
                        <textarea
                            value={outgoing}
                            onChange={(e) => setOutgoing(e.target.value)}
                            placeholder='可以是任意文本或JSON: {"type":"ping"}'
                            className="w-full min-h-[180px] px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 rounded-lg transition-colors font-mono text-sm"
                        />
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={sendMessage}
                                disabled={!isConnected}
                                className={`px-6 h-10 rounded-lg text-sm font-medium ${
                                    isConnected ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                }`}
                            >
                                发送
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 发送/接收日志 */}
            <div
                className="bg-gray-50/50 dark:bg-gray-900/20 rounded-lg p-5 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">发送与回执</h3>
                    </div>
                    <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full font-medium ${
                isConnected ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}/>
                {isConnected ? '已连接' : '未连接'}
            </span>
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
              placeholder="发送和接收的消息将在这里显示..."
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
                                <p className="text-sm">连接后即可发送消息并查看回执</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WebSocketSender;
