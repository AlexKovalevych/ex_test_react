defmodule Gt.Fixtures.User do
    alias Gt.Repo
    alias Gt.Model.{User, Project}
    import Gt.Manager.Permissions, only: [add: 3]
    require Logger

    permissions = Application.get_env(:gt, :permissions)

    @users [
        {
            "alex@example.com",
            permissions,
            "none",
            "06312345678",
            true
        },
        {
            "admin@example.com",
            permissions,
            "sms",
            "06312345678",
            true
        },
        {
            "test@example.com",
            permissions,
            "google",
            "06312345678",
            false
        }
    ]

    def run do
        Logger.info("Loading #{__MODULE__} fixtures")
        projects = Repo.all(Project)
        project_ids = Enum.map(projects, fn project -> project.id end)
        Enum.map(@users, &insert_user(&1, project_ids))
        Logger.info("Loaded #{__MODULE__} fixtures")
    end

    def insert_user(user, project_ids) do
        {email, permissions, authenticated_type, phone, is_admin} = user;
        [pass, _] = String.split(email, "@")
        Repo.insert!(User.changeset(%User{}, %{
            email: email,
            password_plain: pass,
            permissions: add(permissions, Map.keys(permissions), project_ids),
            is_admin: is_admin,
            phoneNumber: phone,
            authenticationType: authenticated_type
        }))
    end
end
