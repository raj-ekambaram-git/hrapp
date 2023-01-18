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
import cookie from 'js-cookie'
import { userService } from '../services';
import {Alert, Spinner } from '../components';
import { Provider } from 'react-redux';
import { access } from '../helpers/access';

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

  async function authCheck(url) {

    // redirect to login page if accessing a private page and not logged in 
    setUser(userService.userValue);
    const publicPaths = ['/login', '/register', '/changepassword'];
    const path = url.split('?')[0];
    if (!userService.userValue && !publicPaths.includes(path)) { // When user is not logged in and URL is NOT Public
        setAuthorized(false);
        router.push({
            pathname: '/login',
            query: { returnUrl: router.asPath }
        });
    } else if (!userService.userValue && publicPaths.includes(path)) { //User NOT logged in and path is pub,ic
        setAuthorized(false);
    } else if(userService.userValue && !publicPaths.includes(path)) { //User logged in and path is NOT pubmic now check the ROLES
        const userCookie = cookie.get("user");
        if(userCookie && await access.hasAccess(url, JSON.parse(userCookie).authToken)){
          setAuthorized(true);
        }
    } else {
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
