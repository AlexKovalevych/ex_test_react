defmodule Gt.Model do
    def object_id(id) do
        {:ok, mongo_id} = Mongo.Ecto.ObjectID.dump(id)
        mongo_id
    end

    defmacro __using__(_) do
        quote do
            use Ecto.Model
            @primary_key {:id, :binary_id, autogenerate: true}
            # @foreign_key_type :string # For associations
        end
    end
end
