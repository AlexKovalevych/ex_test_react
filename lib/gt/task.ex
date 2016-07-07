defmodule Gt.Task do
    require Logger
    use Timex

    defmacro __using__(_) do
        quote do
            use Mix.Task
            require Logger
            def run(args) do
                Logger.info title
                Gt.start_repo_supervisor
                Logger.configure([level: :info])
                start_time = Time.now
                OptionParser.parse(args)
                |> parse_args
                |> do_process
                Gt.Task.log_time_diff(start_time, Time.now)
            end
        end
    end

    def log_time_diff(start_time, end_time) do
        minutes = to_string(Time.diff(end_time, start_time, :minutes))
        seconds = to_string(Time.diff(end_time, start_time, :seconds))
        Logger.info "Completed in " <> minutes <> "m " <> seconds <> "s"
    end
end
