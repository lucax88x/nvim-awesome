using Autofac;
using NvimAwesome.CLI.Commands;

namespace NvimAwesome.CLI.Ioc
{
    public class Module : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<CommandHelper>()
                .AsSelf()
                .SingleInstance();
        }
    }
}