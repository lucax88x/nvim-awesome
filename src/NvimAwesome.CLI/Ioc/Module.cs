using Autofac;
using NvimAwesome.CLI.Commands;
using NvimAwesome.CLI.Commands.Helpers;

namespace NvimAwesome.CLI.Ioc
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<CommandHelper>()
                .AsSelf()
                .SingleInstance();
            
            builder.RegisterType<GeneratePluginMetadataHelper>()
                .AsSelf()
                .SingleInstance();
        }
    }
}