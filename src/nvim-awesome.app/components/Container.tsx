import { PropsWithChildren } from 'react';
import { theme } from '../code/theme';

const styles = {
  root: {
    width: '100%',
    height: '100%',
    margin: 'auto',
    padding: `0 ${theme.spacing(1)}`,

    transition: 'all .6s cubic-bezier(0.175, 0.885, 0.32, 1.2)',

    overflow: 'auto',

    [theme.breakpoints.up('sm')]: {
      padding: `0 ${theme.spacing(2)}`,
      maxWidth: `${theme.breakpoints.values.sm}px`,
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: `${theme.breakpoints.values.md}px`,
    },
    [theme.breakpoints.up('lg')]: {
      padding: `0 ${theme.spacing(3)}`,
      maxWidth: `${theme.breakpoints.values.lg}px`,
    },
    // [theme.breakpoints.up('xl')]: {
    //   maxWidth: `${theme.breakpoints.values.xl}px`,
    // },
  },
};

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ContainerProps {}

export const Container = (props: PropsWithChildren<ContainerProps>) => {
  const { children } = props;

  return <div css={styles.root}>{children}</div>;
};
