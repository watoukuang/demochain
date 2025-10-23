import React from 'react';
import ApiTester from '../components/ApiTester';
import HeroTheme from '../components/HeroTheme';

export default function Sender(): React.ReactElement {
    return (
        <div className="px-4">
            <HeroTheme title="接口测试工具" subtitle="构造请求并验证响应，支持多种请求方法与 Headers，助力接口联调与测试" />
            <div className="w-full max-w-7xl mx-auto">
                <ApiTester/>
            </div>
        </div>
    );
}
