// https://docs.github.com/en/rest/reference/repos#list-repository-languageos

import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { NextApiRequest, NextApiResponse } from 'next';
import { isString } from '../../../../code/is';
import { GithubRepositoryInformation } from '../../../../models/github.model';
import { cacheService } from '../../../../server/cache.service';

const githubPersonalAccessToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const githubPrivateKey = process.env.GITHUB_PRIVATE_KEY;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

let githubOptions: {} | null = null;

if (!!githubPersonalAccessToken) {
  githubOptions = {
    auth: githubPersonalAccessToken,
  };
}

if (!!githubPrivateKey && !!githubClientId && !!githubClientSecret) {
  githubOptions = {
    authStrategy: createAppAuth,
    auth: {
      appId: 112587,
      installationId: 16558069,
      privateKey: githubPrivateKey,
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    },
  };
}

if (!githubOptions) {
  throw new Error('github credentials not defined');
}

const octokit = new Octokit(githubOptions);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GithubRepositoryInformation | { error: string }>,
) {
  const { owner, repository } = req.query;

  if (isString(owner) && isString(repository)) {
    const cacheKey = buildCacheKey(owner, repository);

    let result = await cacheService.get<GithubRepositoryInformation>(cacheKey);

    console.group(cacheKey);
    if (!result) {
      console.info('not in cache, retrieving');
      const [getResponse, getLanguages] = await Promise.all([
        octokit.rest.repos.get({
          owner,
          repo: repository,
        }),
        octokit.rest.repos.listLanguages({
          owner,
          repo: repository,
        }),
      ]);

      if (getResponse.status === 200) {
        const rateLimitLimit = getResponse.headers['x-ratelimit-limit'];
        const rateLimitRemaining = getResponse.headers['x-ratelimit-remaining'];
        console.info(`rate limit ${rateLimitRemaining}/${rateLimitLimit}`);

        const starCount = getResponse.data.stargazers_count;
        const issuesCount = getResponse.data.open_issues_count;
        const owner = {
          avatar: getResponse.data.owner.avatar_url,
          name: getResponse.data.owner.login,
          link: getResponse.data.owner.html_url,
        };

        let languages = {};
        if (getLanguages.status === 200) {
          languages = getLanguages.data;
        }

        result = { starCount, issuesCount, languages, owner };
        console.info('setting in cache');
        await cacheService.set(cacheKey, result);
      } else {
        console.error(getResponse);
        res.status(400).json({ error: 'github api error' });
      }
    } else {
      console.info('from cache');
    }
    res.status(200).json(result);
    console.groupEnd();
  } else {
    res.status(400).json({ error: 'wrong fields' });
  }
}

function buildCacheKey(owner: string, repository: string) {
  return `${owner}|${repository}`;
}
