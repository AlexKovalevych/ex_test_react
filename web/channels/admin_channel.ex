defmodule Gt.AdminChannel do
    use Gt.Web, :channel
    alias Gt.Model.User
    alias Gt.Model.Project
    alias Gt.Manager.Permissions
    alias Gt.Manager.Users
    alias Gt.Manager.Projects

    defp admin_required(socket) do
        current_user = Repo.get(User, socket.assigns.current_user)
        if !current_user.is_admin do
            {:error, %{reason: "Permission denied"}}
        else
            {:ok, socket}
        end
    end

    def join("admins:" <> user_id, _params, socket) do
        if user_id == socket.assigns.current_user do
            admin_required(socket)
        else
            {:error, %{reason: "Invalid user"}}
        end
    end

    def handle_in("users", params, socket) do
        {:reply, {:ok, Users.load_users(params["page"], params["search"])}, socket}
    end
    def handle_in("user", %{"id" => id, "user" => data}, socket) do
        response = case Users.update_user(id, data) do
            {:ok, user} -> {:ok, %{user: user}}
            {:error, user, changeset} -> {:ok, %{user: user, errors: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("user", %{}, socket) do
        [users_state, permissions_state] = Users.load_user
        {:reply, {:ok, Map.merge(users_state, permissions_state)}, socket}
    end
    def handle_in("user", id, socket) do
        [users_state, permissions_state] = Users.load_user(id)
        {:reply, {:ok, Map.merge(users_state, permissions_state)}, socket}
    end
    def handle_in("projects", params, socket) do
        {:reply, {:ok, Projects.load_projects(params["page"], params["search"])}, socket}
    end
    def handle_in("project", %{"id" => id, "project" => data}, socket) do
        updated_project = Map.delete(data, :id)
        %{project: project} = Projects.load_project(id)
        response = case Repo.update(Project.changeset(project, updated_project)) do
            {:ok, project} -> {:ok, %{project: project}}
            {:error, changeset} -> {:ok, %{project: project, errors: changeset}}
        end
        {:reply, response, socket}
    end
    def handle_in("project", id, socket) do
        {:reply, {:ok, Projects.load_project(id)}, socket}
    end
    def handle_in("permissions", _, socket) do
        {:reply, {:ok, Permissions.load()}, socket}
    end
end
