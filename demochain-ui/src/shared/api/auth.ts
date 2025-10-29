import request from '../utils/request';
import {R} from "@/src/shared/types/response";
import {AuthVO, LoginDTO, RegisterDTO, UserDetail} from "@/src/shared/types/user";


// 登录
export async function login(payload: LoginDTO): Promise<AuthVO> {
    const response = await request.post<AuthVO>('/api/auth/login', payload);
    if (!response.success) {
        throw new Error(response.message || '登录失败');
    }
    const data = response.data;
    if (!data) throw new Error('登录响应数据为空');
    if (typeof window !== 'undefined') {
        if (data.token) localStorage.setItem('token', data.token);
        localStorage.setItem('user_detail', JSON.stringify(data.user_detail));
        window.dispatchEvent(new Event('authChanged'));
    }
    return data;
}

// 注册
export async function register(payload: RegisterDTO): Promise<R<null>> {
    const resp = await request.post<null>('/api/auth/register', payload);
    if (!resp.success) {
        throw new Error(resp.message || '注册失败');
    }
    return resp;
}

// 登出
export async function logout(): Promise<R<null>> {
    const response = await request.post<null>('/api/auth/logout');
    if (!response.success) {
        throw new Error(response.message || '登出失败');
    }
    // 清除本地存储
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user_detail');
        // 通知全局认证状态已变更
        window.dispatchEvent(new Event('authChanged'));
    }
    return response;
}
