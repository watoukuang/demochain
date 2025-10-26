import React from 'react';
import Hash from './pow/hash';

export default function Home(): React.ReactElement {
    return (
        <div className="px-4">
            <div className="w-full max-w-7xl mx-auto">
                <Hash/>
            </div>
        </div>
    );
}
