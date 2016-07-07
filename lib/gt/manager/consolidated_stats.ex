defmodule Gt.Manager.ConsolidatedStats do
    require Logger
    alias Gt.Model.{
        Payment,
        ProjectUser,
        ProjectUserGame,
        PokerGame,
        ProcessedEvent,
        ConsolidatedStats,
        ConsolidatedStatsMonthly
    }
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Repo
    use Timex

    defmacrop process_data(name, term) do
        quote do
            message = unquote name
            Logger.info "Aggregating #{message}"
            data = unquote(term) |> Enum.to_list
            Logger.info "Updating dashboard #{message}"
            total = length(data)
            Enum.each 1..total, fn i ->
                project_day = Enum.at(data, i - 1)
                ConsolidatedStats.upsert_project_date(project_day["_id"], Map.drop(project_day, ["_id"]))
                ProgressBar.render(i, total)
            end
        end
    end

    def update_daily_stats(from, to, project_ids) do
        Logger.configure([level: :info])
        process_data("payments", Payment.dashboard_stats(from, to, project_ids))
        process_data("first deposits", ProjectUser.first_deposit_stats(from, to, project_ids))
        process_data("signups", ProjectUser.signup_stats(from, to, project_ids))
        process_data("netgaming", ProjectUserGame.netgaming(from, to, project_ids))
        process_data("rake", PokerGame.rake(from, to, project_ids))
        process_data("authorizations", ProcessedEvent.authorizations_by_period(from, to, project_ids))
    end

    def update_monthly_stats(from, to, project_ids) do
        diff = GtDate.diff(from, to, :months)
        interval = Interval.new(from: from, until: [months: diff], step: [months: 1], right_open: false)
        periods = Enum.map(interval, fn month ->
            from = month
            last_date = Timex.Calendar.Gregorian.days_in_month(from.year, from.month)
            to = from |> DateTime.set([{:date, {from.year, from.month, last_date}}])
            {from, to}
        end)
        stats = Enum.map(periods, fn {from, to} ->
            ConsolidatedStats.monthly_by_interval(from, to)
        end)
        months = Enum.map(interval, fn datetime ->
            GtDate.format(datetime, :month)
        end)
        ConsolidatedStatsMonthly
        |> ConsolidatedStatsMonthly.months(months)
        |> ConsolidatedStatsMonthly.project_ids
        |> Repo.delete
        Enum.map(periods, fn {from, to} ->
            Enum.map(project_ids, fn project_id ->
                vip_levels = ProjectUser.vip_levels_by_month(from, to, project_id)
                Repo.insert!(ConsolidatedStatsMonthly.changeset(%ConsolidatedStatsMonthly{}, %{
                    project: project_id,
                    month: GtDate.format(from, :month),
                    vipLevels: vip_levels
                    # depositorsNumber:
                    # transactorsNumber:
                }))
            end)
        end)
    end
end
