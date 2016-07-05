defmodule Gt.Task do
    use Timex
    alias Gt.Manager.Date, as: GtDate
    require Logger

    defmacro __using__(_) do
        quote do
            def run(args) do
                Logger.configure([level: :info])
                start_time = Time.now
                OptionParser.parse(args)
                |> parse_args
                |> do_process
                GtDate.log_time_diff(start_time, Time.now)
            end
        end
    end
end
