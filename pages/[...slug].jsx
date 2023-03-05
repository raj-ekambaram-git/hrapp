import { Flex, Heading, Stack, VStack, Container, Center } from '@chakra-ui/react';
import Head from 'next/head';
import content from '../static.content.json';
import { Layout } from '../components/static/Layout';
import { FooterSection } from '../components/static/FooterSection';
import Components from "../components/components";

export default function Page({page}) {


  return (
      <>
        <Head>
          <title>{page?.content?.title}</title>
        </Head>
        <Layout>
          <VStack
              backgroundColor="white"
              w="full"
              spacing={16}
              py={[16, 0]}
            >
              {page?.components?.map(block => Components(block))}           
		      </VStack>    
          <FooterSection/>
          
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