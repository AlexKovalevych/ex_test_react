defmodule Gt.Repo.Migrations.CreateProjectUsers do
    use Ecto.Migration

    def change do
        create unique_index(:project_users, [:item_id, :project])
        create index(:project_users, [:project, :email])
        create index(:project_users, [:email])
        create index(:project_users, [:project, :segment])
        create index(:project_users, [:project, :reg_d, :last_d])
        create index(:project_users, [:project, :last_d])
        create index(:project_users, [:project, :first_dep_d])
        create index(:project_users, [:project, :last_dep_d])
        create index(:project_users, [:project, :reg_d, :first_dep_d])
        create index(:project_users, [:reg_d])
        create index(:project_users, [:project, :first_dep_amount])
        create index(:project_users, ["stat.total.dep.cash_real"])
        create index(:project_users, ["ref_codes_history.*.code", "ref_codes_history.*.date"])
        create index(:project_users, [:is_test])
        create index(:project_users, [:is_active])
        create index(:project_users, [:project, :glow_id])
        create index(:project_users, ["project", "phones.number"])
        create index(:project_users, [:project, :birthday])
        create index(:project_users, [
            "projectUserAction.gameAfterFirstDeposit.date",
            "projectUserAction.gameAfterSecondDeposit.date",
            "projectUserAction.gameAfterThirdDeposit.date"
        ], name: "projectUserActionGameAfterDeposit")
    end
end
