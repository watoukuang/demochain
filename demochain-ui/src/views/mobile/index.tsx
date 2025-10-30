import React from 'react';
import Link from 'next/link';

export default function MobileHero(): React.ReactElement {
  return (
    <div className="md:hidden">
      {/* 背景渐变与柔光装饰 */}
      <section className="relative overflow-hidden">
        <div className="absolute -z-10 inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-56 w-[720px] rounded-full bg-gradient-to-r from-emerald-400/10 via-sky-400/10 to-purple-400/10 blur-3xl" />
        </div>

        <div className="px-4 sm:px-6 max-w-7xl mx-auto pt-10 pb-8">
          {/* 徽标/角标 */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/80 shadow-sm border border-gray-200 backdrop-blur dark:bg-[#15171b]/80 dark:border-[#2a2c31]">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            区块链共识演示站
          </div>

          {/* 标题与说明 */}
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            直观探索主流共识机制
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            通过交互式演示理解 POW、POS、DPoS、BFT、POH 等共识的出块、验证与安全性差异，助你快速建立体系化认知。
          </p>

          {/* CTA 按钮 */}
          <div className="mt-5 flex items-center gap-2">
            <Link
              href="/blogs"
              className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-lime-500 shadow-sm hover:opacity-90 transition-opacity dark:from-emerald-400 dark:to-lime-400"
            >
              开始阅读
            </Link>
            <Link
              href="/glossary"
              className="inline-flex flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors dark:text-emerald-300 dark:bg-[#161a1a] dark:border-[#223232] dark:hover:bg-[#1b2121]"
            >
              名词速览
            </Link>
          </div>

          {/* 关键特性徽章 */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">POW</span>
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">POS</span>
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">DPoS</span>
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">BFT</span>
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">POH</span>
            <span className="inline-flex items-center justify-center rounded-lg px-2.5 py-1.5 bg-white/90 border border-gray-200 shadow-sm text-gray-700 dark:bg-[#15171b]/90 dark:border-[#2a2c31] dark:text-gray-300">可视化</span>
          </div>
        </div>
      </section>

      {/* 轻量推荐区：最新/热门 */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto pb-8">
        <div className="mt-2 grid grid-cols-1 gap-3">
          <Link href="/blogs" className="group rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow transition-shadow dark:bg-[#15171b]/80 dark:border-[#2a2c31]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">新手入门</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">从零认识区块链共识与安全性</p>
              </div>
              <span className="text-xs text-emerald-600 group-hover:translate-x-0.5 transition-transform dark:text-emerald-400">前往</span>
            </div>
          </Link>
          <Link href="/blogs" className="group rounded-2xl border border-gray-200 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow transition-shadow dark:bg-[#15171b]/80 dark:border-[#2a2c31]">
            <div className="flex items-center justify之间">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">机制对比</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">性能/安全/去中心化三角的权衡</p>
              </div>
              <span className="text-xs text-emerald-600 group-hover:translate-x-0.5 transition-transform dark:text-emerald-400">前往</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
