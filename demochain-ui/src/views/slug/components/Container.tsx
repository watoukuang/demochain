import React from 'react';

type Props = {
  children: React.ReactNode;
};

const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen dark:bg-[#0f1115]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {children}
      </div>
    </div>
  );
};

export default Container;
