defmodule Gt.Model.Payment do
    use Gt.Web, :model
    import ExPrintf

    @state_new 0
    @state_approved 1
    @state_failure 2
    @state_canceled 3

    @type_deposit 1
    @type_cashout 2
    @type_bonus 3
    @type_refund 4

    @traffic_sources [:buying, :webmasters, :internal, :noref]

    schema "payments" do
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
            "$match" => %{
                "state" => @state_approved,
                "type" => %{"$in" => [@type_deposit, @type_cashout]},
                "add_d" => %{
                    "$gte" => from,
                    "$lte" => to
                },
                "project" => %{"$in" => project_ids}
            },
        }

        group = %{
            "$group" => %{
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
        }

        for traffic_source <- @traffic_sources do
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
        #     $group[sprintf('%s_cashoutsAmount', $trafficSource)] = [
        #         '$sum' => [
        #             '$cond' => [
        #                 ['$and' => [
        #                     ['$eq' => ['$trafficSource', $trafficSource]],
        #                     ['$eq' => ['$type', Payment::TYPE_CASHOUT]]
        #                 ]],
        #                 '$goods.cash_real',
        #                 0
        #             ]
        #         ]
        #     ];
        #     $group[sprintf('%s_depositorsNumber', $trafficSource)] = [
        #         '$addToSet' => [
        #             '$cond' => [
        #                 [
        #                     '$and' => [
        #                         ['$eq' => ['$type', Payment::TYPE_DEPOSIT]],
        #                         ['$eq' => ['$trafficSource', $trafficSource]],
        #                     ]
        #                 ],
        #                 '$user',
        #                 null
        #             ]
        #         ]
        #     ];
        #     $group[sprintf('%s_depositsNumber', $trafficSource)] = [
        #         '$sum' => [
        #             '$cond' => [
        #                 ['$and' => [
        #                     ['$eq' => ['$trafficSource', $trafficSource]],
        #                     ['$eq' => ['$type', Payment::TYPE_DEPOSIT]]
        #                 ]],
        #                 1,
        #                 0
        #             ]
        #         ]
        #     ];

        end

        IO.inspect(group)



        # cursor = Mongo.aggregate(Gt.Repo.__mongo_pool__, "payments", [
        # ])
        # IO.inspect(cursor)
    end
end
