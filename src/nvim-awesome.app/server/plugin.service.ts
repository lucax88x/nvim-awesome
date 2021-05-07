import { GithubRepositoryInformation } from '@awesome/models/github.model';
import { promises } from 'fs';
import { join } from 'path';
import { descend, map, sortWith } from 'ramda';
import {
  jsonToPlugin,
  Plugin,
  PluginWithoutGithub,
} from '../models/plugin.model';
import { githubService } from './github.service';

const { readdir, readFile } = promises;

const pluginsDirPath = 'data/plugins';

const get = async () => {
  try {
    const files = await readdir(pluginsDirPath);
    if (!!files && files.length) {
      console.info(`retrieved plugin files: ${files.length}`);
      const readFilePromises = map(
        fileName => readFile(join(pluginsDirPath, fileName)),
        files,
      );

      const buffers = await Promise.all(readFilePromises);

      const pluginsWithoutGithub = map(
        buffer => jsonToPlugin(buffer.toString()),
        buffers,
      );

      const githubInformationPromises = map(
        plugin =>
          githubService
            .getGithubRepositoryInformations(plugin.owner, plugin.repository)
            .then(
              gh =>
                [plugin, gh] as [
                  PluginWithoutGithub,
                  GithubRepositoryInformation,
                ],
            ),
        pluginsWithoutGithub,
      );

      try {
        const githubInformations = await Promise.all(githubInformationPromises);

        console.info(
          `retrieved github informations: ${githubInformations.length}`,
        );

        const plugins = map(
          ([plugin, githubInformation]) =>
            ({ ...plugin, github: githubInformation } as Plugin),
          githubInformations,
        );

        return sortWith([descend(plugin => plugin.github.starCount)], plugins);
      } catch (err) {
        console.error(err);

        return map(
          plugin => ({
            ...plugin,
            github: {
              starCount: 0,
              issuesCount: 0,
              owner: {
                name: plugin.owner,
                avatar: '',
                link: '',
              },
              lastCommit: null,
              languages: {},
            },
          }),
          pluginsWithoutGithub,
        ) as Plugin[];
      }
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
