import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { wrapper } from "../store";

import 'styles/globals.css';

import { userService } from '../services';
import {Alert } from '../components';

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);


  useEffect(() => {
      // on initial load - run auth check 
      authCheck(router.asPath);

      // on route change start - hide page content by setting authorized to false  
      const hideContent = () => setAuthorized(false);
      router.events.on('routeChangeStart', hideContent);

      // on route change complete - run auth check 
      router.events.on('routeChangeComplete', authCheck)

      // unsubscribe from events in useEffect return function
      return () => {
          router.events.off('routeChangeStart', hideContent);
          router.events.off('routeChangeComplete', authCheck);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {

    // redirect to login page if accessing a private page and not logged in 
    setUser(userService.userValue);
    const publicPaths = ['/account/login', '/account/register'];
    const path = url.split('?')[0];

    // if (!userService.userValue && !publicPaths.includes(path)) {

    if (!userService.userValue && !publicPaths.includes(path)) {

        console.log("11111")

        setAuthorized(false);
        router.push({
            pathname: '/account/login',
            query: { returnUrl: router.asPath }
        });
    } else if (!userService.userValue && publicPaths.includes(path)) {
        setAuthorized(false);
    } else {
        setAuthorized(true);
    }
}


  return (
    <>
      <Head>
          <title>HR Web App</title>
          
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className={`app-container ${user ? 'bg-light' : ''}`}>
        <Alert />
        <Layout>
            <Component {...pageProps} />
        </Layout>
      </div>

    </>
  );
}




export default wrapper.withRedux(MyApp);
