import React from 'react';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { getPageSEO } from '../utils/seo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps): React.ReactElement {
  const router = useRouter();
  const seo = getPageSEO(router.pathname);

  return (
    <>
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        {seo.keywords && <meta name="keywords" content={seo.keywords} />}
        
        {/* Open Graph */}
        <meta property="og:title" content={seo.ogTitle || seo.title} />
        <meta property="og:description" content={seo.ogDescription || seo.description} />
        <meta property="og:url" content={seo.canonical} />
        {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
        
        {/* Canonical URL */}
        {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      </Head>
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
