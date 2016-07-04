defmodule Gt.Repo.Migrations.CreateProcessedEvents do
    use Ecto.Migration

    def change do
        create unique_index(:processed_events, [:item_id, :source])
        create index(:processed_events, [:name, :date])
        create index(:processed_events, [:date, :state_id])
        create index(:processed_events, [:project])
    end
end
