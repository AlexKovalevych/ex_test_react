defmodule Gt.Manager.Users do
    alias Gt.Model.User
    alias Gt.Manager.Date, as: GtDate

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
        Gt.Repo.get!(User, id) |> User.secure_phone(false)
    end

    def create_user do
        %User{} |> User.changeset |> Ecto.Changeset.apply_changes
    end
end
