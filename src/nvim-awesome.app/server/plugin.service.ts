import { promises } from 'fs';
import { join } from 'path';
import { jsonToPlugin, Plugin } from '../models/plugin.model';

const { readdir, readFile } = promises;

const pluginsDirPath = 'data/plugins';

const get = async () => {
  try {
    const files = await readdir(pluginsDirPath);
    if (!!files && files.length) {
      const plugins: Plugin[] = [];
      for (const fileName of files) {
        const fileContent = await readFile(join(pluginsDirPath, fileName));

        const plugin = jsonToPlugin(fileContent.toString());
        if (!!plugin) {
          plugins.push(plugin);
        }
      }

      return plugins;
    }

    console.error('No plugins found');
    return [];
  } catch (err) {
    console.error(err);
    console.error('Plugins folder missing');
    return [];
  }
};

export const pluginService = { get };
