using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Flurl;
using Flurl.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NvimAwesome.CLI.Commands.Helpers
{
    public class GeneratePluginMetadataHelper
    {
        public async Task GeneratePluginMetadata(string owner,
            string repository,
            string branch,
            string description,
            string tags)
        {
            var readmes = new[] {"README.md", "Readme.md", "readme.md"};
            foreach (var readmeName in readmes)
            {
                Url url = $"https://raw.githubusercontent.com/{owner}/{repository}/{branch}/{readmeName}";

                try
                {
                    var readme = await url.GetStringAsync();

                    var plugin = new PluginJson(repository,
                        description,
                        $"https://github.com/{owner}/{repository}",
                        string.IsNullOrEmpty(tags)
                            ? new List<string>()
                            : tags.Split(",")
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

                    await File.WriteAllTextAsync($"./src/nvim-awesome.app/data/plugins/{owner}-{repository}.json",
                        json);

                    break;
                }
                catch (FlurlHttpException)
                {
                }
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