defmodule Gt.Model.PomadoroDataSource do
    use Gt.Model
    alias Gt.Model.DataSource.AbstractDataSource

    @type_casino_bonuses "casino_bonuses"
    @type_casino_games "casino_games"
    @type_casino_invoices "casino_invoices"
    @type_casino_users "casino_users"
    @type_poker_bonuses "poker_bonuses"
    @type_poker_games "poker_games_raw"

    schema AbstractDataSource.collection do
        Enum.map(AbstractDataSource.schema, fn [name, type] ->
            field(name, type)
        end) ++ [
            field(:type, :string, default: "pomadoro_poker"),
            field(:project, :binary_id),
            field(:host, :string),
            field(:types, {:array, :string}),
            field(:startDate, Ecto.DateTime)
        ]
    end

    @required_fields ~w(
        createdAt
        type
        project
        host
        types
        startDate
    )

    @optional_fields ~w(name)

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def type(:casino_bonuses), do: @type_casino_bonuses
    def type(:casino_games), do: @type_casino_games
    def type(:casino_invoices), do: @type_casino_invoices
    def type(:casino_users), do: @type_casino_users
    def type(:poker_bonuses), do: @type_poker_bonuses
    def type(:poker_games), do: @type_poker_games
end
