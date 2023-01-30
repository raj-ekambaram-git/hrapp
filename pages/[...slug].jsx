import { Flex, Heading, Stack } from '@chakra-ui/react';
import Head from 'next/head';
import content from '../static.content.json';

export default function Page({page}) {
  return (
      <>
        <Flex>
          <Heading>

          </Heading>
          <Stack>
            <div dangerouslySetInnerHTML={{__html: page?.content}}></div>
          </Stack>
        </Flex>
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