// https://docs.github.com/en/rest/reference/repos#list-repository-languageos

import { GithubRepositoryInformation } from '@awesome/models/github.model';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import { cacheService } from './cache.service';

const githubPersonalAccessToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

const githubPrivateKey = process.env.GITHUB_PRIVATE_KEY;
const githubAppId = process.env.GITHUB_APP_ID;
const githubInstallationId = process.env.GITHUB_INSTALLATION_ID;
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

let githubOptions: {} | null = null;

if (!!githubPersonalAccessToken) {
  githubOptions = {
    auth: githubPersonalAccessToken,
  };
}

if (
  !!githubAppId &&
  !!githubInstallationId &&
  !!githubPrivateKey &&
  !!githubClientId &&
  !!githubClientSecret
) {
  githubOptions = {
    authStrategy: createAppAuth,
    auth: {
      appId: githubAppId,
      installationId: githubInstallationId,
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

function buildCacheKey(owner: string, repository: string) {
  return `${owner}|${repository}`;
}

const getGithubRepositoryInformations = async (
  owner: string,
  repository: string,
) => {
  const cacheKey = buildCacheKey(owner, repository);

  // in prod, this is used statically, so it's not used, but locally, we don't want to hit rate limit so we are caching it
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

      const { data } = getResponse;

      const starCount = data.stargazers_count;
      const issuesCount = data.open_issues_count;

      const ownerInfo = {
        avatar: data.owner.avatar_url,
        name: data.owner.login,
        link: data.owner.html_url,
      };

      let languages = {};
      if (getLanguages.status === 200) {
        languages = getLanguages.data;
      }

      const getDefaultBranchResponse = await octokit.rest.repos.getBranch({
        owner,
        repo: repository,
        branch: data.default_branch,
      });

      let lastCommit: {
        date: string;
        link: string;
      } | null = null;
      if (getDefaultBranchResponse.status === 200) {
        lastCommit = {
          date: getDefaultBranchResponse.data.commit.commit.author.date,
          link: getDefaultBranchResponse.data.commit.html_url,
        };
      }

      result = {
        starCount,
        issuesCount,
        languages,
        owner: ownerInfo,
        lastCommit,
      };
      console.info('setting in cache');
      await cacheService.set(cacheKey, result);
    } else {
      console.error(getResponse);
    }
  } else {
    console.info('from cache');
  }
  console.groupEnd();

  return result;
};

export const githubService = {
  getGithubRepositoryInformations,
};
