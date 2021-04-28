using System;
using System.Threading.Tasks;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using NvimAwesome.CLI.Commands;
using Serilog;

namespace NvimAwesome.CLI
{
    class Program
    {
        private static async Task<int> Main(string[] args)
        {
            Log.Logger = LoggerFactory.Create("cli");

            try
            {
                var hostBuilder = new HostBuilder()
                    .UseServiceProviderFactory(new AutofacServiceProviderFactory())
                    .ConfigureContainer((ContainerBuilder builder) => builder.RegisterModule(new Ioc.Module()))
                    .ConfigureServices((_,
                        services) =>
                    {
                        services.AddAutofac();
                    })
                    .ConfigureLogging(logging => { logging.AddSerilog(); });

                await hostBuilder.RunCommandLineApplicationAsync<CliCommand>(args)
                    .ConfigureAwait(false);

                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex,
                    "cli terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
    }
}