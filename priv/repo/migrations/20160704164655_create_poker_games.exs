defmodule Gt.Repo.Migrations.CreatePokerGames do
    use Ecto.Migration

    def change do
        create index(:poker_game, [:startDate])
    end
end
