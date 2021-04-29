import { uniqBy } from 'ramda';

export interface PluginExampleLink {
  label: string;
  link: string;
}

export interface Plugin {
  name: string;
  description?: string;
  link: string;
  owner: string;
  repository: string;
  tags?: string[];
  examples?: PluginExampleLink[];
}

interface PluginJson {
  name?: string;
  description?: string;
  link?: string;
  tags?: string[];
  examples?: { label: string; link: string }[];
}

const getRepositoryInfo = (link: string) => {
  const splitted = link.split('/');

  if (splitted.length > 2) {
    return {
      owner: splitted[splitted.length - 2],
      repository: splitted[splitted.length - 1],
    };
  }

  return null;
};

export const jsonToPlugin = (json: string): Plugin | null => {
  if (!json || !json.length) {
    console.error('invalid json');
    return null;
  }

  const pluginJson: PluginJson = JSON.parse(json);

  if (!pluginJson.name || !pluginJson.link) {
    console.error('name and link are mandatory ');
    return null;
  }

  // TODO: validate link
  const repositoryInfo = getRepositoryInfo(pluginJson.link);

  if (!repositoryInfo) {
    return null;
  }

  return {
    name: pluginJson.name,
    description: pluginJson.description,
    owner: repositoryInfo.owner,
    repository: repositoryInfo.repository,
    link: pluginJson.link,
    tags: pluginJson.tags ?? [],
    examples: uniqBy(p => p.link, pluginJson.examples) ?? [],
  };
};
