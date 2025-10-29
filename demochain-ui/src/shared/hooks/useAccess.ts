import {useCallback} from 'react';
import {AccessState} from '../types/permission';
import {useAuth} from './useAuth';


export function useAccess() {
    const {user, isAuthenticated} = useAuth();

    const checkPermission = useCallback((): AccessState => {
        if (!isAuthenticated) {
            return {
                hasPermission: false,
                reason: '需要登录后才能访问此功能',
            };
        }

        const vip = user?.vip ?? null;
        const isPaid = vip === '11' || vip === '111' || vip === '1111';
        if (isPaid) return {hasPermission: true};

        return {
            hasPermission: false,
            reason: '当前 Free 计划不支持此功能',
        };
    }, [isAuthenticated, user?.vip]);

    return {
        loading: false,
        checkPermission,
        isFreePlan: !(user?.vip === '11' || user?.vip === '111' || user?.vip === '1111'),
        isPaidPlan: user?.vip === '11' || user?.vip === '111' || user?.vip === '1111',
    };
}
