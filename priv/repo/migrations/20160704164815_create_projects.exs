defmodule Gt.Repo.Migrations.CreateProjects do
    use Ecto.Migration

    def change do
        create unique_index(:project, [:prefix])
        create index(:project, [:enabled])
    end
end
