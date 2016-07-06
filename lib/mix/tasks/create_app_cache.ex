defmodule Mix.Tasks.Gt.AppCache do
    use Timex
    use Gt.Task
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.Project
    import Gt.Model, only: [object_id: 1]

    @shortdoc "Sends a greeting to us from Hello Phoenix"

    @moduledoc """
        This is where we would put any long form documentation or doctests.
    """

    def parse_args(args) do
        yesterday = GtDate.yesterday |> GtDate.format(:date)
        now = GtDate.today |> GtDate.format(:date)
        Map.merge(%{:from => yesterday, :to => now, :projects => []}, Map.new(elem(args, 0)))
    end

    def do_process(%{:from => from, :to => to, :projects => projects}) do
        project_ids = case length(projects) do
            0 -> Project
                |> Project.get_ids
                |> Gt.Repo.all
            _ -> projects
        end
        project_ids = Enum.map(project_ids, &object_id/1)
        Gt.Manager.ConsolidatedStats.update_daily_stats(from, to, project_ids)
        start_date = GtDate.parse(from, :date)
        end_date = GtDate.parse(to, :date)
        start_date = case (start_date.year == end_date.year && start_date.month == end_date.month) do
            true -> start_date |> Timex.shift(months: -1)
            false -> start_date
        end
        last_date = Timex.Calendar.Gregorian.days_in_month(end_date.year, end_date.month)
        end_date = end_date |> DateTime.set([{:date, {end_date.year, end_date.month, last_date}}])
        Gt.Manager.ConsolidatedStats.update_monthly_stats(start_date, end_date, project_ids)
    end

    def do_process(_) do
        IO.puts """
            Usage:
            mix gt.app_cache --from=.. --to=.. --projects=[..]

            Options:
            --help  Show this help message.

            Description:
            Generates app cache
        """

        System.halt(0)
    end
end
