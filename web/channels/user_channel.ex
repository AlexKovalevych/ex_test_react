defmodule Gt.UserChannel do
    use Gt.Web, :channel
    alias Gt.Model.Project
    alias Gt.Model.User
    alias Gt.Manager.Dashboard
    alias Gt.Manager.Permissions

    def join("users:" <> user_id, _params, socket) do
        current_user = socket.assigns.current_user
        if user_id == current_user.id do
            {:ok, socket}
        else
            {:error, %{reason: "Invalid user"}}
        end
    end

    def handle_in("dashboard_stats", _, socket) do
        current_user = socket.assigns.current_user
        settings = current_user.settings
        project_ids = Permissions.get(current_user.permissions, "dashboard_index")
        projects = Project |> Project.ids(project_ids) |> Repo.all
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        data = Dashboard.get_stats(
            String.to_atom(settings["dashboardPeriod"]),
            settings["dashboardComparePeriod"],
            project_ids
        )
        charts = Dashboard.get_charts(String.to_atom(settings["dashboardPeriod"]), project_ids)
        {:reply, {:ok, %{
            stats: data.stats,
            charts: charts,
            periods: data.periods,
            totals: data.totals,
            projects: projects
        }}, socket}
    end
    def handle_in("locale", locale, socket) do
        user_id = socket.assigns.current_user.id
        user = Repo.get(User, user_id)
        user = Ecto.Changeset.change user, locale: locale
        case Repo.update user do
            {:ok, user} -> {:reply, {:ok, user}, socket}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
    end
    def handle_in("consolidated_chart", params, socket) do
        current_user = socket.assigns.current_user
        [from, to] = Dashboard.get_period(String.to_atom(current_user.settings["dashboardPeriod"]))
        IO.inspect(params)

        case params do
            ["daily"] -> Dashboard.consolidated_chart(:daily, from, to)
            ["monthly"] -> Dashboard.consolidated_chart(:monthly, from, to)
            ["daily", project_id] ->
                if !Permissions.has(current_user.permissions, "dashboard_index", project_id) do
                    {:error, %{reason: "No permission"}}
                else
                    Dashboard.consolidated_chart(:daily, from, to, project_id)
                end
            ["monthly", project_id] ->
                if !Permissions.has(current_user.permissions, "dashboard_index", project_id) do
                    {:error, %{reason: "No permission"}}
                else
                    Dashboard.consolidated_chart(:monthly, from, to, project_id)
                end
        end
    end
end
