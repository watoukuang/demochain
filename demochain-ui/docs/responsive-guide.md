# 响应式设计通用方案

## 🎯 设计原则

### 移动优先 (Mobile First)
- 默认样式为移动端设计
- 使用 `sm:`, `md:`, `lg:`, `xl:` 逐步增强

### 断点系统
```
sm: 640px   (平板竖屏)
md: 768px   (平板横屏)  
lg: 1024px  (小桌面)
xl: 1280px  (大桌面)
2xl: 1536px (超大屏)
```

## 🛠️ 通用工具类

### 容器类
```css
.responsive-container     /* 标准容器 max-w-7xl */
.responsive-container-sm  /* 小容器 max-w-4xl */
.responsive-container-lg  /* 大容器 max-w-screen-2xl */
```

### 间距类
```css
.responsive-py     /* py-4 sm:py-6 lg:py-8 */
.responsive-py-lg  /* py-6 sm:py-8 lg:py-12 */
.responsive-px     /* px-4 sm:px-6 lg:px-8 */
.responsive-gap    /* gap-4 sm:gap-6 lg:gap-8 */
```

### 网格类
```css
.responsive-grid-2  /* 1列 -> 2列 */
.responsive-grid-3  /* 1列 -> 2列 -> 3列 */
.responsive-grid-4  /* 1列 -> 2列 -> 3列 -> 4列 */
```

### 文字类
```css
.responsive-text-lg   /* text-lg sm:text-xl lg:text-2xl */
.responsive-text-xl   /* text-xl sm:text-2xl lg:text-3xl */
.responsive-text-2xl  /* text-2xl sm:text-3xl lg:text-4xl */
```

## 📱 使用示例

### 页面布局
```tsx
export default function MyPage() {
  return (
    <div className="responsive-container responsive-py-lg">
      <h1 className="responsive-text-2xl mb-6">页面标题</h1>
      <div className="responsive-grid-3">
        {items.map(item => (
          <div key={item.id} className="responsive-card">
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 导航栏
```tsx
<nav className="responsive-px responsive-py">
  <div className="responsive-flex items-center justify-between">
    <LogoIcon />
    <div className="desktop-only">
      <NavLinks />
    </div>
    <div className="mobile-only">
      <MobileMenu />
    </div>
  </div>
</nav>
```

### 卡片网格
```tsx
<div className="responsive-grid-3 responsive-gap">
  {cards.map(card => (
    <div key={card.id} className="responsive-card">
      <h3 className="responsive-text-lg">{card.title}</h3>
      <p className="text-gray-600">{card.description}</p>
    </div>
  ))}
</div>
```

## 🎨 最佳实践

### 1. 容器使用
- 页面顶层使用 `responsive-container`
- 特殊需求使用 `responsive-container-sm/lg`
- 避免嵌套多层容器

### 2. 间距管理
- 使用统一的间距工具类
- 保持垂直韵律一致
- 大屏适当增加间距

### 3. 网格布局
- 优先使用响应式网格工具类
- 考虑内容的最佳显示数量
- 保证小屏可读性

### 4. 文字处理
- 标题使用响应式文字类
- 正文保持固定大小
- 确保对比度足够

### 5. 交互元素
- 按钮使用响应式尺寸
- 触摸目标至少44px
- 考虑手指操作区域

## 🔧 调试技巧

### 1. 浏览器开发工具
- 使用设备模拟器测试
- 检查不同断点效果
- 验证触摸友好性

### 2. 常见问题
- 文字过小：使用响应式文字类
- 间距不当：统一使用工具类
- 布局错乱：检查网格设置
- 触摸困难：增大点击区域

### 3. 性能优化
- 避免过度嵌套
- 合理使用断点
- 减少重复样式

## 📋 检查清单

- [ ] 移动端优先设计
- [ ] 使用标准断点系统
- [ ] 应用响应式工具类
- [ ] 测试所有设备尺寸
- [ ] 验证触摸交互
- [ ] 检查文字可读性
- [ ] 确保加载性能

## 🚀 快速开始

1. **导入工具类**
   ```tsx
   import '../styles/responsive-utilities.css';
   ```

2. **使用布局容器**
   ```tsx
   <main className="responsive-container responsive-py">
     {children}
   </main>
   ```

3. **应用响应式组件**
   ```tsx
   <div className="responsive-grid-3">
     <div className="responsive-card">内容</div>
   </div>
   ```

这套方案确保你的网站在所有设备上都有良好的用户体验！
