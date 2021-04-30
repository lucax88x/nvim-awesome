import { CSSObject } from '@emotion/react';
import { theme } from '../code/theme';
import { GithubIcon } from '../icons/GithubIcon';
import { NeovimIcon } from '../icons/NeovimLogo';
import { Container } from './Container';
import Link from 'next/link';

export const headerHeight = theme.spacing(8);

const styles: CSSObject = {
  root: {
    width: '100vw',
    height: headerHeight,
    backgroundColor: theme.palette.primary4,
    borderBottom: `1px solid ${theme.palette.neutral6}`,
  },
  link: {
    textDecoration: 'none',
  },
  main: {
    height: '100%',
    display: 'grid',
    gridGap: theme.spacing(2),
    gridAutoFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

// TODO: convert to css grid
export const Header = () => {
  return (
    <div css={styles.root}>
      <Container>
        <div css={styles.main}>
          <Link href='/'>
            <a css={styles.link}>
              <NeovimIcon height='40' />
            </a>
          </Link>
          <a
            href='https://github.com/lucax88x/nvim-awesome'
            target='_blank'
            className='whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900'
          >
            <GithubIcon width='24' />
          </a>
        </div>
      </Container>
    </div>
  );
};
