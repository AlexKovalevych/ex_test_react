defmodule Gt.Model.ProjectUserGame do
    use Ecto.Model

    @collection "project_user_game"

    @primary_key {:id, :binary_id, autogenerate: false}

    schema @collection do
        field :balanceAfter, :float
        field :balanceBefore, :float
        field :bets, :integer
        field :convertedBets, :float
        field :betsCount, :integer
        field :currency, :string
        field :date, Ecto.DateTime
        field :gameRef, :string
        field :userId, :string
        field :wins, :integer
        field :convertedWins, :float
        field :winsCount, :integer
        field :itemId, :string
        field :isRisk, :boolean, default: false

        field :project, :binary_id
        field :game, :binary_id
        field :user, :binary_id
    end

    @required_fields ~w(
        bets
        convertedBets
        betsCount
        currency
        date
        gameRef
        game
        userId
        user
        wins
        convertedWins
        winsCount
        project
    )
    @optional_fields ~w(
        balanceAfter
        balanceBefore
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end
end
