import { promises } from 'fs';
import { join } from 'path';
import { jsonToPlugin } from '../models/plugin.model';

const { readdir, readFile } = promises;

const pluginsDirPath = 'data/plugins';

export const getPlugins = async () => {
  try {
    const files = await readdir(pluginsDirPath);
    if (!!files && files.length) {
      const plugins = [];
      for (const fileName of files) {
        const fileContent = await readFile(join(pluginsDirPath, fileName));

        const plugin = jsonToPlugin(fileContent.toString());
        if (!!plugin) {
          plugins.push(plugin);
        }
      }

      for (let i = 0; i < 50; i++) {
        plugins.push({
          name: `plugin ${i}`,
          description: `lorem ${i}`,
          link: 'some-link',
          tags: [`tag ${i}`],
          examples: ['https://via.placeholder.com/140x100'],
        });
      }

      return plugins;
    } else {
      console.error('No plugins found');
      return [];
    }
  } catch (err) {
    console.error(err);
    console.error('Plugins folder missing');
    return [];
  }
};
