import React, { useEffect, useState } from 'react';
import HashView from '../src/views/hash';
import ArticleView from '../src/views/article';

export default function Home(): React.ReactElement {
  const [isMdUp, setIsMdUp] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(min-width: 768px)');
    const update = () => setIsMdUp(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  if (isMdUp === null) return <div />;
  return isMdUp ? <HashView /> : <ArticleView />;
}