export interface Plugin {
  name: string;
  description?: string;
  link: string;
  owner: string;
  repository: string;
  tags?: string[];
  examples?: string[];
}

interface PluginJson {
  name?: string;
  description?: string;
  link?: string;
  tags?: string[];
  examples?: string[];
}

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
  const { repository, owner } = getRepositoryInfo(pluginJson.link);

  return {
    name: pluginJson.name,
    description: pluginJson.description,
    owner: owner,
    repository: repository,
    link: pluginJson.link,
    tags: pluginJson.tags ?? [],
    examples: pluginJson.examples ?? [],
  };
};

const getRepositoryInfo = (link: string) => {
  const splitted = link.split('/');

  if (splitted.length > 2) {
    return {
      owner: splitted[splitted.length - 2],
      repository: splitted[splitted.length - 1],
    };
  }
};
