import React from 'react';
import Header from './Header';
import Footer from './Footer';
import {LayoutProps} from '../types';

export default function Layout({children}: LayoutProps): React.ReactElement {
    return (
        <div
            className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0f1115] dark:via-[#111317] dark:to-[#0f1115]">
            <Header toggleSidebar={() => {
            }}/>

            <main className="flex-1 py-4 sm:py-6 lg:py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {children}
                </div>
            </main>

            {/* 页脚 */}
            <Footer/>
        </div>
    );
}
