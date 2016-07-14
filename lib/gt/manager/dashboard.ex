defmodule Gt.Manager.Dashboard do
    use Timex
    import ExPrintf
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.Payment
    alias Gt.Model.ConsolidatedStats

    def get_stats(:month, previous_period, project_ids) do
        now = GtDate.today
        current_start = now |> Date.set([day: 1])
        current_end = now
        comparison_start = Timex.shift(current_start, months: previous_period)
        comparison_end = now |> Timex.shift(months: previous_period)

        current_key = sprintf("%s|%s", [GtDate.format(current_start, :date), GtDate.format(current_end, :date)])
        comparison_key = sprintf("%s|%s", [GtDate.format(comparison_start, :date), GtDate.format(comparison_end, :date)])
        initial = %{
            current_key => %{},
            comparison_key => %{}
        }
        stats = Enum.into(project_ids, %{}, fn id ->
            {Gt.Model.id_to_string(id), initial}
        end)
        stats = Payment.depositors_number_by_period(
            current_start,
            current_end,
            project_ids
        )
        |> Enum.to_list
        |> set_depositors(stats, current_key)
        stats = Payment.depositors_number_by_period(
            comparison_start,
            comparison_end,
            project_ids
        )
        |> Enum.to_list
        |> set_depositors(stats, comparison_key)

        stats = ConsolidatedStats.dashboard(current_start, current_end, project_ids)
        |> Enum.to_list
        |> set_stats(stats, current_key)

        ConsolidatedStats.dashboard(comparison_start, comparison_end, project_ids)
        |> Enum.to_list
        |> set_stats(stats, comparison_key)
    end
    def get_stats(:month_period, project_ids) do

    end
    def get_stats(:year, project_ids) do

    end
    def get_stats(:year_period, project_ids) do

    end

    defp set_depositors(data, stats, key) do
        Enum.reduce(data, stats, fn (project_stats, acc) ->
            put_in(acc, [Gt.Model.id_to_string(project_stats["_id"]), key, "depositorsNumber"], project_stats["depositorsNumber"])
        end)
    end

    defp set_stats(data, stats, key) do
        Enum.reduce(data, stats, fn (project_stats, acc) ->
            project_id = Gt.Model.id_to_string(project_stats["_id"])
            metrics_stats = Map.drop(project_stats, ["_id"])
            project_period_stats = get_in(stats, [project_id, key])
            put_in(acc, [project_id, key], Map.merge(project_period_stats, metrics_stats))
        end)
    end
end
