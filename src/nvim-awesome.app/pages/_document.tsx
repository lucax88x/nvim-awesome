import Document, {
  DocumentContext,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { theme } from '../code/theme';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <style jsx global>{`
            body {
              --color-primary5: ${theme.palette.primary5};
              --color-primary6: ${theme.palette.primary6};
              --color-neutral5: ${theme.palette.neutral5};
              --color-neutral6: ${theme.palette.neutral6};
              --color-contrary5: ${theme.palette.contrary5};
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
