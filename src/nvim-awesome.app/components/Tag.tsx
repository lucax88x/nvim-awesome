import { CSSObject } from '@emotion/react';
import { PropsWithChildren, useCallback, useMemo } from 'react';
import { theme } from '../code/theme';

interface TagProps {
  name: string;
  color: 'blue' | 'red' | 'green' | 'orange';
  isUppercase?: boolean;
  onClick: (name: string) => void;
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
    border: 'none',
    cursor: 'pointer',
  },
};

export const Tag = ({
  name,
  color,
  isUppercase = true,
  children,
  onClick,
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

  const handleClick = useCallback(() => onClick(name), [name, onClick]);
  return (
    <button
      css={styles.root}
      type="button"
      style={{ ...colors, textTransform: isUppercase ? 'uppercase' : 'unset' }}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
