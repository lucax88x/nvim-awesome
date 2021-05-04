import Head from 'next/head';

interface SeoHeadProps {
  name: string;

  description: string;
}

export const SeoHead = ({ name, description }: SeoHeadProps) => (
  <Head>
    <title>{name}</title>
    <meta name='description' content={description} />
    <meta name='robots' content='index, follow' />

    <meta name='twitter:site' content='nvimawesome' />
    <meta name='twitter:title' content={name} />
    <meta name='twitter:description' content={description} />

    <meta property='og:title' content={name} />
    <meta property='og:description' content={description} />
    <meta property='og:site_name' content='nvimawesome' />
  </Head>
);
