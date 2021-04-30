import { theme } from '@awesome/code/theme';
import { css, Global } from '@emotion/react';

export const ThemeInjector = () => {
  return (
    <Global
      styles={css`
        body {
          --color-primary5: ${theme.palette.primary5};
          --color-primary6: ${theme.palette.primary6};
          --color-neutral5: ${theme.palette.neutral5};
          --color-neutral6: ${theme.palette.neutral6};
          --color-contrary5: ${theme.palette.contrary5};
        }
      `}
    />
  );
};
