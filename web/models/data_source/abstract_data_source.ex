defmodule Gt.Model.DataSource.AbstractDataSource do
    # use Ecto.Schema

    @collection "data_source"

    def collection, do: @collection

    def schema do
        [
            [:createdAt, Ecto.DateTime],
            [:name, :string],
            [:lastDate, Ecto.DateTime],
            [:pid, :integer],
            [:isActive, :boolean],
            [:runFrequency, :integer],
            [:errors, :map],
            [:lastRequestDate, Ecto.DateTime]
        ]
    end

    def required_fields do
        ~w(
            type
            name
        )
    end

    def optional_fields do
        ~w(
            date
            lastDate
            pid
            isActive
        )
    end
end
