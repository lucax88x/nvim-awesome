using System;
using System.Reflection;
using System.Threading.Tasks;
using McMaster.Extensions.CommandLineUtils;
using NvimAwesome.CLI.Commands.Subcommands;

namespace NvimAwesome.CLI.Commands
{
    [Command(Name = "cli",
        OptionsComparison = StringComparison.InvariantCultureIgnoreCase)]
    [VersionOptionFromMember("--version",
        MemberName = nameof(GetVersion))]
    [Subcommand(
        typeof(GeneratePluginMetadata)
    )]
    public class CliCommand
    {
        protected Task<int> OnExecute(CommandLineApplication app)
        {
            // this shows help even if the --help option isn't specified
            app.ShowHelp();
            return Task.FromResult(0);
        }

        private static string GetVersion()
            => typeof(CliCommand).Assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()!
                .InformationalVersion;
    }
}