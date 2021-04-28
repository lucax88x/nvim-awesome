using System;
using McMaster.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace NvimAwesome.CLI.Commands
{
    public class CommandHelper
    {
        private readonly IConsole _console;
        private readonly ILogger<CommandHelper> _logger;

        public CommandHelper(IConsole console,
            ILogger<CommandHelper> logger)
        {
            _console = console;
            _logger = logger;
        }

        public string TryRequestParameter(string label,
            string originalValue)
        {
            if (!string.IsNullOrEmpty(originalValue))
            {
                return originalValue;
            }

            var value = Prompt.GetString(label,
                originalValue);

            if (!string.IsNullOrEmpty(value))
            {
                return value;
            }

            throw new ArgumentException($"{label} is missing");
        }

        public int TryRequestParameterAsInt(string label)
        {
            return Prompt.GetInt(label);
        }

        public bool RequestConfirm(string question)
        {
            return Prompt.GetYesNo(question,
                true,
                ConsoleColor.Yellow);
        }

        public void OutputToConsole(string data)
        {
            _console.BackgroundColor = ConsoleColor.Black;
            _console.ForegroundColor = ConsoleColor.White;
            _console.Out.Write(data);
            _console.ResetColor();
            _console.WriteLine();
        }

        public void OutputError(Exception exception)
        {
            _logger.LogError(exception,
                exception.Message);

            _console.ForegroundColor = ConsoleColor.Red;
            _console.Error.WriteLine(exception.Message);
            _console.ResetColor();
            _console.WriteLine();
        }
    }
}