# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Gt.Repo.insert!(%Gt.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

defmodule Gt.Fixtures do
    alias Gt.Repo
    alias Gt.User

    @emails [
        "alex@example.com",
        "admin@example.com"
    ]

    def run do
        Enum.map(@emails, &insert_user/1)
    end

    def insert_user(email) do
        [pass, _] = String.split(email, "@")
        Repo.insert(User.changeset(%User{}, %{email: email, password_plain: pass}))
    end
end

Gt.Fixtures.run()
