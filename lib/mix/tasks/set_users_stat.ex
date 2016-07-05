defmodule Mix.Tasks.Gt.SetUsersStat do
    use Mix.Task
    use Timex
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.{Project, ProjectUser}
    alias Gt.Repo
    import Ecto.Query, only: [offset: 3, order_by: 3]
    require Logger

    @shortdoc "Sends a greeting to us from Hello Phoenix"

    @moduledoc """
        This is where we would put any long form documentation or doctests.
    """

    def run(args) do
        start_time = Time.now
        OptionParser.parse(args)
        |> parse_args
        |> do_process
        GtDate.log_time_diff(start_time, Time.now)
    end

    def parse_args(args) do
        Map.merge(%{:skip => 0, :onlyWithStats => false, :projectIds => []}, Map.new(elem(args, 0)))
    end

    def do_process(%{:skip => skip, :onlyWithStats => onlyWithStats, :projectIds => projectIds}) do
        Gt.start_repo_supervisor
        project_ids = case length(projectIds) do
            0 -> Project
                |> Project.get_ids
                |> Gt.Repo.all
            _ -> projectIds
        end

        project_users = ProjectUser |> ProjectUser.projects(project_ids)
        project_users = case onlyWithStats do
            "true" -> project_users |> ProjectUser.stat_exists
            _ -> project_users
        end

        project_users = project_users
        |> order_by([pu], asc: pu.id)
        |> offset([pu], ^skip)
        |> Repo.all

        # Gt.Manager.ConsolidatedStats.update_daily_stats(from, to, project_ids)
        # start_date = GtDate.parse(from, :date)
        # end_date = GtDate.parse(to, :date)
        # start_date = case (start_date.year == end_date.year && start_date.month == end_date.month) do
        #     true -> start_date |> Timex.shift(months: -1)
        #     false -> start_date
        # end
        # last_date = Timex.Calendar.Gregorian.days_in_month(end_date.year, end_date.month)
        # end_date = end_date |> DateTime.set([{:date, {end_date.year, end_date.month, last_date}}])
        # Gt.Manager.ConsolidatedStats.update_monthly_stats(start_date, end_date, project_ids)
    end

    def do_process(_) do
        IO.puts """
            Usage:
            mix gt.set_users_stat --skip=.. --onlyWithStats=.. --projectIds=[..]

            Options:
            --help  Show this help message.

            Description:
            Generates app cache
        """

        System.halt(0)
    end
end
