import request from '../utils/request';
import {R} from "@/types/response";

// 请求参数类型
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword?: string;
}

// 统一的 API 响应格式（与请求工具保持一致）
export interface ApiResponse<T> {
    success: boolean;
    data: T | null;
    message: string | null;
}

// 响应数据类型
export interface User {
    id: string;
    email: string;
    username?: string;
    avatar?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
    expiresIn?: number;
}

// 登录
export async function login(payload: LoginRequest): Promise<AuthResponse> {
    const resp = await request.post<AuthResponse>('/api/auth/login', payload);
    if (!resp.success) {
        throw new Error(resp.message || '登录失败');
    }
    const data = resp.data;
    if (!data) throw new Error('登录响应数据为空');
    if (typeof window !== 'undefined') {
        if (data.token) localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        window.dispatchEvent(new Event('authChanged'));
    }
    return data;
}

// 注册
export async function register(payload: RegisterRequest): Promise<R<null>> {
    const resp = await request.post<null>('/api/auth/register', payload);
    if (!resp.success) {
        throw new Error(resp.message || '注册失败');
    }
    return resp;
}

// 登出
export async function logout(): Promise<void> {
    try {
        await request.post('/api/auth/logout');
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        // 清除本地存储
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_info');
            // 通知全局认证状态已变更
            window.dispatchEvent(new Event('authChanged'));
        }
    }
}

// 获取当前用户信息
export async function getCurrentUser(): Promise<User> {
    const resp = await request.get<User>('/api/auth/me');
    if (!resp.success) throw new Error(resp.message || '获取用户信息失败');
    const userData = resp.data;
    if (!userData) throw new Error('用户信息为空');
    return userData;
}

// 刷新 token
export async function refreshToken(): Promise<AuthResponse> {
    const resp = await request.post<AuthResponse>('/api/auth/refresh');
    if (!resp.success) throw new Error(resp.message || '刷新 token 失败');
    const authData = resp.data;
    if (!authData) throw new Error('刷新 token 响应数据为空');
    if (typeof window !== 'undefined') {
        // Bearer-only: 存储 token 并保存用户信息
        if (authData.token) localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('user_info', JSON.stringify(authData.user));
    }
    return authData;
}

// 修改密码
export async function changePassword(data: {
    oldPassword: string;
    newPassword: string;
}): Promise<void> {
    await request.post('/api/auth/change-password', data);
}

// 重置密码
export async function resetPassword(email: string): Promise<void> {
    await request.post('/api/auth/reset-password', {email});
}

// 验证邮箱
export async function verifyEmail(token: string): Promise<void> {
    await request.post('/api/auth/verify-email', {token});
}

// 检查 token 是否有效
export function isTokenValid(): boolean {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
        // 简单的 JWT token 过期检查（可选）
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp > currentTime;
    } catch {
        return false;
    }
}

// 获取本地存储的用户信息
export function getLocalUser(): User | null {
    if (typeof window === 'undefined') return null;

    try {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    } catch {
        return null;
    }
}

// 获取本地存储的 token
export function getLocalToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
}
