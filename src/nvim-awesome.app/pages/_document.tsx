import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import colors from 'tailwindcss/colors';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html className='dark'>
        <Head>
          <style jsx global>{`
            body {
              --color-green500: ${colors.green[500]};
              --color-green700: ${colors.green[700]};
            }
          `}</style>
        </Head>
        <body className='bg-green-300 dark:bg-gray-800'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
