defmodule Gt.Model.Project do
    use Gt.Web, :model

    schema "projects" do
        field :title, :string
        field :prefix, :string
        field :item_id, :string
        field :external_id, :string
        field :url, :string
        field :enabled, :boolean
        field :isPoker, :boolean, default: false
        field :isPartner, :boolean, default: false
    end

    @required_fields ~w(title item_id url enabled)
    @optional_fields ~w(prefix external_id isPoker isPartner)

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
        |> unique_constraint(:item_id, message: "Project with this item_id already exists")
    end
end
