defmodule Gt.Manager.Users do
    alias Gt.Model.User
    alias Gt.Model.Project
    alias Gt.Manager.Date, as: GtDate
    import Gt.Manager.Permissions, only: [get_all: 1]

    @page_size 10

    def load_users(page, search \\ nil) do
        users = User
        users = case is_nil(search) do
            true -> users
            false -> users |> User.filter_by_email(search)
        end
        %{
            users: users |> User.page(page) |> Gt.Repo.all |> Enum.map(&User.secure_phone(&1, false)),
            currentPage: page,
            totalPages: Float.ceil((User.count(users) |> Gt.Repo.one) / @page_size),
            lastUpdated: GtDate.timestamp(GtDate.now),
            search: search
        }
    end

    def load_user(id \\ nil) do
        user = case is_nil(id) do
            true -> User.changeset(%User{}) |> Ecto.Changeset.apply_changes
            false -> Gt.Repo.get!(User, id) |> User.secure_phone(false)
        end
        projects = Gt.Repo.all(Project)
        [
            %{user: user},
            %{
                users: [user],
                roles: all_roles(),
                projects: projects,
                type: "user",
                value: user.id,
                selectedLeftRows: selected_projects(projects)
            }
        ]
    end

    def update_user(id, data) do
        updated_user = data
        |> Map.delete(:id)
        |> Map.put("phoneNumber", data["securePhoneNumber"])
        [%{user: user}, _] = load_user(id)
        updated_user = if data["authenticationType"] != user.authenticationType do
            updated_user
            |> Map.put("failedLoginCount", 0)
            |> Map.put("showGoogleCode", true)
        else
            updated_user
        end
        result = case is_nil(id) do
            true -> Gt.Repo.insert(User.changeset(user, updated_user))
            false -> Gt.Repo.update(User.changeset(user, updated_user))
        end

        case result do
            {:ok, user} -> {:ok, user}
            {:error, changeset} -> {:error, user, changeset}
        end
    end

    defp selected_projects(projects) do
        projects |> Enum.map(fn project -> project.id end)
    end

    defp all_roles do
        get_all(Application.get_env(:gt, :permissions)) |> Enum.map(fn role ->
            %{id: role, title: role}
        end)
    end
end
