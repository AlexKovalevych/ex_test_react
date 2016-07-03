defmodule Gt.Repo.Migrations.CreateConsolidatedStats do
    use Ecto.Migration

    def change do
        create unique_index(:consolidated_stats, [:date, :project])
    end
end
