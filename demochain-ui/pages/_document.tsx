import Document, { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

class MyDocument extends Document {
  render(): React.ReactElement {
    return (
      <Html lang="zh-CN">
        <Head>
          <meta charSet="utf-8"/>
          
          {/* 默认 SEO - 可被页面级覆盖 */}
          <meta name="description" content="WsTool - 专业的WebSocket测试与开发工具平台，提供消息发送、数据订阅、连接管理等功能"/>
          <meta name="keywords" content="WebSocket,WS工具,消息发送,数据订阅,连接管理,实时通信,开发工具"/>
          <meta name="author" content="WsTool"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          
          {/* Open Graph 默认值 */}
          <meta property="og:site_name" content="WsTool"/>
          <meta property="og:type" content="website"/>
          <meta property="og:locale" content="zh_CN"/>
          
          {/* 图标和资源 */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
          <link rel="alternate icon" href="/favicon.ico"/>
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
          
          {/* 预加载主题脚本 - 避免闪烁 */}
          <script src="/js/theme-script.js" />
        </Head>
        <body>
          <Main/>
          <NextScript/>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
