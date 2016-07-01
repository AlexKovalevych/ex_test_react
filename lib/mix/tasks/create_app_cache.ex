defmodule Mix.Tasks.Gt.AppCache do
    use Mix.Task
    use Timex
    alias Gt.Manager.Date, as: GtDate
    alias Gt.Model.Project
    import Mongo.Ecto.ObjectID

    @shortdoc "Sends a greeting to us from Hello Phoenix"

    @moduledoc """
        This is where we would put any long form documentation or doctests.
    """

    def run(args) do
        OptionParser.parse(args)
        |> parse_args
        |> do_process
    end

    def parse_args(args) do
        yesterday = GtDate.yesterday |> GtDate.format(:date)
        now = GtDate.today |> GtDate.format(:date)
        Map.merge(%{:from => yesterday, :to => now, :projects => []}, Map.new(elem(args, 0)))
    end

    def do_process(%{:from => from, :to => to, :projects => projects}) do
        Gt.start_repo_supervisor
        project_ids = case length(projects) do
            0 -> Project
                |> Project.get_ids
                |> Gt.Repo.all
            _ -> projects
        end
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = dump(id)
            object_id
        end)
        Gt.Manager.ConsolidatedStats.update_stats(from, to, project_ids)
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
