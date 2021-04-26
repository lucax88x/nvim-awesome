export interface Plugin {
  name: string;
  link: string;
  tags?: string[];
  examples?: string[];
}

interface PluginJson {
  name?: string;
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

  return {
    name: pluginJson.name,
    link: pluginJson.link,
    tags: pluginJson.tags ?? [],
    examples: pluginJson.examples ?? [],
  };
};
