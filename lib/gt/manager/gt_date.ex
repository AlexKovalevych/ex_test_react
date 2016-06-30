defmodule Gt.Manager.Date do
    use Timex

    def today do
        Timex.Date.today
    end

    def yesterday do
        today |> Timex.subtract(Time.to_timestamp(1, :days))
    end

    def format(date, :date) do
        Timex.format!(date, "%Y-%m-%d", :strftime)
    end

    def timestamp(date) do
        {mega, seconds, _} = Date.to_timestamp(date)
        (mega * 1000000 + seconds) * 1000
    end
end
