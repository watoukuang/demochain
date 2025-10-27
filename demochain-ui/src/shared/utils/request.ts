// 请求响应接口
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

// 请求配置接口
export interface RequestConfig {
    headers?: Record<string, string>;
    timeout?: number;
    skipErrorHandler?: boolean;
}

class RequestService {
    private baseURL: string;

    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://demochain.org:8085';
    }

    private async request<T = any>(
        url: string,
        options: RequestInit & RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const {headers = {}, timeout = 10000, skipErrorHandler, ...fetchOptions} = options;

        // 添加默认 headers
        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // 合并用户提供的 headers
        Object.assign(defaultHeaders, headers);

        // 从 localStorage 获取 token
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                defaultHeaders.Authorization = `Bearer ${token}`;
            }
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${this.baseURL}${url}`, {
                ...fetchOptions,
                headers: defaultHeaders,
                credentials: 'include',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                // HTTP 错误处理
                let errorMessage = `请求失败 (${response.status})`;

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // 忽略 JSON 解析错误
                }

                // 401 未授权处理
                if (response.status === 401) {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user_info');
                    }
                    errorMessage = '登录已过期，请重新登录';
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();

            // 如果后端返回的是标准格式
            if (data && typeof data === 'object' && 'code' in data) {
                if (data.code === 200 || data.code === 0) {
                    return data;
                } else {
                    throw new Error(data.message || '请求失败');
                }
            }

            // 如果后端直接返回数据，包装成标准格式
            return {
                code: 200,
                message: 'success',
                data: data,
            };
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                throw new Error('请求超时');
            }

            if (!skipErrorHandler) {
                console.error('Request error:', error);
            }

            throw error;
        }
    }

    // GET 请求
    public get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        // 添加时间戳防止缓存
        const separator = url.includes('?') ? '&' : '?';
        const urlWithTimestamp = `${url}${separator}_t=${Date.now()}`;

        return this.request<T>(urlWithTimestamp, {
            method: 'GET',
            ...config,
        });
    }

    // POST 请求
    public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    // PUT 请求
    public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    // DELETE 请求
    public delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'DELETE',
            ...config,
        });
    }

    // PATCH 请求
    public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(url, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
            ...config,
        });
    }

    // 上传文件
    public upload<T = any>(url: string, formData: FormData, config?: RequestConfig): Promise<ApiResponse<T>> {
        const {headers = {}, ...restConfig} = config || {};
        // 移除 Content-Type，让浏览器自动设置
        const uploadHeaders = {...headers};
        delete uploadHeaders['Content-Type'];

        return this.request<T>(url, {
            method: 'POST',
            body: formData,
            headers: uploadHeaders,
            ...restConfig,
        });
    }
}

// 创建请求实例
const request = new RequestService();

export default request;

// 导出常用方法
export const {get, post, put, delete: del, patch, upload} = request;
