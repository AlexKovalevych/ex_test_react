defmodule Gt.Model.ProjectUser do
    use Gt.Web, :model

    @collection "project_users"

    def collection, do: @collection

    schema @collection do
        field :item_id, :string
        field :email, :string
        field :email_hash, :string
        field :email_encrypted, :string
        field :email_valid, :integer
        field :email_not_found, :boolean
        field :login, :string
        field :nick, :string
        field :phone, :string
        field :phone_valid, :integer
        field :first_name, :string
        field :last_name, :string
        field :lang, :string
        field :sex, :integer
        field :cash_real, :integer
        field :cash_user_real, :integer
        field :cash_fun, :integer
        field :cash_bonus, :integer
        field :currency, :string
        field :birthday, :string
        field :is_active, :boolean
        field :is_test, :boolean
        field :has_bonus, :boolean
        field :query1, :string
        field :reg_ip, :string
        field :reg_d, :string
        field :reg_ref1, :string
        field :reg_t, :integer
        field :last_d, :string
        field :last_t, :integer
        field :stat, :map
        field :status, :string
        field :segment, :integer
        field :segment_upd_t, :integer
        field :first_dep_d, :string
        field :first_dep_amount, :integer
        field :first_wdr_d, :string
        field :first_wdr_amount, :integer
        field :ref_codes_history, :map
        field :email_unsub_types, :map
        field :sms_unsub_types, :map
        field :last_dep_d, :string
        field :remind_code, :string
        field :glow_id, :string
        field :phones, Ecto.Type.Raw
        field :donor, :string
        field :vipLevel, :map
        field :socialNetwork, :string
        field :socialNetworkUrl, :string

        field :project, :binary_id

        # embeds_one :projectUserAction, Gt.Model.ProjectUserAction
    end

    @required_fields ~w(
        item_id
        project
        email_valid
        is_active
        is_test
        has_bonus
        query1
        reg_d
        reg_t
        last_d
        last_t
        status
        segment
        first_dep_d
        first_dep_amount
        email_unsub_types
        sms_unsub_types
        cash_real
        cash_user_real
        phones
    )
    @optional_fields ~w(
        currency
        segment_upd_t
        reg_ref1
        lang
        email
        email_hash
        email_encrypted
        email_not_found
        login
        nick
        phone
        phone_valid
        first_name
        last_name
        sex
        cash_fun
        cash_bonus
        birthday
        reg_ip
        stat
        first_wdr_d
        first_wdr_amount
        ref_codes_history
        last_dep_d
        remind_code
        glow_id
        donor
        vipLevel
        socialNetwork
        socialNetworkUrl
    )

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def projects(query, project_ids) when is_list(project_ids) do
        from pu in query,
        where: pu.project in ^project_ids
    end
    def projects(query, project_id) do
        from pu in query,
        where: pu.project == ^project_id
    end

    def by_item_id(query, item_id) do
        from pu in query,
        where: pu.item_id == ^item_id
    end

    def stat_exists(query, value \\ true) do
        from pu in query,
        where: fragment("$exists": "stat")
    end

    def first_deposit_stats(from, to, project_ids) do
        Mongo.aggregate(Gt.Repo.__mongo_pool__, @collection, [
            %{"$match" => dashboard_match(from, to, project_ids)},
            %{"$group" => %{
                "_id" => dashboard_group_id,
                "averageFirstDeposit" => %{"$avg" => "$first_dep_amount"},
                "firstDepositsAmount" => %{"$sum" => "$first_dep_amount"},
                "firstDepositorsNumber" => %{"$sum" => 1}
            }}
        ])
    end

    def signup_stats(from, to, project_ids) do
        Mongo.aggregate(Gt.Repo.__mongo_pool__, @collection, [
            %{"$match" => dashboard_match(from, to, project_ids)},
            %{"$group" => %{
                "_id" => dashboard_group_id,
                "signupsNumber" => %{"$sum" => 1}
            }}
        ])
    end

    defp dashboard_match(from, to, project_ids) do
        %{
            "first_dep_amount" => %{"$exists" => true},
            "first_dep_d" => %{
                "$gte" => from,
                "$lte" => to
            },
            "project" => %{
                "$in" => project_ids
            }
        }
    end

    defp dashboard_group_id do
        %{
            "project" => "$project",
            "date" => "$reg_d"
        }
    end
end
