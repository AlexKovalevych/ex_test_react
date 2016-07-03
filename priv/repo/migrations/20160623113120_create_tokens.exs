defmodule Gt.Repo.Migrations.CreateTokens do
    use Ecto.Migration

    def change do
        create unique_index(:tokens, [:jti, :aud])
    end
end
