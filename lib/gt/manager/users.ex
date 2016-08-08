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

    def load_user(id) do
        %{
            user: Gt.Repo.get!(User, id) |> User.secure_phone(false),
            permissions: get_all(Application.get_env(:gt, :permissions)) |> Enum.map(&convert_role/1),
            projects: Gt.Repo.all(Project)
        }
    end

    def create_user do
        %{
            user: User.changeset(%User{}) |> Ecto.Changeset.apply_changes,
            permissions: get_all(Application.get_env(:gt, :permissions)) |> Enum.map(&convert_role/1),
            projects: Gt.Repo.all(Project)
        }
    end

    defp convert_role(role) do
        %{id: role, title: role}
    end
end
