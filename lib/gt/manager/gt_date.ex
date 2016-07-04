defmodule Gt.Manager.Date do
    use Timex
    require Logger

    def today do
        Timex.Date.today
    end

    def now do
        Timex.DateTime.today
    end

    def yesterday do
        today |> Timex.subtract(Time.to_timestamp(1, :days))
    end

    def format(date, :date) do
        Timex.format!(date, "%Y-%m-%d", :strftime)
    end
    def format(date, :time) do
        Timex.format!(date, "%H-%M-%S", :strftime)
    end
    def format(date, :date, :tuple) do
        {date.year, date.month, date.day}
    end
    def format(date, :time, :tuple) do
        {date.hour, date.minute, date.second}
    end
    def format(date, :microtime, :tuple) do
        Tuple.append(format(date, :time, :tuple), date.millisecond)
    end

    def timestamp(date) do
        {mega, seconds, _} = case Date.to_timestamp(date) do
            {_, _, _} -> Date.to_timestamp(date)
            {:error, _} -> DateTime.to_timestamp(date)
        end
        (mega * 1000000 + seconds) * 1000
    end

    def to_bson(date, :date) when is_bitstring(date) do
        {:ok, date} = Timex.Parse.DateTime.Parser.parse(date, "%Y-%m-%d", :strftime)
        BSON.DateTime.from_datetime({format(date, :date, :tuple), format(date, :microtime, :tuple)})
    end

    def log_time_diff(start_time, end_time) do
        minutes = to_string(Time.diff(end_time, start_time, :minutes))
        seconds = to_string(Time.diff(end_time, start_time, :seconds))
        Logger.info "Completed in " <> minutes <> "m " <> seconds <> "s"
    end
end
