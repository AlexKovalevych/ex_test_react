defmodule Gt.Model.PokerGame do
    use Timex
    use Ecto.Model
    alias Gt.Manager.Date, as: GtDate

    @primary_key {:id, :binary_id, autogenerate: false}

    @collection "poker_game"

    def collection, do: @collection

    schema @collection do
        field :buyIn, :float
        field :userBuyIn, :float
        field :currency, :string
        field :cashout, :float
        field :rake, :float
        field :convertedRake, :float
        field :rebuyIn, :float
        field :sessionId, :string
        field :sessionType, :string
        field :startDate, Ecto.DateTime
        field :stopDate, Ecto.DateTime
        field :totalBet, :float
        field :totalPayment, :float
        field :userId, :string

        field :project, :binary_id
        field :user, :binary_id
    end

    @required_fields ~w(
        buyIn
        userBuyIn
        currency
        cashout
        rake
        convertedRake
        rebuyIn
        sessionId
        sessionType
        startDate
        stopDate
        totalBet
        userId
        project
        user
    )
    @optional_fields ~w()

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def id(data) do
        hash = Enum.reduce([
            :buyIn,
            :currency,
            :cashout,
            :rake,
            :rebuyIn,
            :sessionId,
            :sessionType,
            :startDate,
            :stopDate,
            :totalBet,
            :totalPayment,
            :userId
        ], "", fn (field, acc) ->
            value = data[field]
            string_value = cond do
                is_bitstring(value) -> value
                is_integer(value) -> to_string(value)
                field == :startDate || field == :stopDate -> to_string(Timex.format!(value, "{ISO:Basic}"))
                true -> to_string(value)
            end
            acc <> string_value
        end)
        :crypto.hash(:sha, hash) |> Base.encode16(case: :lower)
    end

    def rake(from, to, project_ids) do
        Mongo.aggregate(Gt.Repo.__mongo_pool__, @collection, [
            %{"$match" => %{
                "startDate" => %{
                    "$exists" => true,
                    "$gte" => GtDate.to_bson(from, :date),
                    "$lte" => GtDate.to_bson(to, :date)
                },
                "project" => %{"$in" => project_ids}
            }},
            %{"$project" => %{
                "project" => 1,
                "date" => %{
                    "$dateToString" => %{
                        "format" => "%Y-%m-%d",
                        "date" => "$stopDate"
                    }
                },
                "convertedRake" => 1
            }},
            %{
                "$group" => %{
                    "_id" => %{
                        "project" => "$project",
                        "date" => "$date"
                    },
                    "rakeAmount" => %{"$sum" => "$convertedRake"}
                }
            }
        ])
    end
end
