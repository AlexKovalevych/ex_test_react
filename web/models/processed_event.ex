defmodule Gt.Model.ProcessedEvent do
    use Timex
    use Gt.Model

    @collection "processed_events"

    def collection, do: @collection

    schema @collection do
        field :item_id, :string
        field :added_at, :integer
        field :processed_at, :integer
        field :name, :string
        field :data, :map
        field :state_id, :integer
        field :time, :integer
        field :date, :string
        field :state, :integer
        field :error, :string

        field :project, :binary_id
        field :source, :binary_id

        embeds_one :dataEmbed, UserData
    end

    @required_fields ~w(
        item_id
        name
        added_at
        state_id
        date
        time
        project
        source
    )
    @optional_fields ~w(processed_at data state error)

    def changeset(model, params \\ :empty) do
        model
        |> cast(params, @required_fields, @optional_fields)
    end
end
