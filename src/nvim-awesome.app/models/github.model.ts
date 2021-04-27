export interface GithubRepositoryInformation {
  starCount: number;
  issuesCount: number;
  owner: {
    name: string;
    avatar: string;
    link: string;
  };
  languages: { [language: string]: number };
}
