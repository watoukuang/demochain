import React from 'react';
import Head from 'next/head';
import Title from '@/components/Title';
import Articles from '@/components/Articles'

export default function Blogs() {
    return (
        <>
            <Head>
                <title>文章中心 - DemoChain</title>
                <meta name="description"
                      content="探索区块链技术的深度文章，涵盖基础知识、共识机制、智能合约、DeFi 等热门话题"/>
            </Head>

            <div className="min-h-screen">
                <div className="py-4 sm:py-6 lg:py-12">
                    <Title/>
                    <Articles/>
                </div>
            </div>
        </>
    );
}