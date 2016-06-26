defmodule Gt.Fixtures.User do
    # alias Gt.Manager.Permissions
    alias Gt.Repo
    alias Gt.Model.{User, Project}
    import Gt.Manager.Permissions, only: [insert: 3]

    permissions = Application.get_env(:gt, :permissions)

    @users [
        {
            "alex@example.com",
            permissions
        },
        {
            "admin@example.com",
            permissions
        }
    ]

    def run do
        projects = Repo.all(Project)
        project_ids = Enum.map(projects, fn project -> project.id end)

        Enum.map(@users, &insert_user(&1, project_ids))
    end

    def insert_user(user, project_ids) do
        email = elem(user, 0)
        [pass, _] = String.split(email, "@")
        titles = Enum.map(elem(user, 1), fn block -> block.name end)
        user_permissions = insert(titles, project_ids, elem(user, 1))
        Repo.insert!(User.changeset(%User{}, %{
            email: email,
            password_plain: pass,
            permissions: user_permissions
        }))
    end
end
