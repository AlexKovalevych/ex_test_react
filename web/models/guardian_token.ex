defmodule Gt.GuardianToken do
    use Gt.Web, :model

    alias Gt.Repo
    alias Gt.GuardianSerializer

    @primary_key {:jti, :string, []}
    @derive {Phoenix.Param, key: :jti}

    schema "guardian_tokens" do
        field :aud, :string
        field :iss, :string
        field :sub, :string
        field :exp, :integer
        field :jwt, :string
        field :claims, :map

        timestamps
    end

    def for_user(user) do
        case GuardianSerializer.for_token(user) do
            {:ok, aud} ->
                (from t in Gt.GuardianToken, where: t.sub == ^aud) |> Repo.all
            _ -> []
        end
    end
end
