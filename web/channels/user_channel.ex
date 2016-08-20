defmodule Gt.UserChannel do
    use Gt.Web, :channel
    alias Gt.Model.User
    alias Gt.Model.Project
    alias Gt.Manager.Dashboard
    alias Gt.Manager.Permissions
    alias Gt.Manager.Users
    alias Gt.Manager.Projects

    defp admin_required(socket, data) do
        current_user = Repo.get(User, socket.assigns.current_user)
        response = if !current_user.is_admin do
            {:error, %{reason: "Permission denied"}}
        else
            {:ok, data}
        end
        {:reply, response, socket}
    end

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
    def handle_in("locale", locale, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        user = Ecto.Changeset.change user, locale: locale
        response = case Repo.update user do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("dashboard_sort", sortBy, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardSort", sortBy)
        user = Ecto.Changeset.change user, settings: settings
        response = case Repo.update user do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("dashboard_period", period, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardPeriod", period)
        user = Ecto.Changeset.change user, settings: settings
        response = case Repo.update user do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("dashboard_comparison_period", period, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardComparePeriod", period)
        user = Ecto.Changeset.change user, settings: settings
        response = case Repo.update user do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("dashboard_projects_type", type, socket) do
        user = Repo.get(User, socket.assigns.current_user)
        settings = user.settings |> Map.put("dashboardProjectsType", type)
        user = Ecto.Changeset.change user, settings: settings
        response = case Repo.update user do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, %{reason: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("consolidated_chart", params, socket) do
        current_user = Repo.get(User, socket.assigns.current_user)
        [from, to] = String.to_atom(current_user.settings["dashboardPeriod"])
        |> Dashboard.get_current_period
        |> Dashboard.daily
        [_, project_ids] = Dashboard.allowed_projects(current_user)
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
        response = case result do
            {:error, reason} -> {:error, %{reason: reason}}
            _ -> {:ok, result}
        end
        {:reply, response, socket}
    end
    def handle_in("users", params, socket) do
        admin_required(socket, Users.load_users(params["page"], params["search"]))
    end
    def handle_in("user", %{}, socket) do
        [users_state, permissions_state] = Users.load_user
        admin_required(socket, Map.merge(users_state, permissions_state))
    end
    def handle_in("user", id, socket) do
        [users_state, permissions_state] = Users.load_user(id)
        admin_required(socket, Map.merge(users_state, permissions_state))
    end
    def handle_in("projects", params, socket) do
        admin_required(socket, Projects.load_projects(params["page"], params["search"]))
    end
    def handle_in("project", %{"id" => id, "project" => data}, socket) do
        current_user = Repo.get(User, socket.assigns.current_user)
        response = if !current_user.is_admin do
            {:error, %{reason: "Permission denied"}}
        else
            updated_project = Map.delete(data, :id)
            %{project: project} = Projects.load_project(id)
            case Repo.update(Project.changeset(project, updated_project)) do
                {:ok, project} -> {:ok, %{project: project}}
                {:error, changeset} -> {:ok, %{project: project, errors: changeset}}
            end
        end
        {:reply, response, socket}
    end
    def handle_in("project", id, socket) do
        admin_required(socket, Projects.load_project(id))
    end
end
