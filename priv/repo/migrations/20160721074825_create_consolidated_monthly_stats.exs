defmodule Gt.Repo.Migrations.CreateConsolidatedMonthlyStats do
    use Ecto.Migration

    def change do
        create unique_index(:consolidated_monthly_stats, [:month, :project])
    end
end
