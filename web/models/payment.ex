defmodule Gt.Model.Payment do
    use Gt.Web, :model

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
        amount
        add_d
        add_t
        type
        state
        goods
        system
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
        amountUser
        commitDate
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end
end
