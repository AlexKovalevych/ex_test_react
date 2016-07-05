defmodule Gt.Model.Payment do
    use Gt.Web, :model
    import ExPrintf

    @collection "payments"

    def collection, do: @collection

    @state_new 0
    @state_approved 1
    @state_failure 2
    @state_canceled 3

    @type_deposit 1
    @type_cashout 2
    @type_bonus 3
    @type_refund 4

    def type(:deposit), do: @type_deposit
    def type(:cashout), do: @type_cashout
    def type(:bonus), do: @type_bonus
    def type(:refund), do: @type_refund

    @traffic_sources [:buying, :webmasters, :internal, :noref]

    schema @collection do
        field :item_id, :string
        field :user_id, :string
        field :add_d, :string
        field :add_t, :integer
        field :type, :integer
        field :state, :integer
        field :goods, :map
        field :cost, :map
        field :system, :string
        field :ip, :string
        field :phone, :string
        field :email, :string
        field :info, :map
        field :reason, :string
        field :group_id, :integer
        field :current_balance, :integer
        field :promo_ref, :string
        field :currency, :string
        field :amountUser, :integer
        field :commitDate, Ecto.Date
        field :trafficSource, :string
        field :amount, :float

        field :project, :binary_id
        field :user, :binary_id
    end

    @required_fields ~w(
        item_id
        project
        user
        user_id
        add_d
        add_t
        type
        state
        goods
        trafficSource
    )
    @optional_fields ~w(
        cost
        ip
        phone
        email
        info
        reason
        group_id
        current_balance
        promo_ref
        currency
        system
        amount
        amountUser
        commitDate
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def dashboard_stats(from, to, project_ids) do
        match = %{
            "state" => @state_approved,
            "type" => %{"$in" => [@type_deposit, @type_cashout]},
            "add_d" => %{
                "$gte" => from,
                "$lte" => to
            },
            "project" => %{"$in" => project_ids}
        }

        group = %{
            "_id" => %{
                "project" => "$project",
                "date" => "$add_d"
            },
            "depositsAmount" => %{
                "$sum" => %{
                    "$cond" => [%{"$eq" => ["$type", @type_deposit]}, "$goods.cash_real", 0]
                }
            },
            "depositsNumber" => %{
                "$sum" => %{
                    "$cond" => [%{"$eq" => ["$type", @type_deposit]}, 1, 0]
                }
            },
            "cashoutsAmount" => %{
                "$sum" => %{
                    "$cond" => [%{"$eq" => ["$type", @type_cashout]}, "$goods.cash_real", 0]
                }
            },
            "cashoutsNumber" => %{
                "$sum" => %{
                    "$cond" => [%{"$eq" => ["$type", @type_cashout]}, 1, 0]
                }
            },
            "paymentsAmount" => %{
                "$sum" => "$goods.cash_real"
            },
            "paymentsNumber" => %{
                "$sum" => 1
            },
            "transactors" => %{
                "$addToSet" => "$user"
            },
            "depositorsNumber" => %{
                "$addToSet" => %{
                    "$cond" => [%{"$eq" => ["$type", @type_deposit]}, "$user", nil]
                }
            }
        }

        group = Enum.reduce(@traffic_sources, group, fn (traffic_source, group) ->
            group
            |> Map.put(sprintf("%s_paymentsAmount", [traffic_source]), %{
                "$sum" => %{
                    "$cond" => [%{"$eq" => ["$trafficSource", traffic_source]}, "$goods.cash_real", 0]
                }
            })
            |> Map.put(sprintf("%s_depositsAmount", [traffic_source]), %{
                "$sum" => %{
                    "$cond" => [
                        %{"$and" => [
                            %{"$eq" => ["$trafficSource", traffic_source]},
                            %{"$eq" => ["$type", @type_deposit]}
                        ]},
                        "$goods.cash_real",
                        0
                    ]
                }
            })
            |> Map.put(sprintf("%s_cashoutsAmount", [traffic_source]), %{
                "$sum" => %{
                    "$cond" => [
                        %{"$and" => [
                            %{"$eq" => ["$trafficSource", traffic_source]},
                            %{"$eq" => ["$type", @type_cashout]}
                        ]},
                        "$goods.cash_real",
                        0
                    ]
                }
            })
            |> Map.put(sprintf("%s_depositorsNumber", [traffic_source]), %{
                "$addToSet" => %{
                    "$cond" => [
                        %{"$and" => [
                            %{"$eq" => ["$type", @type_deposit]},
                            %{"$eq" => ["$trafficSource", traffic_source]},
                        ]},
                        "$user",
                        nil
                    ]
                }
            })
            |> Map.put(sprintf("%s_depositsNumber", [traffic_source]), %{
                "$sum" => %{
                    "$cond" => [
                        %{"$and" => [
                            %{"$eq" => ["$trafficSource", traffic_source]},
                            %{"$eq" => ["$type", @type_deposit]}
                        ]},
                        1,
                        0
                    ]
                }
            })
        end)

        project_traffic_sources = Enum.reduce(
            @traffic_sources,
            %{},
            fn (traffic_source, acc) ->
                acc
                |> Map.put(sprintf("%s_depositsNumber", [traffic_source]), 1)
                |> Map.put(sprintf("%s_paymentsAmount", [traffic_source]), 1)
                |> Map.put(sprintf("%s_depositsAmount", [traffic_source]), 1)
                |> Map.put(sprintf("%s_cashoutsAmount", [traffic_source]), 1)
                |> Map.put(sprintf("%s_depositorsNumber", [traffic_source]), %{
                    "$size" => sprintf("$%s_depositorsNumber", [traffic_source])
                })
            end
        )

        grouped_traffic_sources = Enum.reduce(
            @traffic_sources,
            %{},
            fn (traffic_source, acc) ->
                group = %{}
                |> Map.put("paymentsAmount", sprintf("$%s_paymentsAmount", [traffic_source]))
                |> Map.put("depositsAmount", sprintf("$%s_depositsAmount", [traffic_source]))
                |> Map.put("cashoutsAmount", sprintf("$%s_cashoutsAmount", [traffic_source]))
                |> Map.put("depositorsNumber", sprintf("$%s_depositorsNumber", [traffic_source]))
                |> Map.put("depositsNumber", sprintf("$%s_depositsNumber", [traffic_source]))
                Map.put(acc, traffic_source, group)
            end
        )

        project_b = Map.merge(%{
            "_id" => 1,
            "depositsAmount" => 1,
            "depositorsNumber" => 1,
            "cashoutsAmount" => 1,
            "cashoutsNumber" => 1,
            "depositorsNumber" => %{"$setDifference" => ["$depositorsNumber", [nil]]},
            "depositsNumber" => 1,
            "transactors" => %{"$size" => "$transactors"},
            "paymentsAmount" => 1,
            "paymentsNumber" => 1,
        }, project_traffic_sources)

        project_a = project_b |> Map.put("transactors", 1)
        project_a = Enum.reduce(@traffic_sources, project_a, fn (traffic_source, acc) ->
            Map.put(acc, sprintf("%s_depositorsNumber", [traffic_source]), %{
                "$setDifference" => [sprintf("$%s_depositorsNumber", [traffic_source]), [nil]]
            })
        end)

        Mongo.aggregate(Gt.Repo.__mongo_pool__, @collection, [
            %{"$match" => match},
            %{"$group" => group},
            %{"$project" => project_a},
            %{"$project" => project_b},
            %{
                "$project" => %{
                    "_id" => 1,
                    "depositsAmount" => 1,
                    "depositsNumber" => 1,
                    "cashoutsAmount" => 1,
                    "cashoutsNumber" => 1,
                    "depositorsNumber" => %{"$size" => "$depositorsNumber"},
                    "paymentsAmount" => 1,
                    "paymentsNumber" => 1,
                    "transactorsNumber" => "$transactors",
                    "averageDeposit" => %{
                        "$cond" => [
                            %{"$eq" => ["$depositsNumber", 0]},
                            0,
                            %{"$divide" => ["$depositsAmount", "$depositsNumber"]}
                        ]
                    },
                    "averageArpu" => %{
                        "$cond" => [
                            %{"$eq" => ["$transactors", 0]},
                            0,
                            %{"$divide" => ["$paymentsAmount", "$transactors"]}
                        ]
                    },
                    "trafficSources" => grouped_traffic_sources
                }
            }
        ], [{:allow_disk_use, true}])
    end

    def user_id(query, user_id) do
        from p in query,
        where: p.user == ^user_id
    end

    def by_user_id(project_user_id) do
        Mongo.find(Gt.Repo.__mongo_pool__, @collection, %{
            "user" => project_user_id,
            "type" => %{"$in" => [@type_deposit, @type_cashout]},
            "state" => @state_approved,
            "add_t" => %{"$exists" => true},
            "goods.cash_real" => %{"$exists" => true}
        }, sort: %{"add_t": -1})
    end
end
