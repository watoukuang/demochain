import React from 'react';
import ApiTester from "@/components/ApiTester";

export default function Home(): React.ReactElement {
    return (
        <div className="px-4">
            <div className="w-full max-w-7xl mx-auto">
                <ApiTester/>
            </div>
        </div>
    );
}
