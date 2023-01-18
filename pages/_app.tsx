import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from "next/app";
import Layout from "../components/layout/layout";
import { useStore } from '../store';
import {ChakraProvider} from '@chakra-ui/react';
import theme from '../components/styles/theme';
import 'styles/index.css';
import { Fonts } from "../components/styles/fonts"
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'

import { userService } from '../services';
import {Alert, Spinner } from '../components';
import { Provider } from 'react-redux';

function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const store = useStore(pageProps.initialReduxState);

  useEffect(() => {
      // on initial load - run auth check 
      authCheck(router.asPath);

      // on route change start - hide page content by setting authorized to false  
      const hideContent = () => {
        setLoading(true);
        setAuthorized(false);
      };
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
    const publicPaths = ['/login', '/register', '/changepassword'];
    const path = url.split('?')[0];

    console.log("AUTH CHECK PATH::"+path)
    console.log("userService.userValue::"+JSON.stringify(userService.userValue))
    // const { token } = nextCookie(ctx)
    // console.log("COOKIE VALUE::"+cookie.get("user"))
    if (!userService.userValue && !publicPaths.includes(path)) {
      console.log("11111")
        setAuthorized(false);
        router.push({
            pathname: '/login',
            query: { returnUrl: router.asPath }
        });
    } else if (!userService.userValue && publicPaths.includes(path)) {
      console.log("222")
        setAuthorized(false);
    } else {
      console.log("3333")
        setAuthorized(true);
    }

    setLoading(false);
}


  return (
    <>
      <Head>
          <title>HR Web App</title>
          
          {/* eslint-disable-next-line @next/next/no-css-tags */}
          <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div>
        <Provider store={store}>
          <Alert />
          <Layout data={{authorized}}>
              <ChakraProvider theme={theme}>
                <Fonts/>
                {loading? (
                  <>
                  <Spinner/>
                  </>
                ) : (
                  <>
                    <Component {...pageProps} />
                  </>
                )}
                
              </ChakraProvider>
            </Layout>            
        </Provider>            
        
      </div>

    </>
  );
}


export default MyApp;
