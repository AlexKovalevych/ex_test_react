defmodule Gt.UserChannel do
    use Gt.Web, :channel
    alias Gt.Model.Project

    def join("users:" <> user_id, _params, socket) do
        current_user = socket.assigns.current_user
        if user_id == current_user.id do
            {:ok, socket}
        else
            {:error, %{reason: "Invalid user"}}
        end
    end

    def handle_in("dashboard_stats", params, socket) do
        current_user = socket.assigns.current_user
        settings = current_user.settings
        project_ids = Gt.Manager.Permissions.get(current_user.permissions, "dashboard_index")
        projects = Project |> Project.ids(project_ids) |> Repo.all
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        stats = Gt.Manager.Dashboard.get_stats(
            String.to_atom(settings["dashboardPeriod"]),
            settings["dashboardComparePeriod"],
            project_ids
        )
        {:reply, {:ok, %{stats: stats, projects: projects}}, socket}
    end
    def handle_in("dashboard_charts", params, socket) do
        current_user = socket.assigns.current_user
        settings = current_user.settings
        project_ids = Gt.Manager.Permissions.get(current_user.permissions, "dashboard_index")
        projects = Project |> Project.ids(project_ids) |> Repo.all
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)
        :timer.sleep(5000)
        # charts = Gt.Manager.Dashboard.get_stats(
        #     String.to_atom(settings["dashboardPeriod"]),
        #     settings["dashboardComparePeriod"],
        #     project_ids
        # )
        {:reply, {:ok, %{}}, socket}
        # {:reply, {:ok, %{stats: stats, projects: projects}}, socket}
    end
end
