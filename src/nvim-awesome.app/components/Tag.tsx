import { CSSObject } from '@emotion/react';
import { PropsWithChildren, useMemo } from 'react';
import { theme } from '../code/theme';

interface TagProps {
  color: 'blue' | 'red' | 'green' | 'orange';
  isUppercase?: boolean;
}

const styles: CSSObject = {
  root: {
    display: 'grid',
    justifyContent: 'center',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    alignItems: 'center',
    whiteSpace: 'nowrap',
    padding: theme.spacing(1),
    borderRadius: '4px',
  },
};

export const Tag = ({
  color,
  isUppercase = true,
  children,
}: PropsWithChildren<TagProps>) => {
  const colors = useMemo(() => {
    switch (color) {
      default:
      case 'blue':
        return { backgroundColor: theme.palette.blue, color: 'white' };
      case 'red':
        return { backgroundColor: theme.palette.red, color: 'white' };
      case 'green':
        return { backgroundColor: theme.palette.primary5, color: 'white' };
      case 'orange':
        return { backgroundColor: theme.palette.orange, color: 'white' };
    }
  }, [color]);

  return (
    <div
      css={styles.root}
      style={{ ...colors, textTransform: isUppercase ? 'uppercase' : 'unset' }}
    >
      {children}
    </div>
  );
};
