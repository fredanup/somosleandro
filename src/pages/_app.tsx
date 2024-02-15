import '../styles/global.css';
import type { Session } from 'next-auth';
import { getSession, SessionProvider } from 'next-auth/react';
import type { AppType } from 'next/app';
import Head from 'next/head';
import { trpc } from 'utils/trpc';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Somos Leandro</title>
        <meta
          name="description"
          content="Una aplicación para contratar músicos profesionales"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="mask-icon" href="/icons/mask-icon.svg" color="#FFFFFF" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/logo-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/logo-167x167.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://www.somosleandro.com" />
        <meta name="twitter:title" content="Somos Leandro" />
        <meta
          name="twitter:description"
          content="Una aplicación para contratar músicos profesionales"
        />
        <meta name="twitter:image" content="/icons/twitter.png" />
        <meta name="twitter:creator" content="Ángel Ugarte" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Somos Leandro" />
        <meta
          property="og:description"
          content="Una aplicación para contratar músicos profesionales"
        />
        <meta property="og:site_name" content="Somos Leandro" />
        <meta property="og:url" content="https://www.somosleandro.com" />
        <meta property="og:image" content="/icons/logo.png" />
        <meta
          name="facebook-domain-verification"
          content="xolr78f1svxuohzdi82c1zkmuq0zpl"
        />
        {/* add the following only if you want to add a startup image for Apple devices. */}
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-2048x2732.png"
          sizes="2048x2732"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-1668x2224.png"
          sizes="1668x2224"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-1536x2048.png"
          sizes="1536x2048"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-1125x2436.png"
          sizes="1125x2436"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-1242x2208.png"
          sizes="1242x2208"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-750x1334.png"
          sizes="750x1334"
        />
        <link
          rel="apple-touch-startup-image"
          href="/icons/logo-640x1136.png"
          sizes="640x1136"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);
