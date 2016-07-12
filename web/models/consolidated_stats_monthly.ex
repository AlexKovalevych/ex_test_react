defmodule Gt.Model.ConsolidatedStatsMonthly do
    use Gt.Web, :model
    alias Gt.Manager.Date, as: GtDate

    @collection "consolidated_stats_monthly"

    schema @collection do
        field :month, :string
        field :paymentsAmount, :integer
        field :paymentsNumber, :integer
        field :depositsAmount, :integer
        field :depositsNumber, :integer
        field :cashoutsAmount, :integer
        field :cashoutsNumber, :integer
        field :depositorsNumber, :integer
        field :firstDepositorsNumber, :integer
        field :firstDepositsAmount, :integer
        field :signupsNumber, :integer
        field :averageDeposit, :float
        field :averageArpu, :float
        field :averageFirstDeposit, :float
        field :netgamingAmount, :integer
        field :betsAmount, :float
        field :winsAmount, :float
        field :betsNumber, :integer
        field :winsNumber, :integer
        field :rakeAmount, :integer
        field :transactorsNumber, :integer
        field :authorizationsNumber, :integer
        field :trafficSources, :map
        field :vipLevels, :map
        field :firstDepositorsNumberToSignupsNumber, :float

        field :project, :binary_id
    end

    @required_fields ~w(month project)
    @optional_fields ~w(
        paymentsAmount
        paymentsNumber
        depositsAmount
        depositsNumber
        cashoutsAmount
        cashoutsNumber
        depositorsNumber
        firstDepositorsNumber
        firstDepositsAmount
        signupsNumber
        averageDeposit
        averageArpu
        averageFirstDeposit
        netgamingAmount
        betsAmount
        winsAmount
        betsNumber
        winsNumber
        rakeAmount
        transactorsNumber
        authorizationsNumber
        trafficSources
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def months(query, months) do
        from csm in query,
        where: csm.month in ^months
    end

    def project_ids(query, project_ids) do
        from csm in query,
        where: csm.project in ^project_ids
    end

    def delete_months_project_ids(months, project_ids) do
        Mongo.delete_many(Gt.Repo.__mongo_pool__, @collection, %{
            "month" => %{"$in" => months},
            "project" => %{"$in" => project_ids}
        })
    end
end
