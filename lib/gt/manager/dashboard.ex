defmodule Gt.Manager.Dashboard do
    use Timex
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.Payment
    alias Gt.Model.ConsolidatedStats
    alias Gt.Model.ConsolidatedStatsMonthly
    alias Gt.Repo

    def get_period(:month) do
        now = GtDate.today
        current_start = now |> Date.set([day: 1])
        current_end = now
        [GtDate.format(current_start, :date), GtDate.format(current_end, :date)]
    end
    def get_period(:year_period) do
        current_end = GtDate.today |> Date.set([day: 1])
        current_start = current_end |> Timex.shift(months: -11)
        [GtDate.format(current_start, :month), GtDate.format(current_end, :month)]
    end
    def get_period(:month, previous_period) do
        now = GtDate.today
        current_start = now |> Date.set([day: 1])
        current_end = now
        comparison_start = Timex.shift(current_start, months: previous_period)
        comparison_end = now |> Timex.shift(months: previous_period)
        current_period = [GtDate.format(current_start, :date), GtDate.format(current_end, :date)]
        comparison_period = [GtDate.format(comparison_start, :date), GtDate.format(comparison_end, :date)]
        [current_start, current_end, comparison_start, comparison_end, current_period, comparison_period]
    end

    def get_stats(:month, previous_period, project_ids) do
        [current_start, current_end, comparison_start, comparison_end, current_period, comparison_period] = get_period(:month, previous_period)

        # calculate project stats
        initial = %{
            "current" => %{},
            "comparison" => %{}
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
        |> set_depositors(stats, "current")
        stats = Payment.depositors_number_by_period(
            comparison_start,
            comparison_end,
            project_ids
        )
        |> Enum.to_list
        |> set_depositors(stats, "comparison")

        stats = ConsolidatedStats.dashboard(current_start, current_end, project_ids)
        |> Enum.to_list
        |> set_stats(stats, "current")

        stats = ConsolidatedStats.dashboard(comparison_start, comparison_end, project_ids)
        |> Enum.to_list
        |> set_stats(stats, "comparison")

        # calculate totals
        totals = initial
        totals = Payment.depositors_number_by_period(
            current_start,
            current_end,
            project_ids,
            :total
        )
        |> Enum.to_list
        |> set_depositors(totals, "current", :total)

        totals = Payment.depositors_number_by_period(
            comparison_start,
            comparison_end,
            project_ids,
            :total
        )
        |> Enum.to_list
        |> set_depositors(totals, "comparison", :total)

        totals = ConsolidatedStats.dashboard(current_start, current_end, project_ids, :total)
        |> Enum.to_list
        |> set_stats(totals, "current", :total)

        totals = ConsolidatedStats.dashboard(comparison_start, comparison_end, project_ids, :total)
        |> Enum.to_list
        |> set_stats(totals, "comparison", :total)

        %{
            stats: stats,
            periods: %{current: current_period, comparison: comparison_period},
            totals: totals
        }
    end
    def get_stats(:month_period, project_ids) do

    end
    def get_stats(:year, project_ids) do

    end
    def get_stats(:year_period, project_ids) do

    end

    def get_charts(:month, project_ids) do
        [daily_from, daily_to] = get_period(:month)
        [monthly_from, monthly_to] = get_period(:year_period)

        daily_charts = Enum.reduce(project_ids, %{}, fn (project_id, acc) ->
            id = Gt.Model.id_to_string(project_id)
            data = ConsolidatedStats
            |> ConsolidatedStats.dashboard_charts
            |> ConsolidatedStats.project_id(id)
            |> ConsolidatedStats.period(daily_from, daily_to)
            |> Repo.all
            |> Enum.reduce(%{}, fn (daily_stat, acc) ->
                Map.put(acc, daily_stat[:date], daily_stat)
            end)
            Map.put(acc, id, data)
        end)

        monthly_charts = Enum.reduce(project_ids, %{}, fn (project_id, acc) ->
            id = Gt.Model.id_to_string(project_id)
            data = ConsolidatedStatsMonthly
            |> ConsolidatedStatsMonthly.dashboard_charts
            |> ConsolidatedStatsMonthly.project_id(id)
            |> ConsolidatedStatsMonthly.period(monthly_from, monthly_to)
            |> Repo.all
            |> Enum.reduce(%{}, fn (monthly_stat, acc) ->
                Map.put(acc, monthly_stat[:month], monthly_stat)
            end)
            Map.put(acc, id, data)
        end)

        total_daily_charts = ConsolidatedStats.dashboard_charts_period(daily_from, daily_to, project_ids)
        |> Enum.reduce(%{}, fn (daily_stat, acc) ->
            Map.put(acc, daily_stat["_id"], daily_stat)
        end)

        total_monthly_charts = ConsolidatedStatsMonthly.dashboard_charts_period(monthly_from, monthly_to, project_ids)
        |> Enum.reduce(%{}, fn (monthly_stat, acc) ->
            Map.put(acc, monthly_stat["_id"], monthly_stat)
        end)

        %{
            stats: %{
                daily: daily_charts,
                monthly: monthly_charts
            },
            totals: %{
                daily: total_daily_charts,
                monthly: total_monthly_charts
            }
        }
    end

    def consolidated_chart(:daily, from, to, project_id) do
        ConsolidatedStats
        |> ConsolidatedStats.project_id(project_id)
        |> ConsolidatedStats.period(from, to)
        |> ConsolidatedStats.consolidated_chart
        |> Repo.all
        |> Enum.chunk(1)
        |> Enum.into(%{}, fn [consolidated_stats] ->
            {consolidated_stats.date, consolidated_stats}
        end)
    end
    def consolidated_chart(:monthly, project_id) do
        [monthly_from, monthly_to] = get_period(:year_period)
        ConsolidatedStatsMonthly
        |> ConsolidatedStatsMonthly.project_id(project_id)
        |> ConsolidatedStatsMonthly.period(monthly_from, monthly_to)
        |> ConsolidatedStatsMonthly.consolidated_chart
        |> Repo.all
        |> Enum.chunk(1)
        |> Enum.into(%{}, fn [consolidated_stats] ->
            {consolidated_stats.month, consolidated_stats}
        end)
    end

    defp set_depositors(data, stats, key) do
        Enum.reduce(data, stats, fn (project_stats, acc) ->
            put_in(acc, [Gt.Model.id_to_string(project_stats["_id"]), key, "depositorsNumber"], project_stats["depositorsNumber"])
        end)
    end
    defp set_depositors(data, totals, key, :total) do
        put_in(totals, [key, "depositorsNumber"], Enum.at(data, 0)["depositorsNumber"])
    end

    defp set_stats(data, stats, key) do
        Enum.reduce(data, stats, fn (project_stats, acc) ->
            project_id = Gt.Model.id_to_string(project_stats["_id"])
            metrics_stats = Map.drop(project_stats, ["_id"])
            project_period_stats = get_in(stats, [project_id, key])
            put_in(acc, [project_id, key], Map.merge(project_period_stats, metrics_stats))
        end)
    end
    defp set_stats(data, totals, key, :total) do
        metrics_stats = Map.drop(Enum.at(data, 0), ["_id"])
        total_period_stats = get_in(totals, [key])
        put_in(totals, [key], Map.merge(total_period_stats, metrics_stats))
    end
end
