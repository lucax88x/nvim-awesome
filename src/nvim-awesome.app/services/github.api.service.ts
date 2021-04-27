import { buildApiUrl } from './env.service';

export const getRepositoryInformations = (owner: string, repository: string) => async () => {
  try {
    const result = await fetch(
      `${buildApiUrl('github')}/${owner}/${repository}`,
    );

    const json = await result.json();

    return json;
  } catch (error) {
    // if we need to extract, etc
    console.error(error);
    throw error;
  }
};
