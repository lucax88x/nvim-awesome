export type ENV = 'LOCAL' | 'PROD';

const getEnv = (): ENV => {
  switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case 'PROD':
      return 'PROD';
    case 'LOCAL':
      return 'LOCAL';
    default:
      throw Error('Missing Env');
  }
};

const getBaseUrl = () => {
  switch (getEnv()) {
    case 'PROD': {
      return 'https://nvim-awesome.vercel.app/';
    }
    case 'LOCAL': {
      return 'http://localhost:3000';
    }
    default:
      throw Error('Missing Env');
  }
};

const getApiUrl = () => {
  switch (getEnv()) {
    case 'PROD': {
      return '';
    }
    case 'LOCAL': {
      return 'http://localhost:3000/api';
    }
    default:
      throw Error('Missing Env');
  }
};

export const envService = {
  env: getEnv(),
  baseUrl: getBaseUrl(),
  apiUrl: getApiUrl(),
};

export function buildBaseUrl(relativePath: string): string {
  return `${envService.baseUrl}/${relativePath}`;
}

export function buildApiUrl(relativePath: string): string {
  return `${envService.apiUrl}/${relativePath}`;
}
