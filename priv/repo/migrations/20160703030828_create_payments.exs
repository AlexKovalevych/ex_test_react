defmodule Gt.Repo.Migrations.CreatePayments do
    use Ecto.Migration

    def change do
        create index(:payments, [:add_d, :project, :type, :state])
        create index(:payments, [:user])
        create index(:payments, [:user_id, :project])
        create index(:payments, [:project, :promo_ref])
        create index(:payments, [:item_id, :project])
        create index(:payments, [:user, :add_d])
    end
end
