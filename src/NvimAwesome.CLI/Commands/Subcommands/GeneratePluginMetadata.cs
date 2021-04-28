using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using McMaster.Extensions.CommandLineUtils;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NvimAwesome.CLI.Commands.Subcommands
{
    [Command(Name = "generate-plugin-metadata",
        Description = "Given owner, repository and optionally a branch can generate a metadata parsing your README.MD")]
    public class GeneratePluginMetadata
    {
        private readonly CommandHelper _commandHelper;

        public GeneratePluginMetadata(
            CommandHelper commandHelper)
        {
            _commandHelper = commandHelper;
        }

        [Required]
        [Option(CommandOptionType.SingleValue,
            ShortName = "o",
            LongName = "owner",
            Description = "github owner",
            ShowInHelpText = true
        )]
        public string Owner { get; set; } = string.Empty;

        [Required]
        [Option(CommandOptionType.SingleValue,
            ShortName = "r",
            LongName = "repository",
            Description = "github repository",
            ShowInHelpText = true
        )]
        public string Repository { get; set; } = string.Empty;

        [Option(CommandOptionType.SingleValue,
            ShortName = "b",
            LongName = "branch",
            Description = "github branch",
            ShowInHelpText = true
        )]
        public string Branch { get; set; } = "master";
        
        [Option(CommandOptionType.SingleValue,
            ShortName = "d",
            LongName = "description",
            Description = "description of your plugin",
            ShowInHelpText = true
        )]
        public string Description { get; set; } = string.Empty;

        [Option(CommandOptionType.SingleValue,
            ShortName = "t",
            LongName = "tags",
            Description = "tags of your plugin",
            ShowInHelpText = true
        )]
        public string Tags { get; set; } = string.Empty;

        protected async Task<int> OnExecute(CommandLineApplication app)
        {
            try
            {
                Url url = $"https://raw.githubusercontent.com/{Owner}/{Repository}/{Branch}/readme.md";
                
                var readme = await url.GetStringAsync();

                var plugin = new PluginJson(Repository,
                    Description,
                    $"https://github.com/{Owner}/{Repository}",
                    string.IsNullOrEmpty(Tags)
                        ? new List<string>()
                        : Tags.Split(",")
                            .ToList(),
                    ExtractExamples(readme)
                );

                var contractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };

                var json = JsonConvert.SerializeObject(plugin,
                    new JsonSerializerSettings
                    {
                        ContractResolver = contractResolver,
                        Formatting = Formatting.Indented
                    });

                await File.WriteAllTextAsync($"./src/nvim-awesome.app/data/plugins/{Owner}-{Repository}.json", json);
                // _commandHelper.OutputToConsole(json);

                return 0;
            }
            catch (Exception ex)
            {
                _commandHelper.OutputError(ex);
                return 1;
            }
        }

        private static List<PluginJsonExample> ExtractExamples(string readme)
        {
            var pattern = @"\[(?<text>.+)\]\((?<url>.*)?\)";
            var acceptedExtensions = new List<string> {"gif", "mp4", "jpeg", "jpg", "png", "tiff"};

            var pluginExamples = new List<PluginJsonExample>();
            foreach (Match match in Regex.Matches(readme,
                pattern,
                RegexOptions.IgnoreCase |
                RegexOptions.Multiline))
            {
                var text = match.Groups[1]
                    .Value;
                var url = match.Groups[2]
                    .Value;

                if (url.StartsWith("https://"))
                {
                    foreach (var acceptedExtension in acceptedExtensions)
                    {
                        if (url.EndsWith($".{acceptedExtension}"))
                        {
                            pluginExamples.Add(new PluginJsonExample(text,
                                url));
                            break;
                        }
                    }
                }
            }

            return pluginExamples;
        }

        internal class PluginJson
        {
            public PluginJson(string name,
                string description,
                string link,
                List<string> tags,
                List<PluginJsonExample> examples)
            {
                Name = name;
                Description = description;
                Link = link;
                Tags = tags;
                Examples = examples;
            }

            public string Name { get; }
            public string Description { get; }
            public string Link { get; }
            public List<string> Tags { get; }
            public List<PluginJsonExample> Examples { get; }
        }

        internal class PluginJsonExample
        {
            public PluginJsonExample(string label,
                string link)
            {
                Label = label;
                Link = link;
            }

            public string Label { get; }
            public string Link { get; }
        }
    }
}