defmodule Gt.Manager.Date do
    use Timex
    require Logger

    @date_format "%Y-%m-%d"
    @month_format "%Y-%m"
    @time_format "%H-%M-%S"

    def today do
        Timex.Date.today
    end

    def now do
        Timex.DateTime.today
    end

    def yesterday do
        today |> Timex.shift(days: 1)
    end

    def format(date, :date) do
        Timex.format!(date, @date_format, :strftime)
    end
    def format(date, :time) do
        Timex.format!(date, @time_format, :strftime)
    end
    def format(date, :month) do
        Timex.format!(date, @month_format, :strftime)
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

    def parse(date, :date) do
        {:ok, parsed_date} = Timex.parse(date, @date_format, :strftime)
        parsed_date
    end

    def diff(start_date, end_date, :months) do
        Timex.diff(start_date, end_date, :months)
    end

    def timestamp(date) do
        {mega, seconds, _} = case Date.to_timestamp(date) do
            {_, _, _} -> Date.to_timestamp(date)
            {:error, _} -> DateTime.to_timestamp(date)
        end
        (mega * 1000000 + seconds) * 1000
    end

    def to_bson(date, :date) when is_bitstring(date) do
        parsed_date = parse(date, :date)
        BSON.DateTime.from_datetime({
            format(parsed_date, :date, :tuple),
            format(parsed_date, :microtime, :tuple)
        })
    end

    def log_time_diff(start_time, end_time) do
        minutes = to_string(Time.diff(end_time, start_time, :minutes))
        seconds = to_string(Time.diff(end_time, start_time, :seconds))
        Logger.info "Completed in " <> minutes <> "m " <> seconds <> "s"
    end
end
