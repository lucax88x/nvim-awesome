using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using McMaster.Extensions.CommandLineUtils;
using NvimAwesome.CLI.Commands.Helpers;
using Octokit;

namespace NvimAwesome.CLI.Commands.Subcommands
{
    [Command(Name = "fetch-github-repositories",
        Description = "Will fetch all github repository by topic neovim-plugin and generate metadata")]
    public class FetchGithubRepositories
    {
        private readonly CommandHelper _commandHelper;
        private readonly GeneratePluginMetadataHelper _generatePluginMetadataHelper;

        public FetchGithubRepositories(
            CommandHelper commandHelper,
            GeneratePluginMetadataHelper generatePluginMetadataHelper)
        {
            _commandHelper = commandHelper;
            _generatePluginMetadataHelper = generatePluginMetadataHelper;
        }

        protected async Task<int> OnExecute(CommandLineApplication app)
        {
            try
            {
                var token = string.Empty;
                var placeholder = "GITHUB_PERSONAL_ACCESS_TOKEN=";

                try
                {
                    var envLocal = await File.ReadAllTextAsync("src/nvim-awesome.app/.env.local");
                    // var envLocal = await File.ReadAllTextAsync("../../../../nvim-awesome.app/.env.local");
                    token = envLocal.Substring(envLocal.IndexOf(placeholder, StringComparison.Ordinal) + placeholder.Length);
                }
                catch (Exception)
                {
                    _commandHelper.OutputToConsole(
                        $"You must have a .env.local file with {placeholder}{{token}}");

                    throw;
                }

                var client = new GitHubClient(new ProductHeaderValue("nvim-awesome"));
                var tokenAuth = new Credentials(token);
                client.Credentials = tokenAuth;

                var page = 1;
                var hasItems = true;

                var disallowTopics = new[]
                {
                    "neovim",
                    "neovim-plugin",
                    "neovim-lsp",
                    "neovim-lua",
                    "nvim", "nvim-plugin",
                    "vim", "vim-plugin",
                    "vimscript", "vim-script",
                    "lua",
                    "plugin",
                    "code"
                };

                while (hasItems)
                {
                    var result = await client.Search.SearchRepo(new SearchRepositoriesRequest("topic:neovim-plugin")
                        {Page = page});

                    _commandHelper.OutputToConsole($"fetched {page} of {result.TotalCount / 100}");

                    if (result.Items.Count == 100)
                    {
                        page++;
                    }
                    else
                    {
                        hasItems = false;
                    }

                    foreach (var item in result.Items)
                    {
                        var topics = await client.Repository.GetAllTopics(item.Id);

                        _commandHelper.OutputToConsole($"Getting {item.Owner.Login} {item.Name}");

                        await _generatePluginMetadataHelper.GeneratePluginMetadata(
                            item.Owner.Login,
                            item.Name,
                            item.DefaultBranch,
                            item.Description,
                            string.Join(",",
                                topics.Names
                                    .Where(n => !disallowTopics.Contains(n.ToLower()))));
                    }

                    _commandHelper.OutputToConsole($"Got {result.Items.Count}");
                }

                return 1;
            }
            catch (Exception ex)
            {
                _commandHelper.OutputError(ex);
                return 1;
            }
        }
    }
}