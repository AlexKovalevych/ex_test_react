defmodule Gt.UserChannel do
    use Gt.Web, :channel
    alias Gt.Model.User
    alias Gt.Manager.Dashboard
    alias Gt.Manager.Permissions

    def join("users:" <> user_id, _params, socket) do
        if user_id == socket.assigns.current_user do
            {:ok, socket}
        else
            {:error, %{reason: "Invalid user"}}
        end
    end

    def handle_in("dashboard_stats", params, socket) do
        current_user = Repo.get(User, socket.assigns.current_user)
        data = Dashboard.load_data(current_user, Map.get(params, "period"))
        {:reply, {:ok, data}, socket}
    end
    # def handle_in("dashboard_charts", _, socket) do
    #     current_user = socket.assigns.current_user
    #     settings = current_user.settings
    #     project_ids = Permissions.get(current_user.permissions, "dashboard_index")
    #     projects = Project |> Project.ids(project_ids) |> Repo.all
    #     project_ids = Enum.map(project_ids, fn id ->
    #         {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
    #         object_id
    #     end)
    #     charts = Dashboard.get_charts(String.to_atom(settings["dashboardPeriod"]), project_ids)
    #     {:reply, {:ok, charts}, socket}
    # end
    def handle_in("locale", locale, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        user = Ecto.Changeset.change user, locale: locale
        case Repo.update user do
            {:ok, user} -> {:reply, {:ok, user}, socket}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
    end
    def handle_in("dashboard_sort", sortBy, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardSort", sortBy)
        user = Ecto.Changeset.change user, settings: settings
        case Repo.update user do
            {:ok, user} -> {:reply, {:ok, user}, socket}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
    end
    def handle_in("dashboard_period", period, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardPeriod", period)
        user = Ecto.Changeset.change user, settings: settings
        case Repo.update user do
            {:ok, user} -> {:reply, {:ok, user}, socket}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
    end
    def handle_in("dashboard_comparison_period", period, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardComparePeriod", period)
        user = Ecto.Changeset.change user, settings: settings
        case Repo.update user do
            {:ok, user} -> {:reply, {:ok, user}, socket}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
    end
    def handle_in("consolidated_chart", params, socket) do
        current_user = Repo.get(User, socket.assigns.current_user)
        [from, to] = Dashboard.get_current_period(String.to_atom(current_user.settings["dashboardPeriod"]))
        |> Dashboard.daily
        project_ids = Permissions.get(current_user.permissions, "dashboard_index")
        project_ids = Enum.map(project_ids, fn id ->
            {:ok, object_id} = Mongo.Ecto.ObjectID.dump(id)
            object_id
        end)

        result = case params do
            ["daily"] -> Dashboard.consolidated_chart(:daily, from, to, project_ids)
            ["monthly"] -> Dashboard.consolidated_chart(:monthly, project_ids)
            ["daily", project_id] ->
                if !Permissions.has(current_user.permissions, "dashboard_index", project_id) do
                    {:error, "No permission"}
                else
                    Dashboard.consolidated_chart(:daily, from, to, project_id)
                end
            ["monthly", project_id] ->
                if !Permissions.has(current_user.permissions, "dashboard_index", project_id) do
                    {:error, "No permission"}
                else
                    Dashboard.consolidated_chart(:monthly, project_id)
                end
        end
        case result do
            {:error, reason} -> {:error, %{reason: reason}}
            _ -> {:reply, {:ok, result}, socket}
        end
    end
end
