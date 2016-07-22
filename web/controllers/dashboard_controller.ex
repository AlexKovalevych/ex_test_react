defmodule Gt.DashboardController do
    use Gt.Web, :controller
    require Gt.AuthController
    alias Gt.Model.Project
    alias Gt.Manager.Date, as: GtDate

    plug Gt.Guardian.EnsureAuthenticated, handler: Gt.AuthController

    def index(conn, _) do
        user = current_user(conn)
        settings = user.settings
        project_ids = Gt.Manager.Permissions.get(user.permissions, "dashboard_index")
        projects = Project |> Project.ids(project_ids) |> Repo.all
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        data = Gt.Manager.Dashboard.get_stats(
            String.to_atom(settings["dashboardPeriod"]),
            settings["dashboardComparePeriod"],
            project_ids
        )
        charts = Gt.Manager.Dashboard.get_charts(String.to_atom(settings["dashboardPeriod"]), project_ids)
        initial_state = %{
            "pendingTasks" => 1,
            "auth" => %{"user" => user},
            "dashboard" => %{
                "stats" => data.stats,
                "periods" => data.periods,
                "totals" => data.totals,
                "projects" => projects,
                "charts" => charts,
                "lastUpdated" => GtDate.timestamp(GtDate.now)
            }
        }

        Gt.AuthController.render_react(conn, initial_state)
    end
end
