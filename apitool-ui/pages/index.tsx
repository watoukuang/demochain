import React from 'react';
import ApiMockHome from '../components/ApiMockHome';
import HeroTheme from '../components/HeroTheme';

export default function Home(): React.ReactElement {
    return (
        <div className="px-4">
            <HeroTheme title="接口模拟与调试平台" subtitle="可视化配置请求方式/路径/参数与响应内容/状态码，快速生成接口响应，助力前后端并行开发"/>
            <div className="w-full max-w-7xl mx-auto">
                <ApiMockHome/>
            </div>
        </div>
    );
}
