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
using NvimAwesome.CLI.Commands.Helpers;

namespace NvimAwesome.CLI.Commands.Subcommands
{
    [Command(Name = "generate-plugin-metadata",
        Description = "Given owner, repository and optionally a branch can generate a metadata parsing your README.MD")]
    public class GeneratePluginMetadata
    {
        private readonly CommandHelper _commandHelper;
        private readonly GeneratePluginMetadataHelper _generatePluginMetadataHelper;

        public GeneratePluginMetadata(
            CommandHelper commandHelper,
            GeneratePluginMetadataHelper generatePluginMetadataHelper)
        {
            _commandHelper = commandHelper;
            _generatePluginMetadataHelper = generatePluginMetadataHelper;
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
                await _generatePluginMetadataHelper.GeneratePluginMetadata(Owner,
                    Repository,
                    Branch,
                    Description,
                    Tags
                );

                return 0;
            }
            catch (Exception ex)
            {
                _commandHelper.OutputError(ex);
                return 1;
            }
        }
    }
}