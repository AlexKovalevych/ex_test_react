defmodule Gt.Repo.Migrations.CreateProjectUserGames do
    use Ecto.Migration

    def change do
        create index(:project_user_game, [:itemId])
    end
end
