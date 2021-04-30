export interface ThemePalette {
  neutral4: string;
  neutral5: string;
  neutral6: string;

  contrary5: string;

  primary4: string;
  primary5: string;
  primary6: string;

  error: string;
  warning: string;
  success: string;

  blue: string;
  red: string;
  orange: string;
}

interface ThemeBreakpointValues {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

class ThemeBreakpoints {
  values = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  };

  up(breakpoint: keyof ThemeBreakpointValues): string {
    return `@media (min-width: ${this.values[breakpoint]}px)`;
  }

  down(breakpoint: keyof ThemeBreakpointValues): string {
    return `@media (down-width: ${this.values[breakpoint]}px)`;
  }
}

export const theme: {
  palette: ThemePalette;
  breakpoints: ThemeBreakpoints;
  spacing: (mult: number) => string;
} = {
  palette: {
    contrary5: '#e0e0e0',

    neutral4: '#FFD3A4',
    neutral5: '#333333',
    neutral6: '#191919',

    primary4: '#01FF70',
    primary5: '#559140',
    primary6: '#2a4820',

    error: '#f44336',
    warning: '#ffc107',
    success: '#4caf50',

    blue: '#0074D9',
    red: '#FF4136',
    orange: '#FF851B',
  },
  breakpoints: new ThemeBreakpoints(),
  spacing: (mult: number) => `${mult * 8}px`,
};
