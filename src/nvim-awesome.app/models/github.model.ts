export interface GithubRepositoryInformation {
  starCount: number;
  issuesCount: number;
  owner: {
    name: string;
    avatar: string;
    link: string;
  };
  lastCommit: { date: string; link: string } | null;
  languages: { [language: string]: number };
}
