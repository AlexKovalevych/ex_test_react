defmodule Gt.Model.ConsolidatedStats do
    use Gt.Web, :model

    schema "consolidated_stats" do
        field :date, :string
        field :paymentsAmount, :float
        field :paymentsNumber, :integer
        field :depositsAmount, :float
        field :depositsNumber, :integer
        field :cashoutsAmount, :float
        field :cashoutsNumber, :integer
        field :depositorsNumber, :integer
        field :firstDepositorsNumber, :integer
        field :firstDepositsAmount, :float
        field :signupsNumber, :integer
        field :averageDeposit, :float
        field :averageArpu, :float
        field :averageFirstDeposit, :float
        field :betsAmount, :float
        field :winsAmount, :float
        field :betsNumber, :integer
        field :winsNumber, :integer
        field :rakeAmount, :integer
        field :transactorsNumber, :integer
        field :authorizationsNumber, :integer
        field :trafficSources, :map

        field :project, :binary_id
    end

    @required_fields ~w(date project)
    @optional_fields ~w(paymentsAmount
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
end
