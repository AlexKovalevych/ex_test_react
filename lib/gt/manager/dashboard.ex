defmodule Gt.Manager.Dashboard do
    use Timex
    alias Gt.Manager.Date, as: GtDate

    def get_stats(:month, previous_period, project_ids) do
        now = GtDate.today
        current = [
            now,
            now |> DateTime.set([{:date, {now.year, now.month, 1}}])
        ]
        comparison = [
            now |> Timex.shift(months: previous_period),
            Enum.at(current, 1) |> Timex.shift(months: previous_period)
        ]
    end
    def get_stats(:month_period, project_ids) do

    end
    def get_stats(:year, project_ids) do

    end
    def get_stats(:year_period, project_ids) do

    end
end
