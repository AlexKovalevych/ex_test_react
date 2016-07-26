defmodule Gt.Manager.Dashboard do
    use Timex
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.Payment
    alias Gt.Model.ConsolidatedStats
    alias Gt.Model.ConsolidatedStatsMonthly
    alias Gt.Repo
    alias Gt.Manager.Permissions
    alias Gt.Model.Project

    def load_data(user, period \\ nil) do
        settings = user.settings
        project_ids = Permissions.get(user.permissions, "dashboard_index")
        projects = Project |> Project.ids(project_ids) |> Repo.all
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        period = case period do
            nil -> String.to_atom(settings["dashboardPeriod"])
            _ -> String.to_atom(period)
        end
        data = get_stats(
            period,
            settings["dashboardComparePeriod"],
            project_ids
        )
        charts = get_charts(period, project_ids)
        %{
            stats: data.stats,
            charts: charts,
            periods: data.periods,
            totals: data.totals,
            projects: projects,
            lastUpdated: GtDate.timestamp(GtDate.now)
        }
    end

    def get_current_period(:month) do
        now = GtDate.today
        current_start = now |> Date.set([day: 1])
        current_end = now
        [GtDate.format(current_start, :date), GtDate.format(current_end, :date)]
    end
    def get_current_period(:year) do
        now = GtDate.today
        current_start = now |> Date.set([month: 1, day: 1])
        current_end = now
        [GtDate.format(current_start, :date), GtDate.format(current_end, :date)]
    end
    def get_current_period(:months12) do
        current_end = GtDate.today |> Date.set([day: 1])
        current_start = current_end |> Timex.shift(months: -11)
        [GtDate.format(current_start, :month), GtDate.format(current_end, :month)]
    end
    def get_period(:year) do
        now = GtDate.today
        current_start = now |> Date.set([month: 1, day: 1])
        current_end = now
        comparison_start = Timex.shift(current_start, years: -1)
        comparison_end = now |> Timex.shift(years: -1)
        current_period = [GtDate.format(current_start, :date), GtDate.format(current_end, :date)]
        comparison_period = [GtDate.format(comparison_start, :date), GtDate.format(comparison_end, :date)]
        [current_start, current_end, comparison_start, comparison_end, current_period, comparison_period]
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
    def get_stats(:year, _, project_ids) do
        [current_start, current_end, comparison_start, comparison_end, current_period, comparison_period] = get_period(:year)

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
    def get_stats(:days30, _, project_ids) do

    end
    def get_stats(:months12, _, project_ids) do

    end

    def get_charts(:month, project_ids) do
        [daily_from, daily_to] = get_current_period(:month)
        [monthly_from, monthly_to] = get_current_period(:months12)

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
    def get_charts(:year, project_ids) do

    end
    def get_charts(:days30, project_ids) do

    end
    def get_charts(:months12, project_ids) do

    end

    def consolidated_chart(:daily, from, to, project_ids) when is_list(project_ids) do
        ConsolidatedStats.consolidated_chart(from, to, project_ids)
        |> Enum.to_list
        |> Enum.chunk(1)
        |> Enum.into(%{}, fn [consolidated_stats] ->
            {Map.get(consolidated_stats, "date"), consolidated_stats}
        end)
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
    def consolidated_chart(:monthly, project_ids) when is_list(project_ids) do
        [from, to] = get_current_period(:months12)
        ConsolidatedStatsMonthly.consolidated_chart(from, to, project_ids)
        |> Enum.to_list
        |> Enum.chunk(1)
        |> Enum.into(%{}, fn [consolidated_stats] ->
            {Map.get(consolidated_stats, "month"), consolidated_stats}
        end)
    end
    def consolidated_chart(:monthly, project_id) do
        [from, to] = get_current_period(:months12)
        ConsolidatedStatsMonthly
        |> ConsolidatedStatsMonthly.project_id(project_id)
        |> ConsolidatedStatsMonthly.period(from, to)
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
