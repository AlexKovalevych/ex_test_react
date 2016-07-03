defmodule Gt.Model.ProjectGame do
    use Gt.Web, :model

    @collection "project_game"

    def collection, do: @collection

    schema @collection do
        field :name, :string
        field :itemId, :string
        field :isMobile, :boolean, default: false
        field :isDemo, :boolean, default: false
        field :isRisk, :boolean, default: false

        field :project, :binary_id
    end

    @required_fields ~w(
        name
        item_id
        project
        isMobile
        isDemo
        isRisk
    )
    @optional_fields ~w()

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end

    def is_risk(name) do
        Regex.match?(~r/^.+_ch$/, name)
    end

    def is_mobile(name) do
        Regex.match?(~r/^.+_mob$/, name)
    end
end
