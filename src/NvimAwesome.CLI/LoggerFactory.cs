using Serilog;
using Serilog.Events;

namespace NvimAwesome.CLI
{
    public static class LoggerFactory
    {
        public static ILogger Create(string name)
        {
            return new LoggerConfiguration()
                .MinimumLevel.Information()
                .MinimumLevel.Override("Microsoft",
                    LogEventLevel.Information)
                .Enrich.FromLogContext()
                .WriteTo.File($"logs/{name}.log",
                    rollingInterval: RollingInterval.Hour)
                .WriteTo.Console()
                .CreateLogger();
        }
    }
}