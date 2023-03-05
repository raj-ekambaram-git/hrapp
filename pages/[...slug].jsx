import { Flex, Heading, Stack, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import content from '../static.content.json';
import { Layout } from '../components/static/Layout';
import { FooterSection } from '../components/static/FooterSection';

export default function Page({page}) {


  return (
      <>
        <Head>
          <title>{page?.content.title}</title>
        </Head>
        <Layout>
           
          <Stack>
            <div dangerouslySetInnerHTML={{__html: page?.content}}></div>
          </Stack>

          <VStack
            backgroundColor="white"
            w="full"
            id="footer"
            spacing={16}
            py={[16, 0]}
          >
            <FooterSection/>
          </VStack>    
        </Layout>
      </>
  );
}

export async function getStaticPaths() {
  const paths = content.pages.map(page => {
    const slug = page.path.split('/').slice(1);
    return {params: {slug}};
  });
  return {paths, fallback: true};
}

export async function getStaticProps({params}) {
  const currentPath = `/${params.slug.join('/')}`;
  const page = content.pages.find(page => page.path === currentPath) || {notfound: true};
  return {props: {page}};
}