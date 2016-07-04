defmodule Gt.Model.ProjectUserGame do
    use Ecto.Model
    alias Gt.Manager.Date, as: GtDate

    @collection "project_user_game"

    def collection, do: @collection

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
        itemId
    )
    @optional_fields ~w(
        balanceAfter
        balanceBefore
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def item_id(data) do
        Enum.reduce([
            :balanceAfter,
            :balanceBefore,
            :bets,
            :betsCount,
            :currency,
            :date,
            :gameRef,
            :userId,
            :wins,
            :winsCount
        ], "", fn (field, acc) ->
            value = data[field]
            string_value = cond do
                is_bitstring(value) -> value
                is_integer(value) -> to_string(value)
                field == :date -> to_string(GtDate.timestamp(value))
                true -> to_string(value)
            end
            acc <> string_value
        end)
        |> :erlang.md5
        |> Base.encode16(case: :lower)
    end

    def netgaming(from, to, project_ids) do
        Mongo.aggregate(Gt.Repo.__mongo_pool__, @collection, [
            %{
                "$match" => %{
                    "date" => %{
                        "$exists" => true,
                        "$gte" => GtDate.to_bson(from, :date),
                        "$lte" => GtDate.to_bson(to, :date)
                    },
                    "project" => %{"$in" => project_ids}
                }
            },
            %{
                "$project" => %{
                    "project" => 1,
                    "date" => %{
                        "$dateToString" => %{
                            "format" => "%Y-%m-%d",
                            "date" => "$date"
                        }
                    },
                    "convertedBets" => 1,
                    "betsCount" => 1,
                    "convertedWins" => 1,
                    "winsCount" => 1,
                }
            },
            %{
                "$group" => %{
                    "_id" => %{
                        "project" => "$project",
                        "date" => "$date"
                    },
                    "betsNumber" => %{"$sum" => "$betsCount"},
                    "betsAmount" => %{"$sum" => "$convertedBets"},
                    "winsNumber" => %{"$sum" => "$winsCount"},
                    "winsAmount" => %{"$sum" => "$convertedWins"},
                }
            },
            %{
                "$project" => %{
                    "_id" => 1,
                    "betsNumber" => 1,
                    "betsAmount" => 1,
                    "winsNumber" => 1,
                    "winsAmount" => 1,
                    "netgamingAmount" => %{"$subtract" => ["$betsAmount", "$winsAmount"]}
                }
            }
        ])
    end
end
