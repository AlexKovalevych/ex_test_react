defmodule Gt.Repo.Migrations.CreateProjectGames do
    use Ecto.Migration

    def change do
        create index(:project_game, [:project])
    end
end
